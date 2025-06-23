import { Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MotionModalWrapper from '../common/MotionModal';
import { useTranslation } from 'react-i18next';

interface UploadImageModalProps {
    onClose: () => void;
    onSubmit: (image: File | null) => void;
    imageUrl?: string | null;
    loading: boolean
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({ onClose, onSubmit, imageUrl, loading }) => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const { t } = useTranslation('blog');
    useEffect(() => {
        if (imageUrl) {
            setPreview(imageUrl);
        }
    }, []);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleClick = () => {
        document.getElementById('image-upload')?.click();
    };

    const handleSubmit = () => {
        onSubmit(image);
    };

    return (
        <MotionModalWrapper>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                    <button
                        type="button"
                        onClick={() => onClose()}
                        className="absolute top-2 right-2 p-1"
                    >
                        <X size={16} />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('uploadImage')}</h2>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('image')}</label>
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={handleClick}
                            className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                        >
                            <div className="flex flex-col items-center">
                                <Upload className="h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                    {t('placeholderImage')}
                                </p>
                                <p className="text-xs text-gray-500">{t('supportImage')}</p>
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                        </div>
                    </div>

                    {/* Image Preview */}
                    {preview && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('preview')}
                            </label>
                            <div className="rounded-lg p-2 flex flex-col items-center ">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-60 object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    )}


                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            {t('back')}
                        </button>
                        <button
                            disabled={loading}
                            onClick={handleSubmit}
                            className={`px-6 py-2 ${loading ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-blue-600'} text-white rounded-lg hover:bg-blue-700 transition-colors`}
                        >
                            {t('submit')}
                        </button>
                    </div>
                </div>
            </div>
        </MotionModalWrapper>
    );
};

export default UploadImageModal;