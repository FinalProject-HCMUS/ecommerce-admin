import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Login as LoginInterface } from '../types';
import MotionPageWrapper from '../components/common/MotionPage';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const credentials: LoginInterface = { username, password };
        login(credentials, navigate);
    };

    return (

        <div className="flex items-center justify-center min-h-screen bg-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">{t('adminSignin')}</h2>
                <MotionPageWrapper>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('userName')}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        {/* <div className="mb-4 flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-2 text-sm text-gray-700">Remember password</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                        </div> */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('signIn')}
                        </button>
                    </form>
                </MotionPageWrapper>
            </div>
        </div>

    );
};

export default Login;