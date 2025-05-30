import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import MotionPageWrapper from '../../../common/MotionPage';
import { ProductImage } from '../../../../types/product/ProductImage';
import { ProductRequest } from '../../../../types/product/ProductRequest';
import { useTranslation } from 'react-i18next';

interface AddProductImageProps {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    indexThumbnail: number;
    setIndexThumbnail: React.Dispatch<React.SetStateAction<number>>;
    images: ProductImage[];
    setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
    formData: ProductRequest;
    setFormData: React.Dispatch<React.SetStateAction<ProductRequest>>;
}

const AddProductImage: React.FC<AddProductImageProps> = ({ images, setImages, formData, setFormData, setFiles, setIndexThumbnail }) => {
    const navigate = useNavigate();
    const { t } = useTranslation('product');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFiles((prev) => [...prev, ...files]);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newImages.map((url) => ({ id: '', productId: '', url }))]);
        if (!formData.mainImageUrl && newImages.length > 0) {
            setFormData((prev) => ({ ...prev, mainImageUrl: newImages[0] }));
        }
    };

    const handleRemoveImage = (index: number) => {
        const mainUrl = images[index].url;
        const updatedImages = images.filter((_, i) => i !== index);
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setIndexThumbnail((prev) => prev - 1);
        setImages(updatedImages);
        if (mainUrl === formData.mainImageUrl) {
            const nextThumbnail = updatedImages.length > 0 ? updatedImages[0].url : '';
            setFormData((prev) => ({ ...prev, mainImageUrl: nextThumbnail }));
            setIndexThumbnail(0);
        }
    };

    const handleSetThumbnail = (image: string, index: number) => {
        setIndexThumbnail(index);
        setFormData((prev) => ({ ...prev, mainImageUrl: image }));
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t("productImage")}</h1>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="space-y-6">
                        {/* Thumbnail Image */}
                        {formData.mainImageUrl && (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">{t("thumbnailImage")}</label>
                                <div className="flex justify-center mb-6">
                                    <img
                                        src={formData.mainImageUrl}
                                        alt="Thumbnail"
                                        className="h-64 w-auto object-contain rounded-lg border-2 border-blue-500"
                                    />
                                </div>
                            </>
                        )}

                        {/* Product Images */}
                        {images.length > 0 && (
                            <div className="flex justify-center space-x-4 mb-6">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image.url}
                                            alt={`Product ${index}`}
                                            className={`h-24 w-24 object-cover rounded-lg cursor-pointer ${formData.mainImageUrl === image.url ? 'border-2 border-blue-500' : 'border border-gray-300'
                                                }`}
                                            onClick={() => handleSetThumbnail(image.url, index)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-600 rounded-full p-1 shadow-md"
                                        >
                                            <X color="white" size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("uploadImage")}</label>
                            <div
                                onClick={() => document.getElementById('image-upload')?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                            >
                                <div className="flex flex-col items-center">
                                    <Upload className="h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">{t("placeholderImage")}</p>
                                    <p className="text-xs text-gray-500">{t("supportImage")}</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            {t("back")}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/products/add/variants')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t("next")}
                        </button>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default AddProductImage;