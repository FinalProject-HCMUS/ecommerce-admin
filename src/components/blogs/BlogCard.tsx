import React from 'react';
import { Blog } from '../../types';
import { motion } from 'framer-motion';
interface BlogCardProps {
    blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    };
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}>
            <img
                src={blog.image}
                alt={blog.title}
                className="w-full rounded-lg h-64 object-cover"
            />
            <div className="p-4">
                <p className="text-sm text-gray-500">
                    {new Date(blog.created_At).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </p>
                <h2 className="text-lg font-semibold text-gray-800 mt-2">
                    {blog.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {blog.content}
                </p>
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