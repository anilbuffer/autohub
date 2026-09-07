import React from "react";
import { RequestStatus } from "@/lib/types";
import {
  Clock,
  Search,
  FileCheck,
  CreditCard,
  CheckCircle2,
  Package,
  Truck,
  Plane,
  Anchor,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  XCircle,
  PauseCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: RequestStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  showIcon = true,
}) => {
  const getStatusConfig = (s: RequestStatus) => {
    switch (s) {
      case "SUBMITTED":
        return {
          label: "Submitted",
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          icon: Clock,
        };
      case "SOURCING":
        return {
          label: "Sourcing Desk",
          bg: "bg-amber-50 text-amber-800 border-amber-300",
          icon: Search,
        };
      case "QUOTE_PREPARED":
        return {
          label: "Quote Prepared",
          bg: "bg-blue-50 text-blue-800 border-blue-300",
          icon: FileCheck,
        };
      case "AWAITING_CUSTOMER_APPROVAL":
        return {
          label: "Action Required: Review Quote",
          bg: "bg-purple-50 text-purple-800 border-purple-300 animate-pulse",
          icon: Clock,
        };
      case "AWAITING_PAYMENT":
        return {
          label: "Awaiting Payment",
          bg: "bg-amber-100 text-amber-900 border-amber-400 font-semibold",
          icon: CreditCard,
        };
      case "PAYMENT_CONFIRMED":
        return {
          label: "Payment Confirmed",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
          icon: CheckCircle2,
        };
      case "ORDERED_FROM_SUPPLIER":
        return {
          label: "Ordered From Supplier",
          bg: "bg-indigo-50 text-indigo-800 border-indigo-300",
          icon: Package,
        };
      case "SUPPLIER_DISPATCHED":
        return {
          label: "Supplier Dispatched",
          bg: "bg-sky-50 text-sky-800 border-sky-300",
          icon: Truck,
        };
      case "RECEIVED_AT_SHIPPING_FACILITY":
        return {
          label: "At Export Terminal",
          bg: "bg-cyan-50 text-cyan-800 border-cyan-300",
          icon: Anchor,
        };
      case "IN_TRANSIT":
        return {
          label: "In International Transit",
          bg: "bg-blue-100 text-blue-900 border-blue-400 font-medium",
          icon: Plane,
        };
      case "ARRIVED_IN_NZ":
        return {
          label: "Arrived In New Zealand",
          bg: "bg-teal-50 text-teal-800 border-teal-300",
          icon: MapPin,
        };
      case "CUSTOMS_CLEARANCE":
        return {
          label: "Customs Clearance & MPI",
          bg: "bg-indigo-100 text-indigo-900 border-indigo-400",
          icon: ShieldCheck,
        };
      case "OUT_FOR_DELIVERY":
        return {
          label: "Out For Delivery",
          bg: "bg-emerald-100 text-emerald-900 border-emerald-400 font-medium",
          icon: Truck,
        };
      case "DELIVERED":
        return {
          label: "Delivered",
          bg: "bg-emerald-600 text-white border-emerald-700 shadow-sm",
          icon: CheckCircle2,
        };
      case "COMPLETED":
        return {
          label: "Completed",
          bg: "bg-slate-800 text-white border-slate-900",
          icon: CheckCircle2,
        };
      case "SOURCING_EXCEPTION":
        return {
          label: "Sourcing Exception",
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          icon: AlertTriangle,
        };
      case "LOGISTICS_EXCEPTION":
        return {
          label: "Logistics Delay / Hold",
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          icon: AlertTriangle,
        };
      case "PAYMENT_DISPUTED":
        return {
          label: "Payment Review",
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          icon: AlertTriangle,
        };
      case "CUSTOMER_REJECTED":
        return {
          label: "Quote Declined",
          bg: "bg-slate-200 text-slate-700 border-slate-300",
          icon: XCircle,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          bg: "bg-gray-100 text-gray-500 border-gray-200 line-through",
          icon: XCircle,
        };
      case "ON_HOLD":
        return {
          label: "On Hold",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: PauseCircle,
        };
      default:
        return {
          label: status,
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]} transition-all duration-200`}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />}
      <span>{config.label}</span>
    </span>
  );
};
