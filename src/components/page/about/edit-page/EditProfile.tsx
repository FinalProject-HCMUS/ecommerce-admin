import React, { useEffect, useState } from 'react';
import { User } from '../../../../types/user/User';
import { Camera } from 'lucide-react';
import MotionPageWrapper from '../../../common/MotionPage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { uploadImage } from '../../../../apis/imageApi';
import { toast } from 'react-toastify';
import { UserRequest } from '../../../../types/user/UserRequest';
import { updateProfile } from '../../../../apis/userApi';

const EditProfile: React.FC = () => {
    const [updateUser, setUpdateUser] = useState<User | undefined>();
    const [photoPreview, setPhotoPreview] = useState<string>();
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const { user, setUser } = useAuth();;
    const navigate = useNavigate();
    useEffect(() => {
        setUpdateUser(user);
        setPhotoPreview(user?.photo);
    }, [user]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateUser((prev) => ({
            ...prev!,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const url = URL.createObjectURL(file);
            setPhotoPreview(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        //add image if image change
        if (file) {
            console.log(file);

            const imageResponse = await uploadImage(file);
            if (!imageResponse.isSuccess) {
                toast.error(imageResponse.message, { autoClose: 1000, position: 'top-right' });
                setSaving(false);
                return;
            }
            updateUser!.photo = imageResponse.data!;
        }
        //update user
        const userRequest: UserRequest = {
            firstName: updateUser!.firstName,
            lastName: updateUser!.lastName,
            email: updateUser!.email,
            phoneNumber: updateUser!.phoneNumber,
            address: updateUser!.address,
            weight: updateUser!.weight,
            height: updateUser!.height,
            enabled: updateUser!.enabled,
            photo: updateUser!.photo,
            role: updateUser!.role,
        }
        console.log(userRequest);
        const response = await updateProfile(user!.id, userRequest);
        console.log(response);

        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: 'top-center' });
            return;
        }
        setUser(response.data);
        toast.success('Profile updated successfully', {
            autoClose: 1000, position: 'top-right', onClose: () => {
                navigate(-1);
            }
        });
    };

    return (
        <MotionPageWrapper>
            {updateUser && <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Edit profile</h1>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto mt-8">
                    <h2 className="text-2xl font-bold text-center mb-5">Personal information</h2>
                    <div className="flex justify-center items-center mb-8">
                        <div className="relative">
                            <img
                                src={photoPreview}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                            />
                            <label className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer">
                                <Camera size={18} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={updateUser.firstName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={updateUser.lastName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={updateUser.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <input
                                type="number"
                                name="phoneNumber"
                                value={updateUser.phoneNumber}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={updateUser.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Weight</label>
                            <input
                                type="number"
                                name="weight"
                                value={updateUser.weight}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Height</label>
                            <input
                                type="number"
                                name="height"
                                value={updateUser.height}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <input
                                type="text"
                                name="role"
                                value={updateUser.role}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                navigate(-1);
                            }}
                            className="mr-4 bg-gray-300 text-gray-700 px-8 py-2 rounded-full font-semibold hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-700 transition ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={saving}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>}
        </MotionPageWrapper>
    );
};

export default EditProfile;