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
import Sizes from './pages/product/Size';
import EditSize from './components/page/size/edit-page/EditSize';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route path="/colors" element={<PrivateRoute element={Color} />} />
            <Route path="/sizes" element={<PrivateRoute element={Sizes} />} />
            <Route path="/products" element={<PrivateRoute element={Products} />} />
            <Route path="/categories" element={<PrivateRoute element={Categories} />} />
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/products/add/*" element={<PrivateRoute element={AddProduct} />} />
            <Route path="/colors/add" element={<PrivateRoute element={AddColor} />} />
            <Route path="/colors/edit/:id" element={<PrivateRoute element={EditColor} />} />
            <Route path="/sizes/add" element={<PrivateRoute element={AddSize} />} />
            <Route path="/sizes/edit/:id" element={<PrivateRoute element={EditSize} />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;