"use client";

import { useState } from "react";
import { MoreVertical, MapPin, Clock, ExternalLink, Pencil, Trash2, Eye } from "lucide-react";

const typeColors = {
  "full-time": { bg: "rgba(92,184,122,0.1)", color: "#5cb87a", border: "rgba(92,184,122,0.25)" },
  "part-time": { bg: "rgba(232,197,71,0.08)", color: "#e8c547", border: "rgba(232,197,71,0.2)" },
  "internship": { bg: "rgba(100,149,237,0.1)", color: "#6495ed", border: "rgba(100,149,237,0.25)" },
  "contract": { bg: "rgba(200,120,80,0.1)", color: "#e07850", border: "rgba(200,120,80,0.25)" },
  "remote": { bg: "rgba(160,100,220,0.1)", color: "#b06ee0", border: "rgba(160,100,220,0.25)" },
};

const getTypeStyle = (type) => {
  const key = (type || "").toLowerCase();
  return typeColors[key] || { bg: "rgba(255,255,255,0.04)", color: "var(--text2)", border: "var(--border)" };
};

const initials = (company) => {
  if (!company) return "?";
  return company
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

const avatarColors = [
  "#e8c547", "#5cb87a", "#6495ed", "#e07850", "#b06ee0",
  "#e05252", "#4db6ac", "#f06292", "#aed581",
];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
};

const JobCard = ({ job, onView, onEdit, onDelete, index = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const typeStyle = getTypeStyle(job.type);
  const avatarColor = getAvatarColor(job.company);

  return (
    <div
      className="job-card animate-fade-up"
      style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
      onClick={() => { setMenuOpen(false); onView && onView(job); }}
    >
      <div style={{ padding: "20px 20px 16px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          {/* Avatar + company */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: avatarColor + "22",
                border: `1px solid ${avatarColor}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: avatarColor,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {initials(job.company)}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginBottom: 1 }}>
                {job.company || "Unknown Company"}
              </p>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text)",
                  lineHeight: 1.3,
                  fontFamily: "'Playfair Display', serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {job.title}
              </h2>
            </div>
          </div>

          {/* Menu */}
          <div style={{ position: "relative", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: 6,
                color: "var(--text3)",
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; }}
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  borderRadius: 10,
                  overflow: "hidden",
                  zIndex: 50,
                  minWidth: 140,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                {[
                  { label: "View details", icon: Eye, action: () => { setMenuOpen(false); onView && onView(job); }, color: "var(--text)" },
                  { label: "Edit", icon: Pencil, action: () => { setMenuOpen(false); onEdit && onEdit(job); }, color: "var(--text)" },
                  { label: "Delete", icon: Trash2, action: () => { setMenuOpen(false); onDelete && onDelete(job.id); }, color: "var(--red)" },
                ].map(({ label, icon: Icon, action, color }) => (
                  <button
                    key={label}
                    onClick={action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "10px 14px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color,
                      fontSize: 13,
                      textAlign: "left",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <p
            style={{
              marginTop: 12,
              fontSize: 13,
              color: "var(--text2)",
              lineHeight: 1.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {job.description}
          </p>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {job.type && (
              <span
                className="badge"
                style={{ background: typeStyle.bg, color: typeStyle.color, borderColor: typeStyle.border }}
              >
                {job.type}
              </span>
            )}
            {job.location && (
              <span className="badge badge-location" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={10} />
                {job.location}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {job.link && (
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: "var(--text3)", display: "flex", alignItems: "center" }}
                title="Apply"
              >
                <ExternalLink size={13} />
              </a>
            )}
            {job.date_posted && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                <Clock size={10} />
                {job.date_posted}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
