import React from "react";
import ReservationTable from "@/components/component/reservation-table";
import { Toaster } from "react-hot-toast";

const ViewReservation: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto p-4">
      <Toaster></Toaster>
      <ReservationTable />
    </div>
  );
};

export default ViewReservation;