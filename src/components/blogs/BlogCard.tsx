import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../../types/blog/blog';
import { X } from 'lucide-react';

interface BlogCardProps {
    blog: Blog;
    onDelete: (blog: Blog) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onDelete }) => {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    };
    const navigate = useNavigate();

    const handleDelete = async () => {
        onDelete(blog);
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
        >
            {/* Delete Icon */}
            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                aria-label="Delete Blog"
            >
                <X size={16} />
            </button>

            {/* Blog Image */}
            <img
                src={blog.image}
                alt={blog.title}
                className="w-full rounded-lg h-64 object-contain cursor-pointer"
                onClick={() => navigate(`/blogs/edit/${blog.id}`)}
            />

            {/* Blog Content */}
            <div className="p-4">
                {/* Blog Date */}
                <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </p>

                {/* Blog Title */}
                <h2 className="text-lg font-semibold text-gray-800 mt-2">
                    {blog.title}
                </h2>

                {/* Blog Content (Rendered as HTML) */}
                <div
                    className="text-sm text-gray-600 mt-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                ></div>

                {/* Blog Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                        Tips
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">
                        Fashion
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                        Style
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogCard;