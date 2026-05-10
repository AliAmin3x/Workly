"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

const JobCard = ({ job, onView, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
    <div
      onClick={() => onView && onView(job)}
      className="relative bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
    >
      {/* Three Dots Menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={toggleMenu}
          className="p-1 rounded-full hover:bg-gray-100 transition"
        >
          <MoreVertical size={18} className="text-gray-600" />
        </button>

        {menuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-32 bg-white shadow-lg border border-gray-200 rounded-md z-10"
          >
            <button
              onClick={() => { setMenuOpen(false); onView && onView(job); }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              View
            </button>
            <button
              onClick={() => { setMenuOpen(false); onEdit && onEdit(job); }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDelete && onDelete(job.id); }}
              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Job Info */}
      <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
      <p className="text-sm text-gray-500 mt-1">{job.company}</p>

      <p className="text-sm text-gray-600 mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
        {job.description}
      </p>

      <div className="mt-3 text-sm text-gray-700">
        <p><span className="font-medium">Location:</span> {job.location}</p>
        <p><span className="font-medium">Type:</span> {job.type}</p>
      </div>

      <div className="mt-4 flex justify-end">
        <span className="text-xs text-gray-400">{job.date_posted}</span>
      </div>
    </div>
  );
};

export default JobCard;
