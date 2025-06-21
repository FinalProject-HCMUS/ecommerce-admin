import React from 'react';
import { KeyRound, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MotionPageWrapper from '../components/common/MotionPage';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('profile');
    const { user } = useAuth();
    return (
        <MotionPageWrapper>
            {user && <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('about')}</h1>
                </div>
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg flex items-center p-6 mb-6">
                    <div className="relative">
                        <img
                            src={user.photo}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                        />
                    </div>
                    <div className="ml-6">
                        <div className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                    <div className='ml-auto '>
                        <button onClick={() => { navigate("/about/change-password") }} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition">
                            {t("changePassword")}<KeyRound size={16} className="ml-1" />
                        </button>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-semibold">{t('personalInfo')}</h1>
                        <button onClick={() => { navigate("/about/edit") }} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition">
                            {t('edit')} <Pencil size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm text-gray-500">{t('firstName')}</div>
                            <div className="font-medium text-gray-900">{user.firstName}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{t('lastName')}</div>
                            <div className="font-medium text-gray-900">{user.lastName}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{t('userRole')}</div>
                            <div className="font-medium text-gray-900">{user.role}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{t('email')}</div>
                            <div className="font-medium text-gray-900">{user.email}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{t('phone')}</div>
                            <div className="font-medium text-gray-900">{user.phoneNumber}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{t('enabled')}</div>
                            <div className="font-medium text-gray-900">{user.enabled ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{t('height')}</div>
                            <div className="font-medium text-gray-900">{user.height} cm</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{t('weight')}</div>
                            <div className="font-medium text-gray-900">{user.weight} kg</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">{t('address')}</div>
                            <div className="font-medium text-gray-900">{user.address} kg</div>
                        </div>
                    </div>
                </div>
            </div>}
        </MotionPageWrapper>
    );
};

export default About;