'use client';

import { useState } from "react";
import { YoutubeFill, InstagramFill, TwitterXLine } from '@phyoofficial/phyo-icon-library';
import { ShieldCheckLine, ExternalLinkLine, GlobeLine, ArrowLeftLine, MoreLine } from '@phyoofficial/phyo-icon-library';

const SOCIALS = [
  { platform: "Youtube",   icon: <YoutubeFill size={18} /> },
  { platform: "Instagram", icon: <InstagramFill size={18} /> },
  { platform: "Twitter X", icon: <TwitterXLine size={18} /> },
  { platform: "Website",   icon: <GlobeLine size={18} /> },
];

const LATEST_CAMPAIGNS = [
  { id: 1, title: "Outdoor Adventure", subtitle: "Hiking Essentials", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80" },
  { id: 2, title: "Healthy Living",    subtitle: "Meal Prep Kits",    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80" },
];

const PREVIOUS_CAMPAIGNS = [
  { id: 3, title: "Eco-Friendly Living", subtitle: "Sustainable Products", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80" },
  { id: 4, title: "Urban Style",         subtitle: "City Fashion Week",    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" },
];

function CampaignCard({ title, subtitle, img }) {
  return (
    <div style={{
      display: "flex",
      height: 210,
      padding: "16px 0",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 0,
      alignSelf: "stretch",
      position: "relative",
      borderRadius: 14,
      overflow: "hidden",
      background: "#1a1a1a",
      cursor: "pointer",
      boxSizing: "border-box",
    }}>
      {/* Background image */}
      <img src={img} alt={title} style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        objectFit: "cover",
        opacity: 0.65,
      }} />
      {/* Text overlay */}
      <div style={{
        position: "absolute", inset: 0,
        padding: "16px",
        display: "flex", alignItems: "flex-start", gap: 12,
        background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
      }}>
        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#4a6cf7",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          fontSize: 13, fontWeight: 700, color: "#fff",
          border: "2px solid rgba(255,255,255,0.3)",
        }}>
          AC
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{title}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function CampaignsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Latest */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 10px", paddingLeft: 2 }}>
          Latest campaigns
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LATEST_CAMPAIGNS.map(c => <CampaignCard key={c.id} {...c} />)}
        </div>
      </div>
      {/* Previous */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 10px", paddingLeft: 2 }}>
          Previous Campaigns
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PREVIOUS_CAMPAIGNS.map(c => <CampaignCard key={c.id} {...c} />)}
        </div>
      </div>
    </div>
  );
}

export default function BrandProfile() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <>
      {/* ── TOP NAV ── */}
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
          <ArrowLeftLine size={22} className="text-gray-950" />
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <MoreLine size={22} className="text-gray-950" />
        </button>
      </div>

      {/* ── PAGE WRAPPER ── */}
      <div style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        background: "linear-gradient(180deg, #c8d9be 0%, #d4e2ca 35%, #ddebd4 65%, #eaf2e5 100%)",
        minHeight: "100vh",
        maxWidth: 830,
        margin: "0 auto",
        overflowX: "hidden",
        position: "relative",
        paddingTop: 48,
      }}>

        {/* ── HERO SECTION ── */}
        <div style={{
          position: "relative",
          paddingBottom: 28,
          paddingTop: 14,
        }}>

          {/* Large "AB" initials — fixed, fades out toward bottom */}
          <div style={{
            position: "fixed",
            top: "8%",
            left: "50%",
            transform: "translateX(-45%)",
            fontSize: 200,
            fontWeight: 900,
            color: "#3a5033",
            letterSpacing: -8,
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.12) 65%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.12) 65%, transparent 100%)",
            userSelect: "none",
            pointerEvents: "none",
            lineHeight: 0.9,
            zIndex: 0,
          }}>
            AB
          </div>

          {/* Spacer so brand name sits below AB */}
          <div style={{ height: 160 }} />

          {/* Fade gradient — green to white, behind brand info */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 170,
            background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.3) 75%, transparent 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }} />

          {/* Brand name · tagline · pills */}
          <div style={{ padding: "0 20px", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h1 style={{
                fontSize: 28, fontWeight: 900, color: "#111",
                margin: 0, letterSpacing: "-0.03em",
              }}>
                Lenskart
              </h1>
              <span style={{ width: 22, height: 22, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#43573b" }}>
                <ShieldCheckLine size={22} />
              </span>
            </div>
            <p style={{ fontSize: 15, color: "#4b5563", margin: "0 0 14px", lineHeight: 1.5 }}>
              Creating beautiful sunglasses for modern living
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Lifestyle", "Fashion"].map((cat, i) => (
                <span key={i} style={{
                  padding: "5px 16px",
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(67,87,59,0.3)",
                  borderRadius: 20,
                  fontSize: 13, color: "#374151", fontWeight: 500,
                }}>{cat}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{
          display: "flex",
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
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

        {/* ── CONTENT ── */}
        <div style={{
          background: "#fff",
          minHeight: "60vh",
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
                  <span style={{ width: 20, height: 20, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                    <ExternalLinkLine size={20} />
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
                  Um, I'm happy you're home. You're an idiot, Steve Harrington. You're beautiful, Nancy Wheeler. You're right. You are a freak.... Who would you rather be friends with: Bowie or Kenny Rogers? Why's he gotta kick the door? Why do we even need weapons anyway? We have her. Friends don't lie. It's about the shadow monster, isn't it? You're an idiot, Steve Harrington. You're beautiful, Nancy Wheeler. Nobody normal ever accomplished anything meaningful...
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
                      flexShrink: 0,
                      overflow: "hidden",
                    }}>
                      <span style={{ width: 15, height: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                        <ExternalLinkLine size={15} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "campaigns" && (
            <CampaignsTab />
          )}
        </div>
      </div>
    </>
  );
}
