import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  BellRing, 
  AlertTriangle, 
  Info, 
  Calendar, 
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { NotificationItem } from '../types';
import { requestAllNotificationPermissions } from '../services/nativeNotificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  readIds: string[];
  onMarkAllAsRead: () => void;
  onNavigate: (sectionId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  readIds,
  onMarkAllAsRead,
  onNavigate,
  onRefresh,
  isRefreshing = false
}) => {
  const [hasPushPermission, setHasPushPermission] = useState<boolean>(false);
  const [requestingPush, setRequestingPush] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPushPermission(Notification.permission === 'granted');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEnablePush = async () => {
    setRequestingPush(true);
    const granted = await requestAllNotificationPermissions();
    setHasPushPermission(granted);
    setRequestingPush(false);
  };

  const activeNotifications = notifications.filter(n => n.active);
  const unreadCount = activeNotifications.filter(n => !readIds.includes(n.id)).length;

  const getTypeBadge = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 bg-red-600/90 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <AlertTriangle className="w-3 h-3" />
            <span>तातडीचे / Urgent</span>
          </span>
        );
      case 'alert':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-red-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>महत्त्वाचे / Important</span>
          </span>
        );
      case 'event':
        return (
          <span className="inline-flex items-center gap-1 bg-orange-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            <Calendar className="w-3 h-3" />
            <span>उत्सव / Event</span>
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            <Info className="w-3 h-3" />
            <span>सूचना / Notice</span>
          </span>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Festival Notifications & Announcements"
    >
      <div 
        className="w-full max-w-2xl bg-gradient-to-b from-[#FEF7DA] via-[#FFFDF5] to-[#FEF7DA] rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 px-5 py-4 border-b-2 border-amber-400/60 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-red-950 flex items-center justify-center shadow-md flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-100 font-festive leading-none">
                  सूचना फलक / Announcements
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-amber-400 text-red-950 font-black text-[11px] px-2 py-0.5 rounded-full shadow">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-200/80 font-marathi">
                प्राइड युनिव्हर्सल गणेशोत्सव २०२६ थेट अद्यतने
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close Notifications Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Bar (Push Notifications & Mark All Read) */}
        <div className="bg-amber-100/70 border-b border-amber-200/80 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {!hasPushPermission ? (
              <button
                onClick={handleEnablePush}
                disabled={requestingPush}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-900 bg-white hover:bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs transition-transform active:scale-95"
              >
                <BellRing className="w-3.5 h-3.5 text-festival-saffron" />
                <span>{requestingPush ? 'Requesting...' : 'Enable Phone / Browser Alerts'}</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <CheckCheck className="w-3 h-3 text-emerald-700" />
                <span>Device Alerts Enabled</span>
              </span>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Fetch latest announcements from Google Sheet"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-950 bg-white hover:bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Sheet'}</span>
              </button>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-red-900 underline transition-colors ml-auto"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5">
          {activeNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">सध्या कोणतीही नवीन सूचना नाही.</p>
              <p className="text-xs text-slate-500">No new announcements at the moment.</p>
            </div>
          ) : (
            activeNotifications.map((item) => {
              const isUnread = !readIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isUnread
                      ? 'bg-amber-50/90 border-amber-400 shadow-md ring-1 ring-amber-300'
                      : 'bg-white/80 border-amber-200/70 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(item.type)}
                      <span className="text-[11px] font-semibold text-slate-500">
                        {item.date}
                      </span>
                    </div>
                    {isUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse flex-shrink-0 mt-1" title="New notice"></span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm sm:text-base text-red-950 font-festive mb-1 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-marathi whitespace-pre-line mb-3">
                    {item.message}
                  </p>

                  {item.linkText && item.linkSectionId && (
                    <button
                      onClick={() => {
                        onNavigate(item.linkSectionId!);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition-transform active:scale-95"
                    >
                      <span>{item.linkText}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FEF7DA] px-5 py-3 border-t border-amber-300/80 flex items-center justify-between text-xs text-slate-600">
          <span className="font-medium">
            ॥ गणपती बाप्पा मोरया ॥
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-800 to-red-950 text-amber-100 font-bold hover:brightness-110 transition-all shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

