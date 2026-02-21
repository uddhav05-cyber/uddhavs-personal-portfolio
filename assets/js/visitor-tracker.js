/**
 * Visitor Tracking System
 * Tracks unique visitors based on IP address, page views, and collects optional user information
 */

// Initialize visitor tracking
async function initVisitorTracking() {

    // Check Firebase availability
    if (!window.firebaseDatabase) {
        // Retry after 2 seconds
        setTimeout(initVisitorTracking, 2000);
        return;
    }


    // STEP 1: Get IP address first
    const ip = await getVisitorIP();

    // STEP 2: Check if this IP exists in database
    const existingVisitor = await checkIPExists(ip);

    const visitorId = localStorage.getItem('visitorId') || generateVisitorId();

    // STEP 3: Track page view (always track for total count)
    await trackPageView(visitorId, ip);

    // STEP 4: Decide whether to show modal
    // Check both sessionStorage (same tab) and if modal was already dismissed
    const hasInteractedThisSession = sessionStorage.getItem('welcomeModalShown');
    
    if (!existingVisitor && !hasInteractedThisSession) {
        // NEW IP AND FIRST TIME IN THIS SESSION - Show welcome modal for unique visitor
        setTimeout(() => showWelcomeModal(visitorId, ip), 2000); // Show after 2 seconds
    } else {
        // EXISTING IP OR ALREADY SHOWN IN THIS SESSION - Just log and skip modal
        localStorage.setItem('hasVisited', 'true');
    }
}

/**
 * Check if IP address exists in database
 */
async function checkIPExists(ip) {
    try {

        const visitorsRef = window.firebaseDatabase.ref('analytics/visitors');
        const snapshot = await visitorsRef.orderByChild('ip').equalTo(ip).limitToFirst(1).once('value');

        if (snapshot.exists()) {
            const data = snapshot.val();
            const visitorKey = Object.keys(data)[0];
            const visitor = data[visitorKey];
            return visitor;
        } else {
            return null;
        }
    } catch (error) {
        return null; // Treat as new visitor if error
    }
}

/**
 * Generate unique visitor ID
 */
function generateVisitorId() {
    const id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorId', id);
    return id;
}

/**
 * Get approximate IP address (using public API)
 */
async function getVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unknown';
    }
}

/**
 * Track page view in Firebase
 */
async function trackPageView(visitorId, ip) {
    try {
        const timestamp = new Date().toISOString();

        // Get current page
        const pageName = getPageName();


        // Reference to analytics database
        const analyticsRef = window.firebaseDatabase.ref('analytics/pageViews');

        // Push new page view
        await analyticsRef.push({
            visitorId: visitorId,
            ip: ip,
            page: pageName,
            timestamp: timestamp,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct'
        });

        // Update page-specific counter
        if (pageName === 'DevOps Roadmap' || pageName === 'MLOps Roadmap') {
            const counterRef = window.firebaseDatabase.ref(`analytics/roadmapViews/${pageName}`);
            await counterRef.transaction((currentValue) => {
                return (currentValue || 0) + 1;
            });
        }

    } catch (error) {
    }
}

/**
 * Get current page name
 */
function getPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();

    if (fileName === 'index.html' || fileName === '' || fileName === '/') {
        return 'Portfolio Home';
    } else if (fileName.includes('Devops_roadmap')) {
        return 'DevOps Roadmap';
    } else if (fileName.includes('Mlops_roadmap')) {
        return 'MLOps Roadmap';
    } else {
        return fileName;
    }
}

/**
 * Show welcome modal
 */
function showWelcomeModal(visitorId, ip) {
    // Check if modal already exists OR if user already interacted this session
    if (document.getElementById('welcomeModal') || sessionStorage.getItem('welcomeModalShown')) {
        return;
    }

    // Mark that modal has been shown in this session
    sessionStorage.setItem('welcomeModalShown', 'true');

    const modalHTML = `
        <div id="welcomeModal" class="welcome-modal active" onclick="handleBackdropClick(event, '${visitorId}', '${ip}')">
            <div class="welcome-modal-content" onclick="event.stopPropagation()">
                <button class="welcome-close" onclick="skipWelcome('${visitorId}', '${ip}')">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
                
                <div class="welcome-icon">
                    <img src="./assets/images/my-avatar.png" alt="Aviraj Kawade" />
                </div>
                
                <h2>Welcome to My Portfolio!</h2>
                <p>I'd love to know who's visiting. Would you mind sharing your details?</p>
                
                <form class="welcome-form" onsubmit="submitWelcomeForm(event, '${visitorId}', '${ip}')">
                    <div class="input-group">
                        <label for="visitorName">Name <span class="optional">(Optional)</span></label>
                        <input type="text" id="visitorName" placeholder="Your name...">
                    </div>
                    
                    <div class="input-group">
                        <label for="visitorEmail">Email <span class="optional">(Optional)</span></label>
                        <input type="email" id="visitorEmail" placeholder="your@email.com">
                    </div>
                    
                    <div class="welcome-form-buttons">
                        <button type="button" onclick="skipWelcome('${visitorId}')">
                            Skip
                        </button>
                        <button type="submit">
                            Submit
                        </button>
                    </div>
                </form>
                
                <p class="welcome-note">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    Your information is safe and won't be shared
                </p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Handle backdrop click
 */
window.handleBackdropClick = function (event, visitorId, ip) {
    // Only close if clicking directly on the backdrop (not on the modal content)
    if (event.target.id === 'welcomeModal') {
        skipWelcome(visitorId, ip);
    }
};

/**
 * Submit welcome form
 */
window.submitWelcomeForm = async function (event, visitorId, ip) {
    event.preventDefault();


    const nameInput = document.getElementById('visitorName');
    const emailInput = document.getElementById('visitorEmail');
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';


    // If both fields are empty, treat as skip (count as total view only)
    if (!name && !email) {
        skipWelcome(visitorId, ip);
        return;
    }

    try {
        // Check Firebase availability
        if (!window.firebaseDatabase) {
            alert('Firebase not ready. Please refresh the page and try again.');
            return;
        }

        // Save visitor information (UNIQUE visitor - provided name/email)
        const visitorsRef = window.firebaseDatabase.ref('analytics/visitors');
        const visitorData = {
            visitorId: visitorId,
            name: name || 'Anonymous',
            email: email || 'N/A',
            ip: ip,
            timestamp: new Date().toISOString(),
            status: 'submitted',
            isUnique: true
        };


        await visitorsRef.push(visitorData);


        // Mark as visited (permanent for this browser)
        localStorage.setItem('hasVisited', 'true');
        localStorage.setItem('visitorName', name || 'Anonymous');
        
        // Mark session as interacted (prevents re-showing in same tab)
        sessionStorage.setItem('welcomeModalShown', 'true');

        // Close modal with success message
        showThankYouMessage();

    } catch (error) {
        alert('Sorry, there was an error: ' + error.message);
    }
};

/**
 * Skip welcome modal (just count as total view, not unique)
 */
window.skipWelcome = async function (visitorId, ip) {

    try {
        // Check Firebase availability
        if (!window.firebaseDatabase) {
            closeWelcomeModal();
            return;
        }

        // Save as skipped (count as total view only, NOT unique visitor)
        const visitorsRef = window.firebaseDatabase.ref('analytics/visitors');
        await visitorsRef.push({
            visitorId: visitorId,
            name: 'Anonymous',
            email: 'N/A',
            ip: ip,
            timestamp: new Date().toISOString(),
            status: 'skipped',
            isUnique: false
        });


        // Mark as visited (permanent for this browser)
        localStorage.setItem('hasVisited', 'true');
        
        // Mark session as interacted (prevents re-showing in same tab)
        sessionStorage.setItem('welcomeModalShown', 'true');

        // Close modal
        closeWelcomeModal();

    } catch (error) {
        // Close modal anyway
        closeWelcomeModal();
    }
};

/**
 * Show thank you message
 */
function showThankYouMessage() {
    const modal = document.getElementById('welcomeModal');
    const content = modal.querySelector('.welcome-modal-content');

    content.innerHTML = `
        <div class="thank-you-message">
            <div class="thank-you-icon">✅</div>
            <h2>Thank You!</h2>
            <p>I appreciate you taking the time to share your information.</p>
            <button class="btn-submit" onclick="closeWelcomeModal()">Continue Exploring</button>
        </div>
    `;

    setTimeout(closeWelcomeModal, 3000);
}

/**
 * Close welcome modal
 */
function closeWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Wait for Firebase to initialize
        setTimeout(initVisitorTracking, 1000);
    });
}
