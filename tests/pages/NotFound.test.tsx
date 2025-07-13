import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import NotFound from '../../src/pages/NotFound';
import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { vi } from 'vitest';

// Initialize i18n once
i18n
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: {
                notfound: {
                    title: 'Page Not Found',
                    description: "Oops! The page you're looking for doesn't exist.",
                    subDescription: "It might have been moved, deleted, or you entered the wrong URL.",
                    goBack: 'Go Back',
                    goHome: 'Go Home'
                }
            },
            vi: {
                notfound: {
                    title: 'Không Tìm Thấy Trang',
                    description: 'Oops! Trang bạn đang tìm kiếm không tồn tại.',
                    subDescription: 'Nó có thể đã được di chuyển, xóa hoặc bạn đã nhập sai URL.',
                    goBack: 'Quay Lại',
                    goHome: 'Về Trang Chủ'
                }
            }
        },
        interpolation: {
            escapeValue: false,
        },
    });

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => children,
}));

// Mock MotionPageWrapper
vi.mock('../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="motion-page">{children}</div>,
}));

const renderNotFound = async (language = 'en') => {
    await i18n.changeLanguage(language);
    return render(
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <NotFound />
            </I18nextProvider>
        </BrowserRouter>
    );
};

describe('NotFound Page', () => {
    beforeEach(async () => {
        mockNavigate.mockClear();
        await i18n.changeLanguage('en');
        // Reset any mocked functions
        if (vi.isMockFunction(i18n.t)) {
            i18n.t.mockRestore();
        }
    });

    describe('Rendering', () => {
        it('should render the 404 number', async () => {
            await renderNotFound();
            expect(screen.getByText('404')).toBeInTheDocument();
        });


        it('should render the title and description', async () => {
            await renderNotFound();
            await waitFor(() => {
                expect(screen.getByText('Page Not Found')).toBeInTheDocument();
            });
            expect(screen.getByText(/The page you're looking for doesn't exist/)).toBeInTheDocument();
            expect(screen.getByText(/It might have been moved, deleted/)).toBeInTheDocument();
        });

        it('should render action buttons', async () => {
            await renderNotFound();
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
            });
        });

        it('should render with proper page wrapper', async () => {
            await renderNotFound();
            expect(screen.getByTestId('motion-page')).toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        it('should navigate back when Go Back button is clicked', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const buttons = screen.getAllByRole('button');
            const goBackButton = buttons[0]; // First button is Go Back
            fireEvent.click(goBackButton);

            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });

        it('should navigate to products page when Go Home button is clicked', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const buttons = screen.getAllByRole('button');
            const goHomeButton = buttons[1]; // Second button is Go Home
            fireEvent.click(goHomeButton);

            expect(mockNavigate).toHaveBeenCalledWith('/products');
        });
    });

    describe('Internationalization', () => {
        it('should display content in English', async () => {
            await renderNotFound('en');
            await waitFor(() => {
                expect(screen.getByText('Page Not Found')).toBeInTheDocument();
                expect(screen.getByText('Go Back')).toBeInTheDocument();
                expect(screen.getByText('Go Home')).toBeInTheDocument();
            });
        });

        it('should display content in Vietnamese', async () => {
            await renderNotFound('vi');

            await waitFor(() => {
                expect(screen.getByText('Không Tìm Thấy Trang')).toBeInTheDocument();
                expect(screen.getByText('Quay Lại')).toBeInTheDocument();
                expect(screen.getByText('Về Trang Chủ')).toBeInTheDocument();
            });
        });

        it('should change language dynamically', async () => {
            const { rerender } = await renderNotFound('en');

            await waitFor(() => {
                expect(screen.getByText('Page Not Found')).toBeInTheDocument();
            });

            // Change language
            await i18n.changeLanguage('vi');
            rerender(
                <BrowserRouter>
                    <I18nextProvider i18n={i18n}>
                        <NotFound />
                    </I18nextProvider>
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Không Tìm Thấy Trang')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure', async () => {
            await renderNotFound();
            const mainHeading = screen.getByRole('heading', { level: 1 });

            await waitFor(() => {
                const secondaryHeading = screen.getByRole('heading', { level: 2 });
                expect(secondaryHeading).toBeInTheDocument();
            });

            expect(mainHeading).toHaveTextContent('404');
        });

        it('should have accessible button labels', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const buttons = screen.getAllByRole('button');
            buttons.forEach(button => {
                expect(button).toHaveAccessibleName();
            });
        });

        it('should have proper color contrast for text elements', async () => {
            await renderNotFound();

            await waitFor(() => {
                const title = screen.getByText('Page Not Found');
                const description = screen.getByText(/The page you're looking for doesn't exist/);

                expect(title).toHaveClass('text-gray-900');
                expect(description).toHaveClass('text-gray-600');
            });
        });

        it('should have keyboard navigation support', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const buttons = screen.getAllByRole('button');
            const goBackButton = buttons[0];
            const goHomeButton = buttons[1];

            // Both buttons should be focusable
            goBackButton.focus();
            expect(goBackButton).toHaveFocus();

            goHomeButton.focus();
            expect(goHomeButton).toHaveFocus();
        });
    });

    describe('Responsive Design', () => {
        it('should have responsive button layout', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const buttonContainer = screen.getAllByRole('button')[0].parentElement;
            expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row');
        });


        it('should have responsive padding', async () => {
            await renderNotFound();
            const rootContainer = screen.getByText('404').closest('.min-h-screen');

            expect(rootContainer).toHaveClass('p-8');
        });
    });

    describe('Error Handling', () => {
        it('should handle navigation errors gracefully', async () => {
            mockNavigate.mockImplementation(() => {
                throw new Error('Navigation failed');
            });

            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const goBackButton = screen.getAllByRole('button')[0];

            // Should not throw error when clicked (error should be caught by component)
            expect(() => fireEvent.click(goBackButton)).not.toThrow();
        });

        it('should handle missing i18n context gracefully', () => {
            // Test rendering without i18n provider
            render(
                <BrowserRouter>
                    <NotFound />
                </BrowserRouter>
            );

            // Should still render the basic structure
            expect(screen.getByText('404')).toBeInTheDocument();
        });
    });

    describe('Animation and Styling', () => {
        it('should have gradient background', async () => {
            await renderNotFound();
            const background = screen.getByText('404').closest('.min-h-screen');

            expect(background).toHaveClass('bg-gradient-to-br', 'from-gray-50', 'via-white', 'to-gray-100');
        });

        it('should have gradient text for 404 number', async () => {
            await renderNotFound();
            const heading404 = screen.getByText('404');

            expect(heading404).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'bg-clip-text', 'text-transparent');
        });

        it('should have proper button styling', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const buttons = screen.getAllByRole('button');
            const goBackButton = buttons[0];
            const goHomeButton = buttons[1];

            expect(goBackButton).toHaveClass('border', 'border-gray-300', 'bg-white');
            expect(goHomeButton).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-blue-700');
        });

        it('should have proper icon styling', async () => {
            await renderNotFound();
            const iconContainer = screen.getByText('404').parentElement?.nextElementSibling;

            expect(iconContainer).toHaveClass('mb-6');
            expect(iconContainer?.firstElementChild).toHaveClass('mx-auto', 'w-24', 'h-24', 'bg-gray-100', 'rounded-full');
        });
    });

    describe('Content Structure', () => {
        it('should display all required sections in correct order', async () => {
            await renderNotFound();

            const container = screen.getByText('404').closest('.max-w-lg');
            const children = container?.children;

            expect(children).toHaveLength(4); // 404 number, icon, title/description, buttons

            // Check for main sections
            expect(screen.getByText('404')).toBeInTheDocument();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });
        });

        it('should have proper semantic HTML structure', async () => {
            await renderNotFound();

            // Check for semantic elements
            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
                expect(screen.getAllByRole('button')).toHaveLength(2);
            });
        });
    });

    describe('Interactive Elements', () => {
        it('should have hover effects on buttons', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const buttons = screen.getAllByRole('button');
            const goBackButton = buttons[0];
            const goHomeButton = buttons[1];

            expect(goBackButton).toHaveClass('hover:bg-gray-50');
            expect(goHomeButton).toHaveClass('hover:from-blue-700', 'hover:to-blue-800');
        });

        it('should have transition effects', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const buttons = screen.getAllByRole('button');
            const goBackButton = buttons[0];
            const goHomeButton = buttons[1];

            expect(goBackButton).toHaveClass('transition-colors', 'duration-200');
            expect(goHomeButton).toHaveClass('transition-all', 'duration-200');
        });

        it('should handle multiple rapid clicks', async () => {
            await renderNotFound();

            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons).toHaveLength(2);
            });

            const goHomeButton = screen.getAllByRole('button')[1];

            // Rapidly click multiple times
            fireEvent.click(goHomeButton);
            fireEvent.click(goHomeButton);
            fireEvent.click(goHomeButton);

            // Should have been called multiple times
            expect(mockNavigate).toHaveBeenCalledTimes(3);
            expect(mockNavigate).toHaveBeenCalledWith('/products');
        });
    });
});