"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Package,
  Sparkles,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Plane,
  Anchor,
  X,
} from "lucide-react";
import { createPartRequest, getStoredCustomers } from "@/lib/store";
import { calculateEstimatedCost } from "@/lib/aiService";
import { PartCondition } from "@/lib/types";

export default function NewRequestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [vehicle, setVehicle] = useState({
    make: "Toyota",
    model: "Hilux",
    year: 2020,
    vin: "MR0HA3CD800192841",
    registrationPlate: "NZZ482",
    engineCode: "1GD-FTV 2.8L",
    variant: "SR5 Cruiser 4WD",
    transmission: "AUTOMATIC" as const,
    driveConfiguration: "4WD" as const,
  });

  const [part, setPart] = useState({
    partName: "Genuine Alternator 12V 130A Assembly",
    oemPartNumber: "27060-0E050",
    quantity: 1,
    genuinePreference: "GENUINE_ONLY" as const,
    conditionRequirement: "NEW_GENUINE" as PartCondition,
    category: "Lighting & Electrical",
    weightEstKg: 7.2,
    descriptionNotes: "Vehicle is in workshop. Customer requires factory brand new genuine Denso/Toyota alternator with pulley.",
  });

  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([
    { name: "alternator_label_denso.jpg", size: "1.8 MB" },
    { name: "toyota_parts_diagram_charging_system.pdf", size: "750 KB" },
  ]);
  const [newFileInput, setNewFileInput] = useState("");

  // Predefined Vehicle Catalog for Select Dropdowns
  const VEHICLE_CATALOG: Record<string, string[]> = {
    Toyota: ["Hilux", "Land Cruiser", "Land Cruiser Prado", "Hiace", "RAV4", "Aqua", "Prius", "Corolla", "Camry", "Yaris", "Highlander", "C-HR"],
    Nissan: ["Navara", "Patrol", "Leaf", "X-Trail", "Skyline", "GT-R", "Note", "Tiida", "Qashqai", "Pathfinder", "Serena"],
    Mazda: ["CX-5", "CX-9", "CX-30", "CX-8", "BT-50", "Axela / Mazda3", "Demio / Mazda2", "Atenza / Mazda6", "MX-5"],
    Ford: ["Ranger", "Everest", "Transit", "Focus", "Falcon", "Mondeo", "Escape", "Mustang"],
    Mitsubishi: ["Triton", "Outlander", "Pajero", "Pajero Sport", "ASX", "Eclipse Cross", "Lancer", "Delica D:5"],
    Subaru: ["Outback", "Forester", "Legacy", "Impreza", "WRX / STI", "XV / Crosstrek", "Levorg"],
    Honda: ["Civic", "Accord", "CR-V", "Fit / Jazz", "HR-V / Vezel", "Odyssey", "Stepwgn"],
    Isuzu: ["D-Max", "MU-X", "Elf", "Forward", "Giga"],
    BMW: ["3 Series", "5 Series", "1 Series", "X3", "X5", "X1", "M3", "M5", "7 Series"],
    "Mercedes-Benz": ["C-Class", "E-Class", "A-Class", "GLC", "GLE", "Sprinter", "Vito", "S-Class", "G-Class"],
    Audi: ["A3", "A4", "A6", "Q5", "Q7", "Q3", "RS4", "RS6", "e-tron"],
    Hyundai: ["Tucson", "Santa Fe", "i30", "Kona", "Staria", "Ioniq 5", "Palisade"],
    Kia: ["Sportage", "Sorento", "Carnival", "EV6", "Cerato", "Seltos", "Niro"],
    Suzuki: ["Swift", "Jimny", "Vitara", "SX4 S-Cross", "Baleno", "Ignis", "Carry"],
    Volkswagen: ["Golf", "Amarok", "Tiguan", "Transporter", "Passat", "Polo", "Touareg"],
    Lexus: ["RX Series", "NX Series", "IS Series", "GS Series", "LX Series", "ES Series"],
    Other: ["Other / Custom Model"],
  };

  const YEARS = Array.from({ length: 2026 - 1985 + 1 }, (_, i) => 2026 - i);

  const [isCustomMake, setIsCustomMake] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);

  const handleMakeChange = (selectedMake: string) => {
    if (selectedMake === "Other") {
      setIsCustomMake(true);
      setIsCustomModel(true);
      setVehicle((prev) => ({ ...prev, make: "", model: "" }));
    } else {
      setIsCustomMake(false);
      setIsCustomModel(false);
      const models = VEHICLE_CATALOG[selectedMake] || [];
      setVehicle((prev) => ({
        ...prev,
        make: selectedMake,
        model: models[0] || "",
      }));
    }
  };

  const handleModelChange = (selectedModel: string) => {
    if (selectedModel === "Other / Custom Model") {
      setIsCustomModel(true);
      setVehicle((prev) => ({ ...prev, model: "" }));
    } else {
      setIsCustomModel(false);
      setVehicle((prev) => ({ ...prev, model: selectedModel }));
    }
  };

  // AI Instant Cost Estimator
  const aiEstimate = calculateEstimatedCost(vehicle.make, vehicle.model, part.category);

  const handleAddFile = () => {
    if (!newFileInput.trim()) return;
    setAttachments([
      ...attachments,
      { name: newFileInput.trim(), size: "2.1 MB" },
    ]);
    setNewFileInput("");
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle.vin || vehicle.vin.trim().length < 6) {
      alert("Please provide a valid VIN or Chassis number.");
      return;
    }

    setSubmitting(true);
    const customers = getStoredCustomers();
    const customer = customers[0];

    setTimeout(() => {
      const created = createPartRequest({
        customerId: customer.id,
        customerName: customer.tradingName,
        customerNzbn: customer.nzbn,
        customerContactEmail: customer.primaryContact.email,
        deliveryAddress: customer.deliveryAddresses[0] || {
          label: "Main Workshop",
          street: "42 Great South Road",
          suburb: "Penrose",
          city: "Auckland",
          postcode: "1061",
        },
        vehicle,
        part: {
          ...part,
          attachments: attachments.map((a) => ({
            name: a.name,
            size: a.size,
            url: "#",
            type: a.name.endsWith(".pdf") ? "document" : "photo",
          })),
        },
      });

      setSubmitting(false);
      router.push(`/portal/requests/${created.id}`);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
            Door-to-Door Sourcing
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Submit New Vehicle Part Request
          </h1>
          <p className="text-xs text-slate-500">
            Specify your vehicle details and part requirements. Autohub coordinates sourcing through our global supplier and logistics network.
          </p>
        </div>
        <Link
          href="/portal"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Vehicle Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <Car className="w-5 h-5 text-autohub-navy" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              1. Vehicle Identification
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Make Select */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Make *
              </label>
              {!isCustomMake ? (
                <select
                  required
                  value={vehicle.make}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-autohub-navy focus:outline-none font-medium text-slate-800"
                >
                  <option value="" disabled>Select Make</option>
                  {Object.keys(VEHICLE_CATALOG).map((make) => (
                    <option key={make} value={make}>
                      {make === "Other" ? "Other / Custom Make..." : make}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    value={vehicle.make}
                    onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                    placeholder="Enter Custom Make"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMake(false);
                      setIsCustomModel(false);
                      setVehicle({ ...vehicle, make: "Toyota", model: "Hilux" });
                    }}
                    className="text-[10px] text-autohub-red hover:underline font-semibold"
                  >
                    ← Choose from catalog
                  </button>
                </div>
              )}
            </div>

            {/* Model Select */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Model *
              </label>
              {!isCustomModel && !isCustomMake ? (
                <select
                  required
                  value={vehicle.model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-autohub-navy focus:outline-none font-medium text-slate-800"
                >
                  <option value="" disabled>Select Model</option>
                  {(VEHICLE_CATALOG[vehicle.make] || ["Other / Custom Model"]).map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                  <option value="Other / Custom Model">Other / Custom Model...</option>
                </select>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    value={vehicle.model}
                    onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                    placeholder="Enter Custom Model"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                  />
                  {!isCustomMake && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomModel(false);
                        const models = VEHICLE_CATALOG[vehicle.make] || [];
                        setVehicle({ ...vehicle, model: models[0] || "" });
                      }}
                      className="text-[10px] text-autohub-red hover:underline font-semibold"
                    >
                      ← Choose from catalog
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Model Year Select */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Model Year *
              </label>
              <select
                required
                value={vehicle.year}
                onChange={(e) => setVehicle({ ...vehicle, year: parseInt(e.target.value) || 2020 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-autohub-navy focus:outline-none font-medium text-slate-800"
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
                <option value={1980}>Pre-1985 / Classic</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                <span>VIN / Chassis Number (Mandatory) *</span>
                <span className="text-[10px] text-autohub-red font-normal">17-character VIN or JDM Chassis</span>
              </label>
              <input
                type="text"
                required
                value={vehicle.vin}
                onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value.toUpperCase() })}
                placeholder="e.g. JTFLH22P407089123 or TRH200-019842"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono tracking-wider focus:ring-2 focus:ring-autohub-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                NZ Registration Plate (Optional)
              </label>
              <input
                type="text"
                value={vehicle.registrationPlate}
                onChange={(e) => setVehicle({ ...vehicle, registrationPlate: e.target.value.toUpperCase() })}
                placeholder="e.g. NZZ482"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-autohub-navy focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Engine Code / Displacement
              </label>
              <input
                type="text"
                value={vehicle.engineCode}
                onChange={(e) => setVehicle({ ...vehicle, engineCode: e.target.value })}
                placeholder="e.g. 1GD-FTV 2.8L"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Transmission
              </label>
              <select
                value={vehicle.transmission}
                onChange={(e) => setVehicle({ ...vehicle, transmission: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
                <option value="CVT">CVT</option>
                <option value="DCT">Dual Clutch (DCT)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Drive Configuration
              </label>
              <select
                value={vehicle.driveConfiguration}
                onChange={(e) => setVehicle({ ...vehicle, driveConfiguration: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="4WD">4WD (Selectable/Low)</option>
                <option value="AWD">AWD (Full-Time)</option>
                <option value="FWD">FWD (Front-Wheel)</option>
                <option value="RWD">RWD (Rear-Wheel)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Part Requirements */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <Package className="w-5 h-5 text-autohub-navy" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              2. Part Requirements & Specification
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                Part Name / Description *
              </label>
              <input
                type="text"
                required
                value={part.partName}
                onChange={(e) => setPart({ ...part, partName: e.target.value })}
                placeholder="e.g. Left Front Lower Control Arm Assembly"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Quantity Required *
              </label>
              <input
                type="number"
                min={1}
                required
                value={part.quantity}
                onChange={(e) => setPart({ ...part, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                OEM Part Number (If Known)
              </label>
              <input
                type="text"
                value={part.oemPartNumber}
                onChange={(e) => setPart({ ...part, oemPartNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. 48069-26140"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono tracking-wider"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Genuine vs Aftermarket
              </label>
              <select
                value={part.genuinePreference}
                onChange={(e) => setPart({ ...part, genuinePreference: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="GENUINE_ONLY">Genuine OEM Factory Only</option>
                <option value="AFTERMARKET_ACCEPTABLE">Certified Aftermarket Acceptable</option>
                <option value="ANY">Any Verified Quality Source</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Condition Requirement
              </label>
              <select
                value={part.conditionRequirement}
                onChange={(e) => setPart({ ...part, conditionRequirement: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="NEW_GENUINE">Brand New Genuine</option>
                <option value="NEW_AFTERMARKET">Brand New Aftermarket</option>
                <option value="RECONDITIONED_OEM">Reconditioned / Remanufactured OEM</option>
                <option value="USED_TESTED">Tested Good Used (Grade A)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Part Category
              </label>
              <select
                value={part.category}
                onChange={(e) => setPart({ ...part, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Suspension & Steering">Suspension & Steering</option>
                <option value="Lighting & Electrical">Lighting & Electrical</option>
                <option value="Engine & Drivetrain">Engine & Drivetrain</option>
                <option value="EV Powertrain">EV Powertrain & Hybrid Inverter</option>
                <option value="Body & Exterior">Body & Exterior Panels</option>
                <option value="Braking Systems">Braking Systems</option>
                <option value="Cooling & HVAC">Cooling & HVAC</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Estimated Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={part.weightEstKg}
                onChange={(e) => setPart({ ...part, weightEstKg: parseFloat(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">
              Customer Notes & Specific Requirements
            </label>
            <textarea
              rows={3}
              value={part.descriptionNotes}
              onChange={(e) => setPart({ ...part, descriptionNotes: e.target.value })}
              placeholder="e.g. Include seals or gasket kit, left-hand side vs right-hand side, hoist deadline..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-autohub-navy focus:outline-none"
            />
          </div>
        </div>

        {/* AI Instant Cost & Transit Estimator (MVP AI Feature) */}
        <div className="bg-gradient-to-br from-blue-900 via-autohub-navy to-slate-900 text-white rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-autohub-red animate-pulse" />
              <h3 className="text-sm font-bold">
                Instant AI Landed Cost & Freight Estimator
              </h3>
            </div>
            <span className="text-[10px] bg-white/20 text-slate-200 px-2.5 py-0.5 rounded-full font-mono font-medium">
              Autohub AI Engine v1.0
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Based on historical imports for <strong>{vehicle.year} {vehicle.make} {vehicle.model} ({part.category})</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
              <span className="text-slate-300 text-[10px] block">Est. Landed Part Price</span>
              <span className="text-lg font-black text-white block mt-0.5 font-mono">
                ${aiEstimate.estimatedPartNzd} NZD
              </span>
              <span className="text-[10px] text-slate-300">Excl. international freight & GST</span>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
              <span className="text-slate-300 text-[10px] block flex items-center gap-1">
                <Plane className="w-3 h-3 text-sky-400" /> Air Express Option
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                ~${aiEstimate.estimatedAirFreightNzd} NZD
              </span>
              <span className="text-[10px] text-slate-300">Transit: {aiEstimate.airTransit}</span>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
              <span className="text-slate-300 text-[10px] block flex items-center gap-1">
                <Anchor className="w-3 h-3 text-cyan-400" /> Sea Consolidated Option
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                ~${aiEstimate.estimatedSeaFreightNzd} NZD
              </span>
              <span className="text-[10px] text-slate-300">Transit: {aiEstimate.seaTransit}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-300 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{aiEstimate.confidenceScore}</span>
          </div>
        </div>

        {/* Card 3: Multi-File & Document Upload Simulator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <Upload className="w-5 h-5 text-autohub-navy" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              3. Supporting Documents & Photos
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Upload pictures of the damaged part, VIN plate, manufacturer label, or parts diagram.
          </p>

          <div className="flex gap-2 text-xs">
            <input
              type="text"
              value={newFileInput}
              onChange={(e) => setNewFileInput(e.target.value)}
              placeholder="e.g. damaged_part_photo.jpg or workshop_schematic.pdf"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={handleAddFile}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Attach File
            </button>
          </div>

          <div className="space-y-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2 text-slate-800">
                  <FileText className="w-4 h-4 text-autohub-navy" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-[10px] text-slate-400">({file.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between">
          <Link
            href="/portal"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
          >
            Cancel & Discard
          </Link>

          <button
            id="submit-part-request-button"
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold shadow-lg hover:shadow-red-500/20 transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? "Submitting Request..." : "Submit Part Request to Autohub Sourcing"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
