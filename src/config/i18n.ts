
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            searchPlaceholder: 'Search...',
            profileName: 'hcdman',
            languageSwitch: 'English',
            intro: 'Admin Darhboard',
            customerSidebar: 'Customers',
            productSidebar: 'Products',
            categorySidebar: 'Categories',
            orderSidebar: 'Orders',
            logoutSidebar: 'Logout',
            //Customer page
            addCustomer: 'Add Customer',
            avatar: 'Avatar',
            fullName: 'Full Name',
            email: 'Email',
            address: 'Address',
            role: 'Role',
            enable: 'Enable',
            action: 'Action',
            editCustomer: 'Edit Customer',
            uploadPhoto: 'Upload Photo',
            firstName: 'First Name',
            lastName: 'Last Name',
            password: 'Password',
            phoneNumber: 'Phone Number',
            weight: 'Weight',
            height: 'Height',
            status: 'Status',
            cancel: 'Cancel',
            add: 'Add',
            //login page
            adminSignin: 'Admin Sign in',
            userName: 'Username',
            signIn: 'Sign in',
        },
    },
    vi: {
        translation: {
            searchPlaceholder: 'Tìm kiếm...',
            profileName: 'hcdman',
            languageSwitch: 'Tiếng Việt',
            intro: 'Trang chủ quản trị',
            customerSidebar: 'Khách hàng',
            productSidebar: 'Sản phẩm',
            categorySidebar: 'Danh mục',
            orderSidebar: 'Đơn hàng',
            logoutSidebar: 'Đăng xuất',
            //Customer page
            addCustomer: 'Thêm khách hàng',
            avatar: 'Ảnh đại diện',
            fullName: 'Họ và tên',
            email: 'Email',
            address: 'Địa chỉ',
            role: 'Vai trò',
            enable: 'Kích hoạt',
            action: 'Hành động',
            editCustomer: 'Chỉnh sửa khách hàng',
            uploadPhoto: 'Tải ảnh lên',
            firstName: 'Tên',
            lastName: 'Họ',
            password: 'Mật khẩu',
            phoneNumber: 'Số điện thoại',
            weight: 'Cân nặng',
            height: 'Chiều cao',
            status: 'Trạng thái',
            cancel: 'Hủy',
            add: 'Thêm',
            //login page
            adminSignin: 'Đăng nhập quản trị',
            userName: 'Tên đăng nhập',
            signIn: 'Đăng nhập',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;