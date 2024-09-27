import React from "react";
import { ReservationFormSolar } from "@/components/component/reservation-form-solar";
import { Toaster } from "react-hot-toast";

const ReservationPage: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto p-4">
      <Toaster></Toaster>
      <ReservationFormSolar />
    </div>
  );
};

export default ReservationPage;