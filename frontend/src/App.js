import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pantry from './pages/Pantry';
import Recipes from './pages/Recipes';
import SavedRecipes from './pages/SavedRecipes';
import Journal from './pages/Journal';
import SearchRecipes from './pages/SearchRecipes';
import ShoppingList from './pages/ShoppingList';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/pantry" element={<PrivateRoute><Pantry /></PrivateRoute>} />
      <Route path="/recipes" element={<PrivateRoute><Recipes /></PrivateRoute>} />
      <Route path="/saved" element={<PrivateRoute><SavedRecipes /></PrivateRoute>} />
      <Route path='/journal' element={<PrivateRoute><Journal /></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute><SearchRecipes /></PrivateRoute>} />
      <Route path="/shopping" element={<PrivateRoute><ShoppingList /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;