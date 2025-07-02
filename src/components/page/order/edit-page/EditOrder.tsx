import React, { useEffect, useState } from "react";
import { OrderDetailResponse } from "../../../../types/order/OrderDetailResponse";
import EditOrderInformation from "./EditOrderInformation";
import EditOrderProduct from "./EditOrderProduct";
import Preview from "./Preview";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { defaultOrder, Order } from "../../../../types/order/Order";
import { createOrderDetail, getOrderById, getOrderDetailByOrderId, updateOrder, updateOrderDetail } from "../../../../apis/orderApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const EditOrder: React.FC = () => {
    const [formData, setFormData] = useState<Order>(defaultOrder);
    const [orderDetails, setOrderDetails] = useState<OrderDetailResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation("order");
    const fetchData = async () => {
        if (!id) return;
        const response = await getOrderById(id);
        if (response.isSuccess && response.data) {
            setFormData(response.data);
        }
        const orderDetailResponse = await getOrderDetailByOrderId(id);
        if (!orderDetailResponse.isSuccess) {
            toast.error(orderDetailResponse.message, {
                autoClose: 1000,
                position: "top-right"
            });
            return;
        }
        setOrderDetails(orderDetailResponse.data!);
    }
    useEffect(() => {
        fetchData();
    }, []);
    const handleSubmit = async () => {
        setLoading(true);
        //update order information
        const orderResponse = await updateOrder(id!, formData);
        if (!orderResponse.isSuccess) {
            toast.error(orderResponse.message, {
                autoClose: 1000,
                position: "top-right"
            });
            setLoading(false);
            return;
        }
        //update order details
        orderDetails.forEach(async (orderDetail) => {
            if (orderDetail.id !== "") {
                const response = await updateOrderDetail(orderDetail.id, orderDetail);
                if (!response.isSuccess) {
                    toast.error(response.message, {
                        autoClose: 1000,
                        position: "top-right"
                    });
                    setLoading(false);
                    return;
                }
            }
            else {
                const response = await createOrderDetail(orderDetail);
                if (!response.isSuccess) {
                    toast.error(response.message, {
                        autoClose: 1000,
                        position: "top-right"
                    });
                    setLoading(false);
                    return;
                }
            }
        });
        toast.success(t("updatedOrder"), {
            autoClose: 1000,
            position: "top-right"
        });
        setLoading(false);
        navigate("/orders");
    }
    if (!formData.id)
        return <div role="status" className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>;
    return (
        <>
            <Routes>
                <Route path="/information" element={
                    <EditOrderInformation
                        formData={formData} setFormData={setFormData} />} />
                <Route path="/product" element={
                    <EditOrderProduct
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
export default EditOrder;