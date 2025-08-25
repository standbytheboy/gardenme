import React from 'react';
import { Navbar } from '../components/Navbar';
import { Header } from '../components/Header';
import PopularCategories from '../components/PopularCategories';
import WhyPlantWithUs from '../components/WhyPlantWithUs';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <Navbar />
      <main>
        <Header />
        <PopularCategories />
        <WhyPlantWithUs />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Home;