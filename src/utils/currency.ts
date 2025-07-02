import i18n from '../config/i18n';

// Exchange rate constant - using environment variable or fallback
export const VND_TO_USD = Number(import.meta.env.VITE_VND_TO_USD) || 24000;

interface CurrencyFormatOptions {
    amount: number;
    language?: string;
    fromCurrency?: 'VND' | 'USD';
    toCurrency?: 'VND' | 'USD';
}

export const formatCurrency = ({
    amount,
    language,
    fromCurrency = 'VND',
    toCurrency
}: CurrencyFormatOptions): string => {
    const currentLanguage = language || i18n.language;

    // Determine target currency based on language if not specified
    const targetCurrency = toCurrency || (currentLanguage === 'vi' ? 'VND' : 'USD');

    let convertedAmount = amount;

    // Convert currency if needed
    if (fromCurrency !== targetCurrency) {
        if (fromCurrency === 'VND' && targetCurrency === 'USD') {
            convertedAmount = amount / VND_TO_USD;
        } else if (fromCurrency === 'USD' && targetCurrency === 'VND') {
            convertedAmount = amount * VND_TO_USD;
        }
    }

    // Format based on target currency
    if (targetCurrency === 'VND') {
        return convertedAmount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    } else {
        return convertedAmount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }
};

/**
 * Simple currency formatter that follows the same pattern as your example
 * @param amount - The amount in VND
 * @param language - Optional language override
 * @returns Formatted currency string
 */
export const formatProductCost = (amount: number, language?: string): string => {
    const currentLanguage = language || i18n.language;

    if (currentLanguage === 'vi') {
        return amount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    } else {
        return (amount / VND_TO_USD).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }
};

/**
 * Format price with custom symbol (₫) as used in your project
 * @param amount - The amount to format
 * @param language - Optional language override
 * @returns Formatted price string with ₫ symbol
 */
export const formatPrice = (amount: number, language?: string): string => {
    const currentLanguage = language || i18n.language;

    if (currentLanguage === 'vi') {
        return `₫${amount.toLocaleString()}`;
    } else {
        return `$${(amount / VND_TO_USD).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }
};
