// Cloudinary Configuration
// Ganti nilai ini dengan kredensial Cloudinary Anda
// Cara dapat: Daftar gratis di cloudinary.com -> Settings -> Upload -> Add upload preset (Mode: Unsigned)

export const CLOUDINARY_CONFIG = {
    cloudName: 'ddqynuz2a', // Ganti dengan cloud name Anda (dashboard)
    uploadPreset: 'upload_data' // Ganti dengan upload preset name (settings -> upload)
};

/**
 * Upload file to Cloudinary
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    // Validate config
    if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
        console.error("Cloudinary config missing!");
        alert("Konfigurasi Cloudinary belum dipasang. Hubungi administrator.");
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', 'verifikasi_uhc_docs'); // Folder di Cloudinary

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url; // Return URL public
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
