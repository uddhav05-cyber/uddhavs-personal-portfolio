/**
 * Firebase Spotlight Integration
 * Handles all Firebase operations for spotlight section
 */

class FirebaseSpotlightManager {
    constructor() {
        this.db = window.firebaseDB;
        this.auth = window.firebaseAuth;
        this.spotlightRef = this.db.ref('spotlight');
        this.isInitialized = false;
    }

    /**
     * Initialize and listen to spotlight data changes
     */
    init() {
        return new Promise((resolve, reject) => {
            this.spotlightRef.on('value', (snapshot) => {
                const data = snapshot.val();
                const spotlightArray = data ? Object.keys(data).map(key => ({
                    firebaseKey: key,
                    ...data[key]
                })) : [];

                // Sort by date (newest first)
                spotlightArray.sort((a, b) => new Date(b.date) - new Date(a.date));

                this.isInitialized = true;

                // Trigger render event
                window.dispatchEvent(new CustomEvent('spotlightDataLoaded', {
                    detail: { data: spotlightArray }
                }));

                resolve(spotlightArray);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * Add new spotlight item
     */
    async addItem(itemData) {
        try {
            const newRef = this.spotlightRef.push();
            await newRef.set({
                ...itemData,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });

            return { success: true, key: newRef.key };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Update existing spotlight item
     */
    async updateItem(firebaseKey, itemData) {
        try {
            await this.spotlightRef.child(firebaseKey).update({
                ...itemData,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete spotlight item
     */
    async deleteItem(firebaseKey) {
        try {
            await this.spotlightRef.child(firebaseKey).remove();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get single item by key
     */
    async getItem(firebaseKey) {
        try {
            const snapshot = await this.spotlightRef.child(firebaseKey).once('value');
            return { success: true, data: snapshot.val() };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all items (one-time read)
     */
    async getAllItems() {
        try {
            const snapshot = await this.spotlightRef.once('value');
            const data = snapshot.val();
            const spotlightArray = data ? Object.keys(data).map(key => ({
                firebaseKey: key,
                ...data[key]
            })) : [];

            spotlightArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            return { success: true, data: spotlightArray };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Authentication - Sign in admin
     */
    async signIn(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Sign out admin
     */
    async signOut() {
        try {
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.auth.currentUser !== null;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.auth.currentUser;
    }

    /**
     * Upload image to Firebase Storage
     * Delegates to FirebaseStorage class
     */
    async uploadImage(file, folder = 'spotlight') {
        if (!window.firebaseStorageManager) {
            throw new Error('Firebase Storage not initialized');
        }
        return await window.firebaseStorageManager.uploadImage(file, folder);
    }

    /**
     * Upload multiple images to Firebase Storage
     */
    async uploadMultipleImages(files, folder = 'spotlight') {
        if (!window.firebaseStorageManager) {
            throw new Error('Firebase Storage not initialized');
        }
        return await window.firebaseStorageManager.uploadMultipleImages(files, folder);
    }
}

// Initialize manager
window.firebaseSpotlight = new FirebaseSpotlightManager();
