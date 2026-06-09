'use client'
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Download, X, Clock } from 'lucide-react';
import apiClient from '@/utils/api';
import Button from '@/components/ui/Button';

/* ─── helpers ─────────────────────────────────────────────── */
const getId = (item) => item?._id || item?.id || '';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/* ─── status badge ─────────────────────────────────────────── */
const STATUS_STYLE = {
  pending:          'bg-[rgba(11,79,217,0.2)] border border-[#0b4fd9] text-white',
  accepted:         'bg-[rgba(22,163,74,0.2)] border border-[#16a34a] text-white',
  rejected:         'bg-[rgba(220,38,38,0.2)] border border-red-500 text-white',
  request_changes:  'bg-[rgba(217,119,6,0.2)] border border-amber-500 text-white',
};
const STATUS_LABEL = {
  pending:         'Pending Review',
  accepted:        'Approved',
  rejected:        'Rejected',
  request_changes: 'Changes Requested',
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  const l = STATUS_LABEL[status] || 'Pending';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${s}`}>
      {l}
    </span>
  );
}

/* ─── request-changes modal ────────────────────────────────── */
function RequestChangesModal({ onClose, onSubmit, loading }) {
  const [message, setMessage] = useState('');
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[600px] bg-[#181818] rounded-[24px] p-5 mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          className="text-white text-[24px] font-normal mb-4"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          Required Changes
        </h2>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Add changes brief here."
          className="w-full bg-[#272626] rounded-[12px] px-3 py-2.5 text-[14px] text-white placeholder:text-[#9b9b9b] outline-none resize-none transition-colors"
          style={{ fontFamily: 'Inter, sans-serif', height: '139px' }}
        />

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 h-[40px] rounded-full border border-white text-white text-[16px] hover:bg-white/10 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </button>
          <button
            disabled={!message.trim() || loading}
            onClick={() => onSubmit(message)}
            className="flex-1 h-[40px] rounded-full bg-white text-black text-[16px] hover:bg-white/90 transition-colors disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── deliverable card ─────────────────────────────────────── */
function DeliverableCard({ deliverable, onApprove, onReject, onRequestChanges, actionLoading }) {
  const status = deliverable.brandReview || deliverable.status || 'pending';
  const isPending = status === 'pending';
  const mediaUrl = deliverable.contentUrl || deliverable.mediaUrl || deliverable.image;
  const id = getId(deliverable);
  const caption = deliverable.caption || deliverable.description || deliverable.notes;

  return (
    <div className="bg-[#181818] rounded-[20px] border border-white/5 overflow-hidden">
      <div className="p-5">
        {/* Thumbnail + title + badge row */}
        <div className="flex items-center gap-4 mb-4">
          <div className="shrink-0 w-[60px] h-[60px] rounded-[8px] bg-[#252525] overflow-hidden relative">
            {mediaUrl ? (
              <img
                src={mediaUrl}
                alt={deliverable.title}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full bg-[#303030]" />
            )}
            {mediaUrl && (
              <a
                href={mediaUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
              >
                <Download className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[16px] leading-snug" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
              {deliverable.title || deliverable.type || 'Deliverable'}
            </p>
            <p className="text-[#9b9b9b] text-[14px] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              {deliverable.submittedAt ? `Submitted ${fmt(deliverable.submittedAt)}` : 'Not yet submitted'}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#767676]/40 mb-4" style={{ borderTopWidth: '0.5px' }} />

        {/* Caption */}
        {caption && (
          <div className="mb-4">
            <p className="text-white text-[16px] mb-1" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Caption</p>
            <p className="text-[#9b9b9b] text-[14px] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              {caption}
            </p>
          </div>
        )}

        {/* Review notes (after action) */}
        {deliverable.reviewNotes && (
          <div className="bg-[#16a34a]/10 border border-[#16a34a]/20 rounded-[12px] px-3 py-2.5 mb-4">
            <p className="text-[#9b9b9b] text-[10px] uppercase tracking-wider mb-1 font-medium">Review notes</p>
            <p className="text-[#16a34a] text-[13px]">{deliverable.reviewNotes}</p>
          </div>
        )}

        {/* Action buttons — only when pending */}
        {isPending && (
          <>
            <div className="border-t border-[#767676]/40 mb-4" style={{ borderTopWidth: '0.5px' }} />
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="md"
                disabled={actionLoading}
                onClick={() => onReject(id)}
              >
                Reject
              </Button>
              <Button
                variant="ghost"
                size="md"
                loading={actionLoading}
                onClick={() => onApprove(id)}
                className="bg-[rgba(255,255,255,0.08)] border-white/20"
              >
                Approve
              </Button>
              <button
                disabled={actionLoading}
                onClick={() => onRequestChanges(id)}
                className="inline-flex items-center justify-center rounded-full h-[40px] px-[24px] text-[16px] font-normal bg-white text-black hover:bg-white/90 transition-colors whitespace-nowrap disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Request Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── main page ────────────────────────────────────────────── */
export default function InfluencersDetailsWithDeliverable({ campaignId: propCampaignId, influencerId: propInfluencerId }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const campaignId = propCampaignId || searchParams.get('campaignId');
  const influencerId = propInfluencerId || searchParams.get('influencerId');

  const [deliverables, setDeliverables] = useState([]);
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingDeliverableId, setPendingDeliverableId] = useState(null);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesTargetId, setChangesTargetId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!campaignId) { setLoading(false); return; }
    fetchDeliverables();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  async function fetchDeliverables() {
    setLoading(true);
    try {
      const res = await apiClient.get(`/campaigns/${campaignId}/deliverables`, {
        params: influencerId ? { influencerId } : undefined,
      });
      const payload = res.data?.data;
      if (Array.isArray(payload)) {
        setDeliverables(payload);
      } else if (payload?.deliverables) {
        setDeliverables(payload.deliverables);
        if (payload.influencer) setInfluencer(payload.influencer);
      } else {
        setDeliverables(Array.isArray(res.data) ? res.data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  /* approve */
  async function handleApprove(deliverableId) {
    setActionLoading(true);
    setPendingDeliverableId(deliverableId);
    try {
      await apiClient.post(`/campaigns/${campaignId}/deliverables/${deliverableId}/approve`, {
        reviewNotes: 'Approved',
      });
      setDeliverables(prev =>
        prev.map(d => getId(d) === deliverableId ? { ...d, brandReview: 'accepted' } : d)
      );
      showToast('Deliverable approved!');
    } catch (e) {
      showToast(e?.response?.data?.message || 'Failed to approve', 'error');
    } finally {
      setActionLoading(false);
      setPendingDeliverableId(null);
    }
  }

  /* reject */
  async function handleReject(deliverableId) {
    setActionLoading(true);
    setPendingDeliverableId(deliverableId);
    try {
      await apiClient.post(`/campaigns/${campaignId}/deliverables/${deliverableId}/reject`, {
        rejectedReason: 'Does not meet requirements',
        reviewNotes: 'Rejected by brand',
      });
      setDeliverables(prev =>
        prev.map(d => getId(d) === deliverableId ? { ...d, brandReview: 'rejected' } : d)
      );
      showToast('Deliverable rejected.');
    } catch (e) {
      showToast(e?.response?.data?.message || 'Failed to reject', 'error');
    } finally {
      setActionLoading(false);
      setPendingDeliverableId(null);
    }
  }

  /* request changes */
  function openRequestChanges(deliverableId) {
    setChangesTargetId(deliverableId);
    setShowChangesModal(true);
  }

  async function handleSubmitChanges(message) {
    setActionLoading(true);
    try {
      await apiClient.patch(
        `/campaigns/${campaignId}/deliverables/${changesTargetId}/brand-review`,
        { brandReview: 'request_changes', message }
      );
      setDeliverables(prev =>
        prev.map(d => getId(d) === changesTargetId ? { ...d, brandReview: 'request_changes' } : d)
      );
      showToast('Change request sent.');
    } catch (e) {
      showToast(e?.response?.data?.message || 'Failed to send request', 'error');
    } finally {
      setActionLoading(false);
      setShowChangesModal(false);
      setChangesTargetId(null);
    }
  }

  /* ── no campaignId fallback ── */
  if (!campaignId) {
    return (
      <div className="bg-[#000201] min-h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#9b9b9b] text-[16px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            No campaign selected.
          </p>
          <Button variant="ghost" onClick={() => router.back()}>← Go Back</Button>
        </div>
      </div>
    );
  }

  const influencerName = influencer?.name || influencer?.username || 'Influencer';
  const pendingCount = deliverables.filter(d => (d.brandReview || d.status || 'pending') === 'pending').length;
  const approvedCount = deliverables.filter(d => (d.brandReview || d.status) === 'accepted').length;

  return (
    <div className="bg-[#000201] min-h-full px-6 py-6 w-full">

      {/* ── Back button row ── */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[#9b9b9b] hover:text-white transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>Back to Campaign</span>
      </button>

      {/* ── Influencer profile card ── */}
      <div className="bg-[#181818] rounded-[20px] border border-white/5 p-5 mb-6">
        {/* Top row: avatar + name + badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full bg-[#763d06] flex items-center justify-center text-white text-[24px] font-medium shrink-0" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {influencer?.profileImage
                ? <img src={influencer.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                : getInitials(influencerName)
              }
            </div>
            <div>
              <p className="text-white text-[16px]" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
                {influencerName} submitted deliverables
              </p>
              <p className="text-[#9b9b9b] text-[14px] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                {influencer?.platform || 'Content'} ready for review
              </p>
            </div>
          </div>
          <StatusBadge status={pendingCount > 0 ? 'pending' : 'accepted'} />
        </div>

        {/* Divider */}
        <div className="border-t border-[#767676]/40 mb-4" style={{ borderTopWidth: '0.5px' }} />

        {/* Stats row */}
        <div className="flex gap-6">
          <div>
            <p className="text-[#9b9b9b] text-[36px] leading-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{deliverables.length}</p>
            <p className="text-[#9b9b9b] text-[16px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Total Deliverables</p>
          </div>
          <div className="w-px bg-white/5" />
          <div>
            <p className="text-[#9b9b9b] text-[36px] leading-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{pendingCount}</p>
            <p className="text-[#9b9b9b] text-[16px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Pending Review</p>
          </div>
          <div className="w-px bg-white/5" />
          <div>
            <p className="text-[#9b9b9b] text-[36px] leading-none" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{approvedCount}</p>
            <p className="text-[#9b9b9b] text-[16px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Approved</p>
          </div>
        </div>
      </div>

      {/* ── Section label ── */}
      <p className="text-white text-[24px] mb-4" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
        Submitted Deliverables
      </p>

      {/* ── Deliverables list ── */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#181818] rounded-[20px] h-[220px] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : deliverables.length === 0 ? (
        <div className="bg-[#181818] rounded-[20px] border border-white/5 p-12 text-center">
          <Clock className="w-9 h-9 text-[#9b9b9b] mx-auto mb-3" />
          <p className="text-white text-[15px] font-medium mb-1">No deliverables yet</p>
          <p className="text-[#9b9b9b] text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            The influencer hasn't submitted any content yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliverables.map(d => (
            <DeliverableCard
              key={getId(d)}
              deliverable={d}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestChanges={openRequestChanges}
              actionLoading={actionLoading && pendingDeliverableId === getId(d)}
            />
          ))}
        </div>
      )}

      {/* ── Timeline section ── */}
      {deliverables.length > 0 && (
        <div className="bg-[#181818] rounded-[20px] border border-white/5 p-5 mt-4">
          <p className="text-white text-[24px] mb-4" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>Timeline</p>
          <div className="border-t border-[#767676]/40 mb-5" style={{ borderTopWidth: '0.5px' }} />
          <div className="relative flex gap-0">
            {/* Timeline items */}
            {[
              { label: 'Deliverable Submitted', sub: '2 hours ago' },
              { label: 'Counter offer sent', sub: '1 day ago' },
              { label: 'Influencer invited', sub: '3 days ago' },
            ].map((item, i, arr) => (
              <div key={i} className="flex-1 relative">
                {/* Connector line */}
                {i < arr.length - 1 && (
                  <div className="absolute top-[5px] left-1/2 w-full h-px bg-white/10" />
                )}
                {/* Dot */}
                <div className={`w-3 h-3 rounded-full mx-auto mb-3 relative z-10 ${i === 0 ? 'bg-[#16a34a]' : 'bg-white'}`} />
                <p className="text-white text-[20px] text-center" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>{item.label}</p>
                <p className="text-[#9b9b9b] text-[16px] text-center mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Request Changes Modal ── */}
      {showChangesModal && (
        <RequestChangesModal
          onClose={() => { setShowChangesModal(false); setChangesTargetId(null); }}
          onSubmit={handleSubmitChanges}
          loading={actionLoading}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-[14px] font-medium shadow-lg transition-all ${
          toast.type === 'error' ? 'bg-red-900/90 text-red-200' : 'bg-[#16a34a] text-white'
        }`} style={{ fontFamily: 'Inter, sans-serif' }}>
          {toast.msg}
        </div>
      )}

    </div>
  );
}
