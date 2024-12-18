import React, { useEffect, useState } from 'react'
import Title from '../Components/Title'
import { ShopContext } from '../Context/ShopContext'
import { useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../Components/Loading'

const Orders = ({ loading }) => {

    const { backendUrl, token, currency, navigate, setToken } = useContext(ShopContext)

    const [order, setOrder] = useState([]);

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null
            }
            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
            if (response.data.success) {
                let allOrderItem = []
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date

                        allOrderItem.push(item)
                    })
                    setOrder(allOrderItem.reverse());

                })
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)


        }
    }
    useEffect(() => {
        if (!token) {
            const savedToken = localStorage.getItem('token')
            if (savedToken) {
                setToken(savedToken)
                loadOrderData()
            }
            else {
                navigate('/')
                toast.error(error.message)
            }
        }
        else {
            loadOrderData()
        }
    }, [token, navigate])
    return (
        <div>
            {
                loading ? (
                    <Loading show={loading} />
                )
                    : (
                        <div className='border-t pt-16'>
                            <div className='text-2xl'>
                                <Title text1={'MY'} text2={'ORDERS'} />
                            </div>
                            {
                                order.length > 0 ?
                                    <div>
                                        {
                                            order.map((item, index) => (
                                                <div key={index} className='py-4 px-2 border border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                                    <div className='flex items-start gap-6 text-sm'>
                                                        <img src={item.image[0]} className='w-16 sm:w-20' alt="" />
                                                        <div>
                                                            <p className='sm:text-base font-medium'>{item.name}</p>
                                                            <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                                                                <p>{currency}{item.price}</p>
                                                                <p>Quantity: {item.quantity}</p>
                                                                <p>Size: {item.size}</p>

                                                            </div>
                                                            <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                                            <p className='mt-2'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className='md:w-1/2 flex justify-between'>
                                                        <div className='flex items-center gap-2'>
                                                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                                            <p className='text-sm md:text-base'>{item.status}</p>
                                                        </div>
                                                        <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : <p className=' font-bold text-[50px]'>You have placed No orders</p>
                            }
                        </div>
                    )
            }
        </div>
    )
}

export default Orders