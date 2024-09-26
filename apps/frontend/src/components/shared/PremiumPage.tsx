"use client"
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { FaGooglePay, FaCcMastercard, FaCcApplePay } from "react-icons/fa";
import { SiPaytm, SiRazorpay } from "react-icons/si";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Laptop, Headphones, Gift, Clock, UserCircle, Laptop2, DollarSign } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const PremiumPage = () => {
  const handleCheckout = async (priceId: string) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize.');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center py-8 px-4 lg:px-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-500">QILIN PREMIUM</h1>
        <p className="mt-2 text-lg">
          Become a Supporter and Get Exclusive Perks Across <strong>All Tracker Network Sites</strong>
        </p>
      </div>

      {/* Pricing Section */}
      <div className="mt-10 flex flex-col lg:flex-row gap-8">
      {[
        {
          type: "One-Time Purchase",
          price: "$4",
          duration: "per month ($48/year)",
          priceId: "price_1Q2vcFRoM7cPVVMnHV2Z2nnf",
        },
        {
          type: "Monthly Subscription",
          price: "$3",
          duration: "per month ($36/year) Save 25%",
          priceId: "price_1Q2vcFRoM7cPVVMnHV2Z2nnf",
        },
        {
          type: "Annual Subscription",
          price: "$30",
          duration: "per year Save 35%",
          priceId: "price_1Q2vcFRoM7cPVVMnHV2Z2nnf",
        },
      ].map((plan) => (
        <div
          key={plan.type}
          className="bg-gray-800 p-6 rounded-lg text-center flex flex-col justify-between"
        >
          <h3 className="text-2xl font-semibold mb-2">{plan.type}</h3>
          <p className="text-4xl font-bold text-yellow-500">{plan.price}</p>
          <p className="text-sm text-gray-400 mt-1">{plan.duration}</p>
          <Button 
            className="mt-6 bg-red-500 text-white w-full" 
            onClick={() => handleCheckout(plan.priceId)}
          >
            Purchase
          </Button>
        </div>
      ))}
      </div>

      {/* Payment Methods */}
      <div className="mt-10">
        <p className="text-gray-400 text-center text-lg">We Accept:</p>
        <div className="flex flex-wrap gap-6 justify-center mt-6">
            {/* Payment method icons */}
            <div className="flex flex-col items-center">
            <FaGooglePay className="text-6xl text-white transition-transform transform hover:scale-110" />
            <p className="text-sm text-gray-400 mt-2">Google Pay</p>
            </div>
            <div className="flex flex-col items-center">
            <FaCcMastercard className="text-6xl text-white transition-transform transform hover:scale-110" />
            <p className="text-sm text-gray-400 mt-2">Mastercard</p>
            </div>
            <div className="flex flex-col items-center">
            <FaCcApplePay className="text-6xl text-white transition-transform transform hover:scale-110" />
            <p className="text-sm text-gray-400 mt-2">Apple Pay</p>
            </div>
            <div className="flex flex-col items-center">
            <SiPaytm className="text-6xl text-white transition-transform transform hover:scale-110" />
            <p className="text-sm text-gray-400 mt-2">Paytm</p>
            </div>
            <div className="flex flex-col items-center">
            <SiRazorpay className="text-6xl text-white transition-transform transform hover:scale-110" />
            <p className="text-sm text-gray-400 mt-2">Razorpay</p>
            </div>
        </div>
    </div>

      {/* Premium Flair Section */}
      <div className="mt-10 text-center">
        <h3 className="text-2xl font-bold">Premium Flair</h3>
        <p className="mt-2 text-gray-400">
          Your loyalty will not go unnoticed! Adorn your profile picture with a Premium profile frame
          that can be leveled up the longer you're a Premium member.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          {['Supporter', 'Veteran', 'Hero', 'Legend'].map((flair, index) => (
            <div key={flair} className="text-center">
              {/* Replace with actual flair icons */}
              <div className="bg-gray-800 p-4 rounded-full mb-2">
                <span className="text-3xl">{index + 1}</span>
              </div>
              <p className="text-gray-200">{flair}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">ALL BENEFITS</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          <Card>
            <CardHeader className="flex items-center space-x-3">
              <Laptop className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-medium">Help support growth to expand to new game titles</span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center space-x-3">
              <Headphones className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-medium">Priority Support</span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center space-x-3">
              <Gift className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-medium">Exclusive Rewards</span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-medium">Offline Profile Auto-Updates</span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center space-x-3">
              <UserCircle className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-medium">Personalized Profiles</span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center space-x-3">
              <Laptop2 className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-medium">Ad-Free Websites & Apps</span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-medium">Premium Supporter Flair</span>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>




    </div>

    

  );
};

export default PremiumPage;
