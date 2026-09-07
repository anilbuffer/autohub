import React from "react";
import { RequestStatus } from "@/lib/types";
import { Check, Clock, AlertCircle } from "lucide-react";

interface LifecycleTrackerProps {
  status: RequestStatus;
  currentMilestoneNote?: string;
}

interface StepInfo {
  id: string;
  label: string;
  sublabel: string;
  statuses: RequestStatus[];
}

const LIFECYCLE_STEPS: StepInfo[] = [
  {
    id: "sourcing",
    label: "Sourcing",
    sublabel: "Global Supplier Desk",
    statuses: ["SUBMITTED", "SOURCING"],
  },
  {
    id: "quote",
    label: "Quotation",
    sublabel: "Pricing & Freight Options",
    statuses: ["QUOTE_PREPARED", "AWAITING_CUSTOMER_APPROVAL"],
  },
  {
    id: "payment",
    label: "Payment Gate",
    sublabel: "Transfer / Credit Clearance",
    statuses: ["AWAITING_PAYMENT", "PAYMENT_CONFIRMED"],
  },
  {
    id: "procurement",
    label: "Procurement",
    sublabel: "Supplier Order & Pack",
    statuses: ["ORDERED_FROM_SUPPLIER", "SUPPLIER_DISPATCHED", "RECEIVED_AT_SHIPPING_FACILITY"],
  },
  {
    id: "transit",
    label: "Freight Transit",
    sublabel: "Air Cargo / Ocean Sea",
    statuses: ["IN_TRANSIT", "ARRIVED_IN_NZ"],
  },
  {
    id: "customs",
    label: "Customs & MPI",
    sublabel: "Clearance NZ",
    statuses: ["CUSTOMS_CLEARANCE"],
  },
  {
    id: "delivery",
    label: "Delivery",
    sublabel: "Workshop Doorstep",
    statuses: ["OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED"],
  },
];

export const LifecycleTracker: React.FC<LifecycleTrackerProps> = ({
  status,
  currentMilestoneNote,
}) => {
  const isException = [
    "SOURCING_EXCEPTION",
    "LOGISTICS_EXCEPTION",
    "PAYMENT_DISPUTED",
    "CUSTOMER_REJECTED",
    "CANCELLED",
    "ON_HOLD",
  ].includes(status);

  // Find active step index
  let activeStepIndex = -1;
  LIFECYCLE_STEPS.forEach((step, idx) => {
    if (step.statuses.includes(status)) {
      activeStepIndex = idx;
    }
  });

  if (status === "DELIVERED" || status === "COMPLETED") {
    activeStepIndex = LIFECYCLE_STEPS.length - 1;
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            End-to-End Procurement Lifecycle
          </h4>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">
            Door-to-Door Autohub Logistics Orchestration
          </p>
        </div>
        {isException && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            <AlertCircle className="w-4 h-4" />
            <span>Attention Required: {status.replace(/_/g, " ")}</span>
          </div>
        )}
      </div>

      {/* Progress Stepper */}
      <div className="relative">
        <div className="hidden md:flex items-center justify-between relative z-10">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = activeStepIndex > idx || status === "DELIVERED" || status === "COMPLETED";
            const isCurrent = activeStepIndex === idx && status !== "DELIVERED" && status !== "COMPLETED";
            const isUpcoming = activeStepIndex < idx;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 text-center relative group">
                {/* Connecting Line */}
                {idx < LIFECYCLE_STEPS.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-1 -z-10 transition-all duration-300 ${
                      activeStepIndex > idx ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}

                {/* Circle Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-100"
                      : isCurrent
                      ? "bg-autohub-navy text-white shadow-md ring-4 ring-blue-100 animate-pulse"
                      : "bg-slate-100 text-slate-400 border border-slate-300"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Labels */}
                <span
                  className={`text-xs font-semibold mt-2.5 transition-colors ${
                    isCurrent
                      ? "text-autohub-navy font-bold"
                      : isCompleted
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 max-w-[90px] leading-tight">
                  {step.sublabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-2">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = activeStepIndex > idx || status === "DELIVERED" || status === "COMPLETED";
            const isCurrent = activeStepIndex === idx && status !== "DELIVERED" && status !== "COMPLETED";

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded-lg border ${
                  isCurrent
                    ? "bg-blue-50/70 border-autohub-navy/30 text-autohub-navy"
                    : isCompleted
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-autohub-navy text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold block">{step.label}</span>
                  <span className="text-[10px] text-slate-500">{step.sublabel}</span>
                </div>
                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-autohub-navy bg-white px-2 py-0.5 rounded border border-blue-200">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {currentMilestoneNote && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-autohub-navy flex-shrink-0" />
          <span>
            <strong className="text-slate-800">Latest Coordination Update:</strong> {currentMilestoneNote}
          </span>
        </div>
      )}
    </div>
  );
};
