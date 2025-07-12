import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import MotionPageWrapper from '../components/common/MotionPage';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('notfound');

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleGoBack = () => {
        try {
            navigate(-1);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleGoHome = () => {
        try {
            navigate('/customers');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    return (
        <MotionPageWrapper>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-8">
                <motion.div
                    className="max-w-lg mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* 404 Number */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            404
                        </h1>
                    </motion.div>

                    {/* Icon */}
                    <motion.div variants={itemVariants} className="mb-6">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="h-12 w-12 text-gray-400" />
                        </div>
                    </motion.div>

                    {/* Title and Description */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {t('title')}
                        </h2>
                        <p className="text-lg text-gray-600 mb-2">
                            {t('description')}
                        </p>
                        <p className="text-gray-500">
                            {t('subDescription')}
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            onClick={handleGoBack}
                            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            {t('goBack')}
                        </motion.button>

                        <motion.button
                            onClick={handleGoHome}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Home className="mr-2 h-5 w-5" />
                            {t('goHome')}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </MotionPageWrapper>
    );
};

export default NotFound;