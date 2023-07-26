/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react';
import './CheckoutPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../Components/Navbar/Navbar';
import { Radio } from '@mantine/core';
import { clearCart, decreamentItem, incrementItem } from '../../Slices/Cart';
import APIService from '../../utils/ApiService';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PayPalCheckout from '../PayPalCheckout/PayPalCheckout';
const CheckoutPage = () => {
    const checkoutItems = useSelector(state => state?.cart?.cartItems);
    const [ showItems, setShowItems ] = React.useState(false);
    const dispatch = useDispatch();

    const [ opened, { open, close } ] = useDisclosure();
    const [ shippingInfo, setShippingInfo ] = React.useState({
        name: '',
        showShipping: true,
        address: '',
        city: '',
        pincode: '',
        country: '',
        state: '',
        phone: ''
    });
    const [ paymentMethod, setPaymentMethod ] = React.useState('PayPal');
    const [ showPayment, setShowPayment ] = React.useState(false);
    const [ subtotal, setSubtotal ] = React.useState(0);
    const [ tax, setTax ] = React.useState(0);
    const [ shipping, setShipping ] = React.useState(0);
    const [ total, setTotal ] = React.useState(0);
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/login')
        if (checkoutItems.length === 0) navigate('/')

        setSubtotal(checkoutItems.reduce((acc, item) => acc + item.discounted_price * item.qty, 0));
        setTax(subtotal * 18 / 100);
        setShipping(5);
        setTotal(Number((subtotal + tax + shipping).toFixed(2)));
    }, [ subtotal, checkoutItems ])
    useEffect(() => {
        console.log(opened)
    }, [ opened ])
    const onShippingContinue = async () => {
        if (shippingInfo.name === '' || shippingInfo.address === '' || shippingInfo.city === '' || shippingInfo.postalCode === '' || shippingInfo.country === '' || shippingInfo.state === '' || shippingInfo.phone === '') {
            return toast.error('Please fill all the fields');
        }
        if (!/^[a-zA-Z]+.$/.test(shippingInfo.name))
            return toast.error('Please enter a valid name');
        if (shippingInfo.address.length < 10)
            return toast.error('Please enter a valid address');
        if (shippingInfo.city.length < 4)
            return toast.error('Please enter a valid city');
        if (!/^[\w ]{7}$/.test(shippingInfo.pincode))
            return toast.error('Please enter a valid pincode');
        if (shippingInfo.country.length < 3)
            return toast.error('Please enter a valid country');
        if (shippingInfo.state.length < 2)
            return toast.error('Please enter a valid state');
        if (!/^\+1[0-9]+/.test(shippingInfo.phone))
            return toast.error('Please enter a valid phone number');

        setShippingInfo({ ...shippingInfo, showShipping: false });

        setShowPayment(true);

    }

    const onPaymentSuccess = async (data) => {
        await APIService.POST('/checkout', {
            products: checkoutItems,
            shippingInfo,
            paymentMode: paymentMethod,
            total,
        })
        dispatch(clearCart());
        navigate('/');
    }
    const onPaymentContinue = async () => {
        if (!paymentMethod)
            return toast.error('Please select a payment method');
        if (paymentMethod === "POD") {
            await APIService.POST('/checkout', {
                products: checkoutItems,
                shippingInfo,
                paymentMode: paymentMethod,
                total,
            })
            dispatch(clearCart());
            navigate('/')
        }
        else {
            toast.success('Please wait while we redirect you to paypal');
            open();
        }
    }

    return <div className='bg-slate-100 h-full min-h-screen'>
        <Navbar />
        <div className="flex justify-center gap-5 p-4 max-md:flex-col ">
            <div className="w-[70%] max-md:w-full max-w-[70rem] h-full  bg-white p-4 flex-col gap-4">
                <div className="flex flex-col bg-white items-center justify-center  max-w-[70rem]">
                    <h1 className='text-2xl  font-semibold w-full border p-3' onClick={() => setShowItems(!showItems)}>Items in the Cart</h1>
                    {showItems && <div className="flex gap-8 flex-col items-center justify-center w-full max-w-[70rem]">
                        {checkoutItems?.map(item => <div className="flex justify-between items-center w-full max-w-[70rem]">
                            <div className="flex items-center gap-4">
                                <div className="flex justify-center items-center  aspect-square h-[5rem] w-[5rem] ">
                                    <img className="rounded-[10rem] w-full h-full" src={item.image[ 0 ].url} alt={item.image[ 0 ].alt} />
                                </div>
                                <div className="flex flex-col">
                                    <Link to={`/product/${item._id}`} className='text-xl hover:underline'>{item.name}</Link>
                                    <p className='text-gray-400'>
                                        {item.description.length > 250 ? item.description.slice(0, 250) + '...' : item.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className='text-xl'>${item.discounted_price}</p>
                                <p className='flex gap-4'>
                                    <button className='border border-gray-300 p-2 rounded-md aspect-square w-full' onClick={() => {
                                        dispatch(incrementItem(item));
                                    }}>+</button>
                                    <span className='border border-gray-300 p-2 rounded-md'>{item.qty}</span>
                                    <button className='border border-gray-300 p-2 rounded-md' onClick={() => {
                                        dispatch(decreamentItem(item));
                                    }}>-</button>
                                </p>
                                <p className='text-xl'>${item.discounted_price * item.qty}</p>
                            </div>
                        </div>)}

                    </div>}
                </div>
                <div className="flex flex-col bg-white items-center justify-center mt-4  max-w-[70rem]">
                    <h1 className='text-2xl  font-semibold w-full border p-3' onClick={() => setShippingInfo({ ...shippingInfo, showShipping: !shippingInfo.showShipping })}>Shipping Information</h1>
                    {shippingInfo.showShipping && <div className="flex p-4 gap-4 flex-col items-center justify-center w-full max-w-[70rem]">

                        <div className="flex flex-col gap-4 items-center justify-center w-full max-w-[70rem]">
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <label htmlFor="name" className='text-xl'>Name</label>
                                <input type="text" id='name' className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' value={shippingInfo.name} onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <label htmlFor="address" className='text-xl'>Address</label>
                                <input type="text" id='address' className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <label htmlFor="city" className='text-xl'>City</label>
                                <input type="text" id='city' className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <label htmlFor="pincode" className='text-xl'>Postal Code</label>
                                <input type="text" id='pincode' className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' value={shippingInfo.pincode} onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <label htmlFor="country" className='text-xl'>Country</label>
                                <input type="text" id='country' className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' value={shippingInfo.country} onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <label htmlFor="state" className='text-xl'>State</label>
                                <input type="text" id='state' className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' value={shippingInfo.state} onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <label htmlFor="phone" className='text-xl'>Phone</label>
                                <input type="text" id='phone' className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <button onClick={onShippingContinue} className="border-none cursor-pointer text-white text-md font-semibold bg-green-400 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-500 transform-gpu hover:scale-105 ">Continue</button>
                            </div>
                        </div>
                    </div>}
                </div>
                <Modal opened={opened} onClose={close} title="Paypal Payment">
                    <div style={{
                        marginLeft: "auto", marginRight: "auto", maxWidth: 500, width: "100%", marginTop: "0.625rem"
                    }}> <PayPalCheckout onPaymentSuccess={onPaymentSuccess} /></div>
                </Modal>
                <div className="flex flex-col bg-white items-center justify-center mt-4  max-w-[70rem]">
                    <h1 className='text-2xl  font-semibold w-full border p-3' onClick={() => setShowPayment(!showPayment)}>Payment Method</h1>
                    {showPayment && <div className="flex p-4 gap-4 flex-col items-center justify-center w-full max-w-[70rem]">
                        <Radio.Group value={paymentMethod} onChange={setPaymentMethod} className="flex flex-col gap-4 items-center justify-center w-full max-w-[70rem]">
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <Radio label="Paypal" className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' type="radio" value='PayPal' name='payment' checked={paymentMethod === "Paypal"} onChange={(e) => setPaymentMethod(e.currentTarget.checked)} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <Radio label="POD" className='border border-gray-300 p-2 rounded-md w-full max-w-[70rem]' type="radio" value='POD' name='payment' checked={paymentMethod === 'POD'} onChange={(e) => setPaymentMethod(e.currentTarget.checked)} />
                            </div>
                            <div className="flex flex-col items-center justify-center w-full max-w-[70rem]">
                                <button onClick={onPaymentContinue} className="border-none cursor-pointer text-white text-md font-semibold bg-green-400 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-500 transform-gpu hover:scale-105 ">Checkout</button>
                            </div>
                        </Radio.Group>
                    </div>}
                </div>

            </div>
            <div className="w-[30%] max-md:w-full bg-white h-max p-4">
                <div className="flex flex-col items-center justify-center w-full max-w-[30rem]">
                    <h1 className='text-2xl mt-5 font-semibold'>Total Charges</h1>
                    <div className="flex flex-col items-center justify-center w-full max-w-[30rem]">
                        <div className="flex justify-between w-full max-w-[30rem]">
                            <p className='text-xl'>Subtotal</p>
                            <p className='text-xl'>${subtotal}</p>
                        </div>
                        <div className="flex justify-between w-full max-w-[30rem]">
                            <p className='text-xl'>Shipping</p>
                            <p className='text-xl'>${shipping}</p>
                        </div>
                        <div className="flex justify-between w-full max-w-[30rem]">
                            <p className='text-xl'>Tax</p>
                            <p className='text-xl'>${tax}</p>
                        </div>
                        <div className="flex justify-between w-full max-w-[30rem]">
                            <p className='text-xl'>Total</p>
                            <p className='text-xl'>${Number((subtotal + shipping + tax).toFixed(2))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>;
};

export default CheckoutPage;