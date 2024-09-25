import React from 'react';
import Header from '@/components/shared/Header';
import MainSection from '@/components/shared/MainSection';
import GamesGrid from '@/components/shared/GamesGrid';
import Footer from '@/components/shared/Footer';

const TrackerNetworkHomepage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
    <Header />
    <MainSection />
    <GamesGrid />
    <Footer />
  </div>
  );
};

export default TrackerNetworkHomepage;
