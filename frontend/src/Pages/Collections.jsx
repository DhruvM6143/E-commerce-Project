import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import Title from '../Components/Title';
import ProductItem from '../Components/ProductItem';
import Loading from '../Components/Loading';

const Collections = ({ loading }) => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [filterProduct, setFilterProducts] = useState([]);
    const [showFilter, setShowFilter] = useState(true);

    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');

    // Load filters from localStorage on component mount
    useEffect(() => {
        const savedCategory = JSON.parse(localStorage.getItem('category')) || [];
        const savedSubCategory = JSON.parse(localStorage.getItem('subCategory')) || [];
        const savedSortType = localStorage.getItem('sortType') || 'relevant';

        setCategory(savedCategory);
        setSubCategory(savedSubCategory);
        setSortType(savedSortType);
    }, []);

    // Update localStorage when filters change
    useEffect(() => {
        localStorage.setItem('category', JSON.stringify(category));
        localStorage.setItem('subCategory', JSON.stringify(subCategory));
        localStorage.setItem('sortType', sortType);
    }, [category, subCategory, sortType]);

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setCategory(prev => [...prev, e.target.value]);
        }
    };

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setSubCategory(prev => [...prev, e.target.value]);
        }
    };

    const applyFilterAndSort = () => {
        let productsCopy = products.slice();

        // Apply category filter
        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }

        // Apply search filter
        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        // Apply subcategory filter
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
        }

        // Apply sorting based on sortType
        switch (sortType) {
            case 'low-high':
                productsCopy.sort((a, b) => a.price - b.price);
                break;
            case 'high-low':
                productsCopy.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        setFilterProducts(productsCopy);
    };

    // Apply filters and sorting when category, subcategory, search, or products change
    useEffect(() => {
        applyFilterAndSort();
    }, [category, subCategory, search, showSearch, products]);

    // Apply sorting when sortType changes
    useEffect(() => {
        applyFilterAndSort();
    }, [sortType]);

    return (
        <div>
            {loading ? (
                <Loading show={loading} />
            ) : (
                <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
                    {/* Filter Options */}
                    <div className='min-w-60'>
                        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
                            FILTERS
                            <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
                        </p>

                        {/* Category Filter */}
                        <div className={`border border-gray-300 pl-5 py-3 ${showFilter ? '' : 'hidden'} sm:block`}>
                            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                                <p className='flex gap-2'>
                                    <input
                                        className='w-3'
                                        type="checkbox"
                                        value={'Men'}
                                        onChange={toggleCategory}
                                        checked={category.includes('Men')}  // Controlled checkbox state
                                    /> Men
                                </p>
                                <p className='flex gap-2'>
                                    <input
                                        className='w-3'
                                        type="checkbox"
                                        value={'Women'}
                                        onChange={toggleCategory}
                                        checked={category.includes('Women')}  // Controlled checkbox state
                                    /> Women
                                </p>
                                <p className='flex gap-2'>
                                    <input
                                        className='w-3'
                                        type="checkbox"
                                        value={'Kids'}
                                        onChange={toggleCategory}
                                        checked={category.includes('Kids')}  // Controlled checkbox state
                                    /> Kids
                                </p>
                            </div>
                        </div>

                        {/* Sub Category Filter */}
                        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                            <p className='mb-3 text-sm font-medium'>TYPE</p>
                            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                                <p className='flex gap-2'>
                                    <input
                                        className='w-3'
                                        type="checkbox"
                                        value={'Topwear'}
                                        onChange={toggleSubCategory}
                                        checked={subCategory.includes('Topwear')}  // Controlled checkbox state
                                    /> Topwear
                                </p>
                                <p className='flex gap-2'>
                                    <input
                                        className='w-3'
                                        type="checkbox"
                                        value={'Bottomwear'}
                                        onChange={toggleSubCategory}
                                        checked={subCategory.includes('Bottomwear')}  // Controlled checkbox state
                                    /> Bottomwear
                                </p>
                                <p className='flex gap-2'>
                                    <input
                                        className='w-3'
                                        type="checkbox"
                                        value={'Winterwear'}
                                        onChange={toggleSubCategory}
                                        checked={subCategory.includes('Winterwear')}  // Controlled checkbox state
                                    /> Winterwear
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className='flex-1'>
                        <div className='flex justify-between text-base sm:text-2xl mb-4'>
                            <Title text1={'ALL'} text2={'COLLECTIONS'} />
                            {/* Product sort */}
                            <select
                                onChange={(e) => setSortType(e.target.value)}
                                value={sortType}  // Controlled select state
                                className='border border-gray-300 text-sm px-2'
                            >
                                <option value="relevant">Sort by: Relevant</option>
                                <option value="low-high">Sort by: Low to High</option>
                                <option value="high-low">Sort by: High to Low</option>
                            </select>
                        </div>
                        {/* Map all the products */}
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                            {filterProduct.map((item, index) => (
                                <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collections;
