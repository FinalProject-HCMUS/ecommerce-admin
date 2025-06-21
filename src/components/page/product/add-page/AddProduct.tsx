import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AddProductInformation from './AddProductInformation';
import AddProductImage from './AddProductImage';
import AddVariants from './AddVariants';
import { ProductImage } from '../../../../types/product/ProductImage';
import { ProductColorSize } from '../../../../types/product/ProductColorSize';

import { toast } from 'react-toastify';
import { uploadImages } from '../../../../apis/imageApi';
import { ProductRequest } from '../../../../types/product/ProductRequest';
import { addProduct, createProductColorSizes, updateProductImages } from '../../../../apis/productApi';
import { ProductColorSizeRequest } from '../../../../types/product/ProductColorSizeRequest';
import { useTranslation } from 'react-i18next';

const initialFormData = {
    name: '',
    description: '',
    category: '',
    categoryName: '',
    categoryId: '',
    price: 0,
    cost: 0,
    total: 0,
    enable: false,
    inStock: false,
    discountPercent: 0,
    mainImageUrl: ''
};

const AddProduct: React.FC = () => {
    const [formData, setFormData] = useState<ProductRequest>(initialFormData);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [indexThumbnail, setIndexThumbnail] = useState<number>(-1);
    const [productColorSizes, setProductColorSizes] = useState<ProductColorSize[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation('product');
    const navigate = useNavigate();
    const handleSubmit = async () => {
        setLoading(true);
        if (!formData.name || !formData.description || !formData.categoryId || formData.price <= 0 || formData.cost <= 0) {
            toast.error(t("filledCondition"), {
                autoClose: 1000,
                position: 'top-right',
            });
            setLoading(false);
            return;
        }
        if (images.length == 0) {
            toast.error(t("imageRequired"), {
                autoClose: 1000,
                position: 'top-right',
            });
            setLoading(false);
            return;
        }
        if (formData.mainImageUrl === '') {
            toast.error(t("mainImageRequired"), {
                autoClose: 1000,
                position: 'top-right',
            });
            setLoading(false);
            return;
        }
        //upload images to cloudinary
        const imageResponse = await uploadImages(files);
        if (!imageResponse.isSuccess) {
            toast.error(imageResponse.message, {
                autoClose: 1000,
                position: 'top-right',
            });
            return;
        }
        //set main image url to form data
        if (indexThumbnail !== -1) {
            formData.mainImageUrl = imageResponse.data![indexThumbnail];
        }
        // Call method add product to got productID
        const productResponse = await addProduct(formData);
        if (!productResponse.isSuccess) {
            toast.error(productResponse.message, {
                autoClose: 1000,
                position: 'top-right',
            });
            return;
        }
        images.forEach((image, index) => {
            image.url = imageResponse.data![index];
            image.productId = productResponse.data!.id;
        });
        //Call method add product images
        const productImageResponse = await updateProductImages(images);
        if (!productImageResponse.isSuccess) {
            toast.error(productImageResponse.message, {
                autoClose: 1000,
                position: 'top-right',
            });
            return;
        }
        if (productColorSizes.length != 0) {
            const productColorSizeRequest: ProductColorSizeRequest[] = productColorSizes.map((productColorSize) => ({
                productId: productResponse.data!.id,
                colorId: productColorSize.color!.id,
                sizeId: productColorSize.size!.id,
                quantity: productColorSize.quantity,
            }));
            const productColorSizeResponse = await createProductColorSizes(productColorSizeRequest);
            if (!productColorSizeResponse.isSuccess) {
                toast.error(productColorSizeResponse.message, {
                    autoClose: 1000,
                    position: 'top-right',
                });
                setLoading(false);
                return;
            }
        }
        setLoading(false);
        toast.success(t('addProductSuccess'), {
            autoClose: 1000,
            position: 'top-right',
            onClose: () => {
                navigate('/products');
            }
        });

    };
    return (
        <Routes>
            <Route path="information" element={<AddProductInformation formData={formData} setFormData={setFormData} />} />
            <Route path="images" element={<AddProductImage indexThumbnail={indexThumbnail} setIndexThumbnail={setIndexThumbnail} images={images} setImages={setImages} formData={formData} setFormData={setFormData} files={files} setFiles={setFiles} />} />
            <Route path="variants" element={<AddVariants productColorSizes={productColorSizes} setProductColorSizes={setProductColorSizes} handleSubmit={handleSubmit} loading={loading} />} />
        </Routes>
    );
};

export default AddProduct;