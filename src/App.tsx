import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Products from './pages/product/Products';
import Categories from './pages/Categories';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import { PrivateRoute } from './router/private-route';
import { ToastContainer } from 'react-toastify';
import AddProduct from './components/page/product/add-page/AddProduct';
import Color from './pages/product/Color';
import AddColor from './components/page/color/add-page/AddColor';
import EditColor from './components/page/color/edit-page/EditColor';
import AddSize from './components/page/size/add-page/AddSize';
import EditSize from './components/page/size/edit-page/EditSize';
import AddCategory from './components/page/category/add-page/AddCategory';
import EditCategory from './components/page/category/edit-page/EditCategory';
import EditProduct from './components/page/product/edit-page/EditProduct';
import About from './pages/About';
import EditProfile from './components/page/about/edit-page/EditProfile';
import Sizes from './pages/product/Size';
import ChangePassword from './components/page/about/edit-page/ChangePassword';
import Setting from './pages/Setting';
import Customers from './pages/Customers';
import Orders from './pages/Order';
import AddCustomer from './components/page/customer/add-page/AddCustomer';
import EditCustomer from './components/page/customer/edit-page/EditCustomer';
import AddOrder from './components/page/order/add-page/AddOrder';
import EditOrder from './components/page/order/edit-page/EditOrder';
import Message from './pages/Message';
import Blogs from './pages/blogs/Blogs';
import AddBlog from './pages/blogs/AddBlog';
import EditBlog from './pages/blogs/EditBlog';
import OrderStatistics from './pages/statistics/OrderStatistics';
import ProductCategories from './pages/statistics/ProductCategories';
import RevenueAnalysis from './pages/statistics/RevenueAnalysis';
import TopProduct from './pages/statistics/TopProducts';

function App() {
  return (
    <Router basename="/ecommerce-admin">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route path="/colors" element={<PrivateRoute element={<Color />} />} />
            <Route path="/sizes" element={<PrivateRoute element={<Sizes />} />} />
            <Route path="/products" element={<PrivateRoute element={<Products />} />} />
            <Route path="/customers" element={<PrivateRoute element={<Customers />} />} />
            <Route path="/customers/add" element={<PrivateRoute element={<AddCustomer />} />} />
            <Route path="/customers/edit/:id" element={<PrivateRoute element={<EditCustomer />} />} />
            <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
            <Route path="/orders/add/*" element={<PrivateRoute element={<AddOrder />} />} />
            <Route path="/orders/edit/:id/*" element={<PrivateRoute element={<EditOrder />} />} />
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/products/add/*" element={<PrivateRoute element={<AddProduct />} />} />
            <Route path="/colors/add" element={<PrivateRoute element={<AddColor />} />} />
            <Route path="/colors/edit/:id" element={<PrivateRoute element={<EditColor />} />} />
            <Route path="/sizes/add" element={<PrivateRoute element={<AddSize />} />} />
            <Route path="/sizes/edit/:id" element={<PrivateRoute element={<EditSize />} />} />
            <Route path="/categories" element={<PrivateRoute element={<Categories />} />} />
            <Route path="/messages" element={<PrivateRoute element={<Message />} />} />
            <Route path="/blogs" element={<PrivateRoute element={<Blogs />} />} />
            <Route path="/blogs/add" element={<PrivateRoute element={<AddBlog />} />} />
            <Route path="/blogs/edit/:id" element={<PrivateRoute element={<EditBlog />} />} />
            <Route path="/statistics/orders" element={<PrivateRoute element={<OrderStatistics />} />} />
            <Route path="/statistics/categories" element={<PrivateRoute element={<ProductCategories />} />} />
            <Route path="/statistics/revenue" element={<PrivateRoute element={<RevenueAnalysis />} />} />
            <Route path="/statistics/top-products" element={<PrivateRoute element={<TopProduct />} />} />
            <Route path="/categories/add" element={<PrivateRoute element={<AddCategory />} />} />
            <Route path="/categories/edit/:id" element={<PrivateRoute element={<EditCategory />} />} />
            <Route path="/products/edit/:id/*" element={<PrivateRoute element={<EditProduct />} />} />
            <Route path="/about" element={<PrivateRoute element={<About />} />} />
            <Route path="/about/edit" element={<PrivateRoute element={<EditProfile />} />} />
            <Route path="/about/change-password" element={<PrivateRoute element={<ChangePassword />} />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;