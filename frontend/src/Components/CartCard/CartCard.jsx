import React, { useEffect } from 'react';
import './CartCard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { decreamentItem, incrementItem, removeFromCart } from '../../Slices/Cart';
import APIService from '../../utils/ApiService';
import { Link } from 'react-router-dom';
const CartCard = ({ item }) => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    const incrementCartItem = async () => {
        dispatch(incrementItem(item))

    }
    const decrementCartItem = async () => {
        dispatch(decreamentItem(item))

    }

    return (
        <div className="flex items-center bg-slate-100 rounded-md p-4 gap-4 max-sm:flex-col">
            <div className="flex justify-center items-center  aspect-square h-[5rem] w-[5rem] ">
                <img className="rounded-[10rem] w-full h-full" src={item.image[ 0 ].url} alt={item.image[ 0 ].alt} />
            </div>
            <div className='flex items-center justify-between bg-slate-100 p-2 max-sm:flex-col'>

                <div className="">

                    <Link to={`/product/${item._id}`} className='text-xl hover:underline'>{item.name}</Link>
                    <p className='text-sm  text-gray-400'>
                        {item.description}
                    </p>
                    <div className="flex gap-2">
                        <p className="mt-1 text-left text-lg line-through opacity-50">${item.price}</p>
                        <p className="mt-1 text-left text-xl ">${item.discounted_price}</p>
                    </div>
                    <div className="">
                        <button onClick={() => dispatch(removeFromCart(item))} className=" hover:underline text-red-500 cursor-pointer  text-md font-semibold   transition duration-500 transform-gpu ">Remove</button>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <button className="border-none cursor-pointer z-0 text-white text-md font-semibold bg-green-400 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-500 transform-gpu hover:scale-110 " onClick={incrementCartItem}>+</button>
                    <p>{item.qty} </p>
                    <button className="border-none cursor-pointer z-0 text-white text-md font-semibold bg-red-400 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-500 transform-gpu hover:scale-110 " onClick={decrementCartItem}>-</button>
                </div>


            </div>
        </div>);
};

export default CartCard;