/**
 * Portfolio Spotlight Integration with Firebase
 * Replaces spotlight-integration.js localStorage approach
 */

let spotlightDataForPortfolio = [];

// Make globally available for URL router
window.spotlightDataForPortfolio = spotlightDataForPortfolio;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async function () {

    // Wait for Firebase to initialize
    await waitForFirebase();

    // Listen to spotlight data changes
    window.addEventListener('spotlightDataLoaded', (e) => {
        spotlightDataForPortfolio = e.detail.data;
        window.spotlightDataForPortfolio = spotlightDataForPortfolio; // Update global reference
        renderSpotlightSection();
    });

    // Initialize Firebase spotlight manager
    await window.firebaseSpotlight.init();

    // Setup spotlight modal
    setupSpotlightModal();
});

/**
 * Wait for Firebase to initialize
 */
function waitForFirebase() {
    return new Promise((resolve) => {
        const checkFirebase = setInterval(() => {
            if (window.firebaseDB && window.firebaseSpotlight) {
                clearInterval(checkFirebase);
                resolve();
            }
        }, 100);
    });
}

/**
 * Render spotlight section
 */
function renderSpotlightSection() {

    const spotlightList = document.querySelector('#spotlightList');
    if (!spotlightList) {
        return;
    }

    if (!spotlightDataForPortfolio.length) {
        spotlightList.innerHTML = `
      <div class="empty-spotlight">
        <ion-icon name="star-outline"></ion-icon>
        <p>No spotlight items to display</p>
      </div>
    `;
        return;
    }

    // Generate HTML with category data attributes
    const html = spotlightDataForPortfolio.map(item => {
        const itemType = item.type || 'highlight'; // default to highlight if not specified

        // Blog posts - extract first inline image for thumbnail
        if (itemType === 'blog') {
            // Prioritize explicit thumbnail, then extract first inline image from content
            let thumbnailImage = item.thumbnail || null; // Check explicit thumbnail first
            if (!thumbnailImage && item.content) {
                const imageMatch = item.content.match(/\[IMAGE:(.+?)\]/);
                if (imageMatch) {
                    thumbnailImage = imageMatch[1];
                }
            }

            // If we have a thumbnail, show image card style
            if (thumbnailImage) {
                return `
    <li class="spotlight-item active" data-category="blog">
      <div class="spotlight-card clickable blog-card-with-thumb" onclick="openSpotlightModal('${item.firebaseKey}')">
        <div class="spotlight-content">
          <h3 class="spotlight-title">${item.title}</h3>
          <time class="spotlight-date">${item.date}</time>
          <figure class="blog-thumbnail-circle">
            <img src="${thumbnailImage}" 
                 alt="${item.title}" 
                 loading="lazy" 
                 onerror="this.style.opacity='0.5';">
          </figure>
          <p class="spotlight-description">${item.description || item.content.substring(0, 150) + '...'}</p>
          <div class="blog-read-more-inline">
            <ion-icon name="book-outline"></ion-icon>
            <span>Read Full Article</span>
          </div>
        </div>
      </div>
    </li>
  `;
            } else {
                // No image - show icon-based card
                return `
    <li class="spotlight-item active blog-item" data-category="blog">
      <div class="spotlight-card clickable" onclick="openSpotlightModal('${item.firebaseKey}')">
        <div class="spotlight-content blog-content">
          <div class="blog-icon">
            <ion-icon name="newspaper-outline"></ion-icon>
          </div>
          <h3 class="spotlight-title">${item.title}</h3>
          <time class="spotlight-date">${item.date}</time>
          <p class="spotlight-description">${item.description || item.content.substring(0, 150) + '...'}</p>
          <div class="blog-read-more">
            <span>Read Full Article</span>
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
        </div>
      </div>
    </li>
  `;
            }
        }

        // Highlights - match admin panel structure for consistency
        // Determine image source (mainImage or first gallery image)
        let highlightImageSrc = item.mainImage;
        if (!highlightImageSrc && item.gallery && item.gallery.length > 0) {
            highlightImageSrc = item.gallery[0];
        }

        // Fallback placeholder if no image
        if (!highlightImageSrc) {
            highlightImageSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23252525" width="200" height="200"/%3E%3Ctext fill="%23ffdb70" font-family="Arial" font-size="48" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E⭐%3C/text%3E%3C/svg%3E';
        }

        return `
    <li class="spotlight-item active" data-category="${itemType}">
      <div class="spotlight-card ${(item.gallery && item.gallery.length > 1) || item.story ? 'clickable' : ''}" 
           ${(item.gallery && item.gallery.length > 1) || item.story ? `onclick="openSpotlightModal('${item.firebaseKey}')"` : ''}>
        <figure class="spotlight-img">
          <div class="spotlight-item-icon-box">
            <ion-icon name="${item.icon || 'star-outline'}"></ion-icon>
          </div>
          <img src="${highlightImageSrc}" 
               alt="${item.title}" 
               loading="lazy"
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect fill=\\'%23252525\\' width=\\'200\\' height=\\'200\\'/%3E%3Ctext fill=\\'%23ffdb70\\' font-family=\\'Arial\\' font-size=\\'48\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E⭐%3C/text%3E%3C/svg%3E';">
        </figure>
        <div class="spotlight-content">
          <h3 class="spotlight-title">${item.title}</h3>
          <time class="spotlight-date">${item.date}</time>
          <p class="spotlight-description">${item.description || ''}</p>
          ${item.location ? `<p class="spotlight-location"><ion-icon name="location-outline"></ion-icon> ${item.location}</p>` : ''}
          ${(item.gallery && item.gallery.length > 1) || item.story ? `
          <div class="spotlight-gallery-indicator">
            <ion-icon name="images-outline"></ion-icon>
            <span>${item.gallery ? item.gallery.length : 0} images</span>
          </div>
          ` : ''}
          ${item.link ? `
          <a href="${item.link}" target="_blank" class="spotlight-external-link" onclick="event.stopPropagation()">
            <ion-icon name="link-outline"></ion-icon>
            <span>Learn More</span>
          </a>
          ` : ''}
        </div>
      </div>
    </li>
  `;
    }).join('');

    spotlightList.innerHTML = html;

    // Initialize filter functionality
    initSpotlightFilters();

    // Show blog by default
    filterSpotlightItems('blog');
}

/**
 * Setup spotlight modal
 */
function setupSpotlightModal() {
    // Create modal HTML if it doesn't exist
    if (!document.getElementById('spotlightModal')) {
        const modalHTML = `
      <div id="spotlightModal" class="spotlight-modal">
        <div class="spotlight-modal-content">
          <button class="spotlight-modal-close" onclick="closeSpotlightModal()">
            <ion-icon name="close-outline"></ion-icon>
          </button>
          
          <!-- Loading Overlay -->
          <div id="modalLoadingOverlay" class="modal-loading-overlay">
            <div class="loading-spinner"></div>
            <p>Loading blog post...</p>
          </div>
          
          <div class="spotlight-modal-header">
            <h2 id="modalSpotlightTitle"></h2>
            <time id="modalSpotlightDate"></time>
            <p id="modalSpotlightLocation" class="modal-location"></p>
          </div>
          
          <div class="spotlight-modal-gallery">
            <div class="gallery-main">
              <img id="modalMainImage" src="" alt="">
              <button class="gallery-nav prev" id="modalPrevImage" onclick="navigateSpotlightGallery(-1)">
                <ion-icon name="chevron-back-outline"></ion-icon>
              </button>
              <button class="gallery-nav next" id="modalNextImage" onclick="navigateSpotlightGallery(1)">
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            </div>
            <div class="gallery-thumbnails" id="modalThumbnails"></div>
          </div>
          
          <div class="spotlight-modal-body">
            <div id="modalSpotlightStory"></div>
            <a id="modalSpotlightLink" href="#" target="_blank" class="modal-external-link" style="display: none;">
              <ion-icon name="link-outline"></ion-icon>
              <span>Visit Website</span>
            </a>
          </div>
        </div>
      </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

/**
 * Open spotlight modal
 */
let currentSpotlightGalleryIndex = 0;
let currentSpotlightItem = null;

function openSpotlightModal(firebaseKey) {
    const item = spotlightDataForPortfolio.find(i => i.firebaseKey === firebaseKey);
    if (!item) return;

    currentSpotlightItem = item;
    currentSpotlightGalleryIndex = 0;

    const itemType = item.type || 'highlight';

    // Update URL with spotlight parameter (for sharing)
    if (window.spotlightRouter) {
        const slug = item.slug || (window.PortfolioConfig ? window.PortfolioConfig.generateSlug(item.title, item.firebaseKey) : item.firebaseKey);
        window.spotlightRouter.updateURL(slug);
    }

    // Show modal immediately with loading overlay
    const modal = document.getElementById('spotlightModal');
    const loadingOverlay = document.getElementById('modalLoadingOverlay');
    modal.classList.add('active');
    loadingOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reduced minimum load time from 3s to 1.5s for faster experience
    const minimumLoadTime = new Promise(resolve => setTimeout(resolve, 1500));

    // Track image loading
    let imagesToLoad = [];
    let imagesLoaded = 0;

    // Populate modal header
    document.getElementById('modalSpotlightTitle').textContent = item.title;
    document.getElementById('modalSpotlightDate').textContent = item.date;

    const locationEl = document.getElementById('modalSpotlightLocation');
    if (item.location && itemType === 'highlight') {
        locationEl.innerHTML = `<ion-icon name="location-outline"></ion-icon> ${item.location}`;
        locationEl.style.display = 'block';
    } else {
        locationEl.style.display = 'none';
    }

    // For Blog posts - show full content, no gallery
    if (itemType === 'blog') {
        const gallerySection = document.querySelector('.spotlight-modal-gallery');
        if (gallerySection) {
            gallerySection.style.display = 'none';
            // Also clear any existing gallery content
            document.getElementById('modalThumbnails').innerHTML = '';
            document.getElementById('modalPrevImage').style.display = 'none';
            document.getElementById('modalNextImage').style.display = 'none';
        }

        // Show blog content
        const storyEl = document.getElementById('modalSpotlightStory');
        if (item.content) {
            // Parse inline images and format content
            const formattedContent = formatBlogContent(item.content);
            storyEl.innerHTML = formattedContent;

            // Find all images in the blog content
            const blogImages = storyEl.querySelectorAll('img');
            imagesToLoad = Array.from(blogImages);

            // Wait for all blog images to load
            const imagePromises = imagesToLoad.map(img => {
                return new Promise((resolve) => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = () => resolve();
                        img.onerror = () => resolve(); // Resolve even on error
                    }
                });
            });

            // Wait for minimum time AND all images
            Promise.all([minimumLoadTime, ...imagePromises]).then(() => {
                loadingOverlay.classList.remove('active');
            });
        } else {
            storyEl.innerHTML = '';
            // Just wait for minimum time if no images
            minimumLoadTime.then(() => {
                loadingOverlay.classList.remove('active');
            });
        }
    } else {
        // For Highlights - show gallery and story
        const gallerySection = document.querySelector('.spotlight-modal-gallery');
        gallerySection.style.display = 'block';

        // Setup gallery
        const gallery = item.gallery || [item.mainImage];
        updateGalleryImage(gallery[0]);

        if (gallery.length > 1) {
            const thumbnailsHTML = gallery.map((img, index) => `
                <img src="${img}" 
                     alt="Gallery ${index + 1}" 
                     onclick="setGalleryImage(${index})"
                     class="${index === 0 ? 'active' : ''}">
            `).join('');

            document.getElementById('modalThumbnails').innerHTML = thumbnailsHTML;
            document.getElementById('modalPrevImage').style.display = 'block';
            document.getElementById('modalNextImage').style.display = 'block';
        } else {
            document.getElementById('modalThumbnails').innerHTML = '';
            document.getElementById('modalPrevImage').style.display = 'none';
            document.getElementById('modalNextImage').style.display = 'none';
        }

        // Story
        const storyEl = document.getElementById('modalSpotlightStory');
        if (item.story) {
            const formattedStory = formatBlogContent(item.story);
            storyEl.innerHTML = `<h3>Story</h3>${formattedStory}`;
        } else {
            storyEl.innerHTML = '';
        }

        // Wait for gallery main image to load
        const mainImage = document.getElementById('modalMainImage');
        const imageLoadPromise = new Promise((resolve) => {
            if (mainImage.complete) {
                resolve();
            } else {
                mainImage.onload = () => resolve();
                mainImage.onerror = () => resolve();
            }
        });

        // Wait for minimum time AND main image
        Promise.all([minimumLoadTime, imageLoadPromise]).then(() => {
            loadingOverlay.classList.remove('active');
        });
    }

    // External link (for both types)
    const linkEl = document.getElementById('modalSpotlightLink');
    if (item.link) {
        linkEl.href = item.link;
        linkEl.style.display = 'flex';
    } else {
        linkEl.style.display = 'none';
    }
}

/**
 * Close spotlight modal
 */
function closeSpotlightModal() {
    const modal = document.getElementById('spotlightModal');
    const loadingOverlay = document.getElementById('modalLoadingOverlay');

    modal.classList.remove('active');
    loadingOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentSpotlightItem = null;

    // Clear URL parameter when modal closes
    if (window.spotlightRouter) {
        window.spotlightRouter.clearURL();
    }
}

/**
 * Navigate gallery
 */
function navigateSpotlightGallery(direction) {
    if (!currentSpotlightItem) return;

    const gallery = currentSpotlightItem.gallery || [currentSpotlightItem.mainImage];
    currentSpotlightGalleryIndex = (currentSpotlightGalleryIndex + direction + gallery.length) % gallery.length;

    updateGalleryImage(gallery[currentSpotlightGalleryIndex]);

    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('#modalThumbnails img');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSpotlightGalleryIndex);
    });
}

/**
 * Set gallery image by index
 */
function setGalleryImage(index) {
    if (!currentSpotlightItem) return;

    const gallery = currentSpotlightItem.gallery || [currentSpotlightItem.mainImage];
    currentSpotlightGalleryIndex = index;
    updateGalleryImage(gallery[index]);

    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('#modalThumbnails img');
    thumbnails.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
    });
}

/**
 * Update gallery image
 */
function updateGalleryImage(imageUrl) {
    const mainImage = document.getElementById('modalMainImage');
    mainImage.src = imageUrl;
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSpotlightModal();
    }
});

// Close modal on background click
document.addEventListener('click', (e) => {
    if (e.target.id === 'spotlightModal') {
        closeSpotlightModal();
    }
});

// Make functions globally available
window.openSpotlightModal = openSpotlightModal;
window.closeSpotlightModal = closeSpotlightModal;
window.navigateSpotlightGallery = navigateSpotlightGallery;
window.setGalleryImage = setGalleryImage;

/**
 * Initialize spotlight filter functionality
 */
function initSpotlightFilters() {
    const filterButtons = document.querySelectorAll('[data-spotlight-filter-btn]');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Filter items
            filterSpotlightItems(category);
        });
    });
}

/**
 * Filter spotlight items by category
 */
function filterSpotlightItems(category) {
    const items = document.querySelectorAll('.spotlight-item[data-category]');

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (category === 'all' || itemCategory === category) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Format blog content with inline images and markdown-style formatting
 */
function formatBlogContent(content) {
    if (!content) {
        return '';
    }

    // Split content into blocks (paragraphs, lists, and images)
    const blocks = content.split(/\n\n+/);

    const formattedBlocks = blocks.map((block, index) => {
        block = block.trim();
        if (!block) return '';

        // Check if this block is an image marker [IMAGE:url]
        const imageMatch = block.match(/^\[IMAGE:(.+?)\]$/);
        if (imageMatch) {
            const imageUrl = imageMatch[1];
            return `
                <div class="blog-inline-image">
                    <img src="${imageUrl}" alt="Blog image" loading="lazy" onerror="this.style.display='none';">
                </div>
            `;
        }

        // Check if this is a heading (starts with ##)
        if (block.startsWith('## ')) {
            const headingText = block.substring(3).trim();
            return `<h3 class="blog-heading">${headingText}</h3>`;
        }

        // Check if this is a bullet list (lines starting with - or * or •)
        const bulletListMatch = block.match(/^[\-\*•]\s+/);
        if (bulletListMatch) {
            const listItems = block.split('\n').map(line => {
                line = line.trim();
                // Remove bullet markers (-, *, •)
                line = line.replace(/^[\-\*•]\s+/, '');
                if (line) {
                    return `<li>${line}</li>`;
                }
                return '';
            }).filter(item => item).join('');
            return `<ul class="blog-list">${listItems}</ul>`;
        }

        // Check if this is a numbered list (lines starting with 1. 2. etc)
        const numberedListMatch = block.match(/^\d+\.\s+/);
        if (numberedListMatch) {
            const listItems = block.split('\n').map(line => {
                line = line.trim();
                // Remove number markers (1. 2. etc)
                line = line.replace(/^\d+\.\s+/, '');
                if (line) {
                    return `<li>${line}</li>`;
                }
                return '';
            }).filter(item => item).join('');
            return `<ol class="blog-list">${listItems}</ol>`;
        }

        // Regular paragraph - preserve single line breaks as <br>
        const paragraphWithBreaks = block.replace(/\n/g, '<br>');
        return `<p>${paragraphWithBreaks}</p>`;
    });

    const result = formattedBlocks.join('');
    return result;
}

