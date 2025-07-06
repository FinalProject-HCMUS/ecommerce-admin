import { vi, describe, it, expect } from 'vitest';

// Type for i18n configuration
interface I18nConfig {
    fallbackLng: string;
    debug: boolean;
    interpolation: {
        escapeValue: boolean;
    };
    backend: {
        loadPath: string;
    };
    ns: string[];
    defaultNS: string;
}

// Mock the dependencies before importing the config
vi.mock('i18next', () => {
    const mockUse = vi.fn().mockReturnThis();
    const mockInit = vi.fn().mockReturnThis();

    return {
        default: {
            use: mockUse,
            init: mockInit,
            t: vi.fn(),
            changeLanguage: vi.fn(),
            language: 'en',
            languages: ['en', 'vi'],
            isInitialized: true,
            loadNamespaces: vi.fn(),
            addNamespaces: vi.fn(),
            hasLoadedNamespace: vi.fn(),
            getResource: vi.fn(),
            getResourceBundle: vi.fn(),
            addResourceBundle: vi.fn(),
            removeResourceBundle: vi.fn(),
        },
    };
});

vi.mock('react-i18next', () => ({
    initReactI18next: { name: 'react-i18next' },
}));

vi.mock('i18next-http-backend', () => ({
    default: { name: 'http-backend' },
}));

vi.mock('i18next-browser-languagedetector', () => ({
    default: { name: 'language-detector' },
}));

// Import after mocking
import '../../src/config/i18n';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get the mocked functions for testing
const mockI18n = vi.mocked(i18n);
const mockUse = mockI18n.use;
const mockInit = mockI18n.init;

describe('i18n Configuration', () => {
    // Don't clear mocks since the i18n configuration runs once during import
    // and we need to preserve the call history

    describe('Initialization', () => {
        it('should use HttpBackend plugin', () => {
            expect(mockUse).toHaveBeenCalledWith(HttpBackend);
        });

        it('should use LanguageDetector plugin', () => {
            expect(mockUse).toHaveBeenCalledWith(LanguageDetector);
        });

        it('should use initReactI18next plugin', () => {
            expect(mockUse).toHaveBeenCalledWith(initReactI18next);
        });

        it('should initialize with correct configuration', () => {
            expect(mockInit).toHaveBeenCalledWith({
                fallbackLng: 'en',
                debug: false,
                interpolation: {
                    escapeValue: false,
                },
                load: "languageOnly",
                backend: {
                    loadPath: '/ecommerce-admin/locale/{{lng}}/{{ns}}.json',
                },
                ns: ['sidebar', 'product', 'pagination',
                    'common', 'color', 'size', 'delete',
                    'profile', 'login', 'category', 'setting', 'user', 'order', "blog",
                    "message", "statistics"],
                defaultNS: 'sidebar',
            });
        });
    });

    describe('Configuration Properties', () => {
        it('should have correct fallback language', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            expect(config).toHaveProperty('fallbackLng', 'en');
        });

        it('should have debug disabled', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            expect(config).toHaveProperty('debug', false);
        });

        it('should have escapeValue disabled in interpolation', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            expect(config).toHaveProperty('interpolation.escapeValue', false);
        });

        it('should have correct backend loadPath', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            expect(config).toHaveProperty('backend.loadPath', '/ecommerce-admin/locale/{{lng}}/{{ns}}.json');
        });

        it('should have all required namespaces', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            const expectedNamespaces = [
                'sidebar', 'product', 'pagination',
                'common', 'color', 'size', 'delete',
                'profile', 'login', 'category', 'setting', 'user', 'order', "blog",
                "message", "statistics"
            ];
            expect(config).toHaveProperty('ns');
            expect(config.ns).toEqual(expectedNamespaces);
        });

        it('should have correct default namespace', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            expect(config).toHaveProperty('defaultNS', 'sidebar');
        });
    });

    describe('Plugin Chain', () => {
        it('should call plugins in correct order', () => {
            const useCalls = mockUse.mock.calls;
            expect(useCalls).toHaveLength(3);
            expect(useCalls[0][0]).toBe(HttpBackend);
            expect(useCalls[1][0]).toBe(LanguageDetector);
            expect(useCalls[2][0]).toBe(initReactI18next);
        });

        it('should return the same instance for method chaining', () => {
            // Verify that use() returns the i18n instance for chaining
            expect(mockUse).toHaveReturnedTimes(3);
        });
    });

    describe('Namespace Configuration', () => {
        it('should include all application modules in namespaces', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            const namespaces = config.ns;

            // Check for core UI namespaces
            expect(namespaces).toContain('sidebar');
            expect(namespaces).toContain('common');
            expect(namespaces).toContain('pagination');

            // Check for feature-specific namespaces
            expect(namespaces).toContain('product');
            expect(namespaces).toContain('category');
            expect(namespaces).toContain('color');
            expect(namespaces).toContain('size');

            // Check for functional namespaces
            expect(namespaces).toContain('login');
            expect(namespaces).toContain('profile');
            expect(namespaces).toContain('setting');
            expect(namespaces).toContain('delete');
        });

        it('should have sidebar as default namespace', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            expect(config.defaultNS).toBe('sidebar');
        });
    });

    describe('Backend Configuration', () => {
        it('should configure backend with proper path template', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0] as I18nConfig;
            expect(config.backend?.loadPath).toBe('/ecommerce-admin/locale/{{lng}}/{{ns}}.json');
        });

        it('should support dynamic language and namespace loading', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0] as I18nConfig;
            const loadPath = config.backend?.loadPath;

            // Verify the path template contains proper placeholders
            expect(loadPath).toMatch(/\{\{lng\}\}/);
            expect(loadPath).toMatch(/\{\{ns\}\}/);
        });
    });

    describe('Interpolation Settings', () => {
        it('should disable HTML escaping for React compatibility', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0] as I18nConfig;
            expect(config.interpolation?.escapeValue).toBe(false);
        });
    });

    describe('Language Detection', () => {
        it('should use browser language detector', () => {
            expect(mockUse).toHaveBeenCalledWith(LanguageDetector);
        });

        it('should have English as fallback language', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            expect(config.fallbackLng).toBe('en');
        });
    });

    describe('Development Settings', () => {
        it('should have debug mode disabled for production-like behavior', () => {
            const initCall = mockInit.mock.calls[0];
            const config = initCall?.[0];
            expect(config.debug).toBe(false);
        });
    });

    describe('Integration with React', () => {
        it('should initialize React i18n integration', () => {
            expect(mockUse).toHaveBeenCalledWith(initReactI18next);
        });
    });
});