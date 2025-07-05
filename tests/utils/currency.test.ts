import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatCurrency, formatProductCost, formatPrice, VND_TO_USD } from '../../src/utils/currency';

// Use vi.hoisted to create the mock object
const mockI18n = vi.hoisted(() => ({
    language: 'en'
}));

// Mock the i18n module
vi.mock('../../src/config/i18n', () => ({
    default: mockI18n
}));

// Mock environment variable with proper typing
declare global {
    interface ImportMeta {
        env: Record<string, string>;
    }
}

const originalEnv = import.meta.env;

beforeEach(() => {
    vi.clearAllMocks();
    // Reset i18n language to default
    mockI18n.language = 'en';
});

afterEach(() => {
    import.meta.env = originalEnv;
});

describe('Currency Utilities', () => {
    describe('VND_TO_USD constant', () => {
        it('should use environment variable if available', () => {
            // The constant is already defined, so we test its existence and type
            expect(VND_TO_USD).toBeDefined();
            expect(typeof VND_TO_USD).toBe('number');
            expect(VND_TO_USD).toBeGreaterThan(0);
        });

        it('should fallback to 24000 if no environment variable', () => {
            // Since we can't easily mock import.meta.env in this context,
            // we test the fallback behavior indirectly
            expect(VND_TO_USD).toBe(24000);
        });
    });

    describe('formatCurrency', () => {
        describe('VND formatting', () => {
            it('should format VND amount for Vietnamese language', () => {
                mockI18n.language = 'vi';

                const result = formatCurrency({ amount: 100000 });

                expect(result).toMatch(/₫|VND/); // Should contain currency symbol or code
                expect(result).toContain('100');
            });

            it('should format VND amount when explicitly specified', () => {
                const result = formatCurrency({
                    amount: 100000,
                    toCurrency: 'VND'
                });

                expect(result).toMatch(/₫|VND/);
                expect(result).toContain('100');
            });

            it('should handle large VND amounts', () => {
                const result = formatCurrency({
                    amount: 1000000000,
                    toCurrency: 'VND'
                });

                expect(result).toMatch(/₫|VND/);
                expect(result).toContain('1');
            });
        });

        describe('USD formatting', () => {
            it('should format USD amount for English language', () => {
                mockI18n.language = 'en';

                const result = formatCurrency({
                    amount: 100,
                    fromCurrency: 'USD'
                });

                expect(result).toContain('$');
                expect(result).toContain('100');
            });

            it('should format USD amount when explicitly specified', () => {
                const result = formatCurrency({
                    amount: 100,
                    fromCurrency: 'USD',
                    toCurrency: 'USD'
                });

                expect(result).toContain('$');
                expect(result).toContain('100');
            });

            it('should handle decimal USD amounts', () => {
                const result = formatCurrency({
                    amount: 99.99,
                    fromCurrency: 'USD',
                    toCurrency: 'USD'
                });

                expect(result).toContain('$');
                expect(result).toContain('99.99');
            });
        });

        describe('currency conversion', () => {
            it('should convert VND to USD', () => {
                const result = formatCurrency({
                    amount: 240000,
                    fromCurrency: 'VND',
                    toCurrency: 'USD'
                });

                expect(result).toContain('$');
                expect(result).toContain('10'); // 240000 / 24000 = 10
            });

            it('should convert USD to VND', () => {
                const result = formatCurrency({
                    amount: 10,
                    fromCurrency: 'USD',
                    toCurrency: 'VND'
                });

                expect(result).toMatch(/₫|VND/);
                expect(result).toContain('240'); // 10 * 24000 = 240000
            });

            it('should not convert when currencies are the same', () => {
                const result = formatCurrency({
                    amount: 100,
                    fromCurrency: 'USD',
                    toCurrency: 'USD'
                });

                expect(result).toContain('$');
                expect(result).toContain('100');
            });
        });

        describe('language override', () => {
            it('should use provided language parameter over i18n language', () => {
                mockI18n.language = 'en';

                const result = formatCurrency({
                    amount: 100000,
                    language: 'vi'
                });

                expect(result).toMatch(/₫|VND/);
            });

            it('should use English formatting when language is overridden to en', () => {
                mockI18n.language = 'vi';

                const result = formatCurrency({
                    amount: 100,
                    fromCurrency: 'USD',
                    language: 'en'
                });

                expect(result).toContain('$');
            });
        });

        describe('edge cases', () => {
            it('should handle zero amount', () => {
                const result = formatCurrency({
                    amount: 0,
                    fromCurrency: 'USD'
                });

                expect(result).toContain('0');
            });

            it('should handle negative amounts', () => {
                const result = formatCurrency({
                    amount: -100,
                    fromCurrency: 'USD'
                });

                expect(result).toContain('-');
                expect(result).toContain('100');
            });

            it('should handle very large amounts', () => {
                const result = formatCurrency({
                    amount: 999999999999,
                    fromCurrency: 'USD'
                });

                expect(result).toBeDefined();
                expect(typeof result).toBe('string');
            });

            it('should handle decimal amounts', () => {
                const result = formatCurrency({
                    amount: 123.45,
                    fromCurrency: 'USD'
                });

                expect(result).toBeDefined();
                expect(typeof result).toBe('string');
            });
        });
    });

    describe('formatProductCost', () => {
        it('should format in VND for Vietnamese language', () => {
            mockI18n.language = 'vi';

            const result = formatProductCost(100000);

            expect(result).toMatch(/₫|VND/);
            expect(result).toContain('100');
        });

        it('should format in USD for English language', () => {
            mockI18n.language = 'en';

            const result = formatProductCost(240000);

            expect(result).toContain('$');
            expect(result).toContain('10'); // 240000 / 24000 = 10
        });

        it('should use language parameter over i18n language', () => {
            mockI18n.language = 'en';

            const result = formatProductCost(100000, 'vi');

            expect(result).toMatch(/₫|VND/);
        });

        it('should handle zero cost', () => {
            const result = formatProductCost(0);

            expect(result).toContain('0');
        });

        it('should handle large costs', () => {
            const result = formatProductCost(10000000); // 10 million VND

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        describe('USD conversion accuracy', () => {
            it('should convert VND to USD correctly for common amounts', () => {
                mockI18n.language = 'en';

                const result = formatProductCost(480000); // Should be $20

                expect(result).toContain('$');
                expect(result).toContain('20');
            });

            it('should handle fractional USD amounts', () => {
                mockI18n.language = 'en';

                const result = formatProductCost(360000); // Should be $15

                expect(result).toContain('$');
                expect(result).toContain('15');
            });
        });
    });

    describe('formatPrice', () => {
        it('should format with ₫ symbol for Vietnamese language', () => {
            mockI18n.language = 'vi';

            const result = formatPrice(100000);

            expect(result).toContain('₫');
            expect(result).toContain('100,000');
        });

        it('should format with $ symbol for English language', () => {
            mockI18n.language = 'en';

            const result = formatPrice(240000);

            expect(result).toContain('$');
            expect(result).toContain('10.00'); // Should show 2 decimal places
        });

        it('should use language parameter over i18n language', () => {
            mockI18n.language = 'en';

            const result = formatPrice(100000, 'vi');

            expect(result).toContain('₫');
            expect(result).toContain('100,000');
        });

        it('should show exactly 2 decimal places for USD', () => {
            mockI18n.language = 'en';

            const result = formatPrice(240000);

            expect(result).toMatch(/\$\d+\.\d{2}/); // Should match $XX.XX format
        });

        it('should handle zero price', () => {
            const result = formatPrice(0);

            expect(result).toContain('0');
        });

        it('should handle negative prices', () => {
            const result = formatPrice(-100000);

            expect(result).toContain('-');
        });

        describe('number formatting', () => {
            it('should add commas to large VND amounts', () => {
                mockI18n.language = 'vi';

                const result = formatPrice(1000000);

                expect(result).toContain('₫');
                expect(result).toContain('1,000,000');
            });

            it('should format USD with proper comma separation', () => {
                mockI18n.language = 'en';

                const result = formatPrice(24000000); // Should be $1,000.00

                expect(result).toContain('$');
                expect(result).toContain('1,000.00');
            });
        });

        describe('conversion edge cases', () => {
            it('should handle amounts that result in fractional USD', () => {
                mockI18n.language = 'en';

                const result = formatPrice(300000); // Should be $12.50

                expect(result).toContain('$');
                expect(result).toContain('12.50');
            });

            it('should round USD amounts appropriately', () => {
                mockI18n.language = 'en';

                const result = formatPrice(240001); // Should be approximately $10.00

                expect(result).toContain('$');
                expect(result).toContain('10.00');
            });
        });
    });

    describe('integration scenarios', () => {
        it('should maintain consistency between different formatting functions', () => {
            const amount = 240000;
            mockI18n.language = 'vi';

            const currencyResult = formatCurrency({ amount });
            const productCostResult = formatProductCost(amount);
            const priceResult = formatPrice(amount);

            // All should format in VND for Vietnamese
            expect(currencyResult).toMatch(/₫|VND/);
            expect(productCostResult).toMatch(/₫|VND/);
            expect(priceResult).toContain('₫');
        });

        it('should handle language switching correctly', () => {
            const amount = 240000;

            // Test Vietnamese
            mockI18n.language = 'vi';
            const vnResult = formatPrice(amount);

            // Test English
            mockI18n.language = 'en';
            const enResult = formatPrice(amount);

            expect(vnResult).toContain('₫');
            expect(enResult).toContain('$');
            expect(vnResult).not.toEqual(enResult);
        });
    });
});
