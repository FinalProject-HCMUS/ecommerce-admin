import React, { useState } from "react";
import MotionPageWrapper from "../../../common/MotionPage";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { uploadImage } from "../../../../apis/imageApi";
import { toast } from "react-toastify";
import { createUser } from "../../../../apis/userApi";
import { UserRequestCreated } from "../../../../types/user/UserRequestCreated";

const AddCustomer: React.FC = () => {
    const [formData, setFormData] = useState<UserRequestCreated>({
        email: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        address: '',
        weight: 0,
        height: 0,
        password: '',
        photo: 'https://res.cloudinary.com/djjbs0a2v/image/upload/v1747887269/default_ebfqam.png',
        enabled: true,
    });
    const [saving, setSaving] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { t } = useTranslation('user');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const photoURL = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                photo: photoURL,
            }));
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        //add image if image change
        if (file) {
            const imageResponse = await uploadImage(file);
            if (!imageResponse.isSuccess) {
                toast.error(imageResponse.message, { autoClose: 1000, position: 'top-right' });
                setSaving(false);
                return;
            }
            formData!.photo = imageResponse.data!;
        }
        //add user
        const response = await createUser(formData);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: 'top-right' });
            setSaving(false);
            return;
        }
        toast.success(t('addCustomerSuccess'), { autoClose: 1000, position: 'top-right' });
        setSaving(false);
        navigate('/customers');
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('addCustomer')}</h1>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
                    <h2 className="text-2xl font-bold text-center mb-5">{t('personalInfo')}</h2>
                    <div className="flex justify-center items-center mb-8">
                        <div className="relative">
                            <img
                                src={formData.photo}
                                alt="User"
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
                            <label className="block text-sm font-medium mb-1">{t('firstName')}</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('lastName')}</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('email')}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('password')}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('phone')}</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('address')}</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('weight')}</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('height')}</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t('status')}</label>
                            <select
                                name="enabled"
                                value={formData.enabled ? 'Enabled' : 'Disabled'}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        enabled: e.target.value === 'Enabled',
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Enabled">{t('enable')}</option>
                                <option value="Disabled">{t('disable')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mr-4 bg-gray-300 text-gray-700 px-8 py-2 rounded-full font-semibold hover:bg-gray-400 transition"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-700 transition ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={saving}
                        >
                            {t('add')}
                        </button>
                    </div>
                </form>
            </div>
        </MotionPageWrapper>
    );
};

export default AddCustomer;