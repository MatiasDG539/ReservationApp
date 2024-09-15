import React from "react";
import { ReservationForm } from "@/components/component/reservation-form";

const ReservationPage: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto p-4">
      <ReservationForm />
    </div>
  );
};

export default ReservationPage;
