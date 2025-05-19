import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MotionPageWrapper from '../../components/common/MotionPage';
import { useNavigate, useParams } from 'react-router-dom';
import UploadImageModal from '../../components/blogs/UploadImageModal';
import { toast } from 'react-toastify';
import { Blog } from '../../types/blog/blog';
import { uploadImage } from '../../apis/imageApi';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getBlogById, updateBlog } from '../../apis/blogApi';

const EditBlog: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation('blog');
    const getBlog = async () => {
        const response = await getBlogById(id || '');
        if (!response.isSuccess) {
            toast.error(response.message, { position: 'top-right', autoClose: 1000 });
            return;
        }
        if (response.data) {
            setTitle(response.data.title);
            setContent(response.data.content);
            setImage(response.data.image);
            setBlog(response.data);
        }
    }
    useEffect(() => {
        getBlog();
    }, []);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error('Please fill in all fields!', { position: 'top-right', autoClose: 1000 });
            return;
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (newImage: File | null) => {
        let updatedBlog: Blog = {
            ...blog!,
            userId: user!.id,
            title,
            content,
        };
        if (newImage) {
            const imageResposne = await uploadImage(newImage);
            if (!imageResposne.isSuccess) {
                toast.error(imageResposne.message, { position: "top-right", autoClose: 1000 });
                return;
            }
            updatedBlog = {
                ...updatedBlog,
                image: imageResposne.data!,
            };
        }
        console.log('updatedBlog', updatedBlog);

        const response = await updateBlog(id!, updatedBlog);
        if (!response.isSuccess) {
            toast.error(response.message, { position: 'top-right', autoClose: 1000 });
            return;
        }
        toast.success('Blog updated successfully!', { position: 'top-right', autoClose: 1000 });
        setIsModalOpen(false);
        navigate('/blogs');
    };

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
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t('editBlog')}</h1>
                <div className="bg-white rounded-lg shadow p-6">
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
                            placeholder={t('blogContectPlaceholder')}
                            className="h-96"
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
                    imageUrl={image}
                />
            )}
        </MotionPageWrapper>
    );
};

export default EditBlog;