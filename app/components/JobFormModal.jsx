"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

const Field = ({ label, children }) => (
  <div>
    <label
      className="section-label"
      style={{ display: "block", marginBottom: 6 }}
    >
      {label}
    </label>
    {children}
  </div>
);

const JobFormModal = ({ isOpen, onClose, onSave, jobData }) => {
  const empty = { title: "", company: "", description: "", location: "", type: "", date_posted: "", link: "" };
  const [formData, setFormData] = useState(empty);

  useEffect(() => {
    setFormData(jobData ? { ...empty, ...jobData } : empty);
  }, [jobData, isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={jobData ? "Edit listing" : "New listing"}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Job Title *">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Engineer"
            className="input-dark"
            required
          />
        </Field>

        <Field label="Company">
          <input
            type="text"
            name="company"
            value={formData.company || ""}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            className="input-dark"
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="What's this role about?"
            className="input-dark"
            rows={4}
            style={{ resize: "vertical", minHeight: 90 }}
          />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Location">
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              placeholder="Remote / NYC"
              className="input-dark"
            />
          </Field>
          <Field label="Job Type">
            <select name="type" value={formData.type || ""} onChange={handleChange} className="input-dark">
              <option value="">Select type</option>
              {["Full-time", "Part-time", "Internship", "Contract"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Date Posted">
            <input
              type="text"
              name="date_posted"
              value={formData.date_posted || ""}
              onChange={handleChange}
              placeholder="e.g. May 2025"
              className="input-dark"
            />
          </Field>
          <Field label="Application Link">
            <input
              type="url"
              name="link"
              value={formData.link || ""}
              onChange={handleChange}
              placeholder="https://..."
              className="input-dark"
            />
          </Field>
        </div>

        <div style={{ paddingTop: 4 }}>
          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
            {jobData ? "Save changes" : "Add listing"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JobFormModal;
