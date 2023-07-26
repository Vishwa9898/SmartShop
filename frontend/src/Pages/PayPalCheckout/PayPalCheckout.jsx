import React from 'react';
import './PayPalCheckout.scss';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import APIService from '../../utils/ApiService';
import { toast } from 'react-toastify';

const PayPalCheckout = ({onPaymentSuccess}) => {

    const createOrder = async (data, actions) => {
        const resp = await APIService.POST('/paypal/orders');
        return resp.data.id;
    }
    const onApprove = async (data, actions) => {
        const resp = await APIService.POST(`/paypal/orders/${data.orderID}/capture`);
   
        if (resp.data.status === 'COMPLETED') {
            
            onPaymentSuccess(data);
            toast.success('Payment Successful');
            return;
        }
        toast.error('Payment Failed');
        
    }
    const onFailed = (err) => {
        console.log(err);
        toast.error('Payment Failed');
    }

    return <PayPalScriptProvider options={{  clientId: import.meta.env.VITE_PUBLIC_CLIENT_ID,currency:"CAD" }} >
            <PayPalButtons  className='flex justify-center' style={{  layout: "vertical",shape:"pill"  }} onError={onFailed}  createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>



};

export default PayPalCheckout;