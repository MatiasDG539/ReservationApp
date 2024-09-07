import React from "react";
import ReservationTable from "@/components/component/reservation-table";

const ViewReservation: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto p-4">
      <ReservationTable />
    </div>
  );
};

export default ViewReservation;