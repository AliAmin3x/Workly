"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

const JobFormModal = ({ isOpen, onClose, onSave, jobData }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    type: "",
    date_posted: "",
    link: "",
  });

  useEffect(() => {
    if (jobData) {
      setFormData(jobData);
    } else {
      setFormData({ title: "", company: "", description: "", location: "", type: "", date_posted: "", link: "" });
    }
  }, [jobData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={jobData ? "Edit Job" : "Add Job"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="company"
          value={formData.company || ""}
          onChange={handleChange}
          placeholder="Company"
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Job Description"
          className="w-full border border-gray-300 rounded-lg p-2"
          rows="3"
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            placeholder="Location"
            className="w-1/2 border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            placeholder="Type (Full-time / Part-time)"
            className="w-1/2 border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            name="date_posted"
            value={formData.date_posted || ""}
            onChange={handleChange}
            placeholder="Date Posted"
            className="w-1/2 border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="link"
            value={formData.link || ""}
            onChange={handleChange}
            placeholder="Job Link (URL)"
            className="w-1/2 border border-gray-300 rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
        >
          {jobData ? "Update Job" : "Add Job"}
        </button>
      </form>
    </Modal>
  );
};

export default JobFormModal;
