"use client"
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { FaGooglePay, FaCcMastercard, FaCcApplePay } from "react-icons/fa";
import { SiPaytm, SiRazorpay } from "react-icons/si";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Monitor, Headphones, Gift, Clock, User, Laptop, Award ,Store} from 'lucide-react';
import { text } from 'stream/consumers';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface BenefitItemProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-2 p-2 rounded-full bg-yellow-500">
      <Icon className="w-6 h-6 text-gray-900" />
    </div>
    <p className="text-xs text-gray-400">{text}</p>
  </div>
);

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

  const benefits = [
    { icon: Monitor, text: "Help support growth to expand to new game titles" },
    { icon: Headphones, text: "Priority Matchmaking" },
    { icon: Gift, text: "Exclusive Rewards" },
    { icon: Clock, text: "Offline Profile Auto-Updates" },
    { icon: User, text: "Personalized Profiles" },
    { icon: Laptop, text: "Ad-Free Websites & Apps" },
    { icon: Award, text: "Premium Supporter Flair" },
    {icon: Store, text:"Exclusive In-game Store Access"}
  ];

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
            type: "Weekly Purchase",
            price: "$7",
            duration: "per week($7)",
            priceId: "price_1Q3KnCRoM7cPVVMnUS4ubCob",
          },
          {
            type: "Monthly Subscription",
            price: "$3",
            duration: "per month ($36/year) Save 25%",
            priceId: "price_1Q3KZURoM7cPVVMnu5OnlJHH",
          },
          {
            type: "Annual Subscription",
            price: "$30",
            duration: "per year Save 35%",
            priceId: "price_1Q3KeVRoM7cPVVMnckOgpJDn",
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

      {/* Benefits Dashboard */}
      <Card className="w-full max-w-4xl mx-auto bg-gray-900 text-white mt-10">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            ALL <span className="bg-yellow-500 text-gray-900 px-2">BENEFITS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitItem key={index} icon={benefit.icon} text={benefit.text} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumPage;