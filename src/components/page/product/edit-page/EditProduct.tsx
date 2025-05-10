import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ProductImage } from '../../../../types/product/ProductImage';
import { toast } from 'react-toastify';
import { getProductById, getProductImages, getProductColorSizes } from '../../../../apis/productApi';
import EditProductInformation from './EditProductInformation';
import EditProductImage from './EditProductImage';
import EditVariants from './EditVariants';
import { Product } from '../../../../types/product/Product';
import { ProductColorSize } from '../../../../types/product/ProductColorSize';

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<Product>({} as Product);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [productColorSizes, setProductColorSizes] = useState<ProductColorSize[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            //get product information
            const response = await getProductById(id);

            if (!response.isSuccess || !response.data) {
                toast.error('Failed to fetch product data', { autoClose: 1000, position: 'top-right' });
                navigate('/products');
                return;
            }
            //get product images information
            const imagesResponse = await getProductImages(id);
            if (!imagesResponse.isSuccess) {
                toast.error('Failed to fetch product images', { autoClose: 1000, position: 'top-right' });
                return;
            }
            //get product color sizes
            const productColorSizesResponse = await getProductColorSizes(id);
            if (!productColorSizesResponse.isSuccess) {
                toast.error('Failed to fetch product color sizes', { autoClose: 1000, position: 'top-right' });
                return;
            }
            setFormData(response.data);
            setImages(imagesResponse.data || []);
            setProductColorSizes(productColorSizesResponse.data || []);
        };
        fetchProduct();
    }, [id, navigate]);

    const handleSubmit = async () => {
        // if (!formData) return;
        // // Upload new images if any
        // let updatedImages = [...images];
        // if (files.length > 0) {
        //     const imageResponse = await uploadImages(files);
        //     if (!imageResponse.isSuccess) {
        //         toast.error(imageResponse.message, { autoClose: 1000, position: 'top-right' });
        //         return;
        //     }
        //     updatedImages = updatedImages.map((img, idx) => ({
        //         ...img,
        //         url: imageResponse.data ? imageResponse.data[idx] : img.url,
        //         productId: formData.id,
        //     }));
        // }
        // // Update product
        // const productResponse = await updateProduct(formData);
        // if (!productResponse.isSuccess) {
        //     toast.error(productResponse.message, { autoClose: 1000, position: 'top-right' });
        //     return;
        // }
        // // Update images
        // const productImageResponse = await updateProductImages(updatedImages);
        // if (!productImageResponse.isSuccess) {
        //     toast.error(productImageResponse.message, { autoClose: 1000, position: 'top-right' });
        //     return;
        // }
        // // Update variants
        // if (productColorSizes.length !== 0) {
        //     const productColorSizeRequest: ProductColorSizeRequest[] = productColorSizes.map((pcs) => ({
        //         productId: formData.id,
        //         colorId: pcs.color!.id,
        //         sizeId: pcs.size!.id,
        //         quantity: pcs.quantity,
        //     }));
        //     const productColorSizeResponse = await createProductColorSizes(productColorSizeRequest);
        //     if (!productColorSizeResponse.isSuccess) {
        //         toast.error(productColorSizeResponse.message, { autoClose: 1000, position: 'top-right' });
        //         return;
        //     }
        // }
        toast.success('Product updated successfully', {
            autoClose: 1000,
            position: 'top-right',
            onClose: () => {
                navigate('/products');
            }
        });
    };

    if (!formData) return <div className="p-8 text-center">Loading...</div>;

    return (
        <Routes>
            <Route path="information" element={<EditProductInformation formData={formData} setFormData={setFormData} />} />
            <Route path="images" element={<EditProductImage images={images} setImages={setImages} formData={formData} setFormData={setFormData} files={files} setFiles={setFiles} />} />
            <Route path="variants" element={<EditVariants productColorSizes={productColorSizes} setProductColorSizes={setProductColorSizes} handleSubmit={handleSubmit} />} />
        </Routes>
    );
};

export default EditProduct;