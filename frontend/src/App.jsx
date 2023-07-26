import { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Homepage from './Pages/Homepage/Homepage';
import CartPage from './Pages/CartPage/CartPage';
import ProductPage from './Pages/ProductPage/ProductPage';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage';
import Orders from './Pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import APIService from './utils/ApiService';
import { useSelector } from 'react-redux';
import PayPalCheckout from './Pages/PayPalCheckout/PayPalCheckout';

function App() {
  const cart = useSelector(state => state.cart);
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    if (cart.lastUpdated)
      APIService.POST('/cart', cart);
    

  }, [ cart ])
  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Homepage />} />
        <Route path='/register' exact element={<Register />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/cart' exact element={<CartPage />} />
        <Route path='/checkout' exact element={<CheckoutPage />} />
        <Route path="/orders" exact element={<Orders />} />
        <Route path='/paypal' exact element={<PayPalCheckout/>}/>
        <Route path='/:category' exact element={<Homepage />} />
        <Route path='/:category/:productId' exact element={<ProductPage />} />
      </Routes>
      <ToastContainer position='top-center' />
    </div>
  )
}

export default App
