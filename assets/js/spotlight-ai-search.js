/**
 * AI-Powered Fuzzy Search for Spotlight Section
 * Implements intelligent search with fuzzy matching, typo tolerance, and semantic understanding
 */

class SpotlightAISearch {
    constructor() {
        this.searchInput = null;
        this.searchClearBtn = null;
        this.searchResultsInfo = null;
        this.searchResultsText = null;
        this.spotlightItems = [];
        this.allSpotlightData = [];
        this.currentCategory = 'blog';
        this.debounceTimer = null;
    }

    /**
     * Initialize the AI search functionality
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSearch());
        } else {
            this.setupSearch();
        }
    }

    /**
     * Setup search elements and event listeners
     */
    setupSearch() {
        this.searchInput = document.getElementById('spotlightSearchInput');
        this.searchClearBtn = document.getElementById('searchClearBtn');
        this.searchResultsInfo = document.getElementById('searchResultsInfo');
        this.searchResultsText = document.getElementById('searchResultsText');

        if (!this.searchInput) {
            return;
        }

        // Initialize spotlight items immediately
        this.updateSpotlightItems();

        // Listen to spotlight data loaded event
        window.addEventListener('spotlightDataLoaded', (e) => {
            this.allSpotlightData = e.detail.data;
            this.updateSpotlightItems();
        });

        // Search input event
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Clear button event
        this.searchClearBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        // Track category changes
        const filterButtons = document.querySelectorAll('[data-spotlight-filter-btn]');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentCategory = button.getAttribute('data-category');
                this.updateSpotlightItems();
                
                // Re-apply search if there's a query
                if (this.searchInput.value.trim()) {
                    this.handleSearch(this.searchInput.value);
                }
            });
        });
    }

    /**
     * Update spotlight items reference
     */
    updateSpotlightItems() {
        this.spotlightItems = document.querySelectorAll('.spotlight-item[data-category]');
    }

    /**
     * Handle search with debounce
     */
    handleSearch(query) {
        // Show/hide clear button
        if (query.trim()) {
            this.searchClearBtn.style.display = 'flex';
        } else {
            this.searchClearBtn.style.display = 'none';
            this.searchResultsInfo.style.display = 'none';
            this.showAllItems();
            return;
        }

        // Debounce search for better performance
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performAISearch(query);
        }, 300);
    }

    /**
     * Perform AI-powered fuzzy search
     */
    performAISearch(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const results = [];

        // Ensure spotlight items are up to date
        this.updateSpotlightItems();

        // Safety check: if no data loaded yet, wait and retry
        if (this.allSpotlightData.length === 0) {
            console.log('Waiting for spotlight data to load...');
            setTimeout(() => {
                if (this.allSpotlightData.length > 0) {
                    this.performAISearch(query);
                }
            }, 500);
            return;
        }

        // Get filtered data based on current category
        const filteredData = this.currentCategory === 'all' 
            ? this.allSpotlightData 
            : this.allSpotlightData.filter(item => item.category === this.currentCategory);

        // Search through each item
        filteredData.forEach((item, index) => {
            const score = this.calculateFuzzyScore(normalizedQuery, item);
            if (score > 0) {
                results.push({
                    item,
                    score,
                    index
                });
            }
        });

        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);

        // Update UI
        this.displaySearchResults(results, query);
    }

    /**
     * Calculate fuzzy matching score using advanced algorithms
     * Combines: Levenshtein distance, substring matching, word matching, and semantic scoring
     */
    calculateFuzzyScore(query, item) {
        let totalScore = 0;
        const queryWords = query.split(/\s+/).filter(w => w.length > 0);

        // Searchable fields with different weights
        const fields = [
            { text: item.title || '', weight: 10 },
            { text: item.description || '', weight: 7 },
            { text: item.content || '', weight: 5 },
            { text: item.story || '', weight: 5 },
            { text: item.location || '', weight: 3 },
            { text: item.date || '', weight: 2 },
            { text: (item.type || 'highlight'), weight: 4 },
            { text: (item.tags || []).join(' '), weight: 8 } // Add tags with high weight
        ];

        fields.forEach(field => {
            const fieldText = field.text.toLowerCase();
            
            // 1. Exact match (highest score)
            if (fieldText.includes(query)) {
                totalScore += 100 * field.weight;
            }

            // 2. Word-level matching
            queryWords.forEach(queryWord => {
                if (fieldText.includes(queryWord)) {
                    totalScore += 50 * field.weight;
                }

                // 3. Fuzzy match each word
                const fieldWords = fieldText.split(/\s+/);
                fieldWords.forEach(fieldWord => {
                    const similarity = this.stringSimilarity(queryWord, fieldWord);
                    if (similarity > 0.7) {
                        totalScore += similarity * 30 * field.weight;
                    }
                });
            });

            // 4. Starts with query (partial match)
            if (fieldText.startsWith(query)) {
                totalScore += 70 * field.weight;
            }

            // 5. Acronym matching (e.g., "ml" matches "Machine Learning")
            if (this.matchesAcronym(query, fieldText)) {
                totalScore += 40 * field.weight;
            }
        });

        return totalScore;
    }

    /**
     * Calculate string similarity using Levenshtein distance
     * Returns a value between 0 and 1 (1 = identical)
     */
    stringSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) {
            return 1.0;
        }

        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    /**
     * Calculate Levenshtein distance (edit distance) between two strings
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        // Initialize matrix
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        // Fill matrix
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Check if query matches as an acronym
     * Example: "mlops" matches "Machine Learning Operations"
     */
    matchesAcronym(query, text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (words.length < 2) return false;

        const acronym = words.map(w => w[0]).join('').toLowerCase();
        return acronym.includes(query) || query.includes(acronym);
    }

    /**
     * Display search results - Reorder items by relevance in real-time
     */
    displaySearchResults(results, query) {
        const spotlightList = document.querySelector('.spotlight-list');
        if (!spotlightList) return;

        // Show search results info
        if (results.length > 0) {
            this.searchResultsInfo.style.display = 'flex';
            this.searchResultsText.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
        } else {
            this.searchResultsInfo.style.display = 'flex';
            this.searchResultsText.textContent = `No results found for "${query}"`;
        }

        if (results.length === 0) {
            // No results - hide all items
            this.spotlightItems.forEach(item => {
                item.classList.remove('active', 'search-highlight');
            });
            return;
        }

        // Hide all items first
        this.spotlightItems.forEach(item => {
            item.classList.remove('active', 'search-highlight');
            item.style.order = '999'; // Move to end
        });

        // Show and reorder matching items by score
        results.forEach((result, index) => {
            const itemId = result.item.id;
            const matchingItem = Array.from(this.spotlightItems).find(item => {
                return item.getAttribute('data-spotlight-id') === itemId;
            });

            if (matchingItem) {
                matchingItem.classList.add('active', 'search-highlight');
                matchingItem.style.order = index.toString(); // Set order by relevance score
                
                // Add ranking badge to show position
                this.addRankingBadge(matchingItem, index + 1);
            }
        });

        // Scroll to top to show first result
        setTimeout(() => {
            const spotlightSection = document.querySelector('.spotlight-section');
            if (spotlightSection) {
                spotlightSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    /**
     * Add ranking badge to show search result position
     */
    addRankingBadge(item, rank) {
        // Remove existing badge if any
        const existingBadge = item.querySelector('.search-rank-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Add new ranking badge for top 3 results
        if (rank <= 3) {
            const badge = document.createElement('div');
            badge.className = 'search-rank-badge';
            badge.textContent = `#${rank}`;
            
            // Add different colors for top 3
            if (rank === 1) badge.classList.add('rank-1');
            if (rank === 2) badge.classList.add('rank-2');
            if (rank === 3) badge.classList.add('rank-3');
            
            const card = item.querySelector('.spotlight-card');
            if (card) {
                card.appendChild(badge);
            }
        }
    }

    /**
     * Show all items (clear search)
     */
    showAllItems() {
        this.spotlightItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            item.classList.remove('search-highlight');
            item.style.order = ''; // Reset order
            
            // Remove ranking badges
            const badge = item.querySelector('.search-rank-badge');
            if (badge) {
                badge.remove();
            }
            
            if (this.currentCategory === 'all' || itemCategory === this.currentCategory) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Clear search
     */
    clearSearch() {
        this.searchInput.value = '';
        this.searchClearBtn.style.display = 'none';
        this.searchResultsInfo.style.display = 'none';
        this.showAllItems();
        this.searchInput.focus();
    }
}

// Initialize AI Search when script loads
const spotlightAISearch = new SpotlightAISearch();
spotlightAISearch.init();

// Make globally available
window.spotlightAISearch = spotlightAISearch;
