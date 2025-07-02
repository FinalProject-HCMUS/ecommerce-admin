// Example usage of currency helper functions in your project

import { formatCurrency, formatProductCost, formatPrice } from '../utils/currency';

// Example: Using in a product form component
const ProductFormExample = ({ formData, setFormData }) => {
    return (
        <div>
            {/* Display product cost based on current language */}
            <p>Product Cost: {formatProductCost(formData.cost)}</p>

            {/* Display product price with custom ₫ symbol */}
            <p>Product Price: {formatPrice(formData.price)}</p>

            {/* More flexible formatting with options */}
            <p>
                Converted Price: {formatCurrency({
                    amount: formData.price,
                    fromCurrency: 'VND',
                    toCurrency: 'USD'
                })}
            </p>

            {/* Force specific language formatting */}
            <p>Price in Vietnamese: {formatPrice(formData.price, 'vi')}</p>
            <p>Price in English: {formatPrice(formData.price, 'en')}</p>
        </div>
    );
};

// Example: Using in table displays
const ProductTableExample = ({ products }) => {
    return (
        <table>
            <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{formatPrice(product.price)}</td> {/* Will auto-format based on language */}
                        <td>{formatProductCost(product.cost)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Example: Using in conditional rendering (replaces your original pattern)
const OriginalPattern = ({ formData, i18n }) => {
    // OLD WAY:
    // {i18n.language === 'vi'
    //   ? formData.productCost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    //   : (formData.productCost / VND_TO_USD).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}

    // NEW WAY:
    return <span>{formatProductCost(formData.productCost)}</span>;
};

export { ProductFormExample, ProductTableExample, OriginalPattern };
