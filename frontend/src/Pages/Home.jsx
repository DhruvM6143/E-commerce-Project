import React, { useEffect } from 'react'
import Hero from '../Components/Hero'
import LatestCollection from '../Components/LatestCollection'
import BestSeller from '../Components/BestSeller'
import OurPolicy from '../Components/OurPolicy'
import NewsLetter from '../Components/NewsLetter'
import Loading from '../Components/Loading'

const Home = ({ loading }) => {
    useEffect(() => {

        window.scrollTo(0, 0); // Scroll to the top of the page
    }, []);
    return (

        <div>
            {
                loading ? (
                    <Loading show={loading} />
                ) : (
                    <div>
                        <Hero />
                        <LatestCollection />
                        <BestSeller />
                        <OurPolicy />
                        <NewsLetter />
                    </div>
                )
            }

        </div>
    )
}

export default Home