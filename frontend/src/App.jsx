import React, { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Collections from "./Pages/Collections"
import About from "./Pages/About"
import Contact from "./Pages/Contact"
import Product from "./Pages/Product"
import Cart from "./Pages/Cart"
import Login from "./Pages/Login"
import PlaceOrder from "./Pages/PlaceOrder"
import Orders from "./Pages/Orders"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import SearchBar from "./Components/SearchBar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from "./Pages/Verify"
import Loading from "./Components/Loading"
import axios from "axios"

function App() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false); // stop loading even if there's an error
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);


  return (

    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer autoClose={2000} />
      <Navbar />
      <SearchBar />

      <Routes>
        <Route path="/" element={<Home loading={loading} />} />
        <Route path="/collection" element={<Collections loading={loading} />} />
        <Route path="/about" element={<About loading={loading} />} />
        <Route path="/contact" element={<Contact loading={loading} />} />
        <Route path="/product/:productId" element={<Product loading={loading} />} />
        <Route path="/cart" element={<Cart loading={loading} />} />
        <Route path="/login" element={<Login loading={loading} />} />
        <Route path="/place-order" element={<PlaceOrder loading={loading} />} />
        <Route path="/orders" element={<Orders loading={loading} />} />
        <Route path="/verify" element={<Verify loading={loading} />} />
      </Routes>
      <Footer />
    </div>

  )
}

export default App
