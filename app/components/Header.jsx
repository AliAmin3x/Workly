"use client";

import { Briefcase } from "lucide-react";

const Header = ({ jobCount }) => {
  return (
    <header
      style={{
        background: "rgba(15,15,15,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: "var(--accent)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Briefcase size={16} color="#0f0f0f" strokeWidth={2.5} />
        </div>
        <span className="workly-logo" style={{ fontSize: 22, color: "var(--text)" }}>
          Workly
        </span>
        <span style={{ color: "var(--border2)", fontSize: 18, marginLeft: 2 }}>/</span>
        <span
          className="section-label"
          style={{ color: "var(--text3)", fontSize: 11 }}
        >
          Job Board
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {jobCount !== undefined && (
          <span className="stat-pill">
            {jobCount} {jobCount === 1 ? "listing" : "listings"}
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
