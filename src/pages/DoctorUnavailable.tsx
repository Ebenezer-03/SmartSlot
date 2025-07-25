import React from "react";
import { useParams, Link } from "react-router-dom";

const DoctorUnavailable = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 to-blue-200/80 backdrop-blur-xl p-6 flex items-center justify-center">
      <div className="bg-white/60 shadow-xl p-10 rounded-2xl border border-blue-100 text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Doctor Unavailable
        </h1>
        <p className="text-gray-700 text-lg">
          Doctor with ID <span className="font-semibold">{id}</span> is currently unavailable at this slot.
        </p>
        <Link
          to="/schedule-appointment"
          className="mt-6 inline-block text-blue-700 font-semibold hover:underline"
        >
          ← Back to Schedule
        </Link>
      </div>
    </div>
  );
};

export default DoctorUnavailable;