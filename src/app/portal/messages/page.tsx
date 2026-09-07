"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Paperclip,
  Clock,
  ArrowRight,
  Send,
  User,
  Shield,
  FileText,
  ChevronRight,
} from "lucide-react";
import { getStoredRequests, addRequestMessage, subscribeToStore } from "@/lib/store";
import { PartRequest, MessageItem } from "@/lib/types";

export default function MessagesCenterPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);

  useEffect(() => {
    const reqs = getStoredRequests();
    setRequests(reqs);
    if (reqs.length > 0 && !selectedRequestId) {
      setSelectedRequestId(reqs[0].id);
    }

    const unsub = subscribeToStore(() => {
      const updatedReqs = getStoredRequests();
      setRequests(updatedReqs);
    });
    return unsub;
  }, [selectedRequestId]);

  const filteredRequests = requests.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.referenceNumber.toLowerCase().includes(q) ||
      r.vehicle.make.toLowerCase().includes(q) ||
      r.vehicle.model.toLowerCase().includes(q) ||
      r.part.partName.toLowerCase().includes(q)
    );
  });

  const activeRequest = requests.find((r) => r.id === selectedRequestId) || requests[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRequest) return;

    addRequestMessage(
      activeRequest.id,
      "CUST-001",
      "James Wilson",
      "CUSTOMER",
      newMessage.trim(),
      false,
      attachments.length > 0 ? attachments : undefined
    );

    setNewMessage("");
    setAttachments([]);
    setAttachmentName("");
  };

  const handleAddAttachment = () => {
    if (!attachmentName.trim()) return;
    setAttachments([...attachments, attachmentName.trim()]);
    setAttachmentName("");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Sourcing & Logistics Messaging Threads
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Direct communication channels with Autohub procurement coordinators, logistics agents, and supplier desks.
        </p>
      </div>

      {/* Two column layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* Left Column: Request Conversations List */}
        <div className="lg:col-span-5 border-r border-slate-200 flex flex-col">
          {/* Search box */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search request threads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-autohub-navy/20"
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {filteredRequests.map((req) => {
              const lastMsg = req.messages[req.messages.length - 1];
              const isSelected = req.id === activeRequest?.id;

              return (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`w-full p-4 text-left transition flex items-start justify-between gap-3 ${
                    isSelected ? "bg-blue-50/50 border-l-4 border-autohub-navy" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-autohub-navy">
                        {req.referenceNumber}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.content}` : "No messages yet"}
                    </p>

                    {lastMsg?.attachments && lastMsg.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-autohub-navy font-semibold pt-0.5">
                        <Paperclip className="w-3 h-3" />
                        <span>{lastMsg.attachments.length} file attached</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Messaging Thread */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {activeRequest ? (
            <>
              {/* Thread Top Bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {activeRequest.referenceNumber}
                  </span>
                  <span className="text-xs text-slate-500">
                    • {activeRequest.part.partName}
                  </span>
                </div>

                <Link
                  href={`/portal/requests/${activeRequest.id}`}
                  className="text-xs font-bold text-autohub-navy hover:underline flex items-center gap-1"
                >
                  <span>Open Full Request</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Thread Messages */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 max-h-[460px]">
                {activeRequest.messages.map((msg) => {
                  const isCustomer = msg.senderRole === "CUSTOMER";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                        <span className="font-semibold text-slate-700">{msg.senderName}</span>
                        <span>•</span>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                          isCustomer
                            ? "bg-autohub-navy text-white rounded-br-none"
                            : "bg-slate-100 text-slate-800 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>

                        {/* File Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/20 flex flex-wrap gap-1.5">
                            {msg.attachments.map((file, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-mono ${
                                  isCustomer ? "bg-white/10 text-white" : "bg-white text-slate-700 border border-slate-200"
                                }`}
                              >
                                <Paperclip className="w-3 h-3" />
                                <span className="truncate max-w-[140px]">{file}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white space-y-2">
                {/* Attachments chips */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    {attachments.map((att, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        <Paperclip className="w-3 h-3 text-autohub-navy" />
                        <span>{att}</span>
                        <button
                          type="button"
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                          className="hover:text-rose-600 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your sourcing question or update..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-autohub-navy/20"
                  />

                  {/* Attachment input toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const sample = prompt("Enter file name or document link:", "spec_sheet_diagram.pdf");
                      if (sample) setAttachments([...attachments, sample]);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                    title="Attach File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-autohub-red hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Select a request thread from the list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
