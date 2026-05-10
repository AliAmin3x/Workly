"use client";

import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";

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

  return (
    <div className="bg-white shadow-md rounded-lg p-5 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold font-mono">Filter Jobs</h2>
        <button
          onClick={resetFilters}
          className="flex items-center text-xs text-gray-500 hover:text-blue-500 transition"
        >
          <RotateCcw size={14} className="mr-1" /> Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by title or company..."
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          className="w-full font-mono p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Job Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 font-mono">
          Job Type
        </label>
        <select
          value={filters.jobType}
          onChange={(e) => handleFilterChange("jobType", e.target.value)}
          className="w-full font-mono p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {jobTypeOptions.map((type) => (
            <option key={type} value={type === "All" ? "" : type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 font-mono">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full font-mono p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <label className="block text-sm font-medium text-gray-700 mb-2 font-mono">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full border text-sm font-mono transition-colors duration-200 ${
                filters.tags.includes(tag)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
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
