import React from "react";
import { ReservationForm } from "@/components/component/reservation-form";
import { Toaster } from "react-hot-toast";

const ReservationPage: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto p-4">
      <Toaster></Toaster>
      <ReservationForm />
    </div>
  );
};

export default ReservationPage;
