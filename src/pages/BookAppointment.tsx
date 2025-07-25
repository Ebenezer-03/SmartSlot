import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 to-blue-200/80 backdrop-blur-xl p-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-white/60 shadow-xl backdrop-blur-md p-8 rounded-2xl border border-blue-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Book Appointment for Doctor ID: {id}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="patientName"
            placeholder="Your Name"
            value={formData.patientName}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white/70 backdrop-blur border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="reason"
            placeholder="Reason for Appointment"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full p-3 h-24 rounded-xl border bg-white/70 backdrop-blur border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white/70 backdrop-blur border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border bg-white/70 backdrop-blur border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;