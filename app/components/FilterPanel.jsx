"use client";

import { useState } from "react";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

const JobFilterPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    jobType: "",
    location: "",
    tags: [],
  });

  const jobTypeOptions = ["All", "Full-time", "Part-time", "Internship", "Contract"];
  const locationOptions = ["All", "Remote", "On-site", "Hybrid"];
  const tagOptions = ["React", "Flask", "API", "Frontend", "Backend", "Remote", "Internship"];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange("tags", newTags);
  };

  const resetFilters = () => {
    const cleared = { keyword: "", jobType: "", location: "", tags: [] };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const activeCount = [
    filters.keyword,
    filters.jobType,
    filters.location,
  ].filter(Boolean).length + filters.tags.length;

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px",
        height: "fit-content",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={14} color="var(--accent)" />
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>Filters</span>
          {activeCount > 0 && (
            <span
              style={{
                background: "var(--accent)",
                color: "#0f0f0f",
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 999,
                padding: "1px 6px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button className="btn-ghost" onClick={resetFilters} style={{ fontSize: 12, padding: "3px 8px" }}>
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search
          size={14}
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }}
        />
        <input
          type="text"
          placeholder="Title or company..."
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          className="input-dark"
          style={{ paddingLeft: 34, fontSize: 13 }}
        />
      </div>

      {/* Job Type */}
      <div style={{ marginBottom: 14 }}>
        <label className="section-label" style={{ display: "block", marginBottom: 6 }}>Job Type</label>
        <select
          value={filters.jobType}
          onChange={(e) => handleFilterChange("jobType", e.target.value)}
          className="input-dark"
          style={{ fontSize: 13 }}
        >
          {jobTypeOptions.map((type) => (
            <option key={type} value={type === "All" ? "" : type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div style={{ marginBottom: 16 }}>
        <label className="section-label" style={{ display: "block", marginBottom: 6 }}>Location</label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="input-dark"
          style={{ fontSize: 13 }}
        >
          {locationOptions.map((loc) => (
            <option key={loc} value={loc === "All" ? "" : loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="section-label" style={{ display: "block", marginBottom: 8 }}>Tags</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tagOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`tag-chip ${filters.tags.includes(tag) ? "active" : ""}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobFilterPanel;
