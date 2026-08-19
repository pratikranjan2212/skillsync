"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Bell,
  SlidersHorizontal,
  CheckCircle2,
  Plus,
  X,
  Clock,
  Camera,
  Upload,
  RefreshCw,
  Trash2,
  Crop,
  Image as ImageIcon,
  Search,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import { useAuth } from "@/app/hooks/useAuth";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import ImageCropperModal from "@/app/components/profile/ImageCropperModal";
import DatePickerFlyout from "@/app/components/ui/DatePickerFlyout";
import { GitHubIcon, LinkedInIcon, PortfolioIcon } from "@/app/components/icons";
import { STUDENT_INTERN_SKILLS, PRELOADED_SKILL_RECOMMENDATIONS } from "@/app/data/studentInternSkills";

function GitHubLogo({ className = "w-4 h-4 shrink-0" }) {
  return <GitHubIcon className={className} />;
}

function LinkedInLogo({ className = "w-4 h-4 shrink-0" }) {
  return <LinkedInIcon className={className} />;
}

function PortfolioLogo({ className = "w-4 h-4 shrink-0" }) {
  return <PortfolioIcon className={className} />;
}

async function fetchUserProfile() {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("Failed to load profile");
  const data = await res.json();
  return data.profile;
}

async function updateUserProfile(payload) {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.details || `Failed to update profile (${res.status})`);
  }
  return res.json();
}

function formatNameClient(name, login) {
  if (name && name.trim() && (name.includes(" ") || /[A-Z]/.test(name))) return name.trim();
  const raw = name || login || "";
  if (!raw) return "Student User";

  let cleaned = raw.replace(/\d+$/, "").replace(/[._-]+/g, " ").trim();
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, "$1 $2");

  const common = {
    tonystark: "Tony Stark",
    peterparker: "Peter Parker",
    brucewayne: "Bruce Wayne",
    clarkkent: "Clark Kent",
    alexchen: "Alex Chen",
    pratikranjan: "Pratik Ranjan",
  };

  const key = cleaned.toLowerCase().replace(/\s+/g, "");
  if (common[key]) return common[key];

  return (
    cleaned
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ") || raw
  );
}

function parseDobToDateInput(dobStr) {
  if (!dobStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) return dobStr;
  const d = new Date(dobStr);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
}

function formatDateFromInput(val) {
  if (!val) return "";
  const parts = val.split("-");
  if (parts.length !== 3) return val;
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  if (monthIdx >= 0 && monthIdx < 12) {
    return `${day} ${months[monthIdx]} ${year}`;
  }
  return val;
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading, user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const datePickerRef = useRef(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isSkillFocused, setIsSkillFocused] = useState(false);
  const skillInputRef = useRef(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const deleteInputRef = useRef(null);

  useEffect(() => {
    if (showDeleteModal) {
      setTimeout(() => deleteInputRef.current?.focus(), 80);
    }
  }, [showDeleteModal]);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") return;
    setIsDeletingAccount(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `Failed to delete account (${res.status})`);
      }

      // Clear client session cookies
      document.cookie = "skillsync_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "authjs.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "__Secure-authjs.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "skillsync_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      queryClient.clear();

      try {
        await signOut({ redirect: false });
      } catch {}

      window.location.href = "/";
    } catch (err) {
      console.error("Account deletion error:", err);
      setDeleteError(err.message || "Failed to delete account. Please try again.");
      setIsDeletingAccount(false);
    }
  };

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
    enabled: isAuthenticated,
  });

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "Male",
    image: "",
    college: "",
    degree: "",
    batch: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    skills: [],
    emailNotifications: true,
    publicPassport: true,
  });

  const [isSkillsInitialized, setIsSkillsInitialized] = useState(false);

  useEffect(() => {
    // Only update formData from profile when not actively editing
    if (isEditing) return;

    if (profile) {
      setFormData({
        name: profile.name || formatNameClient(profile.name, authUser?.name),
        dob: profile.dob || "",
        gender: profile.gender && profile.gender !== "Student" ? profile.gender : "Male",
        image: profile.image || authUser?.image || "",
        college: profile.college || "",
        degree: profile.degree || "",
        batch: profile.batch || "",
        bio: profile.bio || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        portfolio: profile.portfolio || "",
        skills: profile.skills || [],
        emailNotifications: true,
        publicPassport: profile.passport?.isPublic ?? true,
      });
      setIsSkillsInitialized(true);
      if (profile.image) setCustomPhotoUrl(profile.image);
    } else if (authUser) {
      setFormData((prev) => ({
        ...prev,
        name: formatNameClient(authUser.name, authUser.email ? authUser.email.split("@")[0] : ""),
        image: authUser.image || "",
      }));
    }
  }, [profile, authUser, isEditing]);

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], data.profile);
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["skill-passport"] });
      queryClient.invalidateQueries({ queryKey: ["dash-passport"] });
      queryClient.invalidateQueries({ queryKey: ["dash-evidence"] });
      setIsEditing(false);
      setShowPhotoModal(false);
      setShowCropperModal(false);
      setImageToCrop(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    },
    onError: (err) => {
      console.error("Profile update mutation error:", err);
      alert("Failed to save changes: " + (err.message || "Unknown error"));
    },
  });

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Image size should be less than 8MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImageToCrop(base64);
      setShowCropperModal(true);
      setShowPhotoModal(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPhotoUrl = (e) => {
    if (e) e.preventDefault();
    const trimmed = customPhotoUrl.trim();
    if (!trimmed) return;
    setImageToCrop(trimmed);
    setShowCropperModal(true);
    setShowPhotoModal(false);
  };

  const handleCropComplete = (croppedDataUrl) => {
    const updated = { ...formData, image: croppedDataUrl };
    setFormData(updated);
    updateMutation.mutate(updated);
    setShowCropperModal(false);
    setImageToCrop(null);
  };

  const handleRemovePhoto = () => {
    const updated = { ...formData, image: "" };
    setFormData(updated);
    setCustomPhotoUrl("");
    updateMutation.mutate(updated);
  };

  const handleAddSkillByName = (skillName) => {
    const trimmed = skillName?.trim();
    if (!trimmed) return;
    if (!formData.skills.includes(trimmed)) {
      const updatedSkills = [...formData.skills, trimmed];
      const newFormData = { ...formData, skills: updatedSkills };
      setFormData(newFormData);
      setNewSkillInput("");
      updateMutation.mutate(newFormData);
    } else {
      setNewSkillInput("");
    }
  };

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    handleAddSkillByName(newSkillInput);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter((s) => s !== skillToRemove);
    const newFormData = { ...formData, skills: updatedSkills };
    setFormData(newFormData);
    updateMutation.mutate(newFormData);
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111]">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <AuthRequiredView
            title="Authentication Required"
            subtitle="Please sign in to view and manage your SkillSync profile."
          />
        </main>
      </div>
    );
  }

  const displayName = formatNameClient(formData.name || profile?.name || authUser?.name, authUser?.name);
  const displayEmail = profile?.email || authUser?.email || "student@skillsync.edu";
  const displayRole = profile?.role || authUser?.role || "student";
  const displayStudentId = profile?.studentId || "SS-2026-STU01";
  const displayImage = formData.image || profile?.image || authUser?.image;
  const userInitials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "ST";

  const evidenceCount = profile?.evidenceCount || 0;
  const trustScore = profile?.trustScore;
  const hasEvidence = evidenceCount > 0 && trustScore !== null;
  const shareToken = profile?.passport?.shareToken || displayStudentId;

  const isProfileComplete = Boolean(
    (profile?.college || formData.college)?.trim() &&
    (profile?.degree || formData.degree)?.trim() &&
    (profile?.batch || formData.batch)?.trim() &&
    (profile?.dob || formData.dob)?.trim()
  );

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-6xl 2xl:max-w-7xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6">
        {savedSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Profile and skills successfully updated and saved to your account.</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-xl border border-black/5 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Profile Avatar with Hover Change Photo Trigger */}
              <div className="relative group cursor-pointer" onClick={() => setShowPhotoModal(true)}>
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md transition-all group-hover:brightness-75"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-2xl sm:text-3xl ring-4 ring-emerald-500/20 shadow-md transition-all group-hover:brightness-75">
                    {userInitials}
                  </div>
                )}

                {/* Camera Overlay on Avatar Hover */}
                <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                </div>

                <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1.5 rounded-xl shadow-md z-10">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                    {displayName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white uppercase tracking-wider">
                    {displayRole}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-xs font-medium text-[#494D4D]">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{displayEmail}</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ID: {displayStudentId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <Link
                href={`/passport/${shareToken}`}
                target="_blank"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <span>Preview Public Card</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-[#494D4D] hover:text-[#111111] hover:bg-neutral-200"
              }`}
            >
              Account Overview
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-[#494D4D] hover:text-[#111111] hover:bg-neutral-200"
              }`}
            >
              Preferences & Security
            </button>
          </div>
        </div>

        {/* Incomplete Profile Callout Banner */}
        {!isProfileComplete && !isEditing && (
          <div className="mb-6 p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-500/30 rounded-3xl sm:rounded-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-[#111111] tracking-tight">
                    Complete Your Student Profile Details
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 uppercase tracking-wide">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-[#494D4D] mt-0.5 max-w-2xl">
                  Your identity has been automatically synced from your account. Please complete your <strong>Institution, Degree, Batch & Date of Birth</strong> to generate your official Verified Skill Passport.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Complete Profile Now</span>
            </button>
          </div>
        )}

        {/* Modal: Change Profile Picture */}
        {showPhotoModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/10 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#111111]">Update Profile Picture</h3>
                    <p className="text-xs text-[#494D4D]">Upload an image or sync from your GitHub account.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col items-center gap-4">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-2xl ring-4 ring-emerald-500/20 shadow-md">
                    {userInitials}
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-2xl shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Upload Image File</span>
                </button>

                <form onSubmit={handleApplyPhotoUrl} className="w-full flex items-center gap-2 mt-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
                  >
                    Apply URL
                  </button>
                </form>

                {displayImage && (
                  <div className="w-full flex flex-col gap-2 pt-1 border-t border-neutral-100 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setImageToCrop(displayImage);
                        setShowCropperModal(true);
                        setShowPhotoModal(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Crop className="w-4 h-4 text-emerald-600" />
                      <span>Crop & Adjust Current Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo & Use Initials Avatar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Interactive Image Cropper */}
        {showCropperModal && imageToCrop && (
          <ImageCropperModal
            imageSrc={imageToCrop}
            onCancel={() => {
              setShowCropperModal(false);
              setImageToCrop(null);
            }}
            onCropComplete={handleCropComplete}
            isProcessing={updateMutation.isPending}
          />
        )}

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Personal Profile & Links Card */}
              <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-xl border border-black/5">
                <div className="flex flex-wrap items-center gap-3 mb-5 pb-4 border-b border-neutral-100">
                  <h2 className="text-lg font-extrabold text-[#111111] flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>Personal Profile</span>
                  </h2>
                  {(formData.dob || profile?.dob || formData.gender || profile?.gender) && (
                    <div className="flex items-center gap-2 text-xs font-medium text-[#494D4D]">
                      {(formData.dob || profile?.dob) && (
                        <span className="flex items-center gap-1 bg-[#F5F5F3] px-2.5 py-1 rounded-lg border border-black/5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>DOB: {formData.dob || profile?.dob}</span>
                        </span>
                      )}
                      {(formData.gender || profile?.gender) && (
                        <span className="flex items-center gap-1 bg-[#F5F5F3] px-2.5 py-1 rounded-lg border border-black/5">
                          <User className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{formData.gender || profile?.gender}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="flex flex-col gap-4">
                    {/* Full Name & Date of Birth (DOB) Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Tony Stark / Pratik Ranjan"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">Date of Birth (DOB)</label>
                        <DatePickerFlyout
                          value={formData.dob}
                          onChange={(val) => setFormData({ ...formData, dob: val })}
                          placeholder="e.g. 21 January 2004"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">College / Institution</label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="e.g. Stanford University / Tech Institute"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">Degree / Major</label>
                        <input
                          type="text"
                          value={formData.degree}
                          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                          placeholder="e.g. B.S. Computer Science"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">Batch / Graduation Year</label>
                        <input
                          type="text"
                          value={formData.batch}
                          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                          placeholder="e.g. 2023 – 2027"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">Gender</label>
                        <select
                          value={formData.gender || "Male"}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">GitHub Profile</label>
                        <input
                          type="text"
                          value={formData.github}
                          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                          placeholder="https://github.com/username"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#111111] mb-1.5">Portfolio / Website</label>
                        <input
                          type="text"
                          value={formData.portfolio}
                          onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                          placeholder="https://yourportfolio.dev"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-[#494D4D] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {updateMutation.isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        <span>{updateMutation.isPending ? "Saving..." : "Save Changes"}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-6">
                    {/* Primary Degree & Academic Background */}
                    {(formData.degree || formData.college || formData.batch || profile?.degree || profile?.college || profile?.batch) && (
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-200/60">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Primary Degree & Academic Background</div>
                          <div className="text-base sm:text-lg font-extrabold text-[#111111] mt-0.5">
                            {formData.degree || profile?.degree || "Degree not specified"}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#494D4D] mt-1 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{formData.college || profile?.college || "Institution not specified"}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Batch: {formData.batch || profile?.batch || "Not specified"}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
                      {formData.github ? (
                        <a
                          href={formData.github.startsWith("http") ? formData.github : `https://${formData.github}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2.5 p-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-2xl border border-black/5 transition-colors text-xs font-bold text-[#111111]"
                        >
                          <GitHubLogo className="w-4.5 h-4.5 text-neutral-900 shrink-0" />
                          <span className="truncate">GitHub</span>
                          <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 border border-dashed border-neutral-300 rounded-2xl text-xs font-medium text-neutral-500 cursor-pointer"
                        >
                          <GitHubLogo className="w-4 h-4 text-neutral-500 shrink-0" />
                          <span>+ Add GitHub Link</span>
                        </button>
                      )}

                      {formData.linkedin ? (
                        <a
                          href={formData.linkedin.startsWith("http") ? formData.linkedin : `https://${formData.linkedin}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2.5 p-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-2xl border border-black/5 transition-colors text-xs font-bold text-[#111111]"
                        >
                          <LinkedInLogo className="w-4.5 h-4.5 text-[#0A66C2] shrink-0" />
                          <span className="truncate">LinkedIn</span>
                          <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 border border-dashed border-neutral-300 rounded-2xl text-xs font-medium text-neutral-500 cursor-pointer"
                        >
                          <LinkedInLogo className="w-4 h-4 text-[#0A66C2] shrink-0" />
                          <span>+ Add LinkedIn Link</span>
                        </button>
                      )}

                      {formData.portfolio ? (
                        <a
                          href={formData.portfolio.startsWith("http") ? formData.portfolio : `https://${formData.portfolio}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2.5 p-3 bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-2xl border border-black/5 transition-colors text-xs font-bold text-[#111111]"
                        >
                          <PortfolioLogo className="w-5 h-5 shrink-0" />
                          <span className="truncate">Portfolio</span>
                          <ExternalLink className="w-3 h-3 ml-auto text-neutral-400" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 border border-dashed border-neutral-300 rounded-2xl text-xs font-medium text-neutral-500 cursor-pointer"
                        >
                          <PortfolioLogo className="w-4.5 h-4.5 shrink-0" />
                          <span>+ Add Portfolio Link</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Card with Add/Delete Feature */}
              <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-xl border border-black/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-extrabold text-[#111111] flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span>Active Verifiable Skills ({formData.skills.length})</span>
                  </h2>
                  <Link
                    href="/passport"
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Full Passport</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Unified Add Skill Input with Focus Animation & Intelligent Recommendations */}
                <div className="relative mb-5">
                  <div
                    className={`relative flex items-center bg-[#F8F9FA] rounded-2xl border transition-all duration-300 ease-out ${
                      isSkillFocused
                        ? "scale-[1.015] bg-white border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/15"
                        : "border-black/5 hover:border-black/10"
                    }`}
                  >
                    <Search
                      className={`w-4 h-4 ml-4 shrink-0 transition-colors duration-300 ${
                        isSkillFocused ? "text-emerald-600" : "text-neutral-400"
                      }`}
                    />
                    <input
                      ref={skillInputRef}
                      type="text"
                      value={newSkillInput}
                      onFocus={() => setIsSkillFocused(true)}
                      onBlur={() => {
                        setTimeout(() => setIsSkillFocused(false), 200);
                      }}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newSkillInput.trim()) {
                            const matchingSkill = PRELOADED_SKILL_RECOMMENDATIONS.find(
                              (sk) =>
                                !formData.skills.includes(sk) &&
                                sk.toLowerCase() === newSkillInput.trim().toLowerCase()
                            );
                            handleAddSkillByName(matchingSkill || newSkillInput);
                            setIsSkillFocused(false);
                          }
                        } else if (e.key === "Escape") {
                          setIsSkillFocused(false);
                          skillInputRef.current?.blur();
                        }
                      }}
                      placeholder="Type a skill (e.g. React, Python, SQL, Node js)..."
                      className="w-full pl-3.5 pr-4 py-3.5 bg-transparent text-xs sm:text-sm font-semibold text-[#111111] placeholder:text-neutral-400 placeholder:font-normal focus:outline-none"
                    />
                  </div>

                  {/* Autocomplete / Preloaded Recommendations Dropdown (shown only when typing) */}
                  {isSkillFocused && newSkillInput.trim().length > 0 && (
                    <div
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-black/10 z-50 p-2 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                        <span>Recommended Skills</span>
                        <span className="text-[9px] font-normal text-neutral-400">Click to add</span>
                      </div>
                      {(() => {
                        const q = newSkillInput.trim().toLowerCase();
                        const startsWith = [];
                        const contains = [];

                        for (const s of STUDENT_INTERN_SKILLS) {
                          if (formData.skills.includes(s.name)) continue;
                          const sLower = s.name.toLowerCase();
                          if (sLower.startsWith(q)) {
                            startsWith.push(s);
                          } else if (sLower.includes(q)) {
                            contains.push(s);
                          }
                        }

                        const matching = [...startsWith, ...contains].slice(0, 16);

                        if (matching.length > 0) {
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                              {matching.map((sk) => (
                                <button
                                  key={sk.name}
                                  type="button"
                                  onClick={() => {
                                    handleAddSkillByName(sk.name);
                                    setIsSkillFocused(false);
                                  }}
                                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 text-left transition-colors group cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shrink-0" />
                                    <span className="text-xs font-bold text-neutral-800 group-hover:text-emerald-950 truncate">
                                      {sk.name}
                                    </span>
                                    {sk.category && (
                                      <span className="text-[9px] font-semibold text-neutral-400 bg-neutral-100 group-hover:bg-emerald-100 group-hover:text-emerald-800 px-1.5 py-0.2 rounded-md shrink-0">
                                        {sk.category}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-100/70 px-2 py-0.5 rounded-md shrink-0 ml-2">
                                    + Add
                                  </span>
                                </button>
                              ))}
                            </div>
                          );
                        }

                        if (newSkillInput.trim()) {
                          return (
                            <div className="p-3 text-center text-xs text-neutral-500">
                              No matching preloaded preset. Press{" "}
                              <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-bold text-neutral-800">
                                Enter
                              </kbd>{" "}
                              to save as custom skill.
                            </div>
                          );
                        }

                        return (
                          <div className="p-3 text-center text-xs text-neutral-400">All preset skills added!</div>
                        );
                      })()}

                      {/* Custom skill direct add prompt if user typed something not matching presets */}
                      {newSkillInput.trim() &&
                        !STUDENT_INTERN_SKILLS.some(
                          (sk) => sk.name.toLowerCase() === newSkillInput.trim().toLowerCase()
                        ) &&
                        !formData.skills.includes(newSkillInput.trim()) && (
                          <button
                            type="button"
                            onClick={() => {
                              handleAddSkillByName(newSkillInput.trim());
                              setIsSkillFocused(false);
                            }}
                            className="w-full mt-1.5 pt-2 border-t border-neutral-100 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-50 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                          >
                            <span className="text-xs font-bold text-emerald-800">
                              Add &quot;{newSkillInput.trim()}&quot; as custom skill
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                              Custom
                            </span>
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {formData.skills.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {formData.skills.map((skillName, index) => (
                      <div
                        key={index}
                        className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center justify-between group hover:border-black/10 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-extrabold text-[#111111]">{skillName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skillName)}
                          title="Remove Skill"
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#F8F9FA] rounded-2xl border border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2">
                    <Award className="w-8 h-8 text-neutral-300" />
                    <div className="text-xs font-bold text-[#111111]">No Skills Added Yet</div>
                    <p className="text-[11px] text-[#494D4D] max-w-sm">
                      Add your technical competencies above or submit evidence records in the dashboard to automatically extract and verify skills.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="flex flex-col gap-6">
              {/* Credential Trust Score Card */}
              <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-xl border border-black/5">
                <h3 className="text-sm font-bold text-[#111111] mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Credential Trust Score</span>
                </h3>

                {hasEvidence ? (
                  <>
                    <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/60 mb-4 text-center">
                      <div className="text-3xl font-black text-emerald-800">{trustScore}%</div>
                      <div className="text-[11px] font-bold text-emerald-700 mt-1">
                        {parseFloat(trustScore) >= 85
                          ? "High Institutional Trust"
                          : parseFloat(trustScore) >= 65
                          ? "Moderate Institutional Trust"
                          : "Verification In Progress"}
                      </div>
                    </div>

                    <ul className="flex flex-col gap-2.5 text-xs text-[#494D4D]">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Cryptographically signed credential hash</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>OCR transcript domain validated</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{evidenceCount} verified evidence {evidenceCount === 1 ? "record" : "records"} attached</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="bg-neutral-50 rounded-2xl p-5 border border-dashed border-neutral-300 mb-4 text-center flex flex-col items-center gap-1.5">
                      <Clock className="w-6 h-6 text-neutral-400" />
                      <div className="text-sm font-black text-neutral-700">Awaiting Evidence</div>
                      <div className="text-[11px] text-neutral-500 font-medium leading-tight">
                        Trust score will calculate once you submit your first coursework or GitHub evidence.
                      </div>
                    </div>

                    <ul className="flex flex-col gap-2.5 text-xs text-neutral-400">
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center shrink-0 text-[10px]">1</div>
                        <span>Upload transcript or project evidence</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center shrink-0 text-[10px]">2</div>
                        <span>Automated OCR & cryptographic validation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center shrink-0 text-[10px]">3</div>
                        <span>Verifiable credential trust score generated</span>
                      </li>
                    </ul>
                  </>
                )}

                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <Link
                    href="/dashboard/evidence/new"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{hasEvidence ? "Submit New Evidence" : "Submit First Evidence"}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-6">
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
                  checked={formData.emailNotifications}
                  onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
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
                  checked={formData.publicPassport}
                  onChange={(e) => setFormData({ ...formData, publicPassport: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Danger Zone in Settings Tab */}
            <div className="mt-4 pt-6 border-t border-neutral-100">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 shrink-0 border border-rose-200/50 shadow-2xs">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#111111]">Delete Account & Purge Records</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-700">
                        Danger Zone
                      </span>
                    </div>
                    <p className="text-xs text-[#494D4D] mt-1 max-w-xl leading-relaxed">
                      Permanently delete your student profile, academic credentials, verified evidence uploads, and all database records from SkillSync. This action is irreversible.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setDeleteConfirmText("");
                    setDeleteError("");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Focused Account Deletion Confirmation Dialog */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-account-dialog-title"
              className="bg-white rounded-4xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-200"
            >
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 id="delete-account-dialog-title" className="text-lg font-black text-[#111111]">
                      Delete Account Permanently?
                    </h3>
                    <p className="text-xs text-rose-600 font-bold">This action is permanent & irreversible.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                    setDeleteError("");
                  }}
                  disabled={isDeletingAccount}
                  className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 flex flex-col gap-4 text-xs text-[#494D4D]">
                <p className="leading-relaxed">
                  You are about to permanently delete the account for <strong className="text-neutral-900 font-bold">{displayEmail}</strong> ({displayName}).
                </p>

                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/60 flex flex-col gap-2">
                  <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                    The following records will be permanently wiped:
                  </div>
                  <ul className="flex flex-col gap-1.5 text-xs text-rose-950 font-medium">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Personal profile, DOB, institution, bio, and social links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>All claimed skills and verified skill competencies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>All uploaded coursework and project evidence records</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Cryptographic Verifiable Credential Passport & share token ({displayStudentId})</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>All active login sessions and authentication records</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1.5">
                    To confirm deletion, please type <span className="font-mono text-rose-600 font-black">DELETE</span> below:
                  </label>
                  <input
                    ref={deleteInputRef}
                    type="text"
                    autoFocus
                    disabled={isDeletingAccount}
                    value={deleteConfirmText}
                    onChange={(e) => {
                      setDeleteConfirmText(e.target.value);
                      if (deleteError) setDeleteError("");
                    }}
                    placeholder="Type DELETE"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/10 text-xs font-bold text-[#111111] placeholder:text-neutral-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-rose-500 uppercase tracking-wide"
                  />
                </div>

                {deleteError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                    {deleteError}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  disabled={isDeletingAccount}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                    setDeleteError("");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-[#494D4D] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText.trim().toUpperCase() !== "DELETE" || isDeletingAccount}
                  onClick={handleDeleteAccount}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeletingAccount ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Purging Database Records...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Permanently Delete My Account</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

