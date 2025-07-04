import React, { useState } from "react";
import AddOrderInformation from "./AddOrderInformation";
import AddOrderProduct from "./AddOrderProduct";
import Preview from "./Preview";
import { defaultOrderCreatedRequest, OrderCreatedRequest } from "../../../../types/order/OrderCreatedRequest";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { createListOrderDetails, createOrder } from "../../../../apis/orderApi";
import { toast } from "react-toastify";
import { OrderDetailCreated } from "../../../../types/order/OrderDetailCreated";
import { OrderDetailCreatedUI } from "../../../../types/order/OrderDetailCreatedUI";
import { useTranslation } from "react-i18next";

const AddOrder: React.FC = () => {
    const [formData, setFormData] = useState<OrderCreatedRequest>(defaultOrderCreatedRequest);
    const [orderDetails, setOrderDetails] = useState<OrderDetailCreatedUI[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const { t } = useTranslation("order");
    const navigate = useNavigate();
    const handleSubmit = async () => {
        setLoading(true);
        const idUser = user?.id;
        formData.customerId = idUser;
        formData.deliveryDate = new Date().toISOString();
        const orderResponse = await createOrder(formData);
        if (!orderResponse.isSuccess) {
            toast.error(orderResponse.message, { autoClose: 1000, position: "top-right" });
            setLoading(false);
            return;
        }
        //add order details
        const orderDetailsRequest: OrderDetailCreated[] = orderDetails.map((item) => ({
            orderId: orderResponse.data!.id,
            itemId: item.itemId,
            productCost: item.productCost,
            total: item.total,
            unitPrice: item.unitPrice,
            quantity: item.quantity
        }));
        const orderDetailsResponse = await createListOrderDetails(orderDetailsRequest);
        if (!orderDetailsResponse.isSuccess) {
            toast.error(orderDetailsResponse.message, { autoClose: 1000, position: "top-right" });
            return;
        }
        toast.success(t("addedOrder"), { autoClose: 1000, position: "top-right" });
        setLoading(false);
        navigate("/orders");

    }
    return (
        <>
            <Routes>
                <Route path="/information" element={
                    <AddOrderInformation
                        formData={formData} setFormData={setFormData} />} />
                <Route path="/product" element={
                    <AddOrderProduct
                        orderDetails={orderDetails}
                        setOrderDetails={setOrderDetails}
                        formData={formData}
                        setFormData={setFormData}
                    />} />
                <Route path="/preview" element={
                    <Preview
                        formData={formData}
                        orderDetails={orderDetails}
                        handleSubmit={handleSubmit}
                        loading={loading}
                    />} />
            </Routes>
        </>
    );
};
export default AddOrder;