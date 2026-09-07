"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCheck,
  Filter,
  ExternalLink,
  Clock,
  Trash2,
} from "lucide-react";
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToStore,
} from "@/lib/store";
import { CustomerNotification } from "@/lib/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "QUOTE" | "PAYMENT" | "SHIPMENT" | "SECURITY">("ALL");

  useEffect(() => {
    setNotifications(getStoredNotifications());
    const unsub = subscribeToStore(() => {
      setNotifications(getStoredNotifications());
    });
    return unsub;
  }, []);

  const handleMarkRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  };

  const filtered = notifications.filter((n) => {
    if (categoryFilter === "ALL") return true;
    return n.type === categoryFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: CustomerNotification["type"]) => {
    switch (type) {
      case "QUOTE":
        return <FileText className="w-4 h-4 text-amber-600" />;
      case "PAYMENT":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "SHIPMENT":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "SECURITY":
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: CustomerNotification["type"]) => {
    switch (type) {
      case "QUOTE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "PAYMENT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SHIPMENT":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "SECURITY":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Notifications & Activity Feed
            </h1>
            {unreadCount > 0 && (
              <span className="bg-autohub-red text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time procurement alerts, quotation updates, shipment milestones, and account security notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
        {[
          { id: "ALL", label: "All Alerts" },
          { id: "QUOTE", label: "Quotations" },
          { id: "PAYMENT", label: "Payments & Invoices" },
          { id: "SHIPMENT", label: "Shipments & Freight" },
          { id: "SECURITY", label: "Account & MFA" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
              categoryFilter === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">No notifications in this category</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 transition flex items-start justify-between gap-4 ${
                !notif.read ? "bg-blue-50/30" : "hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.type === "QUOTE"
                      ? "bg-amber-100"
                      : notif.type === "PAYMENT"
                      ? "bg-emerald-100"
                      : notif.type === "SHIPMENT"
                      ? "bg-blue-100"
                      : "bg-purple-100"
                  }`}
                >
                  {getTypeIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-xs font-bold ${
                        !notif.read ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeBadge(
                        notif.type
                      )}`}
                    >
                      {notif.type}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-autohub-red shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.timestamp}
                    </span>

                    {notif.linkUrl && (
                      <Link
                        href={notif.linkUrl}
                        className="text-autohub-navy font-bold hover:underline flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition shrink-0"
                  title="Mark as read"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
