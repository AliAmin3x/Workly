"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h2
                className="display-font"
                style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontStyle: "italic" }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text3)",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "var(--red)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: "20px 24px 24px" }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
