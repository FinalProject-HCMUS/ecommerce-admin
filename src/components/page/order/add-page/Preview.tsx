import React from "react";
import { OrderDetailRequest } from "../../../../types/order/OrderDetailRequest";
import { OrderCreatedRequest } from "../../../../types/order/OrderCreatedRequest";
import MotionPageWrapper from "../../../common/MotionPage";
import { useNavigate } from "react-router-dom";

interface Props {
    formData: OrderCreatedRequest;
    orderDetails: OrderDetailRequest[];
    handleSubmit: () => void;
}

const Preview: React.FC<Props> = ({ formData, orderDetails, handleSubmit }) => {
    const navigate = useNavigate();
    return (
        <MotionPageWrapper>
            <div className="bg-gray-100 p-8 h-full">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Order Preview</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                        <div className="mb-2">
                            <span className="font-medium text-gray-700">Full Name: </span>
                            <span className="text-gray-900">{formData.firstName}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-medium text-gray-700">Phone Number: </span>
                            <span className="text-gray-900">{formData.phoneNumber}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-medium text-gray-700">Address: </span>
                            <span className="text-gray-900">{formData.address}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-medium text-gray-700">Payment Method: </span>
                            <span className="text-gray-900">{formData.paymentMethod}</span>
                        </div>
                        <div className="mb-6">
                            <span className="font-medium text-gray-700">Status: </span>
                            <span className="text-gray-900">{formData.status}</span>
                        </div>
                    </div>
                    <div className="row-span-2">
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
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
                                                <p className="text-sm text-gray-500">Size: {detail.size.name}</p>
                                                <p className="text-sm text-gray-500">Color: {detail.color.name}</p>
                                            </div>
                                            <div className="text-sm font-medium">{detail.unitPrice.toFixed(2)}</div>
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
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Order
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Subtotal</span>
                                <span className="text-sm font-medium">${formData.productCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Shipping Cost</span>
                                <span className="text-sm font-medium">${formData.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Total</span>
                                <span className="text-lg font-semibold">${formData.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default Preview;