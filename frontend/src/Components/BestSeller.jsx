import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);

    const [best, setBest] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestSeller))
        setBest(bestProduct.slice(0, 5));
    }, [products])


    return (
        <div className='my-10`'>
            <div className='text-center text-3xl py-8'>
                <Title text1={`BEST`} text2={`SELLERS`} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Timeless favorites combining comfort, style, and unmatched versatility.
                </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    best.map((item, index) => (
                        <ProductItem key={index} id={item._id} price={item.price} image={item.image} name={item.name} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller