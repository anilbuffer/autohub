"use client";

import React, { useState } from "react";
import { PartRequest, UserRole } from "@/lib/types";
import { addMessageToRequest, getActiveRole } from "@/lib/store";
import { generateAiMessageDraft } from "@/lib/aiService";
import {
  Send,
  Sparkles,
  Lock,
  User,
  Paperclip,
  CheckCircle2,
  Bot,
  Shield,
  MessageSquare,
} from "lucide-react";

interface MessagingThreadProps {
  request: PartRequest;
  onMessageSent?: () => void;
}

export const MessagingThread: React.FC<MessagingThreadProps> = ({
  request,
  onMessageSent,
}) => {
  const [content, setContent] = useState("");
  const [attachedFile, setAttachedFile] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const activeRole = getActiveRole();

  const isStaff = activeRole !== "CUSTOMER";

  // Filter messages: if customer, don't show internal notes
  const visibleMessages = request.messages.filter((m) => {
    if (!isStaff && m.isInternalOnly) return false;
    return true;
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalContent = attachedFile
      ? `${content.trim() ? content.trim() + " " : ""}[Attached File: ${attachedFile}]`
      : content.trim();

    if (!finalContent) return;

    const senderName =
      activeRole === "CUSTOMER"
        ? request.customerName
        : activeRole === "SOURCING_SPECIALIST"
        ? "Nathan Cole (Sourcing)"
        : activeRole === "LOGISTICS_COORDINATOR"
        ? "Liam Patel (Logistics)"
        : activeRole === "FINANCE_OFFICER"
        ? "Clara Jenkins (Finance)"
        : "Autohub Operations";

    addMessageToRequest(
      request.id,
      finalContent,
      senderName,
      activeRole,
      isInternal && isStaff,
      false
    );

    setContent("");
    setAttachedFile("");
    setIsInternal(false);
    if (onMessageSent) onMessageSent();
  };

  const handleAiDraft = (intent: "QUOTE_ISSUED" | "PAYMENT_REMINDER" | "CUSTOMS_UPDATE" | "DELIVERY_SCHEDULED" | "SOURCING_ADVISORY") => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const draft = generateAiMessageDraft(request, intent);
      setContent(draft);
      setIsGeneratingAi(false);
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-autohub-navy" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Coordination Communications Thread
          </h4>
          <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
            {visibleMessages.length} updates
          </span>
        </div>

        {isStaff && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Internal Note Mode:</span>
            <button
              type="button"
              onClick={() => setIsInternal(!isInternal)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                isInternal
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>{isInternal ? "Internal Note (Staff Only)" : "Public Note"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {visibleMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
            <MessageSquare className="w-8 h-8 stroke-1 text-slate-300 mb-2" />
            <span>No messages yet. Send a query to the Autohub coordination desk.</span>
          </div>
        ) : (
          visibleMessages.map((msg) => {
            const isMe =
              (activeRole === "CUSTOMER" && msg.senderRole === "CUSTOMER") ||
              (activeRole !== "CUSTOMER" && msg.senderRole !== "CUSTOMER");

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500">
                  {msg.isInternalOnly && (
                    <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded text-[10px]">
                      <Lock className="w-2.5 h-2.5" /> Staff Internal
                    </span>
                  )}
                  {msg.isAiGenerated && (
                    <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
                      <Bot className="w-2.5 h-2.5" /> AI Coordinator
                    </span>
                  )}
                  <span className="font-semibold text-slate-700">{msg.senderName}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.isInternalOnly
                      ? "bg-amber-50 text-amber-950 border border-amber-200"
                      : isMe
                      ? "bg-autohub-navy text-white"
                      : "bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* AI Reply Quick Draft Toolbar (Staff & Customer) */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-medium flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-autohub-red" />
          AI Quick Replies:
        </span>
        {isStaff ? (
          <>
            <button
              onClick={() => handleAiDraft("QUOTE_ISSUED")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition"
            >
              Quote Ready
            </button>
            <button
              onClick={() => handleAiDraft("CUSTOMS_UPDATE")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition"
            >
              Customs NZ Update
            </button>
            <button
              onClick={() => handleAiDraft("PAYMENT_REMINDER")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition"
            >
              Payment Pending
            </button>
            <button
              onClick={() => handleAiDraft("DELIVERY_SCHEDULED")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition"
            >
              Out for Delivery
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setContent("Could you please provide an updated ETA for arrival into Auckland?")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition"
            >
              Ask ETA Update
            </button>
            <button
              onClick={() => setContent("Can we expedite dispatch via priority courier once customs clears?")}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition"
            >
              Request Expedited Delivery
            </button>
          </>
        )}
      </div>

      {/* Attachment Pill Preview if added */}
      {attachedFile && (
        <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Paperclip className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium text-[11px]">{attachedFile}</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachedFile("")}
            className="text-slate-400 hover:text-rose-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-slate-200 bg-white rounded-b-2xl flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => {
            const sampleFiles = ["control_arm_bushing_photo.jpg", "workshop_measurement_scan.pdf", "toyota_chassis_tag.png"];
            const chosen = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
            setAttachedFile(chosen);
          }}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
          title="Attach photo or document (PDF, PNG, JPG)"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isInternal
              ? "Type internal confidential note (visible only to Autohub staff)..."
              : "Type a message to the coordination team..."
          }
          className={`flex-1 px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 transition ${
            isInternal
              ? "bg-amber-50/50 border-amber-300 focus:ring-amber-500/20 text-amber-950 placeholder-amber-700/60"
              : "bg-slate-50 border-slate-200 focus:ring-autohub-navy/20 focus:border-autohub-navy text-slate-800"
          }`}
        />
        <button
          type="submit"
          disabled={!content.trim() && !attachedFile}
          className="p-2.5 rounded-xl bg-autohub-navy hover:bg-autohub-navy-dark text-white disabled:opacity-40 transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
