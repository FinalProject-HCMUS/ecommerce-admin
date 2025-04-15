import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MotionPageWrapper from '../../components/common/MotionPage';
import { useNavigate, useParams } from 'react-router-dom';
import UploadImageModal from '../../components/blogs/UploadImageModal';
import { toast } from 'react-toastify';
import { Blog } from '../../types';
import { getBlogById } from '../../apis/blogApi';

const EditBlog: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get blog ID from URL params
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    // Fetch all blogs
    useEffect(() => {
        getBlogById(id || '').then((blog) => {
            if (blog) {
                setTitle(blog.title);
                setContent(blog.content);
                setImage(blog.image);
            }
        });
    }, []);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error('Please fill in all fields!', { position: 'top-right', autoClose: 1000 });
            return;
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (newImage: File | null) => {
        const updatedBlog: Blog = {
            id: id || '',
            title,
            content,
            image: newImage ? URL.createObjectURL(newImage) : image || '',
            updated_At: new Date().toISOString(),
        };

        // Call API to update the blog
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
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Blog</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Title Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Blog Title..."
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
                            placeholder="Edit your blog content here..."
                            className="h-96"
                        />
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNextStep}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Next step
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