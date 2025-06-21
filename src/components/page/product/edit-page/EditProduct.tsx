import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ProductImage } from '../../../../types/product/ProductImage';
import { toast } from 'react-toastify';
import { getProductById, getProductImages, getProductColorSizes, updateProductImages, updateProduct, deleteProductImage, createProductColorSizes, updateProductColorSize } from '../../../../apis/productApi';
import EditProductInformation from './EditProductInformation';
import EditProductImage from './EditProductImage';
import EditVariants from './EditVariants';
import { Product } from '../../../../types/product/Product';
import { ProductColorSize } from '../../../../types/product/ProductColorSize';
import { uploadImages } from '../../../../apis/imageApi';
import { ProductColorSizeRequest } from '../../../../types/product/ProductColorSizeRequest';
import { useTranslation } from 'react-i18next';

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<Product>({} as Product);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [deletedProductImages, setDeletedProductImages] = useState<ProductImage[]>([]);
    const [indexThumbnail, setIndexThumbnail] = useState<number>(-1);
    const [productColorSizes, setProductColorSizes] = useState<ProductColorSize[]>([]);
    const [addedProductColorSizes, setAddedProductColorSizes] = useState<ProductColorSize[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation('product');
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
    }, [id]);

    const handleSubmit = async () => {
        //validation data
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
            toast.error('Please add at least one image', {
                autoClose: 1000,
                position: 'top-right',
            });
            setLoading(false);
            return;
        }
        if (formData.mainImageUrl === '') {
            toast.error('Please select a thumbnail image', {
                autoClose: 1000,
                position: 'top-right',
            });
            setLoading(false);
            return;
        }
        //add images if necessary
        let imageResponse = undefined;
        if (files.length > 0) {
            imageResponse = await uploadImages(files);
            if (!imageResponse.isSuccess) {
                toast.error(imageResponse.message, {
                    autoClose: 1000,
                    position: 'top-right',
                });
                setLoading(false);
                return;
            }
        }
        if (imageResponse) {
            let i = 0;
            images.forEach(image => {
                if (image.id === '') {
                    image.url = imageResponse.data![i++];
                    image.productId = formData.id;
                }
            });
        }
        if (indexThumbnail !== -1) {
            formData.mainImageUrl = images[indexThumbnail].url;
        }
        if (indexThumbnail === -1 && images.length == 0) {
            formData.mainImageUrl = '';
        }
        //update prroduct images
        const productImageResponse = await updateProductImages(images);
        if (!productImageResponse.isSuccess) {
            toast.error(productImageResponse.message, {
                autoClose: 1000,
                position: 'top-right',
            });
            setLoading(false);
            return;
        }
        //delete product images
        if (deletedProductImages.length > 0) {
            deletedProductImages.forEach(async image => {
                const response = await deleteProductImage(image.id);
                if (!response.isSuccess) {
                    toast.error(response.message, {
                        autoClose: 1000,
                        position: 'top-right',
                    });
                    setLoading(false);
                    return;
                }
            }
            );
        }
        //update product information
        const productResponse = await updateProduct(formData.id, formData);
        if (!productResponse.isSuccess) {
            toast.error(productResponse.message, {
                autoClose: 1000,
                position: 'top-right',
            });
            setLoading(false);
            return;
        }
        //add product color sizes not in database
        if (addedProductColorSizes.length != 0) {
            const productColorSizeRequest: ProductColorSizeRequest[] = addedProductColorSizes.map((productColorSize) => ({
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
        //update product color sizes
        productColorSizes.forEach(async productColorSize => {
            const response = await updateProductColorSize(productColorSize.id, {
                productId: productResponse.data!.id,
                colorId: productColorSize.color!.id,
                sizeId: productColorSize.size!.id,
                quantity: productColorSize.quantity,
            });
            if (!response.isSuccess) {
                toast.error(response.message, {
                    autoClose: 1000,
                    position: 'top-right',
                });
                return;
            }
        }
        );
        toast.success(t('editProductSuccess'), {
            autoClose: 1000,
            position: 'top-right',
            onClose: () => {
                navigate('/products');
            }
        });
    };

    if (!formData.id)
        return <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>;

    return (
        <Routes>
            <Route path="information" element={<EditProductInformation formData={formData} setFormData={setFormData} />} />
            <Route path="images" element={<EditProductImage setDeletedProductImages={setDeletedProductImages} indexThumbnail={indexThumbnail} setIndexThumbnail={setIndexThumbnail} images={images} setImages={setImages} formData={formData} setFormData={setFormData} files={files} setFiles={setFiles} />} />
            <Route path="variants" element={<EditVariants loading={loading} addedProductColorSizes={addedProductColorSizes} setAddedProductColorSizes={setAddedProductColorSizes} productColorSizes={productColorSizes} setProductColorSizes={setProductColorSizes} handleSubmit={handleSubmit} />} />
        </Routes>
    );
};

export default EditProduct;