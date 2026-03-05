'use client';

import { useState, useEffect, useRef } from "react";
import { YoutubeFill, InstagramFill, TwitterXLine } from '@phyoofficial/phyo-icon-library';
import { ShieldCheck, ExternalLink, Globe, ArrowLeft, MoreVertical } from 'lucide-react';

const SOCIALS = [
  { platform: "Youtube",   icon: <YoutubeFill size={18} /> },
  { platform: "Instagram", icon: <InstagramFill size={18} /> },
  { platform: "Twitter",   icon: <TwitterXLine size={18} /> },
  { platform: "Website",   icon: <Globe size={18} /> },
];

export default function BrandProfile() {
  const [activeTab, setActiveTab] = useState("info");
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Calculate opacity (0 at start, 1 after scrolling 100px)
  const contentOpacity = Math.min(1, scrollY / 100);
  const contentZIndex = scrollY > 50 ? 20 : 1;

  return (
    <>
      {/* ══════════════════════════════════
          TOP NAV — Back + More (Fixed at top)
      ══════════════════════════════════ */}
      <div style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        padding: "8px 4px",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
        width: "100%",
        maxWidth: 830,
        boxSizing: "border-box",
      }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <ArrowLeft size={22} className="text-gray-950" />
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <MoreVertical size={22} className="text-gray-950" />
        </button>
      </div>
    
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "linear-gradient(180deg, #cfdfc6 0%, #d8e8cf 40%, #e2eedd 100%)",
      minHeight: "100vh",
      maxWidth: 830,
      margin: "0 auto",
      overflowX: "hidden",
      position: "relative",
      paddingTop: 48,
    }}>

    

      {/* ══════════════════════════════════
          HERO SECTION — green bg with AB
      ══════════════════════════════════ */}
      <div style={{
        background: "transparent",
        position: "relative",
        paddingBottom: 28,
        zIndex: 1,
        paddingTop: 14,
      }}>

        {/* AB — fixed on screen, always visible while scrolling */}
        <div style={{
          position: "fixed",
          top: "8%",
          left: "50%",
          transform: "translateX(-45%)",
          fontSize: 200,
          fontWeight: 900,
          color: "#43573b",
          letterSpacing: -8,
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.15) 65%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.15) 65%, transparent 100%)",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 0.9,
          zIndex: 0,
        }}>
          AB
        </div>
        {/* spacer so brand name sits below AB in hero */}
        <div style={{ height: 160 }} />

        {/* White fade — starts from Lenskart text upward */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 160,
          background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.3) 70%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }} />

        {/* Brand name, tagline, pills — overlaps bottom of AB */}
        <div style={{ padding: "0 20px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{
              fontSize: 28, fontWeight: 900, color: "#111",
              margin: 0, letterSpacing: "-0.03em",
            }}>
              Lenskart
            </h1>
            <ShieldCheck size={22} className="text-[#43573b] flex-shrink-0" />
          </div>
          <p style={{ fontSize: 15, color: "#4b5563", margin: "0 0 14px", lineHeight: 1.5 }}>
            Creating beautiful sunglasses for modern living
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {["Lifestyle", "Fashion"].map((cat, i) => (
              <span key={i} style={{
                padding: "5px 16px",
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(67,87,59,0.3)",
                borderRadius: 20,
                fontSize: 13, color: "#374151", fontWeight: 500,
              }}>{cat}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          TABS
      ══════════════════════════════════ */}
      <div style={{
        display: "flex",
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
      }}>
        {["info", "campaigns"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "16px 0",
            background: "transparent", border: "none",
            borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent",
            fontSize: 15,
            fontWeight: activeTab === tab ? 700 : 500,
            color: activeTab === tab ? "#111" : "#6b7280",
            cursor: "pointer", transition: "all 0.15s",
            marginBottom: -1,
          }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════
          CONTENT
      ══════════════════════════════════ */}
      <div style={{
        background: "#fff",
        minHeight: "100vh",
        padding: "14px 12px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>

        {activeTab === "info" && (
          <>
            {/* About card */}
            <div style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              padding: "18px 18px 20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111", margin: 0 }}>About</h3>
                <ExternalLink size={20} className="text-gray-600" />
              </div>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
                Um, I'm happy you're home. You're an idiot, Steve Harrington. You're beautiful, Nancy Wheeler. You're right. You are a freak.... Who would you rather be friends with: Bowie or Kenny Rogers? Why's he gotta kick the door? Why do we even need weapons anyway? We have her. Friends don't lie.
              </p>
            </div>

            {/* Socials label */}
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "2px 0 0", paddingLeft: 2 }}>
              Socials
            </h3>

            {/* Socials list */}
            <div style={{
              display: "flex", flexDirection: "column",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              overflow: "hidden",
              background: "#fff",
            }}>
              {SOCIALS.map((s, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px",
                  borderBottom: i < SOCIALS.length - 1 ? "1px solid #f0f0f0" : "none",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 38, height: 38,
                      background: "#111",
                      borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      color: "white",
                    }}>
                      {s.icon}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{s.platform}</span>
                  </div>
                  <div style={{
                    width: 34, height: 34,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#fafafa",
                  }}>
                    <ExternalLink size={15} className="text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "campaigns" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#9ca3af", marginBottom: 16, fontSize: 14 }}>
              Campaigns will be displayed here
            </p>
            <button style={{
              background: "#43573b", color: "#fff",
              padding: "10px 24px", borderRadius: 20,
              border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              View All Campaigns
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
