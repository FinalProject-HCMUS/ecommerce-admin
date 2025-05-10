import React from 'react';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MotionPageWrapper from '../components/common/MotionPage';
import { useAuth } from '../context/AuthContext';

const About: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <MotionPageWrapper>
            {user && <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">About</h1>
                </div>
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow flex items-center p-6 mb-6">
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
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-semibold">Personal Information</h1>
                        <button onClick={() => { navigate("/about/edit") }} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition">
                            Edit <Pencil size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm text-gray-500">First Name</div>
                            <div className="font-medium text-gray-900">{user.firstName}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Last Name</div>
                            <div className="font-medium text-gray-900">{user.lastName}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">User Role</div>
                            <div className="font-medium text-gray-900">{user.role}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Email Address</div>
                            <div className="font-medium text-gray-900">{user.email}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Phone Number</div>
                            <div className="font-medium text-gray-900">{user.phoneNumber}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Enabled</div>
                            <div className="font-medium text-gray-900">{user.enabled ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Height</div>
                            <div className="font-medium text-gray-900">{user.height} cm</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Weight</div>
                            <div className="font-medium text-gray-900">{user.weight} kg</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Address</div>
                            <div className="font-medium text-gray-900">{user.address} kg</div>
                        </div>
                    </div>
                </div>
            </div>}
        </MotionPageWrapper>
    );
};

export default About;