import React from "react";
import MotionPageWrapper from "../../../common/MotionPage";
import { OrderCreatedRequest } from "../../../../types/order/OrderCreatedRequest";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Props {
    formData: OrderCreatedRequest;
    setFormData: React.Dispatch<React.SetStateAction<OrderCreatedRequest>>;
}

const AddOrderInformation: React.FC<Props> = ({ formData, setFormData }) => {
    const { t } = useTranslation("order");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNextStep = () => {
        // Handle the next step logic here
        //check fill all informations
        if (!formData.firstName || !formData.phoneNumber || !formData.address || !formData.paymentMethod || !formData.status) {
            toast.error("Please fill in all required fields.", { autoClose: 1000, position: "top-right" });
            return;
        }
        navigate("/orders/add/product");
    }
    const navigate = useNavigate();
    return (
        <MotionPageWrapper>
            <div className="bg-gray-100 p-8 h-full">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">{t('orderInformation')}</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <p className="text-gray-600 mb-4 italic">{t('guide')}</p>
                    <form className="p-6 grid grid-cols-1 gap-6">
                        {/* Customer Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{t('headerCustomer')}</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">{t('firstName')}</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">{t('lastName')}</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">{t('phone')}</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">{t('address')}</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    rows={2}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">{t('paymentMethod')}</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="COD">{t('cod')}</option>
                                    <option value="VN_PAY">VN Pay</option>
                                    <option value="MOMO">Momo</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">{t('status')}</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="NEW">{t('new')}</option>
                                    <option value="PROCESSING">{t('processing')}</option>
                                    <option value="PACKAGED">{t('packaged')}</option>
                                    <option value="PICKED">{t('picked')}</option>
                                    <option value="SHIPPING">{t('shipping')}</option>
                                    <option value="DELIVERED">{t('delivered')}</option>
                                    <option value="REFUNDED">{t('refunded')}</option>
                                    <option value="CANCELLED">{t('cancelled')}</option>
                                </select>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="col-span-2 flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                    navigate(-1);
                                }}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {t('next')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MotionPageWrapper >
    );
};

export default AddOrderInformation;