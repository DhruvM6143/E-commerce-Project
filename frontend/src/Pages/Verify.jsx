import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../Components/Loading'

const Verify = ({ loading }) => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const verifyPayment = async () => {
        try {
            if (!token) {
                return null;

            }
            const response = await axios.post(backendUrl + '/api/order/verify', { success, orderId }, { headers: { token } })
            if (response.data.success) {
                setCartItems([])
                navigate('/orders')
            }
            else {
                navigate('/cart')
                toast.error('error with payment')
            }
        } catch (error) {
            console.log(error);
            toast.error('error with payment')

        }
    }
    useEffect(() => {
        verifyPayment()
    }, [token])
    return (
        <div>
            {loading ? (<Loading show={loading} />)
                : (
                    <div>

                    </div>
                )
            }
        </div>
    )
}

export default Verify