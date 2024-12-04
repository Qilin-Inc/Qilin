"use client"
import React from "react";
import ReportForm from "../../components/shared/ReportForm"; // Adjust the path based on your file structure
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <ReportForm />
    </div>
  );
};

export default App;
