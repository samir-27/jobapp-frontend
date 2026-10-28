import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchWithAuth } from "../utils/api";
import { FaUserPlus, FaUserShield, FaTrash, FaEnvelope, FaIdBadge } from "react-icons/fa";

const ROLES = [
  { key: "recruiter", label: "Recruiter" },
  { key: "hiring_manager", label: "Hiring Manager" },
  { key: "admin", label: "Company Admin" },
];

const CompanyTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    name: "",
    role: "recruiter",
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth("/team");
      if (!res.ok) throw new Error("Failed to fetch team members");
      const data = await res.json();
      setTeam(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching team:", err);
      toast.error("Could not load company team members.");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteForm.email.trim()) {
      toast.warning("Please provide a valid work email.");
      return;
    }

    try {
      setInviting(true);
      const res = await fetchWithAuth("/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteForm.email.trim().toLowerCase(),
          name: inviteForm.name.trim() || undefined,
          role: inviteForm.role,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to invite team member");
      }

      toast.success(`Invitation sent to ${inviteForm.email}!`);
      setShowInviteModal(false);
      setInviteForm({ email: "", name: "", role: "recruiter" });
      fetchTeam();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const res = await fetchWithAuth(`/team/${memberId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update role");
      }

      const updated = await res.json();
      setTeam((prev) =>
        prev.map((m) => (m._id === memberId ? updated : m))
      );
      toast.success("Team member role updated successfully.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRemoveMember = async (memberId, memberEmail) => {
    if (!window.confirm(`Are you sure you want to remove ${memberEmail} from your company team?`)) {
      return;
    }

    try {
      const res = await fetchWithAuth(`/team/${memberId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to remove member");
      }

      setTeam((prev) => prev.filter((m) => m._id !== memberId));
      toast.info(`Member ${memberEmail} has been removed.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm">Loading hiring team...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recruitment Team</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your company recruiters, hiring managers, and administrators.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-2 shadow-xs"
        >
          <FaUserPlus /> Invite Team Member
        </button>
      </div>

      {/* Team Members List */}
      {team.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl p-8">
          <FaIdBadge className="mx-auto text-4xl text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-700">No Additional Team Members</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            You are currently the primary admin. Invite your recruiting colleagues to collaborate on job postings and candidate reviews.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl bg-white overflow-hidden shadow-xs">
          {team.map((member) => {
            const displayName = member.name || member.user?.fullname || member.user?.name || member.email.split("@")[0];
            const isPending = member.status === "pending";

            return (
              <div
                key={member._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center uppercase shrink-0 text-sm">
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{displayName}</span>
                      <span
                        className={`text-2xs font-bold uppercase px-2 py-0.5 rounded-full border ${
                          isPending
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {member.status || "active"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <FaEnvelope className="text-gray-400" />
                      <span>{member.email}</span>
                      {member.invitedAt && (
                        <span className="text-2xs text-gray-400">
                          • Invited {new Date(member.invitedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1.5">
                    <FaUserShield className="text-gray-400 text-xs" />
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-gray-700 focus:outline-none focus:border-blue-500"
                    >
                      {ROLES.map((r) => (
                        <option key={r.key} value={r.key}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleRemoveMember(member._id, member.email)}
                    title="Remove team member"
                    className="p-2 text-gray-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Invite Colleague</h3>
            <p className="text-xs text-gray-500 mb-4">
              Send an invitation to join your company recruiting workspace.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, name: e.target.value })
                  }
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Team Role
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, role: e.target.value })
                  }
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none bg-white"
                >
                  {ROLES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <p className="text-2xs text-gray-400 mt-1">
                  {inviteForm.role === "admin"
                    ? "Full access to manage jobs, candidates, company profile, and invite team members."
                    : inviteForm.role === "recruiter"
                    ? "Can create and publish jobs, review applicants, schedule interviews, and extend offers."
                    : "Can review candidates and leave interview evaluation notes."}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                >
                  {inviting ? "Sending Invitation..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTeam;
