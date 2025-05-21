import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import MotionPageWrapper from '../../components/common/MotionPage';
import { useNavigate } from 'react-router-dom';
import UploadImageModal from '../../components/blogs/UploadImageModal'; // Import the modal component
import { toast } from 'react-toastify';
import { BlogRequest } from '../../types/blog/BlogRequest';
import { uploadImage } from '../../apis/imageApi';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { addNewBlog } from '../../apis/blogApi';


const AddBlog: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation('blog');
    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error('Please fill in all fields!', { position: "top-right", autoClose: 1000 });
            return;
        }
        setIsModalOpen(true);
    };
    const handleSubmit = async (image: File | null) => {
        if (image) {
            //add image to cloudinary
            const imageResposne = await uploadImage(image);
            if (!imageResposne.isSuccess) {
                toast.error(imageResposne.message, { position: "top-right", autoClose: 1000 });
                return;
            }
            const newBlog: BlogRequest = {
                title,
                content,
                image: imageResposne.data!,
                userId: user!.id, // Replace with actual user ID
            };
            const response = await addNewBlog(newBlog); // Replace with actual API call
            if (!response.isSuccess) {
                toast.error(response.message, { position: "top-right", autoClose: 1000 });
                return;
            }
            toast.success('Blog created successfully!', { position: "top-right", autoClose: 1000 });
            setIsModalOpen(false);
            navigate('/blogs');
        } else {
            toast.error('Please upload an image!', { position: "top-right", autoClose: 1000 });
        }
    }
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ color: [] }, { background: [] }],
            ['link'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'font',
        'bold',
        'italic',
        'underline',
        'strike',
        'align',
        'list',
        'bullet',
        'indent',
        'direction',
        'color',
        'background',
        'link',
    ];

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('writeNewBlog')}</h1>
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    {/* Title Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder={t('blogTitle')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* React Quill Editor */}
                    <div className="mb-16">
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            placeholder={t('blogContentPlaceholder')}
                            className='h-96'
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            {t('back')}
                        </button>
                        <button
                            onClick={handleNextStep}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {t('next')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Upload Image Modal */}
            {isModalOpen && (
                <UploadImageModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    imageUrl={null}
                />
            )}
        </MotionPageWrapper>
    );
};

export default AddBlog;