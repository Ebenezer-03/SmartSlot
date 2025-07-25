import React from "react";
import { useNavigate } from "react-router-dom";
import { doctors } from "@/lib/doctors";

const ScheduleAppointment = () => {
  const navigate = useNavigate();

  const handleCardClick = (doctorId: number) => {
    const isAvailable = doctorId % 2 === 0;
    if (isAvailable) {
      navigate(`/book/${doctorId}`);
    } else {
      navigate(`/unavailable/${doctorId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0faff] p-6">
      {/* Back Button */}
      <div className="mb-8 flex justify-start">
        <button
          onClick={() => navigate("/patient-dashboard")}
          className="inline-flex items-center px-5 py-2 bg-[#d0e8f2] text-[#4a90e2] font-medium rounded-xl shadow-md hover:bg-[#e0f0fa] transition"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center text-[#4a90e2] mb-10 drop-shadow-sm">
        Schedule an Appointment
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleCardClick(doc.id)}
            className="cursor-pointer bg-white border border-[#d0e8f2] rounded-3xl p-6 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center gap-5 mb-4">
              <img
                src={doc.profileImage}
                alt={doc.name}
                className="w-16 h-16 rounded-full border-4 border-[#d0e8f2] shadow-sm"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/80?text=Dr")
                }
              />
              <div>
                <h2 className="text-lg font-semibold text-[#4a90e2]">
                  {doc.name}
                </h2>
                <p className="text-sm text-[#7aa5c9]">{doc.specialization}</p>
              </div>
            </div>

            <div className="bg-[#f8fbfd] border border-[#e0f0fa] p-4 rounded-xl">
              <p className="text-sm font-semibold text-[#4a90e2] mb-2">
                Available Timings:
              </p>
              <ul className="text-sm text-[#7aa5c9] list-disc pl-5 space-y-1">
                {doc.availableTimings.map((time) => (
                  <li key={time}>{time}</li>
                ))}
              </ul>
            </div>

            <button className="mt-5 w-full bg-gradient-to-r from-[#c2e0f4] to-[#a7d6f2] hover:from-[#b0d6ec] hover:to-[#94c9e9] text-[#004d80] font-medium py-2 rounded-xl shadow transition-all">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleAppointment;
