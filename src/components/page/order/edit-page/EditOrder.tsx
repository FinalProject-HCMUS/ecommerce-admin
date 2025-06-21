import React, { useEffect, useState } from "react";
import { OrderDetailResponse } from "../../../../types/order/OrderDetailResponse";
import EditOrderInformation from "./EditOrderInformation";
import EditOrderProduct from "./EditOrderProduct";
import Preview from "./Preview";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { defaultOrder, Order } from "../../../../types/order/Order";
import { createOrderDetail, getOrderById, getOrderDetailByOrderId, updateOrder, updateOrderDetail } from "../../../../apis/orderApi";
import { toast } from "react-toastify";

const EditOrder: React.FC = () => {
    const [formData, setFormData] = useState<Order>(defaultOrder);
    const [orderDetails, setOrderDetails] = useState<OrderDetailResponse[]>([]);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
        console.log("formData", formData);
        console.log("orderDetails", orderDetails);
        //update order information
        const orderResponse = await updateOrder(id!, formData);
        if (!orderResponse.isSuccess) {
            toast.error(orderResponse.message, {
                autoClose: 1000,
                position: "top-right"
            });
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
                    return;
                }
            }
        });
        toast.success("Update order successfully", {
            autoClose: 1000,
            position: "top-right"
        });
        navigate("/orders");
    }
    if (!formData.id)
        return <div className="flex justify-center items-center h-[400px]">
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
                    />} />
            </Routes>
        </>
    );
};
export default EditOrder;