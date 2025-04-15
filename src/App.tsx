import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import { PrivateRoute } from './router/private-route';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route path="/products" element={<PrivateRoute element={Products} />} />
            <Route path="/categories" element={<PrivateRoute element={Categories} />} />
            <Route path="/" element={<Navigate to="/products" />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;