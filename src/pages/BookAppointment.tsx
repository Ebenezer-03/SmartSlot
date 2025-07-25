import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiUser, FiEdit } from "react-icons/fi";

const BookAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: "",
    reason: "",
    date: "",
    time: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Appointment booked successfully!");
    navigate("/schedule-appointment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-violet-100 to-purple-200 p-6 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white/60 backdrop-blur-md shadow-2xl p-10 rounded-3xl border border-purple-100">
        <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-6">
          Book Appointment
        </h1>
        <p className="text-center text-gray-600 mb-8">
          You're booking for Doctor ID:{" "}
          <span className="font-semibold text-purple-700">{id}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiUser /> Patient Name
            </label>
            <input
              type="text"
              name="patientName"
              placeholder="Your Full Name"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border bg-white/80 backdrop-blur border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiEdit /> Reason for Visit
            </label>
            <textarea
              name="reason"
              placeholder="Describe your symptoms or reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="w-full p-3 h-28 rounded-xl border bg-white/80 backdrop-blur border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiCalendar /> Appointment Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border bg-white/80 backdrop-blur border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiClock /> Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border bg-white/80 backdrop-blur border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition duration-300 shadow-md"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
