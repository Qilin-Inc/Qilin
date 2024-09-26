// app/payment-failure/page.tsx
"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const PaymentFailurePage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/premium');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center py-8 px-4 lg:px-0">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Payment Failed</h1>
      <p className="text-xl mb-8">We're sorry, but your payment couldn't be processed. You will be redirected to the premium page shortly.</p>
      <Button onClick={() => router.push('/premium')} className="bg-red-500 text-white">
        Return to Premium Page
      </Button>
    </div>
  );
};

export default PaymentFailurePage;