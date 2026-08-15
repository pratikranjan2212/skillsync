"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Award,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  ExternalLink,
  Code2,
  Globe,
  FileCheck,
  Sparkles,
  ChevronRight,
  Edit3,
  Check,
  Share2,
  Lock,
  Bell,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import { useAuth } from "@/app/hooks/useAuth";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import Badge from "@/app/components/ui/Badge";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable profile state initialized from mock / session data
  const [profileData, setProfileData] = useState({
    name: user?.name || INITIAL_PASSPORT.studentName,
    email: user?.email || "alex.chen@skillsync.edu",
    role: user?.role || "student",
    studentId: INITIAL_PASSPORT.studentId,
    college: INITIAL_PASSPORT.college,
    degree: INITIAL_PASSPORT.degree,
    batch: INITIAL_PASSPORT.batch,
    bio: "Passionate Computer Science student specializing in Scalable Systems, Deep Learning, and Verifiable Credentials. Exploring Full-Stack & Machine Learning Engineering opportunities.",
    github: "https://github.com/alexchen",
    linkedin: "https://linkedin.com/in/alexchen",
    portfolio: "https://alexchen.dev",
    emailNotifications: true,
    publicPassport: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111]">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <AuthRequiredView
            title="Authentication Required"
            message="Please sign in to view and manage your SkillSync profile."
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6">
        {/* Top Notification Toast */}
        {savedSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Profile details successfully updated and cryptographically synched with your passport.</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Profile Avatar */}
              <div className="relative">
                <img
                  src={INITIAL_PASSPORT.photoUrl}
                  alt={profileData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1.5 rounded-xl shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Identity & Badges */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                    {profileData.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white uppercase tracking-wider">
                    {profileData.role}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-[#494D4D]">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    {profileData.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neutral-400" />
                    {profileData.college}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ID: {profileData.studentId}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <Link
                href="/passport"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F5F5F3] hover:bg-[#EAEAEA] text-[#111111] rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>View Passport</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 pt-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === "overview"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-[#494D4D] hover:text-[#111111] hover:bg-neutral-200"
              }`}
            >
              Account Overview
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === "academic"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-[#494D4D] hover:text-[#111111] hover:bg-neutral-200"
              }`}
            >
              Academic & Credentials
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === "settings"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-[#494D4D] hover:text-[#111111] hover:bg-neutral-200"
              }`}
            >
              Preferences & Security
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Bio & Details Form / View */}
              <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-[#111111] flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>Personal Profile</span>
                  </h2>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#111111] mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#111111] mb-1.5">Bio / Summary</label>
                      <textarea
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">GitHub Profile</label>
                        <input
                          type="text"
                          value={profileData.github}
                          onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-[#494D4D]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-xs text-[#494D4D] leading-relaxed">
                      {profileData.bio}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <a
                        href={profileData.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-2xl border border-black/5 transition-colors text-xs font-bold text-[#111111]"
                      >
                        <Code2 className="w-4 h-4 text-neutral-800 shrink-0" />
                        <span className="truncate">GitHub</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
                      </a>

                      <a
                        href={profileData.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-2xl border border-black/5 transition-colors text-xs font-bold text-[#111111]"
                      >
                        <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">LinkedIn</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
                      </a>

                      <a
                        href={profileData.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-2xl border border-black/5 transition-colors text-xs font-bold text-[#111111]"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="truncate">Portfolio</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Verified Skills Summary Card */}
              <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-[#111111] flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span>Active Verifiable Skills ({INITIAL_PASSPORT.skills.length})</span>
                  </h2>
                  <Link
                    href="/passport"
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Full Passport</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INITIAL_PASSPORT.skills.map((skill) => (
                    <div
                      key={skill.skillId}
                      className="p-3.5 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-extrabold text-[#111111]">{skill.name}</div>
                        <div className="text-[10px] text-[#494D4D]">{skill.category}</div>
                      </div>
                      <Badge tier="verified-high" size="xs">
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="flex flex-col gap-6">
              {/* Trust Score & Verification Status */}
              <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5">
                <h3 className="text-sm font-bold text-[#111111] mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Credential Trust Score</span>
                </h3>

                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/60 mb-4 text-center">
                  <div className="text-3xl font-black text-emerald-800">98.4%</div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-1">High Institutional Trust</div>
                </div>

                <ul className="flex flex-col gap-2.5 text-xs text-[#494D4D]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cryptographically signed hash</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>OCR transcript domain matched</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No unverified claim flags</span>
                  </li>
                </ul>

                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <Link
                    href="/dashboard/evidence/new"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Submit New Evidence</span>
                  </Link>
                </div>
              </div>

              {/* Public Share Card */}
              <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5">
                <h3 className="text-sm font-bold text-[#111111] mb-2 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span>Public Passport Link</span>
                </h3>
                <p className="text-xs text-[#494D4D] mb-4">
                  Employers and recruiters can verify your skills directly without logging in.
                </p>

                <div className="p-2.5 bg-[#F5F5F3] rounded-xl border border-black/5 text-[11px] font-mono text-[#111111] truncate mb-3 select-all">
                  https://skillsync.edu/passport/{INITIAL_PASSPORT.shareToken}
                </div>

                <Link
                  href={`/passport/${INITIAL_PASSPORT.shareToken}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <span>Preview Public Card</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Academic */}
        {activeTab === "academic" && (
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5">
            <h2 className="text-lg font-extrabold text-[#111111] mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>Academic Background & Degree Credentials</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col gap-3">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Primary Degree</div>
                <div className="text-base font-extrabold text-[#111111]">{profileData.degree}</div>
                <div className="text-xs text-[#494D4D] flex items-center gap-2">
                  <Building className="w-4 h-4 text-neutral-400" />
                  <span>{profileData.college}</span>
                </div>
                <div className="text-xs text-[#494D4D] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>Batch: {profileData.batch}</span>
                </div>
              </div>

              <div className="p-5 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col gap-3">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Verification Authority</div>
                <div className="text-base font-extrabold text-[#111111]">{INITIAL_PASSPORT.issuer}</div>
                <div className="text-xs font-mono text-[#494D4D] break-all bg-white p-2.5 rounded-xl border border-black/5">
                  Hash: {INITIAL_PASSPORT.credentialHash}
                </div>
                <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 mt-auto">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Signed & Tamper-Proof Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Settings & Preferences */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#111111] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-neutral-700" />
                <span>Account Preferences & Security</span>
              </h2>
              <p className="text-xs text-[#494D4D] mt-1">
                Manage your notification rules, privacy toggles, and security settings.
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-neutral-100 pt-4">
              <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-black/5">
                <div>
                  <div className="text-xs font-bold text-[#111111] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-neutral-600" />
                    <span>Email Notifications</span>
                  </div>
                  <div className="text-[11px] text-[#494D4D] mt-0.5">
                    Receive alerts when new matching opportunities or verification outcomes occur.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.emailNotifications}
                  onChange={(e) => setProfileData({ ...profileData, emailNotifications: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-black/5">
                <div>
                  <div className="text-xs font-bold text-[#111111] flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-neutral-600" />
                    <span>Public Passport Visibility</span>
                  </div>
                  <div className="text-[11px] text-[#494D4D] mt-0.5">
                    Allow recruiters to view and verify your Skill Passport via your public share URL.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.publicPassport}
                  onChange={(e) => setProfileData({ ...profileData, publicPassport: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
