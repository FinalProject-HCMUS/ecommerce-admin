import React, { useState, useEffect } from 'react';
import MotionPageWrapper from '../../components/common/MotionPage';
import Pagination from '../../components/common/Pagination';
import BlogCard from '../../components/blogs/BlogCard';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../../types/blog/Blog';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../components/common/DeleteConfirm';
import { useTranslation } from 'react-i18next';
import { deleteBlog, getBlogs } from '../../apis/blogApi';

const ITEMS_PER_PAGE = 6;

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [blogToDelete, setBlogToDelete] = React.useState<Blog | null>(null);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation('blog');
    const fetchBlogs = async (page: number, keysearch = '') => {
        setLoadingBlogs(true);
        const response = await getBlogs(page - 1, ITEMS_PER_PAGE, "createdAt,asc", keysearch);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            setLoadingBlogs(false);
            return;
        }
        if (response.data) {
            setLoadingBlogs(false);
            setBlogs(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
        setLoading(false);
    }
    useEffect(() => {
        fetchBlogs(currentPage, search);
    }, [currentPage, search]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    const handleDelete = (blog: Blog) => {
        setBlogToDelete(blog);
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setSearch(searchTerm);
            setCurrentPage(1);
        }
    }
    const confirmDelete = async () => {
        if (blogToDelete) {
            try {
                setLoading(true);
                await deleteBlog(blogToDelete.id);
                setLoading(false);
                toast.success('Blog deleted successfully!', { autoClose: 1000 });
                fetchBlogs(currentPage);
            } catch (error) {
                setLoading(false);
                console.error('Failed to delete blog:', error);
                toast.error('Failed to delete blog. Please try again.');
            }
            setBlogToDelete(null);
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                {/* Header */}
                <motion.div
                    className="mb-8 items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900">{t('blogs')}</h1>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    className="mb-6 flex justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-auto px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                        onClick={() => navigate('/blogs/add')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>{t('addBlog')}</span>
                    </button>
                </motion.div>

                {/* Blog Cards */}
                <div className="bg-white shadow-lg rounded-2xl">
                    {loadingBlogs ? (
                        <div role='status' className="flex justify-center items-center h-[500px]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                        </div>
                    ) : (
                        <motion.div
                            className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {blogs.map((blog) => (
                                <motion.div key={blog.id} variants={itemVariants}>
                                    <BlogCard blog={blog} onDelete={handleDelete} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <DeleteConfirmationModal
                        title={t('deleteBlog')}
                        isOpen={!!blogToDelete}
                        onClose={() => setBlogToDelete(null)}
                        onConfirm={confirmDelete}
                        loading={loading}
                    />

                    {/* Pagination */}
                    {!loadingBlogs && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </motion.div>
                    )}
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default Blogs;