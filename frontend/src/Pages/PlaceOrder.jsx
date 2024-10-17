import React, { useContext, useEffect, useState } from 'react';
import Title from '../Components/Title';
import CartTotal from '../Components/CartTotal';
import { assets } from '../assets/frontend_assets/assets';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
    const [method, setMethod] = useState('COD'); // Default payment method
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        phone: ''
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response);
                try {
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazor', response, { headers: { token } })
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    }
                } catch (error) {
                    console.log(error);
                    toast.error('Error with payment')

                }

            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            let orderItems = [];
            for (const itemId in cartItems) {
                for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                        const product = products.find(product => product._id === itemId);
                        if (product) {
                            const itemInfo = { ...product, size: size, quantity: cartItems[itemId][size] };
                            orderItems.push(itemInfo);
                        } else {
                            console.warn(`Product with ID ${itemId} not found.`);
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee,
            };

            switch (method) {
                case 'COD':
                    const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });

                    if (response.data.success) {
                        setCartItems({}); // Clear cart on successful order
                        toast.success('Order placed successfully!');
                        navigate('/orders');
                    } else {
                        toast.error(response.data.message);
                    }
                    break;

                case 'stripe':
                    const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data;
                        window.location.replace(session_url);
                    } else {
                        toast.error(responseStripe.data.message);
                    }
                    break;

                case 'razorpay':
                    const responseRazorpay = await axios.post(`${backendUrl}/api/order/razor`, orderData, { headers: { token } });
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order);

                    }
                    break;

                default:
                    toast.error('Selected payment method is not supported yet.');
                    break;
            }

        } catch (error) {
            console.error('Error while placing the order:', error);
            toast.error('An error occurred while placing your order. Please try again.');
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Please login")
            navigate('/cart')
        }
    }, [token, navigate])

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* Left side */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" required placeholder='First Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                    <input onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" required placeholder='Last Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                </div>
                <input onChange={onChangeHandler} name='email' value={formData.email} type="email" required placeholder='Email Address' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                <input onChange={onChangeHandler} name='street' value={formData.street} type="text" required placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                <div className='flex gap-3'>
                    <input onChange={onChangeHandler} name='city' value={formData.city} type="text" required placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                    <input onChange={onChangeHandler} name='state' value={formData.state} type="text" required placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                </div>
                <div className='flex gap-3'>
                    <input onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" required placeholder='Zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                    <input onChange={onChangeHandler} name='country' value={formData.country} type="text" required placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                </div>
                <input onChange={onChangeHandler} name='phone' value={formData.phone} type="number" required placeholder='Phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
            </div>
            {/* Right side */}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>
                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {/* Payment method selection */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
                            <img src={assets.stripe_logo} className='h-5 mx-4' alt="stripe" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''}`}></p>
                            <img src={assets.razorpay_logo} className='h-5 mx-4' alt="razorpay" />
                        </div>
                        <div onClick={() => setMethod('COD')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'COD' ? 'bg-green-500' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-bold mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
