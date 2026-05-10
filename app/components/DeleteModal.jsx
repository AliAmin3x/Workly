"use client";

import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteModal = ({ isOpen, onClose, onConfirm, jobTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 360,
              padding: 24,
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "var(--red-soft)",
                border: "1px solid rgba(224,82,82,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertTriangle size={22} color="var(--red)" />
            </div>

            <h3 className="display-font" style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontStyle: "italic" }}>
              Delete listing?
            </h3>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, marginBottom: 22 }}>
              <span style={{ color: "var(--text)", fontWeight: 500 }}>{jobTitle}</span> will be permanently removed. This can&apos;t be undone.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="btn-danger"
                style={{ flex: 1 }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
