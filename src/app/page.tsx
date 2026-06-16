/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type Tab = "overview" | "explorer" | "tester";
type Collection = "posts" | "events" | "programs" | "members" | "partners" | "lcs" | "testimonials";
type FormType = "member" | "partner" | "exchange";

interface HealthData {
  status: string;
  database: string;
  googleSheets: string;
  timestamp: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  
  // Health / Config states
  const [health, setHealth] = useState<HealthData | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // API Explorer states
  const [selectedCollection, setSelectedCollection] = useState<Collection>("posts");
  const [explorerData, setExplorerData] = useState<any>(null);
  const [explorerLoading, setExplorerLoading] = useState(false);
  const [explorerError, setExplorerError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [upcomingFilter, setUpcomingFilter] = useState("all");
  const [lcFilter, setLcFilter] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("");

  // Form Submission Simulator states
  const [formType, setFormType] = useState<FormType>("member");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  // Form Fields State
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    message: "",
  });

  const [partnerForm, setPartnerForm] = useState({
    organizationName: "",
    contactPerson: "",
    contactEmail: "",
    phone: "",
    partnershipType: "sponsorship",
    message: "",
  });

  const [exchangeForm, setExchangeForm] = useState({
    name: "",
    email: "",
    phone: "",
    program: "global-volunteer",
    college: "",
    motivation: "",
  });

  // Fetch API Health on mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  // Fetch collection data when explorer states change
  useEffect(() => {
    if (activeTab === "explorer") {
      fetchCollectionData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCollection, page, limit, categoryFilter, upcomingFilter, lcFilter, partnerTypeFilter, activeTab]);

  const checkApiHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error(err);
      setHealth({
        status: "disconnected",
        database: "failed",
        googleSheets: "unknown",
        timestamp: new Date().toISOString()
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  const fetchCollectionData = async () => {
    setExplorerLoading(true);
    setExplorerError(null);
    try {
      let url = `/api/${selectedCollection === "lcs" ? "lcs" : selectedCollection}?page=${page}&limit=${limit}`;
      
      if (selectedCollection === "posts" && categoryFilter) {
        url += `&category=${categoryFilter}`;
      } else if (selectedCollection === "events" && upcomingFilter !== "all") {
        url += `&upcoming=${upcomingFilter}`;
      } else if (selectedCollection === "members" && lcFilter) {
        url += `&lc=${lcFilter}`;
      } else if (selectedCollection === "partners" && partnerTypeFilter) {
        url += `&type=${partnerTypeFilter}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch data`);
      const result = await res.json();
      setExplorerData(result);
    } catch (err: any) {
      setExplorerError(err.message || "Something went wrong");
      setExplorerData(null);
    } finally {
      setExplorerLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);
    setSubmitSuccess(null);

    const payload = {
      type: formType,
      fields:
        formType === "member"
          ? memberForm
          : formType === "partner"
          ? partnerForm
          : exchangeForm,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSubmitResult(data);
      if (res.ok) {
        setSubmitSuccess(true);
        // Reset forms
        if (formType === "member") setMemberForm({ name: "", email: "", phone: "", college: "", message: "" });
        else if (formType === "partner") setPartnerForm({ organizationName: "", contactPerson: "", contactEmail: "", phone: "", partnershipType: "sponsorship", message: "" });
        else if (formType === "exchange") setExchangeForm({ name: "", email: "", phone: "", program: "global-volunteer", college: "", motivation: "" });
      } else {
        setSubmitSuccess(false);
      }
    } catch (err: any) {
      setSubmitSuccess(false);
      setSubmitResult({ error: err.message || "Failed to submit form" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-sky-900/20 via-indigo-900/5 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-lg shadow-md shadow-sky-500/20">
                A
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                  AIESEC Nepal
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-400 border border-sky-500/20">
                    Console v1.0
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Backend Development Sandbox & Testing Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800 text-xs">
                <span className="text-slate-400">Database:</span>
                <span className={`flex items-center gap-1.5 font-medium ${health?.database === "connected" ? "text-emerald-400" : "text-rose-400"}`}>
                  <span className={`h-2 w-2 rounded-full ${health?.database === "connected" ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                  {health?.database === "connected" ? "Connected" : "Disconnected"}
                </span>
              </div>

              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-600/15 hover:shadow-sky-500/20 transition-all duration-200"
              >
                Payload Admin CMS
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto scrollbar-none gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-all cursor-pointer ${
              activeTab === "overview"
                ? "border-sky-500 text-sky-400 bg-sky-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z" />
            </svg>
            System Overview & Config
          </button>
          
          <button
            onClick={() => {
              setActiveTab("explorer");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-all cursor-pointer ${
              activeTab === "explorer"
                ? "border-sky-500 text-sky-400 bg-sky-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
            Interactive API Explorer
          </button>

          <button
            onClick={() => {
              setActiveTab("tester");
              setSubmitResult(null);
              setSubmitSuccess(null);
            }}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-all cursor-pointer ${
              activeTab === "tester"
                ? "border-sky-500 text-sky-400 bg-sky-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Form Submission Simulator
          </button>
        </div>

        {/* ── OVERVIEW TAB ────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-2">AIESEC Nepal Web Platform API</h2>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Welcome to the developer console for the AIESEC Nepal backend. This system feeds data to the primary 
                  pages of our upcoming website, manages administration through Payload CMS, and stores leads and registrations in PostgreSQL with automatic syncs to Google Sheets spreadsheets.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">Storage Core</span>
                    <h3 className="text-base font-semibold text-white mt-1">Prisma + PostgreSQL</h3>
                    <p className="text-xs text-slate-400 mt-1">Saves structural tables, leads, and forms. Complete database management is enabled.</p>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">CMS System</span>
                    <h3 className="text-base font-semibold text-white mt-1">Payload CMS v3</h3>
                    <p className="text-xs text-slate-400 mt-1">Admin dashboard for posts, events, testmonials, local committees, and members.</p>
                  </div>
                </div>
              </section>

              <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-4">REST API Endpoint References</h2>
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                    <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Route</th>
                        <th className="px-4 py-3">Purpose / Filters</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-xs">
                      <tr>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">GET</span></td>
                        <td className="px-4 py-3 text-slate-100 font-semibold">/api/health</td>
                        <td className="px-4 py-3 text-slate-400 font-sans">Database connection & sheet sync configuration indicator.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">GET</span></td>
                        <td className="px-4 py-3 text-slate-100 font-semibold">/api/posts</td>
                        <td className="px-4 py-3 text-slate-400 font-sans">Published articles. Filter: `?category=events|exchange|member|impact`.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">GET</span></td>
                        <td className="px-4 py-3 text-slate-100 font-semibold">/api/events</td>
                        <td className="px-4 py-3 text-slate-400 font-sans">List of events. Filter: `?upcoming=true|false`.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">GET</span></td>
                        <td className="px-4 py-3 text-slate-100 font-semibold">/api/members</td>
                        <td className="px-4 py-3 text-slate-400 font-sans">Active leadership profiles. Filter: `?lc=kathmandu-university`.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">GET</span></td>
                        <td className="px-4 py-3 text-slate-100 font-semibold">/api/partners</td>
                        <td className="px-4 py-3 text-slate-400 font-sans">Partner logos & profiles. Filter: `?type=current|past`.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">POST</span></td>
                        <td className="px-4 py-3 text-slate-100 font-semibold">/api/submit</td>
                        <td className="px-4 py-3 text-slate-400 font-sans font-mono">Submit lead forms. Payload type: `member` | `partner` | `exchange`.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Sidebar configurations status */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <h3 className="text-base font-semibold text-white mb-4">Environment Diagnostics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs text-slate-400">Database Engine</span>
                    <span className="text-xs font-mono font-semibold bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-200">PostgreSQL (Prisma)</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs text-slate-400">Google Sheets Sync</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      health?.googleSheets === "configured" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {health?.googleSheets === "configured" ? "Active / Configured" : "Inactive / No Env Key"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs text-slate-400">CMS Framework</span>
                    <span className="text-xs font-mono font-semibold bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-sky-400">Payload CMS v3</span>
                  </div>

                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs text-slate-400">Diag Server Status</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      health?.status === "ok" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                    }`}>
                      {health?.status === "ok" ? "HEALTHY" : checkingHealth ? "PINGING..." : "DEGRADED"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={checkApiHealth}
                  disabled={checkingHealth}
                  className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-semibold transition cursor-pointer border border-slate-700 disabled:opacity-50"
                >
                  {checkingHealth ? "Re-checking..." : "Run Connection Health Check"}
                </button>
              </div>

              <div className="bg-gradient-to-tr from-sky-950/50 to-indigo-950/50 border border-sky-900/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl" />
                <h3 className="text-base font-semibold text-sky-400 mb-2">Need content for testing?</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Log in to the Payload admin console to create sample Blog posts, Events, Local Committees or Active Members, then head to the **API Explorer** tab to fetch them in real-time.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-sky-900/80 hover:bg-sky-900 border border-sky-500/30 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200"
                >
                  Admin CMS Panel Login
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── API EXPLORER TAB ────────────────────────────────────── */}
        {activeTab === "explorer" && (
          <div className="space-y-6">
            {/* Filter Dashboard Header */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Interactive Collection Explorer</h3>
                  <p className="text-xs text-slate-400">Select any CMS collection to fetch and analyze payload responses</p>
                </div>
                
                {/* Collection Selector Grid */}
                <div className="flex flex-wrap gap-2">
                  {([
                    { label: "Posts", val: "posts" },
                    { label: "Events", val: "events" },
                    { label: "Programs", val: "programs" },
                    { label: "Members", val: "members" },
                    { label: "Partners", val: "partners" },
                    { label: "Local Committees", val: "lcs" },
                    { label: "Testimonials", val: "testimonials" },
                  ] as const).map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setSelectedCollection(item.val);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                        selectedCollection === item.val
                          ? "bg-sky-500 text-white border-sky-400 shadow-sm shadow-sky-500/10"
                          : "bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Query Parameters Sub-Bar */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Page:</span>
                  <input
                    type="number"
                    min={1}
                    value={page}
                    onChange={(e) => setPage(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 bg-slate-950 border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-sky-500 text-white font-mono text-center"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Limit:</span>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-sky-500 text-white"
                  >
                    <option value={3}>3 per page</option>
                    <option value={6}>6 per page</option>
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                  </select>
                </div>

                {/* Conditional Filters depending on collection type */}
                {selectedCollection === "posts" && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Category Filter:</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 focus:outline-none focus:border-sky-500 text-white"
                    >
                      <option value="">All Categories</option>
                      <option value="member">Member</option>
                      <option value="events">Events</option>
                      <option value="exchange">Exchange</option>
                      <option value="impact">Impact</option>
                    </select>
                  </div>
                )}

                {selectedCollection === "events" && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Event Time:</span>
                    <select
                      value={upcomingFilter}
                      onChange={(e) => { setUpcomingFilter(e.target.value); setPage(1); }}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 focus:outline-none focus:border-sky-500 text-white"
                    >
                      <option value="all">All Events</option>
                      <option value="true">Upcoming Only</option>
                      <option value="false">Past Only</option>
                    </select>
                  </div>
                )}

                {selectedCollection === "members" && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Local Committee:</span>
                    <input
                      type="text"
                      placeholder="e.g. kathmandu-university"
                      value={lcFilter}
                      onChange={(e) => { setLcFilter(e.target.value); setPage(1); }}
                      className="w-48 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 focus:outline-none focus:border-sky-500 text-white"
                    />
                  </div>
                )}

                {selectedCollection === "partners" && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Partner Type:</span>
                    <select
                      value={partnerTypeFilter}
                      onChange={(e) => { setPartnerTypeFilter(e.target.value); setPage(1); }}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 focus:outline-none focus:border-sky-500 text-white"
                    >
                      <option value="">All Partners</option>
                      <option value="current">Current</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Response Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visual Preview cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-sky-400">Visual Client Mockup</h4>
                  <span className="text-xs text-slate-400">How this data might appear on the website</span>
                </div>

                {explorerLoading ? (
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-16 flex flex-col items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent mb-4" />
                    <span className="text-sm text-slate-400">Fetching collection payload...</span>
                  </div>
                ) : explorerError ? (
                  <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-6 text-center">
                    <svg className="h-8 w-8 text-rose-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm font-semibold text-rose-400">{explorerError}</span>
                  </div>
                ) : !explorerData || !explorerData.docs || explorerData.docs.length === 0 ? (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center shadow-md">
                    <svg className="h-10 w-10 text-slate-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <h5 className="text-sm font-semibold text-white">No items found</h5>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      This collection is empty. Seed some database entries inside the admin console to check frontend rendering logic.
                    </p>
                    <Link
                      href="/admin"
                      className="inline-flex mt-4 bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
                    >
                      Create first {selectedCollection} entry
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {explorerData.docs.map((doc: any, idx: number) => (
                      <div key={doc.id || idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition duration-200">
                        {/* Dynamic visuals mapping dependent on collection type */}
                        {selectedCollection === "posts" && (
                          <div>
                            <span className="inline-block text-[10px] font-semibold text-sky-400 uppercase tracking-wider bg-sky-950/60 px-2 py-0.5 rounded border border-sky-900/50 mb-2">
                              {doc.category}
                            </span>
                            <h5 className="text-sm font-semibold text-white line-clamp-1">{doc.title}</h5>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{doc.excerpt || "No excerpt details provided."}</p>
                            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                              <span>Slug: {doc.slug}</span>
                              {doc.publishedAt && <span>{new Date(doc.publishedAt).toLocaleDateString()}</span>}
                            </div>
                          </div>
                        )}

                        {selectedCollection === "events" && (
                          <div>
                            <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border mb-2 ${
                              doc.isUpcoming 
                                ? "bg-emerald-950/60 text-emerald-400 border-emerald-900/50" 
                                : "bg-slate-950 text-slate-500 border-slate-800"
                            }`}>
                              {doc.isUpcoming ? "Upcoming" : "Past Event"}
                            </span>
                            <h5 className="text-sm font-semibold text-white line-clamp-1">{doc.title}</h5>
                            <p className="text-xs text-slate-400 mt-1.5 font-mono line-clamp-1">📍 {doc.location || "Location not set"}</p>
                            {doc.eventDate && (
                              <p className="text-[11px] text-sky-400 mt-1.5 font-semibold">📅 Date: {new Date(doc.eventDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        )}

                        {selectedCollection === "programs" && (
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">Order: {doc.order ?? 0}</span>
                            <h5 className="text-sm font-semibold text-white mt-2">{doc.title}</h5>
                            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{doc.description || "No description loaded."}</p>
                            <p className="text-[10px] text-indigo-400 mt-2 font-semibold font-mono">Slug: {doc.slug}</p>
                          </div>
                        )}

                        {selectedCollection === "members" && (
                          <div>
                            <span className="inline-block text-[10px] bg-sky-950/60 text-sky-400 border border-sky-900/50 px-2 py-0.5 rounded font-semibold mb-2">
                              LC: {doc.lc?.name || "National"}
                            </span>
                             <h5 className="text-sm font-semibold text-white">{doc.fullName}</h5>
                             <p className="text-xs text-indigo-300 mt-1 font-medium">{doc.role || "Member"}</p>
                             <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">&quot;{doc.bio || "Active representative."}&quot;</p>
                          </div>
                        )}

                        {selectedCollection === "partners" && (
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50 mb-2 inline-block">
                                {doc.type} partner
                              </span>
                              <h5 className="text-sm font-semibold text-white">{doc.name}</h5>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                              <span>Priority: {doc.order ?? 0}</span>
                              {doc.website && <span className="underline truncate max-w-[120px]">{doc.website}</span>}
                            </div>
                          </div>
                        )}

                        {selectedCollection === "lcs" && (
                          <div>
                            <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-500">Sort Priority: {doc.order ?? 0}</span>
                            <h5 className="text-sm font-semibold text-white mt-2">{doc.name}</h5>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2">Contact: {doc.email || "No contact email"}</p>
                          </div>
                        )}

                        {selectedCollection === "testimonials" && (
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-xs text-slate-300 italic line-clamp-3">&quot;{doc.quote}&quot;</p>
                            <div className="mt-4 pt-3 border-t border-slate-800/80">
                              <h5 className="text-xs font-semibold text-white">{doc.authorName}</h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">{doc.authorRole || "Exchange Participant"}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {explorerData && explorerData.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xs text-slate-400">
                      Showing Page {explorerData.page} of {explorerData.totalPages} ({explorerData.totalDocs} entries)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={!explorerData.hasPrevPage}
                        className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-xs text-white disabled:opacity-50 transition cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(explorerData.totalPages, p + 1))}
                        disabled={!explorerData.hasNextPage}
                        className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-xs text-white disabled:opacity-50 transition cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Raw JSON Payload Response</h4>
                  <span className="text-xs text-slate-500 font-mono">GET /api/{selectedCollection === "lcs" ? "lcs" : selectedCollection}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden relative shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-3 text-xs text-slate-400 font-mono">
                    <span>STATUS: {explorerLoading ? "FETCHING..." : explorerError ? "ERROR 500" : "200 OK"}</span>
                    <span>SIZE: {explorerData ? `${JSON.stringify(explorerData).length} bytes` : "0 bytes"}</span>
                  </div>

                  <pre className="text-xs text-sky-300 font-mono overflow-y-auto max-h-[420px] scrollbar-thin scrollbar-thumb-slate-800">
                    {explorerLoading ? (
                      <code className="text-slate-500 animate-pulse">Waiting for response data...</code>
                    ) : explorerData ? (
                      <code>{JSON.stringify(explorerData, null, 2)}</code>
                    ) : (
                      <code className="text-slate-600">Select a collection above to retrieve database documents</code>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FORM SUBMISSION SIMULATOR TAB ──────────────────────── */}
        {activeTab === "tester" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form inputs section */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Form Submission Sandbox</h3>
                <p className="text-xs text-slate-400">Simulate front-end form submissions. The API will validate types via Zod, write to PostgreSQL, and append rows into Google Sheets.</p>
              </div>

              {/* Form type Selector tabs */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
                {(["member", "partner", "exchange"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFormType(type);
                      setSubmitResult(null);
                      setSubmitSuccess(null);
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                      formType === type
                        ? "bg-sky-500 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Submit handler forms */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {formType === "member" && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.name}
                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={memberForm.email}
                          onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number *</label>
                        <input
                          type="text"
                          required
                          value={memberForm.phone}
                          onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                          placeholder="e.g. +977 98xxxxxxxxx"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">College/University *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.college}
                        onChange={(e) => setMemberForm({ ...memberForm, college: e.target.value })}
                        placeholder="Kathmandu University"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Statement / Message (Optional)</label>
                      <textarea
                        value={memberForm.message}
                        onChange={(e) => setMemberForm({ ...memberForm, message: e.target.value })}
                        placeholder="Tell us why you want to join AIESEC..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </>
                )}

                {formType === "partner" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Organization Name *</label>
                        <input
                          type="text"
                          required
                          value={partnerForm.organizationName}
                          onChange={(e) => setPartnerForm({ ...partnerForm, organizationName: e.target.value })}
                          placeholder="Tech Corp Nepal"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Contact Person Name *</label>
                        <input
                          type="text"
                          required
                          value={partnerForm.contactPerson}
                          onChange={(e) => setPartnerForm({ ...partnerForm, contactPerson: e.target.value })}
                          placeholder="Rita Shrestha"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Contact Email *</label>
                        <input
                          type="email"
                          required
                          value={partnerForm.contactEmail}
                          onChange={(e) => setPartnerForm({ ...partnerForm, contactEmail: e.target.value })}
                          placeholder="rita@techcorp.com.np"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number (Optional)</label>
                        <input
                          type="text"
                          value={partnerForm.phone}
                          onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                          placeholder="+977 1-4xxxxxx"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Partnership Type *</label>
                      <select
                        value={partnerForm.partnershipType}
                        onChange={(e) => setPartnerForm({ ...partnerForm, partnershipType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="sponsorship">Sponsorship</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="media">Media Partner</option>
                        <option value="other">Other Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Message (Optional)</label>
                      <textarea
                        value={partnerForm.message}
                        onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                        placeholder="Detail out your partnership query..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </>
                )}

                {formType === "exchange" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={exchangeForm.name}
                          onChange={(e) => setExchangeForm({ ...exchangeForm, name: e.target.value })}
                          placeholder="Siddharth Gurung"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={exchangeForm.email}
                          onChange={(e) => setExchangeForm({ ...exchangeForm, email: e.target.value })}
                          placeholder="siddharth@gmail.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number *</label>
                        <input
                          type="text"
                          required
                          value={exchangeForm.phone}
                          onChange={(e) => setExchangeForm({ ...exchangeForm, phone: e.target.value })}
                          placeholder="+977 98xxxxxxxx"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">AIESEC Exchange Program *</label>
                        <select
                          value={exchangeForm.program}
                          onChange={(e) => setExchangeForm({ ...exchangeForm, program: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        >
                          <option value="global-volunteer">Global Volunteer</option>
                          <option value="global-talent">Global Talent</option>
                          <option value="global-teacher">Global Teacher</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">College/University *</label>
                      <input
                        type="text"
                        required
                        value={exchangeForm.college}
                        onChange={(e) => setExchangeForm({ ...exchangeForm, college: e.target.value })}
                        placeholder="Tribhuvan University"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Motivation / Details (Optional)</label>
                      <textarea
                        value={exchangeForm.motivation}
                        onChange={(e) => setExchangeForm({ ...exchangeForm, motivation: e.target.value })}
                        placeholder="Explain your goals for choosing this exchange program..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-650/15"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving and Syncing Submissions...
                    </>
                  ) : (
                    <>
                      Submit Simulation Lead
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Response inspector panel */}
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-2">Simulated Post Payload</h4>
                  <p className="text-xs text-slate-400 mb-4">The exact JSON object being dispatched by the client side browser to `POST /api/submit` :</p>
                  
                  <pre className="text-xs text-sky-400 font-mono bg-slate-900/40 p-4 border border-slate-900 rounded-xl overflow-x-auto">
                    <code>
                      {JSON.stringify({
                        type: formType,
                        fields: formType === "member" ? memberForm : formType === "partner" ? partnerForm : exchangeForm
                      }, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-4">Response Console Result</h4>
                
                {submitSuccess === null ? (
                  <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
                    awaiting submission trigger...
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${submitSuccess ? "bg-emerald-400 animate-ping" : "bg-rose-400"}`} />
                      <span className={`text-xs font-semibold uppercase tracking-wide ${submitSuccess ? "text-emerald-400" : "text-rose-400"}`}>
                        {submitSuccess ? "Success: Lead Added" : "Error: Submission Rejected"}
                      </span>
                    </div>

                    <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-slate-200">
                      <code>{JSON.stringify(submitResult, null, 2)}</code>
                    </pre>

                    {submitSuccess && (
                      <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 text-xs text-emerald-300">
                        ✨ **Integration Success**: Submission validated by Zod schema and recorded successfully. If configured, Google Sheets row was added asynchronously.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AIESEC Nepal Chapter. Sandbox Control Center.</p>
          <div className="flex gap-4">
            <Link href="/admin" className="hover:text-slate-300 transition">CMS Administration</Link>
            <span className="text-slate-800">|</span>
            <span className="text-slate-400">PostgreSQL + Prisma Client Active</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

