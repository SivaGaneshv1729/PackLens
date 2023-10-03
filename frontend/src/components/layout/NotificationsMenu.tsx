import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, FileCheck2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getReadNotificationIds, listNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/mockNotificationApi";

export default function NotificationsMenu() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => getReadNotificationIds());
  const notifications = useMemo(() => listNotifications(), [open]);
  const unreadCount = notifications.filter((notification) => !readIds.includes(notification.id)).length;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openNotification = (notificationId: string, analysisId: string) => {
    setReadIds(markNotificationRead(notificationId));
    setOpen(false);
    navigate(`/results/${analysisId}`);
  };

  const markAllRead = () => {
    setReadIds(markAllNotificationsRead(notifications.map((notification) => notification.id)));
    toast.success("Notifications marked as read");
  };

  return (
    <div ref={containerRef} className="relative">
      <button data-testid="notifications-button" type="button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={open} onClick={() => setOpen((current) => !current)} className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
        <Bell className="size-[18px]" />
        {unreadCount > 0 && <span data-testid="notification-unread-indicator" className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold leading-4 text-white">{unreadCount}</span>}
      </button>

      {open && <div data-testid="notifications-panel" className="fixed left-4 right-4 top-20 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.18)] md:absolute md:left-auto md:right-0 md:top-12 md:w-[380px]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><h2 data-testid="notifications-title" className="font-heading text-sm font-semibold text-slate-900">Notifications</h2><p data-testid="notifications-unread-count" className="mt-0.5 text-[11px] text-slate-500">{unreadCount ? `${unreadCount} unread updates` : "You're all caught up"}</p></div><button data-testid="notifications-mark-all-button" type="button" onClick={markAllRead} disabled={!unreadCount} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-300"><CheckCheck className="size-3.5" />Mark all read</button></div>
        <div className="max-h-[390px] overflow-y-auto">
          {notifications.length ? notifications.map((notification) => {
            const unread = !readIds.includes(notification.id);
            return <button data-testid={`notification-item-${notification.analysisId}`} key={notification.id} type="button" onClick={() => openNotification(notification.id, notification.analysisId)} className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3.5 text-left last:border-b-0 hover:bg-slate-50 ${unread ? "bg-blue-50/50" : ""}`}><span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${unread ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}><FileCheck2 className="size-4" /></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><span className="truncate text-sm font-semibold text-slate-800">{notification.title}</span>{unread && <span className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" />}</span><span className="mt-1 block text-xs text-slate-500">{notification.description}</span><span className="mt-2 flex items-center justify-between gap-2"><StatusBadge status={notification.status} testId={`notification-status-${notification.analysisId}`} /><span className="text-[10px] text-slate-400">{new Date(notification.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span></span></span></button>;
          }) : <div data-testid="notifications-empty-state" className="px-5 py-10 text-center"><Bell className="mx-auto size-6 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No notifications yet</p><p className="mt-1 text-xs text-slate-500">Completed screenings will appear here.</p></div>}
        </div>
        <button data-testid="notifications-view-all-button" type="button" onClick={() => { setOpen(false); navigate("/results"); }} className="w-full border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-center text-xs font-semibold text-blue-600 hover:bg-slate-100">View all results</button>
      </div>}
    </div>
  );
}