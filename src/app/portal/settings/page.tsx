"use client";

import React, { useState, useEffect } from "react";
import { getStoredCustomers, saveCustomers } from "@/lib/store";
import { TradeCustomer } from "@/lib/types";
import { MapPin, Plus, CheckCircle2, Building2, Users, Shield } from "lucide-react";

export default function AddressBookSettingsPage() {
  const [customer, setCustomer] = useState<TradeCustomer | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newSuburb, setNewSuburb] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPostcode, setNewPostcode] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const custs = getStoredCustomers();
    if (custs.length > 0) setCustomer(custs[0]);
  }, []);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    const newAddr = {
      id: `ADDR-${Date.now()}`,
      label: newLabel,
      street: newStreet,
      suburb: newSuburb,
      city: newCity,
      postcode: newPostcode,
      isDefault: false,
    };

    const updatedCustomer: TradeCustomer = {
      ...customer,
      deliveryAddresses: [...customer.deliveryAddresses, newAddr],
    };

    const all = getStoredCustomers();
    all[0] = updatedCustomer;
    saveCustomers(all);
    setCustomer(updatedCustomer);

    setNewLabel("");
    setNewStreet("");
    setNewSuburb("");
    setNewCity("");
    setNewPostcode("");
    setShowAddModal(false);
  };

  const handleSetDefault = (id: string) => {
    if (!customer) return;
    const updated = {
      ...customer,
      deliveryAddresses: customer.deliveryAddresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    };
    const all = getStoredCustomers();
    all[0] = updated;
    saveCustomers(all);
    setCustomer(updated);
  };

  if (!customer) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Delivery Address Book & Workshop Depots
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage authorized destination addresses for imported vehicle parts consignments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customer.deliveryAddresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-3xl border transition ${
              addr.isDefault
                ? "bg-blue-50/50 border-autohub-navy shadow-sm"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-autohub-navy" />
                <h4 className="text-xs font-bold text-slate-900">{addr.label}</h4>
              </div>
              {addr.isDefault && (
                <span className="text-[10px] bg-autohub-navy text-white font-bold px-2 py-0.5 rounded-full">
                  Default Workshop
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-1">
              {addr.street}, {addr.suburb && `${addr.suburb}, `}{addr.city} {addr.postcode}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              {!addr.isDefault ? (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-autohub-navy hover:underline font-semibold text-[11px]"
                >
                  Set as Default Destination
                </button>
              ) : (
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active for new quotes
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Add Address Card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="p-6 rounded-3xl border-2 border-dashed border-slate-300 hover:border-autohub-navy hover:bg-slate-50 transition text-slate-500 flex flex-col items-center justify-center gap-2 text-xs font-semibold"
        >
          <Plus className="w-6 h-6 text-autohub-navy" />
          <span>Add New Workshop Depot / Delivery Bay</span>
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleAddAddress}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <h3 className="text-sm font-bold text-slate-900">Add New Delivery Location</h3>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Depot Label *</label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. South Auckland Branch"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Street Address *</label>
              <input
                type="text"
                required
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="e.g. 50 Carbine Road"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Suburb</label>
                <input
                  type="text"
                  value={newSuburb}
                  onChange={(e) => setNewSuburb(e.target.value)}
                  placeholder="Mt Wellington"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-slate-700">City *</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Auckland"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Postcode *</label>
                <input
                  type="text"
                  required
                  value={newPostcode}
                  onChange={(e) => setNewPostcode(e.target.value)}
                  placeholder="1060"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-autohub-navy text-white font-bold"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
