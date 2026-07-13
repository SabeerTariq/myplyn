export function formatProposalDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  const diffDays = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function proposalStatusLabel(status) {
  if (status === 'PENDING') return 'Submitted';
  if (status === 'APPROVED') return 'Accepted';
  if (status === 'REJECTED') return 'Declined';
  return status;
}

export const PROPOSAL_TABS = [
  { key: 'all', label: 'All proposals' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Accepted' },
  { key: 'rejected', label: 'Declined' },
];

export function filterProposals(applications, { tab, search, campaignId }) {
  let items = applications;
  if (tab === 'pending') items = items.filter((a) => a.status === 'PENDING');
  if (tab === 'approved') items = items.filter((a) => a.status === 'APPROVED');
  if (tab === 'rejected') items = items.filter((a) => a.status === 'REJECTED');
  if (campaignId) items = items.filter((a) => a.campaignId === campaignId || a.campaign?.id === campaignId);

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    items = items.filter((a) => (
      a.campaign?.name?.toLowerCase().includes(q)
      || a.campaign?.advertiser?.companyName?.toLowerCase().includes(q)
      || a.page?.name?.toLowerCase().includes(q)
    ));
  }
  return items;
}

export function proposalTabCounts(applications) {
  return {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    approved: applications.filter((a) => a.status === 'APPROVED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
  };
}

export function formatBidDelta(proposedPrice, perPlacement) {
  const bid = Number(proposedPrice);
  const budget = Number(perPlacement);
  if (!budget || !bid) return null;

  const diff = bid - budget;
  const pct = Math.round((diff / budget) * 100);
  if (Math.abs(pct) < 3) return { label: 'On budget', tone: 'neutral' };
  if (diff < 0) return { label: `${Math.abs(pct)}% under budget`, tone: 'good' };
  return { label: `${pct}% over budget`, tone: 'warn' };
}
