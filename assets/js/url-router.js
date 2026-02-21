/**
 * URL Router for Deep Linking to Spotlight Items
 * Handles direct URLs to individual blog posts and highlights
 */

class SpotlightURLRouter {
    constructor() {
        this.currentSlug = null;
        this.isInitialized = false;
    }

    /**
     * Initialize router and check for URL parameters
     */
    init() {
        // Wait for DOM and spotlight data to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.checkURLAndRoute());
        } else {
            this.checkURLAndRoute();
        }

        // Handle browser back/forward
        window.addEventListener('popstate', () => this.checkURLAndRoute());

        // Listen for spotlight data loaded event
        window.addEventListener('spotlightDataLoaded', (e) => {
            if (this.currentSlug && !this.isInitialized) {
                // Reduced delay for faster routing
                setTimeout(() => {
                    this.routeToSpotlight(this.currentSlug);
                }, 200);
            }
        });
    }

    /**
     * Check URL for spotlight parameter and route accordingly
     */
    checkURLAndRoute() {
        const urlParams = new URLSearchParams(window.location.search);
        const spotlightSlug = urlParams.get('spotlight');

        if (spotlightSlug) {
            this.currentSlug = spotlightSlug;

            // Switch to Spotlight tab first
            this.switchToSpotlightTab();

            // Try to route to the specific item - reduced delay for faster opening
            setTimeout(() => {
                this.routeToSpotlight(spotlightSlug);
            }, 300);
        }
    }

    /**
     * Switch to Spotlight tab
     */
    switchToSpotlightTab() {
        const navigationLinks = document.querySelectorAll("[data-nav-link]");
        const pages = document.querySelectorAll("[data-page]");

        navigationLinks.forEach(link => {
            if (link.innerHTML.toLowerCase() === 'spotlight') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        pages.forEach(page => {
            if (page.dataset.page === 'spotlight') {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        window.scrollTo(0, 0);
    }

    /**
     * Route to specific spotlight item by slug
     */
    routeToSpotlight(slug, retryCount = 0) {
        const maxRetries = 8; // Try for up to 4 seconds

        // Wait for spotlight data to be available
        if (!window.spotlightDataForPortfolio || window.spotlightDataForPortfolio.length === 0) {
            if (retryCount < maxRetries) {
                setTimeout(() => this.routeToSpotlight(slug, retryCount + 1), 500);
            }
            return;
        }

        // Find item by slug or firebaseKey
        const item = window.spotlightDataForPortfolio.find(i => {
            const itemSlug = i.slug || (window.PortfolioConfig ? window.PortfolioConfig.generateSlug(i.title, i.firebaseKey) : i.firebaseKey);
            return itemSlug === slug || i.firebaseKey === slug;
        });

        if (item) {
            // Check if modal function exists
            if (typeof window.openSpotlightModal === 'function') {
                // Open modal immediately for faster response
                window.openSpotlightModal(item.firebaseKey);
                this.isInitialized = true;
            } else if (retryCount < maxRetries) {
                // Retry if function not ready yet
                setTimeout(() => this.routeToSpotlight(slug, retryCount + 1), 300);
            }
        }
    }

    /**
     * Update URL without page reload
     */
    updateURL(slug) {
        const newUrl = slug
            ? `${window.location.pathname}?spotlight=${slug}`
            : window.location.pathname;

        window.history.pushState({ spotlight: slug }, '', newUrl);
    }

    /**
     * Clear spotlight parameter from URL
     */
    clearURL() {
        const url = new URL(window.location);
        url.searchParams.delete('spotlight');
        window.history.pushState({}, '', url.toString());
    }

    /**
     * Get shareable URL for a spotlight item
     */
    getShareableURL(item) {
        const slug = item.slug || window.PortfolioConfig.generateSlug(item.title, item.firebaseKey);
        return window.PortfolioConfig.getSpotlightUrl(slug);
    }
}

// Initialize router
const spotlightRouter = new SpotlightURLRouter();
spotlightRouter.init();

// Make globally available
window.spotlightRouter = spotlightRouter;
