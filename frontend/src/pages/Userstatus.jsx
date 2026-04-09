import React, { useEffect, useState } from "react";
import TopNavbar from "../Components/TopNavbar";
import { useDispatch, useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";
import { FiRefreshCw, FiUserCheck, FiUsers, FiClock, FiAlertTriangle } from "react-icons/fi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import image from "../images/user.png";
import {
  staffUser,
  managerUser,
  adminUser,
  pendingUsers,
  removeusers,
  approveUserAction,
  changeRoleAction,
} from "../features/authSlice";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────────────────
   Confirmation Modal Component
───────────────────────────────────────────────────────────────────────── */
function ConfirmDeleteModal({ user, onConfirm, onCancel }) {
  if (!user) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onCancel}
    >
      {/* Panel — stop click propagation so clicking inside doesn't close */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalPop 0.18s ease-out" }}
      >
        {/* Red top bar */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <FiAlertTriangle className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">Remove User?</h2>
            <p className="text-red-100 text-xs">This action cannot be undone</p>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl mb-4">
            <img
              src={user.ProfilePic || image}
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-red-200 object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-gray-500 text-sm truncate">{user.email}</p>
              <span
                className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : user.role === "manager"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm text-center">
            Are you sure you want to permanently remove{" "}
            <span className="font-semibold text-gray-800">{user.name}</span> from the system?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-sm transition shadow-sm"
          >
            Yes, Remove
          </button>
        </div>
      </div>

      {/* Keyframe animation injected inline */}
      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────── */
function Userstatus() {
  const { staffuser, manageruser, adminuser, pendinguser, Authuser } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  // confirmTarget holds the full user object to be deleted (or null)
  const [confirmTarget, setConfirmTarget] = useState(null);

  const fetchAll = () => {
    dispatch(staffUser());
    dispatch(managerUser());
    dispatch(adminUser());
    dispatch(pendingUsers());
  };

  useEffect(() => {
    fetchAll();
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAll();
    setTimeout(() => setRefreshing(false), 800);
  };

  /* Ask for confirmation — store user object, don't delete yet */
  const requestRemove = (user) => {
    setConfirmTarget(user);
  };

  /* User confirmed — now actually delete */
  const confirmRemove = () => {
    if (!confirmTarget) return;
    dispatch(removeusers(confirmTarget._id))
      .then(() => {
        toast.success(`${confirmTarget.name} has been removed.`);
        fetchAll();
      })
      .catch(() => toast.error("Error removing user"));
    setConfirmTarget(null);
  };

  const cancelRemove = () => setConfirmTarget(null);

  const handleApprove = (UserId) => {
    dispatch(approveUserAction(UserId))
      .then(() => {
        toast.success("User approved!");
        fetchAll();
      })
      .catch(() => toast.error("Error approving user"));
  };

  const handleChangeRole = (UserId, newRole) => {
    dispatch(changeRoleAction({ UserId, role: newRole }))
      .unwrap()
      .then(() => {
        toast.success(`User role changed to ${newRole}!`);
        fetchAll();
      })
      .catch((err) => toast.error(err || "Error changing user role"));
  };

  // ─── Derived data ──────────────────────────────────────────────────────
  const newSignups = Array.isArray(pendinguser) ? pendinguser : [];
  const approvedAdmins = (adminuser || []).filter((u) => u.isApproved);
  const approvedManagers = (manageruser || []).filter((u) => u.isApproved);
  const approvedStaff = (staffuser || []).filter((u) => u.isApproved);
  const totalUsers =
    approvedAdmins.length + approvedManagers.length + approvedStaff.length;

  // ─── Helpers ──────────────────────────────────────────────────────────
  const roleBadge = (role) => {
    const map = {
      admin: "bg-purple-100 text-purple-700",
      manager: "bg-blue-100 text-blue-700",
      staff: "bg-green-100 text-green-700",
    };
    return map[role] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ─── Approved‑user row renderer ────────────────────────────────────────
  const renderApprovedSection = (title, icon, usersList, colorClass) => {
    if (!usersList || usersList.length === 0) return null;
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <span className={`text-lg ${colorClass}`}>{icon}</span>
          <h3 className="text-base font-semibold text-gray-700">{title}</h3>
          <span className="ml-auto text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-medium">
            {usersList.length}
          </span>
        </div>
        <ul className="divide-y divide-gray-50">
          {usersList.map((user, index) => (
            <li
              key={user._id || index}
              className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user?.ProfilePic || image}
                  alt="User"
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {Authuser?.role === "admin" && user._id !== Authuser._id && (
                  <select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user._id, e.target.value)}
                    className="text-xs p-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-gray-700"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${roleBadge(user.role)}`}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                {Authuser?.role === "admin" && user._id !== Authuser._id && (
                  <button
                    onClick={() => requestRemove(user)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Remove User"
                  >
                    <TiDelete className="text-2xl" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Confirmation modal — rendered at the top level so it overlays everything */}
      <ConfirmDeleteModal
        user={confirmTarget}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />

      <TopNavbar />

      <div className="max-w-5xl mx-auto mt-8 px-4 space-y-6">

        {/* ─── Page Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage team members, approve new signups and assign roles
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg shadow-sm transition"
          >
            <FiRefreshCw className={`text-base ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ─── Stats Row ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "New Signups",
              value: newSignups.length,
              color: "bg-orange-50 border-orange-200",
              text: "text-orange-600",
              pulse: newSignups.length > 0,
            },
            {
              label: "Total Active",
              value: totalUsers,
              color: "bg-blue-50 border-blue-200",
              text: "text-blue-600",
            },
            {
              label: "Admins",
              value: approvedAdmins.length,
              color: "bg-purple-50 border-purple-200",
              text: "text-purple-600",
            },
            {
              label: "Managers",
              value: approvedManagers.length,
              color: "bg-green-50 border-green-200",
              text: "text-green-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${stat.color} border rounded-xl p-4 flex items-center gap-3`}
            >
              {stat.pulse && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              )}
              <div>
                <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── NEW SIGNUPS SECTION ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiClock className="text-orange-600 text-lg" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-800">New Signups</h2>
                <p className="text-xs text-gray-500">Users awaiting admin approval</p>
              </div>
            </div>
            {newSignups.length > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                {newSignups.length} Pending
              </span>
            )}
          </div>

          <div className="p-6">
            {newSignups.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUserCheck className="text-2xl text-green-500" />
                </div>
                <p className="text-gray-700 font-medium">All caught up!</p>
                <p className="text-gray-400 text-sm mt-1">No new signups waiting for approval.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {newSignups.map((user, index) => (
                  <li
                    key={user._id || index}
                    className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={user?.ProfilePic || image}
                          alt="User"
                          className="w-12 h-12 rounded-full border-2 border-orange-200 object-cover"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white"></span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        {user.createdAt && (
                          <p className="text-gray-400 text-xs mt-0.5">
                            Signed up: {formatDate(user.createdAt)}
                          </p>
                        )}
                        <div className="mt-1 flex gap-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${roleBadge(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                            Pending Approval
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {(Authuser?.role === "admin" || Authuser?.role === "manager") && (
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="flex items-center gap-1.5 text-sm bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm"
                        >
                          <FiUserCheck className="text-base" />
                          Approve
                        </button>
                      )}
                      {Authuser?.role === "admin" && (
                        <button
                          onClick={() => requestRemove(user)}
                          className="flex items-center gap-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg border border-red-200 transition"
                          title="Reject & Delete"
                        >
                          <TiDelete className="text-base" />
                          Reject
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ─── APPROVED USERS SECTION ──────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiUsers className="text-blue-600 text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Active Team Members</h2>
              <p className="text-xs text-gray-500">Approved users with system access</p>
            </div>
            <span className="ml-auto text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2.5 py-0.5 font-semibold">
              {totalUsers} Total
            </span>
          </div>

          <div className="p-6">
            {totalUsers === 0 ? (
              <p className="text-gray-400 text-center py-8 text-sm">No approved users yet.</p>
            ) : (
              <>
                {renderApprovedSection(
                  "Admins",
                  <MdOutlineAdminPanelSettings />,
                  approvedAdmins,
                  "text-purple-500"
                )}
                {renderApprovedSection(
                  "Managers",
                  <FiUsers />,
                  approvedManagers,
                  "text-blue-500"
                )}
                {renderApprovedSection(
                  "Staff",
                  <FiUsers />,
                  approvedStaff,
                  "text-green-500"
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Userstatus;
