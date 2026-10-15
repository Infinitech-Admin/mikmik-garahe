"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Eye,
  Film,
  Image as ImageIcon,
  Loader2,
  Play,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import type { ApiError } from "@/lib/api";
import {
  deleteSellTrade,
  fetchAdminSellTrades,
  updateSellTrade,
  type SellTradeRequest,
  type SellTradeStatus,
} from "@/lib/sell-trade-api";

/* -------------------------------------------------------------------------- */
/*  Media types                                                               */
/*  The admin list endpoint already returns `media` (with('media') in         */
/*  SellTradeRequestController::index), so no extra request is needed.        */
/* -------------------------------------------------------------------------- */

type MediaItem = {
  id?: number;
  type: string; // "image" | "video"
  path?: string;
  url?: string | null;
};

type AdminRequest = Omit<SellTradeRequest, "media"> & { media?: MediaItem[] };

type ViewableMedia = { type: "image" | "video"; url: string };

/** Media that has a usable URL, normalised to image/video. */
const getMedia = (item: AdminRequest): ViewableMedia[] =>
  (item.media ?? []).flatMap((m) =>
    m.url
      ? [
          {
            type: m.type === "video" ? ("video" as const) : ("image" as const),
            url: m.url,
          },
        ]
      : [],
  );

const STATUS_FILTERS: Array<"All" | SellTradeStatus> = [
  "All",
  "new",
  "contacted",
  "closed",
];

const STATUS_OPTIONS: SellTradeStatus[] = ["new", "contacted", "closed"];

const STATUS_STYLES: Record<SellTradeStatus, string> = {
  new: "bg-[#39FF14]/10 text-[#7CFF5B]",
  contacted: "bg-zinc-500/15 text-zinc-300",
  closed: "bg-zinc-500/15 text-zinc-400",
};

const STATUS_LABELS: Record<SellTradeStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

const formatPeso = (n: number) => `₱${n.toLocaleString()}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/* -------------------------------------------------------------------------- */
/*  Reusable dialog                                                           */
/* -------------------------------------------------------------------------- */

function Dialog({
  open,
  onClose,
  children,
  busy = false,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Kapag true, hindi ma-close ang dialog (hal. habang nagse-save o nagdedelete). */
  busy?: boolean;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-[#06030D]/70 backdrop-blur-sm"
        onClick={() => {
          if (!busy) onClose();
        }}
      />
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#06030D] p-6 shadow-2xl ${
          wide ? "max-w-lg" : "max-w-md"
        }`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* -------------------------------------------------------------------------- */
/*  Full-screen photo / video viewer                                          */
/* -------------------------------------------------------------------------- */

function MediaViewer({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: ViewableMedia[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const item = items[index];
  const count = items.length;

  useEffect(() => {
    // Capture phase + stopPropagation so Escape only closes the viewer,
    // not the detail dialog behind it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowLeft" && count > 1) {
        onIndex((index - 1 + count) % count);
      } else if (e.key === "ArrowRight" && count > 1) {
        onIndex((index + 1) % count);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [index, count, onIndex, onClose]);

  if (!item) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      <button
        type="button"
        aria-label="Close viewer"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/90"
      />

      <div className="relative z-10 flex items-center justify-center">
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.url}
            src={item.url}
            alt=""
            className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain"
          />
        ) : (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] max-w-[92vw] rounded-lg bg-black"
          />
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/10"
      >
        <X size={18} />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => onIndex((index - 1 + count) % count)}
            aria-label="Previous"
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/10 sm:left-5"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => onIndex((index + 1) % count)}
            aria-label="Next"
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/10 sm:right-5"
          >
            <ChevronRight size={20} />
          </button>
          <p className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-zinc-300">
            {index + 1} / {count}
          </p>
        </>
      )}
    </div>,
    document.body,
  );
}

/* -------------------------------------------------------------------------- */
/*  Thumbnails + counts                                                       */
/* -------------------------------------------------------------------------- */

function MediaThumb({
  item,
  label,
  onOpen,
}: {
  item: ViewableMedia;
  label: string;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-colors hover:border-[#39FF14]/50"
    >
      {failed ? (
        <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-[10px] text-zinc-500">
          <ImageIcon size={16} />
          Can&apos;t load
        </span>
      ) : item.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <>
          <video
            src={`${item.url}#t=0.1`}
            preload="metadata"
            muted
            playsInline
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white">
              <Play size={16} className="ml-0.5" />
            </span>
          </span>
        </>
      )}
    </button>
  );
}

function MediaCount({ item }: { item: AdminRequest }) {
  const all = item.media ?? [];
  if (all.length === 0) return null;

  const videos = all.filter((m) => m.type === "video").length;
  const photos = all.length - videos;

  return (
    <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-500">
      {photos > 0 && (
        <span className="inline-flex items-center gap-1">
          <ImageIcon size={12} />
          {photos}
        </span>
      )}
      {videos > 0 && (
        <span className="inline-flex items-center gap-1">
          <Film size={12} />
          {videos}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Row action icons (always visible)                                         */
/* -------------------------------------------------------------------------- */

function RowActions({
  item,
  onView,
  onDelete,
}: {
  item: AdminRequest;
  onView: (i: AdminRequest) => void;
  onDelete: (i: AdminRequest) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onView(item)}
        title="View"
        aria-label={`View request from ${item.full_name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:border-[#39FF14]/50 hover:bg-[#39FF14]/10 hover:text-[#7CFF5B]"
      >
        <Eye size={14} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(item)}
        title="Delete"
        aria-label={`Delete request from ${item.full_name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:border-[#39FF14]/50 hover:bg-[#39FF14]/10 hover:text-[#7CFF5B]"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function SellTradeClient() {
  const [items, setItems] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | SellTradeStatus>(
    "All",
  );
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail dialog state
  const [selected, setSelected] = useState<AdminRequest | null>(null);
  const [statusDraft, setStatusDraft] = useState<SellTradeStatus>("new");
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Photo / video viewer (index into the selected request's media)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<AdminRequest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAdminSellTrades({
        page,
        perPage: 15,
        search,
        status: statusFilter === "All" ? "" : statusFilter,
      });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch (err) {
      setError((err as ApiError).message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  /* ------------------------------ Detail dialog ----------------------------- */

  const detailMedia = selected ? getMedia(selected) : [];
  const missingUrls =
    !!selected && (selected.media?.length ?? 0) > 0 && detailMedia.length === 0;

  const openDetail = (item: AdminRequest) => {
    setSaveError("");
    setViewerIndex(null);
    setStatusDraft(item.status);
    setNotesDraft(item.notes ?? "");
    setSelected(item);
  };

  const closeDetail = useCallback(() => {
    setSelected(null);
    setViewerIndex(null);
    setSaveError("");
  }, []);

  const closeViewer = useCallback(() => setViewerIndex(null), []);

  const hasChanges =
    !!selected &&
    (statusDraft !== selected.status || notesDraft !== (selected.notes ?? ""));

  async function saveChanges() {
    if (!selected) return;
    setSaving(true);
    setSaveError("");
    try {
      const updated = await updateSellTrade(selected.id, {
        status: statusDraft,
        notes: notesDraft,
      });
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setSelected(null);
      setViewerIndex(null);
    } catch (err) {
      setSaveError((err as ApiError).message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  /* ----------------------------- Delete dialog ------------------------------ */

  const openDeleteDialog = (item: AdminRequest) => {
    setDeleteError("");
    setDeleteTarget(item);
  };

  const closeDeleteDialog = useCallback(() => {
    setDeleteTarget(null);
    setDeleteError("");
  }, []);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteSellTrade(deleteTarget.id);
      setDeleteTarget(null);
      setSelected(null);
      setViewerIndex(null);

      if (items.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        load();
      }
    } catch (err) {
      setDeleteError((err as ApiError).message || "Failed to delete request.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          Sell / Trade
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Review vehicle submissions from customers and follow up on leads.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, contact, brand or model..."
            className="w-full rounded-xl border border-white/10 bg-[#0E0818]/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#39FF14]/60"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal
            size={15}
            className="hidden shrink-0 text-zinc-500 sm:block"
          />
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? "bg-[#39FF14]/15 text-[#7CFF5B]"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-[#39FF14]/30 bg-[#39FF14]/10 px-4 py-3 text-sm text-[#7CFF5B]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#0E0818]/70 py-16 text-sm text-zinc-400">
          <Loader2 size={18} className="mr-2 animate-spin text-[#7CFF5B]" />
          Loading requests...
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-500">
            {total} request{total !== 1 ? "s" : ""} found
          </p>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-[#0E0818]/70 lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Mileage</th>
                  <th className="px-5 py-3 font-medium">Estimate</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr
                    key={i.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{i.full_name}</p>
                      <p className="text-xs text-zinc-500">
                        {i.phone || i.email}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#39FF14]/15 text-[#7CFF5B]">
                          <CarFront size={16} />
                        </span>
                        <div>
                          <p className="font-medium text-white">
                            {i.brand} {i.model}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {i.year} · {i.type} · {i.condition}
                          </p>
                          <MediaCount item={i} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-zinc-400">
                      {i.mileage.toLocaleString()} km
                    </td>
                    <td className="px-5 py-3 text-white">
                      {formatPeso(i.estimate)}
                    </td>
                    <td className="px-5 py-3 text-zinc-400">
                      {formatDate(i.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[i.status]}`}
                      >
                        {STATUS_LABELS[i.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <RowActions
                        item={i}
                        onView={openDetail}
                        onDelete={openDeleteDialog}
                      />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-zinc-500"
                    >
                      No requests match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {items.map((i) => (
              <div
                key={i.id}
                className="rounded-2xl border border-white/10 bg-[#0E0818]/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#39FF14]/15 text-[#7CFF5B]">
                      <CarFront size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {i.brand} {i.model}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {i.type} · {i.year}
                      </p>
                      <MediaCount item={i} />
                    </div>
                  </div>
                  <RowActions
                    item={i}
                    onView={openDetail}
                    onDelete={openDeleteDialog}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">
                    {formatPeso(i.estimate)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[i.status]}`}
                  >
                    {STATUS_LABELS[i.status]}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                  <span>{i.full_name}</span>
                  <span>{formatDate(i.created_at)}</span>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full rounded-2xl border border-white/10 bg-[#0E0818]/70 py-10 text-center text-sm text-zinc-500">
                No requests match your search.
              </div>
            )}
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <p>
                Page {page} of {lastPage}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  type="button"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail dialog */}
      {mounted && (
        <Dialog
          open={!!selected}
          onClose={closeDetail}
          busy={saving || viewerIndex !== null}
          wide
        >
          {selected && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7CFF5B]">
                Request #{selected.id}
              </p>
              <h2 className="mt-1 text-lg font-bold text-white">
                {selected.full_name}
              </h2>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div>
                  <dt className="text-xs text-zinc-500">Phone</dt>
                  <dd className="mt-1 text-white">{selected.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Email</dt>
                  <dd className="mt-1 break-all text-white">
                    {selected.email || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Vehicle</dt>
                  <dd className="mt-1 text-white">
                    {selected.year} {selected.brand} {selected.model}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Type</dt>
                  <dd className="mt-1 text-white">{selected.type}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Mileage</dt>
                  <dd className="mt-1 text-white">
                    {selected.mileage.toLocaleString()} km
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Condition</dt>
                  <dd className="mt-1 text-white">{selected.condition}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-zinc-500">Customer estimate</dt>
                  <dd className="mt-1 text-2xl font-bold text-[#7CFF5B]">
                    {formatPeso(selected.estimate)}
                  </dd>
                </div>
              </dl>

              {/* Photos & videos */}
              <div className="mt-5">
                <p className="text-xs text-zinc-500">
                  Photos &amp; videos
                  {detailMedia.length > 0 ? ` (${detailMedia.length})` : ""}
                </p>

                {detailMedia.length > 0 ? (
                  <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {detailMedia.map((m, idx) => (
                      <li key={`${m.url}-${idx}`}>
                        <MediaThumb
                          item={m}
                          label={`Open ${m.type} ${idx + 1} of ${detailMedia.length}`}
                          onOpen={() => setViewerIndex(idx)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : missingUrls ? (
                  <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-5 text-zinc-400">
                    Files were uploaded, but the API didn&apos;t return their
                    URLs. Check that the SellTradeMedia model appends the{" "}
                    <code className="text-zinc-300">url</code> attribute.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-zinc-500">
                    The customer didn&apos;t attach any photos or videos.
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="sell-trade-status"
                  className="text-xs text-zinc-500"
                >
                  Status
                </label>
                <select
                  id="sell-trade-status"
                  value={statusDraft}
                  onChange={(e) =>
                    setStatusDraft(e.target.value as SellTradeStatus)
                  }
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0E0818]/70 px-4 py-2.5 text-sm text-white outline-none focus:border-[#39FF14]/60"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="sell-trade-notes"
                  className="text-xs text-zinc-500"
                >
                  Internal notes
                </label>
                <textarea
                  id="sell-trade-notes"
                  rows={4}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  disabled={saving}
                  placeholder="Add notes about this lead..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0E0818]/70 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#39FF14]/60"
                />
              </div>

              {saveError && (
                <div className="mt-4 rounded-xl border border-[#39FF14]/30 bg-[#39FF14]/10 px-4 py-3 text-sm text-[#7CFF5B]">
                  {saveError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => openDeleteDialog(selected)}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-full border border-[#39FF14]/30 px-5 py-2.5 text-sm font-medium text-[#7CFF5B] transition-colors hover:bg-[#39FF14]/10 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>

                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeDetail}
                    disabled={saving}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={saveChanges}
                    disabled={saving || !hasChanges}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#39FF14] to-[#7CFF5B] px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </Dialog>
      )}

      {/* Photo / video viewer */}
      {mounted &&
        selected &&
        viewerIndex !== null &&
        detailMedia[viewerIndex] && (
          <MediaViewer
            items={detailMedia}
            index={viewerIndex}
            onIndex={setViewerIndex}
            onClose={closeViewer}
          />
        )}

      {/* Delete confirmation dialog */}
      {mounted && (
        <Dialog
          open={!!deleteTarget}
          onClose={closeDeleteDialog}
          busy={deleting}
        >
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#39FF14]/10 text-[#7CFF5B]">
              <AlertTriangle size={20} />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white">Delete request?</h2>
              <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                You’re about to delete the request from{" "}
                <span className="font-semibold text-white">
                  {deleteTarget?.full_name}
                </span>
                . Its uploaded photos and videos will be deleted too. This
                action can’t be undone.
              </p>
            </div>
          </div>

          {deleteError && (
            <div className="mt-4 rounded-xl border border-[#39FF14]/30 bg-[#39FF14]/10 px-4 py-3 text-sm text-[#7CFF5B]">
              {deleteError}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDeleteDialog}
              disabled={deleting}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-2 rounded-full bg-[#39FF14] px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#39FF14] disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Delete
                </>
              )}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
