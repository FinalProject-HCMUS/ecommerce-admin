import React from "react";
import { OrderDetailResponse } from "../../../../types/order/OrderDetailResponse";
import MotionPageWrapper from "../../../common/MotionPage";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../../types/order/Order";
import { useTranslation } from "react-i18next";
import { formatProductCost } from "../../../../utils/currency";

interface Props {
    formData: Order;
    orderDetails: OrderDetailResponse[];
    handleSubmit: () => void;
    loading: boolean;
}
const VND_TO_USD = import.meta.env.VITE_VND_TO_USD;
const Preview: React.FC<Props> = ({ formData, orderDetails, handleSubmit, loading }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("order");
    return (
        <MotionPageWrapper>
            <div className="bg-gray-100 p-8 h-full">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('orderPreview')}</h1>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('headerCustomer')}</h3>
                        <div className="mb-2">
                            <span className="font-medium text-gray-700">{t('fullName')}: </span>
                            <span className="text-gray-900">{formData.firstName}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-medium text-gray-700">{t('phone')}: </span>
                            <span className="text-gray-900">{formData.phoneNumber}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-medium text-gray-700">{t('address')}: </span>
                            <span className="text-gray-900">{formData.address}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-medium text-gray-700">{t('paymentMethod')}: </span>
                            <span className="text-gray-900">{formData.paymentMethod}</span>
                        </div>
                        <div className="mb-6">
                            <span className="font-medium text-gray-700">{t('status')}: </span>
                            <span className="text-gray-900">{formData.status}</span>
                        </div>
                    </div>
                    <div className="row-span-2">
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">{t('orderDetail')}</h3>
                                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                                    {orderDetails.map((detail) => (
                                        <div key={detail.itemId} className="flex items-center space-x-4">
                                            <img
                                                src={detail.product.mainImageUrl || './images/sample.png'}
                                                alt={detail.product.name}
                                                className="w-16 h-16 object-contain rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium">{detail.product.name}</h4>
                                                <p className="text-sm text-gray-500">{t('size')}: {detail.size.name}</p>
                                                <p className="text-sm text-gray-500">{t('color')}: {detail.color.name}</p>
                                            </div>
                                            <div className="text-sm font-medium">{formatProductCost(detail.unitPrice)}</div>
                                            <div className="flex items-center space-x-2">
                                                <span className="w-12 text-center border border-gray-300 rounded-lg bg-gray-100">
                                                    x{detail.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    onClick={() => navigate(-1)}
                                >
                                    {t('back')}
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                                >
                                    {t('update')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">{t('orderSummary')}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">{t('subtotal')}</span>
                                <span className="text-sm font-medium">{formatProductCost(formData.productCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">{t('shippingCost')}</span>
                                <span className="text-sm font-medium">{formatProductCost(formData.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">{t('total')}</span>
                                <span className="text-lg font-semibold">{formatProductCost(formData.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default Preview;