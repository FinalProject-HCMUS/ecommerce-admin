import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AddProductInformation from './AddProductInformation';
import AddProductImage from './AddProductImage';
import AddVariants from './AddVariants';
import { ProductImage } from '../../../../types/product/ProductImage';
import { Color } from '../../../../types/color/Color';
import { Size } from '../../../../types/size/Size';
import { ProductColorSize } from '../../../../types/product/ProductColorSize';

const initialFormData = {
    name: '',
    description: '',
    category: '',
    categoryId: '',
    price: 0,
    cost: 0,
    total: 0,
    enable: false,
    inStock: true,
    discountPercent: 0,
    mainImageUrl: '',
};

const AddProduct: React.FC = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [productColorSizes, setProductColorSizes] = useState<ProductColorSize[]>([]);

    const handleSubmit = () => {
        // Submit the product data to the server
        console.log('Submitting product:', { formData, images, colors, sizes, productColorSizes });
    };

    return (
        <Routes>
            <Route path="information" element={<AddProductInformation formData={formData} setFormData={setFormData} />} />
            <Route path="images" element={<AddProductImage images={images} setImages={setImages} formData={formData} setFormData={setFormData} />} />
            <Route path="variants" element={<AddVariants colors={colors} setColors={setColors} sizes={sizes} setSizes={setSizes} productColorSizes={productColorSizes} setProductColorSizes={setProductColorSizes} handleSubmit={handleSubmit} />} />
        </Routes>
    );
};

export default AddProduct;