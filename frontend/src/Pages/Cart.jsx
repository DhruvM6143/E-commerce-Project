import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../Components/CartTotal';
import { toast } from 'react-toastify';
import Loading from '../Components/Loading';

const Cart = ({ loading }) => {
    const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);
    const toastId = 'checkout-error'; // Unique toast ID for error notifications

    useEffect(() => {
        const tempData = [];
        if (products.length > 0) {
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        tempData.push({
                            _id: items,
                            size: item,
                            quantity: cartItems[items][item],
                        });
                    }
                }
            }
        }
        setCartData(tempData);
    }, [cartItems, products, token]);

    const handleCheckout = () => {
        let errorMessage = '';

        if (!token) {
            errorMessage += 'Please login first. ';
        }
        if (cartData.length === 0) {
            errorMessage += 'Add something to your cart. ';
        }

        if (errorMessage) {
            if (!toast.isActive(toastId)) { // Check if the toast is already active
                toast.error(errorMessage.trim(), { toastId }); // Show a single toast with the error message
            }
        } else {
            navigate('/place-order'); // Proceed to checkout if no errors
        }
    };

    return (
        <div>
            {loading ? (
                <Loading show={loading} />
            ) : (
                <div className="border-t pt-14">
                    <div className="text-2xl mb-3">
                        <Title text1={'YOUR'} text2={'CART'} />
                    </div>
                    <div>
                        {cartData.map((item, index) => {
                            const productData = products.find((product) => product._id === item._id);
                            return (
                                <div
                                    key={index}
                                    className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                                >
                                    <div className="flex items-start gap-4 sm:gap-6">
                                        <img src={productData.image[0]} className="w-16 sm:w-20" alt="" />
                                        <div>
                                            <p className="text-sm sm:text-lg font-medium">{productData.name}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <p className="text-sm">{currency}{productData.price}</p>
                                                <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '' || value === '0') return null;
                                            updateQuantity(item._id, item.size, Number(value));
                                        }}
                                        type="number"
                                        min={1}
                                        defaultValue={item.quantity}
                                        className="border max-w-[80px] sm:max-w-[120px] px-1 sm:px-2 py-1"
                                    />
                                    <img
                                        onClick={() => updateQuantity(item._id, item.size, 0)}
                                        src={assets.bin_icon}
                                        className="w-5 cursor-pointer"
                                        alt=""
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end my-8">
                        <div className="w-full sm:w-[450px]">
                            <CartTotal />
                            <div className="w-full text-end">
                                <button
                                    onClick={handleCheckout}
                                    className="bg-black text-white text-sm my-8 px-6 py-3 rounded"
                                >
                                    PROCEED TO CHECKOUT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
