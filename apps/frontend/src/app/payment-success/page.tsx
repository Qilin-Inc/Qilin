// app/payment-success/page.tsx
"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const PaymentSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center py-8 px-4 lg:px-0">
      <h1 className="text-4xl font-bold text-green-500 mb-4">Payment Successful!</h1>
      <p className="text-xl mb-8">Thank you for your purchase. You will be redirected to the login page shortly.</p>
      <Button onClick={() => router.push('/login')} className="bg-green-500 text-white">
        Go to Login
      </Button>
    </div>
  );
};

export default PaymentSuccessPage;