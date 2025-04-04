import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import { PrivateRoute } from './router/private-route';
import { ToastContainer } from 'react-toastify';
import Customers from './pages/Customers';
import Order from './pages/Order';
import Message from './pages/Message';
import Blogs from './pages/blogs/Blogs';
import Statistics from './pages/Statistics';
import AddBlog from './pages/blogs/AddBlog';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route path="/products" element={<PrivateRoute element={Products} />} />
            <Route path="/categories" element={<PrivateRoute element={Categories} />} />
            <Route path="/customers" element={<PrivateRoute element={Customers} />} />
            <Route path="/orders" element={<PrivateRoute element={Order} />} />
            <Route path="/messages" element={<PrivateRoute element={Message} />} />
            <Route path="/blogs" element={<PrivateRoute element={Blogs} />} />
            <Route path="/blogs/add" element={<PrivateRoute element={AddBlog} />} />
            <Route path="/statistics" element={<PrivateRoute element={Statistics} />} />
            <Route path="/" element={<Navigate to="/customers" />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;