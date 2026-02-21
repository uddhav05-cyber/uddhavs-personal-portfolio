/**
 * Spotlight Data Loader
 * Loads monthly updates and achievements from spotlight-data.json
 * Integrates with existing Firebase Spotlight system
 */

class SpotlightDataLoader {
    constructor() {
        this.dataUrl = './spotlight-data.json'; // Changed from '/spotlight-data.json'
        this.spotlightList = null;
        this.data = [];
    }

    /**
     * Initialize and load data
     */
    async init() {
        try {
            console.log('🔍 Loading spotlight data from:', this.dataUrl);
            
            // Load data from JSON file
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`Failed to load spotlight data: ${response.statusText}`);
            }
            
            const jsonData = await response.json();
            this.data = jsonData.updates || [];
            
            console.log('✓ Loaded spotlight data:', this.data);
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.render());
            } else {
                this.render();
            }
            
            console.log(`✓ Loaded ${this.data.length} spotlight items`);
            return this.data;
        } catch (error) {
            console.error('❌ Error loading spotlight data:', error);
            return [];
        }
    }

    /**
     * Render spotlight items to the page
     */
    render() {
        console.log('🎨 Starting render...');
        this.spotlightList = document.getElementById('spotlightList');
        
        if (!this.spotlightList) {
            console.warn('⚠️ Spotlight list element not found');
            return;
        }

        console.log('✓ Found spotlight list element');

        // Clear existing items (except noscript)
        const noscriptElement = this.spotlightList.querySelector('noscript');
        this.spotlightList.innerHTML = '';
        if (noscriptElement) {
            this.spotlightList.appendChild(noscriptElement);
        }

        // Sort by date (newest first)
        const sortedData = [...this.data].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        console.log('📊 Sorted data:', sortedData);

        // Render each item
        sortedData.forEach(item => {
            console.log('➕ Adding item:', item.title);
            const listItem = this.createSpotlightItem(item);
            this.spotlightList.appendChild(listItem);
        });

        // Dispatch event for AI search to update
        window.dispatchEvent(new CustomEvent('spotlightDataLoaded', {
            detail: { data: sortedData }
        }));

        console.log(`✓ Rendered ${sortedData.length} spotlight items`);
    }

    /**
     * Create a spotlight item element
     */
    createSpotlightItem(item) {
        const li = document.createElement('li');
        li.className = 'spotlight-item';
        li.setAttribute('data-category', item.category);
        li.setAttribute('data-spotlight-id', item.id);
        
        // Add featured class if applicable
        if (item.featured) {
            li.classList.add('featured');
        }

        // Determine icon based on type
        const iconName = item.type === 'achievement' ? 'trophy-outline' : 
                        item.type === 'monthly-update' ? 'calendar-outline' : 
                        'newspaper-outline';

        li.innerHTML = `
            <div class="spotlight-card">
                <figure class="spotlight-img">
                    <div class="spotlight-item-icon-box">
                        <ion-icon name="${iconName}"></ion-icon>
                    </div>
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </figure>
                <div class="spotlight-content">
                    <h3 class="spotlight-title">${item.title}</h3>
                    <time class="spotlight-date">${this.formatDate(item.date)}</time>
                    <p class="spotlight-description">${item.description}</p>
                    ${item.tags && item.tags.length > 0 ? `
                        <div class="spotlight-tags">
                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        return li;
    }

    /**
     * Format date to readable string
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Add new update/achievement
     */
    async addItem(newItem) {
        // Add to local data
        this.data.push(newItem);
        
        // Re-render
        this.render();
        
        console.log('✓ Added new spotlight item:', newItem.title);
        return newItem;
    }

    /**
     * Get all items
     */
    getAllItems() {
        return this.data;
    }

    /**
     * Get items by category
     */
    getItemsByCategory(category) {
        if (category === 'all') {
            return this.data;
        }
        return this.data.filter(item => item.category === category);
    }

    /**
     * Get items by type
     */
    getItemsByType(type) {
        return this.data.filter(item => item.type === type);
    }

    /**
     * Search items
     */
    searchItems(query) {
        const lowerQuery = query.toLowerCase();
        return this.data.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    }
}

// Initialize and make globally available
window.spotlightDataLoader = new SpotlightDataLoader();
window.spotlightDataLoader.init();

console.log('✓ Spotlight Data Loader initialized');
