"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "@/components/JobCard";
import JobFormModal from "@/components/JobFormModal";
import JobFilterPanel from "@/components/FilterJob";
import DeleteModal from "@/components/DeleteJob";
import { SquarePlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    jobType: "",
    location: "",
    tags: [],
  });

  const fetchJobs = async (f = filters) => {
    try {
      const res = await axios.get("/api/jobs", {
        params: {
          keyword: f.keyword,
          type: f.jobType,
          location: f.location,
          tags: f.tags.join(","),
        },
      });
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs.");
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedJob) => {
    try {
      if (selectedJob) {
        await axios.put(`/api/jobs/${selectedJob.id}`, updatedJob);
        toast.success("Job updated successfully!");
      } else {
        await axios.post("/api/jobs", updatedJob);
        toast.success("Job added successfully!");
      }
      fetchJobs();
      setIsModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job.");
    }
  };

  const handleDeleteConfirm = async (jobId) => {
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      toast.success("Job deleted successfully!");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job.");
    }
  };

  return (
    <div className="flex p-6 gap-6 relative">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Main job list */}
      <div className="w-3/4 space-y-6 pt-10 pr-3">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={(job) => setActiveJob(job)}
              onEdit={() => handleEdit(job)}
              onDelete={() => {
                setSelectedJob(job);
                setIsDeleteOpen(true);
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No jobs found.</p>
        )}
      </div>

      {/* Filter Panel + Add Job Button */}
      <div className="fixed right-0 mt-10 mx-5 w-1/4">
        <button
          onClick={() => {
            setSelectedJob(null);
            setIsModalOpen(true);
          }}
          className="font-mono px-7 py-2 bg-[#3b82f6] rounded-xl font-bold text-white flex gap-2 text-lg items-center mb-4 w-full"
        >
          Add new Job <SquarePlus size={18} />
        </button>

        <JobFilterPanel onFilterChange={handleFilterChange} />
      </div>

      {/* Job Form Modal */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
        onSave={handleSave}
        jobData={selectedJob}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDeleteConfirm(selectedJob?.id)}
        jobTitle={selectedJob?.title}
      />

      {/* Job Detail Drawer */}
      <AnimatePresence>
        {activeJob && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveJob(null)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-1/2 bg-white shadow-2xl p-6 z-50 overflow-y-auto border-r"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{activeJob.title}</h2>
                <button
                  onClick={() => setActiveJob(null)}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  <X size={22} />
                </button>
              </div>

              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Company:</span> {activeJob.company}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Location:</span> {activeJob.location}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Type:</span> {activeJob.type || "N/A"}
              </p>
              {activeJob.link && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Link:</span>{" "}
                  <a
                    href={activeJob.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Apply Here
                  </a>
                </p>
              )}

              <hr className="my-4" />

              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {activeJob.description || "No description provided."}
              </p>

              {activeJob.date_posted && (
                <p className="mt-6 text-sm text-gray-400">
                  Posted on: {activeJob.date_posted}
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
