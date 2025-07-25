import React from "react";
import { useParams, Link } from "react-router-dom";


const DoctorUnavailable = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-md shadow-2xl p-10 rounded-3xl border border-blue-200 max-w-lg w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full border-4 border-red-300 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-red-700 mb-3">
          Doctor Unavailable at This Time
        </h1>

        <p className="text-gray-800 text-lg mb-5 leading-relaxed">
          We're sorry, but the doctor with ID{" "}
          <span className="font-semibold text-blue-800">{id}</span> is not
          accepting appointments right now for this time slot.
        </p>

        <div className="bg-blue-50/60 text-sm text-blue-900 border border-blue-200 px-4 py-3 rounded-xl mb-6">
          Please try selecting a different time slot or check again later.
        </div>

        <Link
          to="/schedule-appointment"
          className="inline-block px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 transition duration-200 shadow-lg"
        >
          ← Go Back to Scheduling
        </Link>

        <div className="mt-6 text-gray-600 text-sm">
          Need help?{" "}
          <a href="/contact-support" className="text-blue-600 underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default DoctorUnavailable;
