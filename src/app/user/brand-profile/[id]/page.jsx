'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { YoutubeFill, InstagramFill, TwitterXLine } from '@phyoofficial/phyo-icon-library';
import { ShieldCheckLine, ExternalLinkLine, GlobeLine, ArrowLeftLine, MoreLine } from '@phyoofficial/phyo-icon-library';

const SOCIAL_ICONS = {
  "Youtube": YoutubeFill,
  "Instagram": InstagramFill,
  "Twitter": TwitterXLine,
  "Website": GlobeLine,
};

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

function CampaignsTab({ campaigns = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {campaigns.length === 0 ? (
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>No campaigns available</p>
      ) : (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: "0 0 10px", paddingLeft: 2 }}>
            All campaigns
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {campaigns.map(c => (
              <CampaignCard
                key={c._id}
                title={c.title}
                subtitle={c.description}
                img={c.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrandProfile() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const [brand, setBrand] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        const brandId = params.id;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

        // Fetch brand profile
        const brandRes = await fetch(`${API_URL}/brand/${brandId}`);
        if (!brandRes.ok) throw new Error("Failed to fetch brand");
        const brandData = await brandRes.json();
        setBrand(brandData.data || brandData);

        // Fetch brand campaigns
        const campaignsRes = await fetch(`${API_URL}/brand/${brandId}/campaigns`);
        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json();
          setCampaigns(Array.isArray(campaignsData) ? campaignsData : campaignsData.data || []);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching brand:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBrandData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontSize: 16, color: "#6b7280" }}>
        Loading brand profile...
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontSize: 16, color: "#dc2626" }}>
        {error ? `Error: ${error}` : "Brand not found"}
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "BR";
  };

  const categories = brand.categories || brand.industry ? [brand.industry] : [];

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
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} onClick={() => window.history.back()}>
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

          {/* Large initials — fixed, fades out toward bottom */}
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
            {getInitials(brand.brandName || brand.name)}
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
                {brand.brandName || brand.name}
              </h1>
              {brand.verified && (
                <span style={{ width: 22, height: 22, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#43573b" }}>
                  <ShieldCheckLine size={22} />
                </span>
              )}
            </div>
            <p style={{ fontSize: 15, color: "#4b5563", margin: "0 0 14px", lineHeight: 1.5 }}>
              {brand.tagline || brand.description}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((cat, i) => (
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
              {brand.about || brand.description && (
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
                    {brand.about || brand.description}
                  </p>
                </div>
              )}

              {/* Socials label */}
              {brand.socialLinks && Object.keys(brand.socialLinks).length > 0 && (
                <>
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
                    {Object.entries(brand.socialLinks).map(([platform, url], i, arr) => {
                      const entries = Object.entries(brand.socialLinks);
                      return (
                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "14px 16px",
                          borderBottom: i < entries.length - 1 ? "1px solid #f0f0f0" : "none",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{
                              width: 38, height: 38,
                              background: "#111",
                              borderRadius: 10,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                              color: "white",
                              fontSize: 18,
                            }}>
                              {platform === "instagram" && <InstagramFill size={18} />}
                              {platform === "youtube" && <YoutubeFill size={18} />}
                              {platform === "twitter" && <TwitterXLine size={18} />}
                              {platform === "website" && <GlobeLine size={18} />}
                            </div>
                            <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
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
                        </a>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "campaigns" && (
            <CampaignsTab campaigns={campaigns} />
          )}
        </div>
      </div>
    </>
  );
}
