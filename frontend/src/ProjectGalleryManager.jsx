import React, { useState, useEffect } from 'react';
import { getProjectGallery, addImageToGallery, deleteGalleryImage } from './Api/projectImagesService';

const ProjectGalleryManager = ({ projectId }) => {
    const [images, setImages] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // جلب الصور عند تحميل المكون أو تغير الـ projectId
    useEffect(() => {
        if (projectId) {
            fetchGallery();
        }
    }, [projectId]);

    const fetchGallery = async () => {
        try {
            const data = await getProjectGallery(projectId);
            setImages(data);
        } catch (error) {
            console.error("خطأ في جلب صور المعرض:", error);
        }
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newImageUrl.trim()) return;

        setLoading(true);
        try {
            const newImage = {
                imageUrl: newImageUrl,
                projectId: projectId
            };
            const added = await addImageToGallery(newImage);
            setImages([...images, added]);
            setNewImageUrl(''); // تفريغ الحقل بعد الإضافة
        } catch (error) {
            console.error("خطأ في إضافة الصورة:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteImage = async (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;

        try {
            await deleteGalleryImage(id);
            setImages(images.filter(img => img.id !== id));
        } catch (error) {
            console.error("خطأ في حذف الصورة:", error);
        }
    };

    return (
        <div className="gallery-manager">
            <h3>Project gallery</h3>

            <form onSubmit={handleAddImage} className="gallery-add-form">
                <input
                    type="text"
                    placeholder="Enter an image URL…"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding…' : 'Add image'}
                </button>
            </form>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.length > 0 ? (
                    images.map((img) => (
                        <div key={img.id} className="relative group rounded-lg overflow-hidden border shadow-sm">
                            <img
                                src={img.imageUrl}
                                alt="Project Gallery"
                                className="w-full h-32 object-cover"
                            />
                            <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                                title="Delete image"
                                aria-label="Delete image"
                            >
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="gallery-empty">No images have been added to this project yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProjectGalleryManager;