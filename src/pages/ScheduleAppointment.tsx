import React from "react";
import { doctors } from "@/lib/doctors";

const ScheduleAppointment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d0f1ff] to-[#e0f7ff] p-6">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-10 drop-shadow-sm">
        Schedule an Appointment
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="backdrop-blur-md bg-white/50 border border-blue-100 shadow-lg rounded-3xl p-6 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-5 mb-4">
              <img
                src={doc.profileImage}
                alt={doc.name}
                className="w-16 h-16 rounded-full border-4 border-blue-200 shadow-md"
              />
              <div>
                <h2 className="text-xl font-semibold text-blue-800">
                  {doc.name}
                </h2>
                <p className="text-sm text-blue-600 font-medium">
                  {doc.specialization}
                </p>
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm border border-blue-100 p-4 rounded-xl">
              <p className="text-sm font-semibold text-blue-700 mb-2">
                Available Timings:
              </p>
              <ul className="text-sm text-blue-600 list-disc pl-5 space-y-1">
                {doc.availableTimings.map((time) => (
                  <li key={time}>{time}</li>
                ))}
              </ul>
            </div>

            <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-semibold py-2 rounded-xl shadow-md transition-all">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleAppointment;
