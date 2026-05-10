"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Download, MapPin, ExternalLink, Clock, X, Building2, Tag, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import JobCard from "./JobCard";
import JobFormModal from "./JobFormModal";
import FilterPanel from "./FilterPanel";
import DeleteModal from "./DeleteModal";
import Header from "./Header";

const typeColors = {
  "full-time": { bg: "rgba(92,184,122,0.1)", color: "#5cb87a", border: "rgba(92,184,122,0.25)" },
  "part-time": { bg: "rgba(232,197,71,0.08)", color: "#e8c547", border: "rgba(232,197,71,0.2)" },
  "internship": { bg: "rgba(100,149,237,0.1)", color: "#6495ed", border: "rgba(100,149,237,0.25)" },
  "contract": { bg: "rgba(200,120,80,0.1)", color: "#e07850", border: "rgba(200,120,80,0.25)" },
};
const getTypeStyle = (type) => {
  const key = (type || "").toLowerCase();
  return typeColors[key] || { bg: "rgba(255,255,255,0.04)", color: "var(--text2)", border: "var(--border)" };
};

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [filters, setFilters] = useState({ keyword: "", jobType: "", location: "", tags: [] });

  const fetchJobs = async (f = filters) => {
    try {
      const res = await axios.get("/api/jobs", {
        params: { keyword: f.keyword, type: f.jobType, location: f.location, tags: f.tags.join(",") },
      });
      setJobs(res.data);
    } catch {
      toast.error("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleFilterChange = (newFilters) => { setFilters(newFilters); fetchJobs(newFilters); };

  const handleSave = async (data) => {
    try {
      if (selectedJob) {
        await axios.put(`/api/jobs/${selectedJob.id}`, data);
        toast.success("Listing updated!");
        if (activeJob?.id === selectedJob.id) setActiveJob({ ...activeJob, ...data });
      } else {
        await axios.post("/api/jobs", data);
        toast.success("Listing added!");
      }
      fetchJobs();
      setIsModalOpen(false);
      setSelectedJob(null);
    } catch {
      toast.error("Failed to save listing.");
    }
  };

  const handleDeleteConfirm = async (jobId) => {
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (activeJob?.id === jobId) setActiveJob(null);
      toast.success("Listing deleted.");
      setIsDeleteOpen(false);
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleScrape = async () => {
    setIsScraping(true);
    try {
      const res = await axios.get("/api/jobs/scrape");
      toast.success(res.data.message || "Scraping done!");
      fetchJobs();
    } catch {
      toast.error("Scraping failed.");
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg3)",
            color: "var(--text)",
            border: "1px solid var(--border2)",
            borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
          },
          success: { iconTheme: { primary: "#5cb87a", secondary: "#0f0f0f" } },
          error: { iconTheme: { primary: "#e05252", secondary: "#0f0f0f" } },
        }}
      />

      <Header jobCount={jobs.length} />

      {/* Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 0,
          minHeight: "100vh",
          paddingTop: 64,
        }}
      >
        {/* Main content */}
        <div style={{ padding: "32px 28px", borderRight: "1px solid var(--border)" }}>
          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <p className="section-label" style={{ marginBottom: 4 }}>Browse</p>
            <h1
              className="display-font"
              style={{ fontSize: 32, fontWeight: 900, fontStyle: "italic", color: "var(--text)", lineHeight: 1.1 }}
            >
              Job Listings
            </h1>
          </div>

          {/* Job list */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 130, borderRadius: 12 }} />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {jobs.map((job, i) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={i}
                  onView={(j) => setActiveJob(j)}
                  onEdit={(j) => { setSelectedJob(j); setIsModalOpen(true); }}
                  onDelete={(id) => { setSelectedJob(jobs.find((j) => j.id === id)); setIsDeleteOpen(true); }}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Briefcase size={40} style={{ color: "var(--border2)", margin: "0 auto 16px" }} />
              <p style={{ fontSize: 16, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>No listings found</p>
              <p style={{ fontSize: 13, color: "var(--text3)" }}>Try adjusting your filters or add a new job.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div
          style={{
            padding: "32px 20px",
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => { setSelectedJob(null); setIsModalOpen(true); }}
          >
            <Plus size={16} /> New listing
          </button>

          <button
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={handleScrape}
            disabled={isScraping}
          >
            <Download size={15} />
            {isScraping ? "Scraping..." : "Scrape jobs"}
          </button>

          <div style={{ marginTop: 4 }}>
            <FilterPanel onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>

      {/* Job Detail Drawer */}
      <AnimatePresence>
        {activeJob && (
          <>
            <motion.div
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 150, backdropFilter: "blur(2px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveJob(null)}
            />
            <motion.div
              className="drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: 64,
                right: 0,
                bottom: 0,
                width: 440,
                overflowY: "auto",
                zIndex: 160,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Drawer Header */}
              <div
                style={{
                  padding: "20px 24px 16px",
                  borderBottom: "1px solid var(--border)",
                  position: "sticky",
                  top: 0,
                  background: "var(--bg2)",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="section-label" style={{ marginBottom: 4 }}>{activeJob.company}</p>
                  <h2
                    className="display-font"
                    style={{ fontSize: 22, fontWeight: 700, fontStyle: "italic", color: "var(--text)", lineHeight: 1.2 }}
                  >
                    {activeJob.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveJob(null)}
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--text3)",
                    flexShrink: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Drawer Body */}
              <div style={{ padding: "20px 24px", flex: 1 }}>
                {/* Meta pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {activeJob.type && (
                    <span
                      className="badge"
                      style={{ background: getTypeStyle(activeJob.type).bg, color: getTypeStyle(activeJob.type).color, borderColor: getTypeStyle(activeJob.type).border }}
                    >
                      <Briefcase size={10} /> {activeJob.type}
                    </span>
                  )}
                  {activeJob.location && (
                    <span className="badge badge-location">
                      <MapPin size={10} /> {activeJob.location}
                    </span>
                  )}
                  {activeJob.date_posted && (
                    <span className="badge badge-location">
                      <Clock size={10} /> {activeJob.date_posted}
                    </span>
                  )}
                </div>

                {/* Apply button */}
                {activeJob.link && (
                  <a
                    href={activeJob.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ display: "inline-flex", textDecoration: "none", marginBottom: 20 }}
                  >
                    <ExternalLink size={14} /> Apply now
                  </a>
                )}

                {/* Description */}
                {activeJob.description && (
                  <>
                    <p className="section-label" style={{ marginBottom: 8 }}>About this role</p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text2)",
                        lineHeight: 1.7,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {activeJob.description}
                    </p>
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              <div
                style={{
                  padding: "14px 24px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: "center", fontSize: 13 }}
                  onClick={() => { setSelectedJob(activeJob); setIsModalOpen(true); }}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  style={{ flex: 1, fontSize: 13 }}
                  onClick={() => { setSelectedJob(activeJob); setIsDeleteOpen(true); }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedJob(null); }}
        onSave={handleSave}
        jobData={selectedJob}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDeleteConfirm(selectedJob?.id)}
        jobTitle={selectedJob?.title}
      />
    </>
  );
};

export default Dashboard;
