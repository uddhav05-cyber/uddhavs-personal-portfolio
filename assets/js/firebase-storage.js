/**
 * Firebase Storage Upload Manager
 * Handles image uploads to Firebase Storage (replaces S3)
 * 
 * 🎉 BENEFITS:
 * - Same platform as Database & Auth
 * - Built-in CDN
 * - Simpler security rules
 * - Better integration
 * - Free 5GB forever (not just first year)
 */

class FirebaseStorageManager {
    constructor() {
        this.storage = window.firebaseStorage;
        this.storageRef = this.storage.ref();
    }

    /**
     * Upload single image to Firebase Storage
     * @param {File} file - Image file to upload
     * @param {string} folder - Optional folder name (e.g., 'spotlight', 'gallery')
     * @returns {Promise} - Promise with download URL
     */
    async uploadImage(file, folder = 'spotlight') {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                reject(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                reject(new Error('File too large. Maximum size is 5MB.'));
                return;
            }

            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(7);
            const extension = file.name.split('.').pop();
            const fileName = `${folder}/${timestamp}-${randomString}.${extension}`;

            // Create storage reference
            const fileRef = this.storageRef.child(fileName);

            // Set metadata
            const metadata = {
                contentType: file.type,
                customMetadata: {
                    'uploaded-by': 'admin-panel',
                    'upload-date': new Date().toISOString(),
                    'original-name': file.name
                }
            };


            // Upload file
            const uploadTask = fileRef.put(file, metadata);

            // Monitor upload progress
            uploadTask.on('state_changed',
                // Progress callback
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    // Trigger progress event
                    window.dispatchEvent(new CustomEvent('firebaseUploadProgress', {
                        detail: {
                            fileName: file.name,
                            progress: Math.round(progress),
                            bytesTransferred: snapshot.bytesTransferred,
                            totalBytes: snapshot.totalBytes
                        }
                    }));
                },
                // Error callback
                (error) => {
                    reject(error);
                },
                // Success callback
                async () => {
                    try {
                        // Get download URL
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();


                        resolve({
                            url: downloadURL,
                            path: fileName,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            fullPath: uploadTask.snapshot.ref.fullPath
                        });
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    /**
     * Upload multiple images to Firebase Storage
     * @param {FileList|Array} files - Array of image files
     * @param {string} folder - Optional folder name
     * @returns {Promise} - Promise with array of download URLs
     */
    async uploadMultipleImages(files, folder = 'spotlight') {
        try {
            const uploadPromises = Array.from(files).map(file =>
                this.uploadImage(file, folder)
            );

            const results = await Promise.all(uploadPromises);
            return { success: true, images: results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete image from Firebase Storage
     * @param {string} imageUrl - Full download URL or storage path
     * @returns {Promise}
     */
    async deleteImage(imageUrl) {
        try {
            let fileRef;

            if (imageUrl.includes('firebasestorage.googleapis.com')) {
                // Extract path from Firebase Storage URL
                fileRef = this.storage.refFromURL(imageUrl);
            } else {
                // Direct path
                fileRef = this.storageRef.child(imageUrl);
            }

            await fileRef.delete();
            return { success: true };
        } catch (error) {

            // File might not exist, that's okay
            if (error.code === 'storage/object-not-found') {
                return { success: true };
            }

            return { success: false, error: error.message };
        }
    }

    /**
     * Delete multiple images from Firebase Storage
     * @param {Array} imageUrls - Array of download URLs or paths
     * @returns {Promise}
     */
    async deleteMultipleImages(imageUrls) {
        try {
            const deletePromises = imageUrls.map(url => this.deleteImage(url));
            await Promise.all(deletePromises);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get metadata for an image
     * @param {string} imageUrl - Firebase Storage URL or path
     * @returns {Promise}
     */
    async getImageMetadata(imageUrl) {
        try {
            let fileRef;

            if (imageUrl.includes('firebasestorage.googleapis.com')) {
                fileRef = this.storage.refFromURL(imageUrl);
            } else {
                fileRef = this.storageRef.child(imageUrl);
            }

            const metadata = await fileRef.getMetadata();
            return { success: true, metadata };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * List all files in a folder
     * @param {string} folder - Folder path
     * @param {number} maxResults - Maximum number of results
     * @returns {Promise}
     */
    async listFiles(folder = 'spotlight', maxResults = 100) {
        try {
            const folderRef = this.storageRef.child(folder);
            const result = await folderRef.listAll();

            const files = await Promise.all(
                result.items.map(async (itemRef) => {
                    const url = await itemRef.getDownloadURL();
                    const metadata = await itemRef.getMetadata();
                    return {
                        name: itemRef.name,
                        fullPath: itemRef.fullPath,
                        url: url,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        timeCreated: metadata.timeCreated,
                        updated: metadata.updated
                    };
                })
            );

            return { success: true, files };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Compress image before upload (client-side)
     * @param {File} file - Image file
     * @param {number} maxWidth - Maximum width
     * @param {number} quality - Quality (0-1)
     * @returns {Promise<Blob>}
     */
    async compressImage(file, maxWidth = 1920, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    }, file.type, quality);
                };

                img.onerror = reject;
                img.src = e.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Get storage usage statistics
     * @returns {Promise}
     */
    async getStorageUsage() {
        try {
            const result = await this.listFiles('spotlight');
            const totalSize = result.files.reduce((sum, file) => sum + file.size, 0);

            const usage = {
                fileCount: result.files.length,
                totalBytes: totalSize,
                totalMB: (totalSize / 1024 / 1024).toFixed(2),
                totalGB: (totalSize / 1024 / 1024 / 1024).toFixed(3),
                freeLimit: '5 GB',
                percentUsed: ((totalSize / (5 * 1024 * 1024 * 1024)) * 100).toFixed(2)
            };

            return { success: true, usage };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Initialize manager
window.firebaseStorageManager = new FirebaseStorageManager();

