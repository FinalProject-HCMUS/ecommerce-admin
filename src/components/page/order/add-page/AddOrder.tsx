import React, { useState } from "react";
import { OrderDetailRequest } from "../../../../types/order/OrderDetailRequest";
import AddOrderInformation from "./AddOrderInformation";
import AddOrderProduct from "./AddOrderProduct";
import Preview from "./Preview";
import { defaultOrderCreatedRequest, OrderCreatedRequest } from "../../../../types/order/OrderCreatedRequest";
import { Route, Routes } from "react-router-dom";

const AddOrder: React.FC = () => {
    const [formData, setFormData] = useState<OrderCreatedRequest>(defaultOrderCreatedRequest);
    const [orderDetails, setOrderDetails] = useState<OrderDetailRequest[]>([]);
    const handleSubmit = async () => {

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
                    />} />
            </Routes>
        </>
    );
};
export default AddOrder;