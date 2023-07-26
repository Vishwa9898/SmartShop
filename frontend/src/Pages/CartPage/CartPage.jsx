import React, { useEffect } from 'react';
import './CartPage.scss';
import CartCard from '../../Components/CartCard/CartCard';
import EmptyCart from '../../assets/undraw_empty_cart_co35.svg';
import { useSelector } from 'react-redux';
import Navbar from '../../Components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem('token')) navigate('/login')
    },[])
    return <div className=''>
        <Navbar />

        {
            cartItems.length !== 0 ?
                (
                    <div className="">

                        <div className="p-4 flex flex-col gap-4">
                            {cartItems.map(item => <CartCard key={item._id} item={item} />)}
                        </div>
                        <div className="m-5">
                            <p className='text-2xl text-center'>
                                Total: ${cartItems.reduce((acc, item) => acc + item.discounted_price * item.qty, 0)}
                            </p>
                            <div className='flex justify-center'>
                                <Link to='/checkout' className='text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md'>Proceed to Checkout</Link>
                            </div>
                        </div>
                    </div>
                ) :
                (<div className="flex items-center justify-center">
                    <div className='flex flex-col items-center justify-center w-full max-w-[70rem]'>
                        <img src={EmptyCart} alt="Empty Cart" className='w-1/2' />
                        <h1 className='text-2xl mt-5 font-semibold'>Your Cart is Empty</h1>
                        <Link to='/' className='text-blue-500 hover:underline'>Go to Home</Link>
                    </div>
                </div>
                )

        }

    </div>;
};

export default CartPage;