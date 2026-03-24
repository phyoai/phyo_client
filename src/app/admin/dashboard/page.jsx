"use client";
import { useState, useEffect } from "react";
import { influencerAPI, brandAPI } from "@/utils/api";
import { useRouter } from "next/navigation";

const TABS = ["Brands", "Influencers"];

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white inline-block"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Info Row Component with Glassmorphism
const InfoRow = ({ label, value, link = false }) => {
  if (!value || value === "N/A" || value === "") return null;

  return (
    <div className="group bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/60 hover:border-green-200/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="font-semibold text-gray-600 text-xs mb-1.5 uppercase tracking-wide">
        {label}
      </div>
      {link && typeof value === "string" && value.startsWith("http") ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 font-medium break-all underline decoration-2 underline-offset-2 transition-colors duration-200"
        >
          {value}
        </a>
      ) : (
        <div className="text-gray-800 font-medium break-words">{value || "N/A"}</div>
      )}
    </div>
  );
};

// Modal Component for Request Details with Glassmorphism
const RequestDetailsModal = ({ request, type, onClose, onApprove, onReject, loading }) => {
  if (!request) return null;

  const isBrand = type === "Brands";
  const isPending = request.status === "PENDING";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-white/20 animate-slideUp">
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 px-8 py-6">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isBrand ? "Brand" : "Influencer"} Request Details
            </h2>
            <p className="text-green-50 text-sm font-medium mt-1.5">
              Review and take action on this request
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 rounded-full w-9 h-9 flex items-center justify-center text-2xl font-light backdrop-blur-sm"
          >
            ×
          </button>
        </div>

        {/* Content - Scrollable with custom scrollbar */}
        <div 
          className="flex-1 overflow-y-auto px-8 py-6 space-y-5 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100" 
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {/* Status Badge */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</span>
                <span
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide shadow-md transition-all duration-300 ${
                    request.status === "APPROVED"
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-green-200"
                      : request.status === "REJECTED"
                      ? "bg-gradient-to-r from-red-400 to-rose-500 text-white hover:shadow-red-200"
                      : "bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 hover:shadow-yellow-200"
                  }`}
                >
                  {request.status}
                </span>
              </div>
              {request.reviewed_by && (
                <div className="text-right text-sm">
                  <p className="font-medium text-gray-500">Reviewed by</p>
                  <p className="text-green-600 font-semibold">{request.reviewed_by}</p>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200/50">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isBrand ? (
                <>
                  <InfoRow label="Company Name" value={request.company_name} />
                  <InfoRow
                    label="Contact Person"
                    value={`${request.contact?.first_name || ""} ${request.contact?.last_name || ""}`}
                  />
                  <InfoRow label="Email" value={request.contact?.email} />
                  <InfoRow label="Phone" value={request.contact?.phone} />
                  <InfoRow label="Job Title" value={request.contact?.job_title} />
                  <InfoRow label="Website" value={request.website_url} link />
                  <InfoRow label="Industry" value={request.industry} />
                  <InfoRow label="Company Type" value={request.company_type} />
                  <InfoRow label="Company Size" value={request.company_size} />
                  <InfoRow label="Location" value={request.location} />
                  <InfoRow label="Country" value={request.country} />
                  <InfoRow label="Subscription Plan" value={request.subscription_plan} />
                </>
              ) : (
                <>
                  <InfoRow label="Full Name" value={request.full_name} />
                  <InfoRow label="Stage Name" value={request.stage_name} />
                  <InfoRow label="Email" value={request.contact?.email} />
                  <InfoRow label="Phone" value={request.contact?.phone} />
                  <InfoRow label="Gender" value={request.gender} />
                  <InfoRow
                    label="Date of Birth"
                    value={
                      request.date_of_birth
                        ? new Date(request.date_of_birth).toLocaleDateString()
                        : "N/A"
                    }
                  />
                  <InfoRow label="Languages" value={request.languages_spoken?.join(", ")} />
                  <InfoRow label="Niches" value={request.niches?.join(", ")} />
                  <InfoRow
                    label="Location"
                    value={`${request.location?.city || ""}, ${request.location?.state || ""}, ${request.location?.country || ""}`}
                  />
                </>
              )}
            </div>
          </div>

          {/* Description/Bio */}
          {(isBrand ? request.company_description : request.bio) && (
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200/50">
                {isBrand ? "Company Description" : "Bio"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {isBrand ? request.company_description : request.bio}
              </p>
            </div>
          )}

          {/* Social Media */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200/50">
              Social Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {request.social_media?.instagram &&
                (isBrand
                  ? request.social_media.instagram
                  : request.social_media.instagram.username) && (
                  <InfoRow
                    label="Instagram"
                    value={
                      isBrand
                        ? request.social_media.instagram
                        : request.social_media.instagram.username
                    }
                    link={!isBrand}
                  />
                )}
              {request.social_media?.facebook &&
                (isBrand || request.social_media.facebook.profile_url) && (
                  <InfoRow
                    label="Facebook"
                    value={
                      isBrand
                        ? request.social_media.facebook
                        : request.social_media.facebook.profile_url
                    }
                    link
                  />
                )}
              {request.social_media?.twitter &&
                (isBrand || request.social_media.twitter.username) && (
                  <InfoRow
                    label="Twitter"
                    value={
                      isBrand
                        ? request.social_media.twitter
                        : request.social_media.twitter.username
                    }
                  />
                )}
              {request.social_media?.youtube &&
                (isBrand || request.social_media.youtube.channel_url) && (
                  <InfoRow
                    label="YouTube"
                    value={
                      isBrand
                        ? request.social_media.youtube
                        : request.social_media.youtube.channel_url
                    }
                    link
                  />
                )}
              {request.social_media?.tiktok &&
                (isBrand || request.social_media.tiktok.username) && (
                  <InfoRow
                    label="TikTok"
                    value={
                      isBrand
                        ? request.social_media.tiktok
                        : request.social_media.tiktok.username
                    }
                  />
                )}
            </div>
          </div>

          {/* Influencer Specific - Rate Card */}
          {!isBrand && request.rate_card && (
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200/50">
                Rate Card
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.rate_card.instagram_post && (
                  <InfoRow
                    label="Instagram Post"
                    value={`₹${request.rate_card.instagram_post}`}
                  />
                )}
                {request.rate_card.instagram_story && (
                  <InfoRow
                    label="Instagram Story"
                    value={`₹${request.rate_card.instagram_story}`}
                  />
                )}
                {request.rate_card.instagram_reel && (
                  <InfoRow
                    label="Instagram Reel"
                    value={`₹${request.rate_card.instagram_reel}`}
                  />
                )}
                {request.rate_card.youtube_video && (
                  <InfoRow
                    label="YouTube Video"
                    value={`₹${request.rate_card.youtube_video}`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Influencer Specific - Availability */}
          {!isBrand && request.availability && (
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200/50">
                Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="Current Status"
                  value={request.availability.current_availability}
                />
                <InfoRow
                  label="Monthly Capacity"
                  value={request.availability.monthly_campaign_capacity}
                />
                {request.availability.preferred_campaign_types?.length > 0 && (
                  <InfoRow
                    label="Preferred Campaign Types"
                    value={request.availability.preferred_campaign_types.join(", ")}
                  />
                )}
              </div>
            </div>
          )}

          {/* Brand Specific - Verification Documents */}
          {isBrand && request.verification_documents && (
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200/50">
                Verification Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                  label="Tax ID"
                  value={request.verification_documents.tax_id}
                />
                <InfoRow
                  label="Company Registration"
                  value={request.verification_documents.company_registration_number}
                />
                {request.verification_documents.business_registration && (
                  <InfoRow
                    label="Business Registration"
                    value={request.verification_documents.business_registration}
                    link
                  />
                )}
              </div>
            </div>
          )}

          {/* Images */}
          {((isBrand && request.company_logo) ||
            (!isBrand && request.profile_picture)) && (
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200/50">
                {isBrand ? "Company Logo" : "Profile Picture"}
              </h3>
              <img
                src={isBrand ? request.company_logo : request.profile_picture}
                alt={isBrand ? "Company Logo" : "Profile Picture"}
                className="max-w-xs rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              />
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <InfoRow
                label="Created At"
                value={new Date(request.createdAt || request.created_at).toLocaleString()}
              />
              <InfoRow
                label="Updated At"
                value={new Date(request.updatedAt || request.updated_at).toLocaleString()}
              />
              {request.reviewed_at && (
                <InfoRow
                  label="Reviewed At"
                  value={new Date(request.reviewed_at).toLocaleString()}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        {isPending && (
          <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200/50 px-8 py-5 flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner /> Processing...
                </>
              ) : (
                "Cancel"
              )}
            </button>
            <button
              onClick={() => onReject(request._id || request.id)}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner /> Processing...
                </>
              ) : (
                "Reject"
              )}
            </button>
            <button
              onClick={() => onApprove(request._id || request.id)}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner /> Processing...
                </>
              ) : (
                "Approve"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("Brands");
  const [brandRequests, setBrandRequests] = useState([]);
  const [influencerRequests, setInfluencerRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const fetchBrandRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await brandAPI.admin.getRequests();
      setBrandRequests(data.requests || data);
    } catch (err) {
      setError("Failed to fetch brand requests");
      console.error(err);
    }
    setLoading(false);
  };

  const fetchInfluencerRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await influencerAPI.admin.getRequests();
      setInfluencerRequests(data.requests || data);
    } catch (err) {
      setError("Failed to fetch influencer requests");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === "Brands") fetchBrandRequests();
    else fetchInfluencerRequests();
    // eslint-disable-next-line
  }, [tab]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      if (tab === "Brands") {
        await brandAPI.admin.approveRequest(id);
        fetchBrandRequests();
      } else {
        await influencerAPI.admin.approveRequest(id);
        fetchInfluencerRequests();
      }
      setSelectedRequest(null);
    } catch (err) {
      setError("Failed to approve request");
      console.error(err);
    }
    setActionLoading(false);
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      if (tab === "Brands") {
        await brandAPI.admin.rejectRequest(id);
        fetchBrandRequests();
      } else {
        await influencerAPI.admin.rejectRequest(id);
        fetchInfluencerRequests();
      }
      setSelectedRequest(null);
    } catch (err) {
      setError("Failed to reject request");
      console.error(err);
    }
    setActionLoading(false);
  };

  const handleLogout = () => {
    // Remove token from localStorage (adjust if you use cookies or a different key)
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.replace("/admin/login");
  };

  const requests = tab === "Brands" ? brandRequests : influencerRequests;

  // Get display name for request
  const getDisplayName = (req) => {
    if (tab === "Brands") {
      return req.company_name || "Unknown Company";
    } else {
      return req.full_name || req.stage_name || "Unknown Influencer";
    }
  };

  // Get display email for request
  const getDisplayEmail = (req) => {
    return req.contact?.email || req.email || "No email";
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
      {/* Header - Fixed with Glassmorphism */}
      <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white text-center md:text-left tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-green-50 text-center md:text-left mt-2 font-medium">
              Manage brand and influencer requests efficiently
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 md:mt-0 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 overflow-hidden flex flex-col p-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 flex flex-col h-full overflow-hidden">
          {/* Tabs - Glassmorphism */}
          <div className="flex border-b border-gray-200/30 bg-white/50 backdrop-blur-sm rounded-t-3xl">
            {TABS.map((t) => (
              <button
                key={t}
                className={`flex-1 px-6 py-4 font-bold text-lg focus:outline-none transition-all duration-300 ${
                  tab === t
                    ? "text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
                    : "text-gray-600 hover:bg-white/60 hover:text-green-600"
                } ${tab === t ? "rounded-tl-3xl" : ""} ${t === TABS[TABS.length - 1] && tab === t ? "rounded-tr-3xl" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Action Bar */}
          <div className="p-5 bg-white/40 backdrop-blur-sm border-b border-gray-200/30">
            <button
              onClick={tab === "Brands" ? fetchBrandRequests : fetchInfluencerRequests}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner /> Refreshing...
                </>
              ) : (
                "Refresh Requests"
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-3 text-red-600 font-semibold p-4 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-200/50 shadow-md">
                {error}
              </div>
            )}
          </div>

          {/* Requests List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100">
            {loading && requests.length === 0 ? (
              <div className="text-green-600 text-center py-16 text-xl font-semibold flex flex-col items-center gap-4">
                <LoadingSpinner />
                <span>Loading requests...</span>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-gray-500 text-center py-16 text-xl font-semibold">
                No requests found.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => {
                  const isPending = req.status === "PENDING";
                  const isApproved = req.status === "APPROVED";
                  const isRejected = req.status === "REJECTED";

                  return (
                    <div
                      key={req._id || req.id}
                      className={`group p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${
                        isPending
                          ? "bg-gradient-to-br from-amber-50/80 to-yellow-50/60 backdrop-blur-sm border border-amber-200/50 hover:border-amber-300"
                          : isApproved
                          ? "bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-sm border border-green-200/50 hover:border-green-300"
                          : "bg-gradient-to-br from-red-50/80 to-rose-50/60 backdrop-blur-sm border border-red-200/50 hover:border-red-300"
                      } shadow-md`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Request Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <div className="font-bold text-gray-800 text-xl">
                              {getDisplayName(req)}
                            </div>
                            <span
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${
                                isApproved
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                  : isRejected
                                  ? "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                                  : "bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                          <div className="text-gray-600 font-medium text-sm mb-1">
                            {getDisplayEmail(req)}
                          </div>
                          {tab === "Brands" && req.industry && (
                            <div className="text-gray-500 font-medium text-sm">
                              Industry: {req.industry}
                            </div>
                          )}
                          {tab === "Influencers" && req.niches && (
                            <div className="text-gray-500 font-medium text-sm">
                              Niches: {req.niches.join(", ")}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            View Details
                          </button>
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(req._id || req.id)}
                                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={actionLoading}
                              >
                                {actionLoading ? (
                                  <>
                                    <LoadingSpinner /> Processing...
                                  </>
                                ) : (
                                  "Approve"
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(req._id || req.id)}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={actionLoading}
                              >
                                {actionLoading ? (
                                  <>
                                    <LoadingSpinner /> Processing...
                                  </>
                                ) : (
                                  "Reject"
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          type={tab}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          loading={actionLoading}
        />
      )}

      {/* Add custom CSS for animations and scrollbar */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .scrollbar-thumb-green-300::-webkit-scrollbar-thumb {
          background-color: rgb(134 239 172);
          border-radius: 9999px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: rgb(243 244 246);
          border-radius: 9999px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgb(74 222 128);
        }
      `}</style>
    </div>
  );
}