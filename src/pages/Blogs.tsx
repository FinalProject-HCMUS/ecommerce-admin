import React, { useState, useEffect } from 'react';
import MotionPageWrapper from '../components/common/MotionPage';
import { Blog } from '../types';
import { getBlogs } from '../apis/blogApi';
import Pagination from '../components/common/Pagination';
import BlogCard from '../components/blogs/BlogCard';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 6;

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getBlogs().then((data) => {
            setBlogs(data || []);
        });
    }, []);

    const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
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
                    className="mb-8 flex justify-between items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-2xl font-semibold text-gray-900">Blogs</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                        <Plus size={20} />
                        <span>Add Blog</span>
                    </button>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <input
                        type="text"
                        placeholder="Search blogs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-auto px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </motion.div>

                {/* Blog Cards */}
                <div className="bg-white rounded-lg shadow">
                    <motion.div
                        className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredBlogs.map((blog) => (
                            <motion.div key={blog.id} variants={itemVariants}>
                                <BlogCard blog={blog} />
                            </motion.div>
                        ))}
                    </motion.div>
                    {/* Pagination */}
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
                </div>

            </div>
        </MotionPageWrapper>
    );
};

export default Blogs;