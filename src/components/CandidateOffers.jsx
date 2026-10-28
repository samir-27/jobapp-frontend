import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchWithAuth } from "../utils/api";
import { FaCalendarAlt, FaVideo, FaPhone, FaBuilding, FaCheck, FaTimes, FaMoneyBillWave, FaClock } from "react-icons/fa";

const CandidateOffers = () => {
  const [activeTab, setActiveTab] = useState("offers"); // 'offers' | 'interviews'
  const [offers, setOffers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [declineModalId, setDeclineModalId] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offersRes, interviewsRes] = await Promise.all([
        fetchWithAuth("/offers"),
        fetchWithAuth("/interviews"),
      ]);

      if (offersRes.ok) {
        const offersData = await offersRes.json();
        setOffers(Array.isArray(offersData) ? offersData : []);
      }
      if (interviewsRes.ok) {
        const interviewsData = await interviewsRes.json();
        setInterviews(Array.isArray(interviewsData) ? interviewsData : []);
      }
    } catch (err) {
      console.error("Error fetching offers/interviews:", err);
      toast.error("Failed to load interview and offer details.");
    } finally {
      setLoading(false);
    }
  };

  const handleRespondOffer = async (offerId, response, note = "") => {
    try {
      setSubmitting(true);
      const res = await fetchWithAuth(`/offers/${offerId}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response,
          candidateResponseNote: note || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit response.");
      }

      const updated = await res.json();
      setOffers((prev) =>
        prev.map((o) => (o._id === offerId ? updated : o))
      );

      if (response === "accepted") {
        toast.success("Congratulations! You have accepted the job offer! 🎉");
      } else {
        toast.info("You have declined the job offer.");
      }
      setDeclineModalId(null);
      setDeclineReason("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800 border-amber-300",
      accepted: "bg-emerald-100 text-emerald-800 border-emerald-300",
      rejected: "bg-rose-100 text-rose-800 border-rose-300",
      rescinded: "bg-gray-100 text-gray-700 border-gray-300",
      expired: "bg-gray-100 text-gray-600 border-gray-200",
      scheduled: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
      cancelled: "bg-rose-100 text-rose-800 border-rose-300",
    };
    return (
      <span
        className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-full border ${
          styles[status] || "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm">Loading interviews and job offers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Interviews & Job Offers</h2>
        <p className="text-xs text-gray-500 mt-1">
          Review interview appointments and formal employment offers extended by recruiting companies.
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition flex items-center gap-2 ${
              activeTab === "offers"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaMoneyBillWave /> Formal Offers ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab("interviews")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition flex items-center gap-2 ${
              activeTab === "interviews"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaCalendarAlt /> Scheduled Interviews ({interviews.length})
          </button>
        </div>
      </div>

      {/* OFFERS TAB */}
      {activeTab === "offers" && (
        <div className="space-y-4">
          {offers.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl p-8">
              <FaMoneyBillWave className="mx-auto text-4xl text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Job Offers Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Once an employer completes interviews and extends a formal contract, your job offer details, salary, and benefits will appear here.
              </p>
            </div>
          ) : (
            offers.map((offer) => {
              const jobTitle = offer.job?.title || "Position Offer";
              const compName = offer.company?.name || "Hiring Partner";
              const isPending = offer.status === "pending";

              return (
                <div
                  key={offer._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-sm transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-gray-900">{jobTitle}</h4>
                        {getStatusBadge(offer.status)}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <FaBuilding className="text-gray-400" />
                        <span className="font-semibold text-gray-700">{compName}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xl font-black text-emerald-600">
                        {offer.currency || "$"}
                        {Number(offer.salary || 0).toLocaleString()}
                      </div>
                      <span className="text-2xs text-gray-400 uppercase tracking-wider font-semibold">
                        Annual Compensation
                      </span>
                    </div>
                  </div>

                  {/* Dates & Logistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaCalendarAlt className="text-blue-500 shrink-0" />
                      <span>
                        <strong>Anticipated Start Date:</strong>{" "}
                        {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : "To be confirmed"}
                      </span>
                    </div>
                    {offer.expiresAt && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaClock className="text-amber-500 shrink-0" />
                        <span>
                          <strong>Offer Valid Until:</strong>{" "}
                          {new Date(offer.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  {Array.isArray(offer.benefits) && offer.benefits.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-2xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Included Benefits & Perks:
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {offer.benefits.map((b, i) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium border border-blue-100"
                          >
                            ✓ {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recruiter Notes */}
                  {offer.notes && (
                    <div className="mb-4 text-xs bg-slate-50 border-l-2 border-slate-400 p-2.5 text-gray-600 rounded-r">
                      <span className="font-semibold text-gray-800">Employer Message: </span>
                      {offer.notes}
                    </div>
                  )}

                  {/* Candidate Response Note (if declined) */}
                  {offer.candidateResponseNote && (
                    <div className="mb-4 text-xs bg-rose-50 border-l-2 border-rose-400 p-2.5 text-rose-800 rounded-r">
                      <span className="font-semibold">Candidate Response Note: </span>
                      {offer.candidateResponseNote}
                    </div>
                  )}

                  {/* Action Buttons for Pending Offer */}
                  {isPending && (
                    <div className="flex flex-wrap justify-end gap-2.5 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setDeclineModalId(offer._id)}
                        disabled={submitting}
                        className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <FaTimes /> Decline Offer
                      </button>
                      <button
                        onClick={() => handleRespondOffer(offer._id, "accepted")}
                        disabled={submitting}
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <FaCheck /> Accept Job Offer
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* INTERVIEWS TAB */}
      {activeTab === "interviews" && (
        <div className="space-y-4">
          {interviews.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl p-8">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Scheduled Interviews</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                When recruiters advance your application to the interview stage, meeting invitations and video links will appear here.
              </p>
            </div>
          ) : (
            interviews.map((iv) => {
              const jobTitle = iv.job?.title || "Position Interview";
              const compName = iv.company?.name || "Hiring Partner";
              const formattedDate = iv.scheduledAt
                ? new Date(iv.scheduledAt).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "TBD";

              return (
                <div
                  key={iv._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-sm transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-gray-900">{iv.title || "Interview Session"}</h4>
                        {getStatusBadge(iv.status)}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        For <span className="font-bold text-gray-700">{jobTitle}</span> at <span className="font-semibold text-blue-600">{compName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                      {iv.mode === "remote" && <FaVideo className="text-blue-600" />}
                      {iv.mode === "phone" && <FaPhone className="text-emerald-600" />}
                      {iv.mode === "in-person" && <FaBuilding className="text-amber-600" />}
                      <span className="capitalize">{iv.mode || "remote"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <FaCalendarAlt className="text-blue-500" />
                      <span><strong>When:</strong> {formattedDate}</span>
                    </div>

                    {iv.meetingLink && (
                      <a
                        href={iv.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                      >
                        <FaVideo /> Join Interview Meeting
                      </a>
                    )}
                  </div>

                  {iv.notes && (
                    <div className="mt-3 text-xs bg-gray-50 p-2.5 rounded text-gray-600">
                      <strong>Instructions: </strong>
                      {iv.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* DECLINE OFFER MODAL */}
      {declineModalId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Decline Job Offer</h3>
            <p className="text-xs text-gray-600 mb-4">
              Please share a polite note explaining why you are declining (e.g. accepted another offer, compensation mismatch).
            </p>
            <textarea
              rows="3"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Optional message to recruiter..."
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeclineModalId(null);
                  setDeclineReason("");
                }}
                className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleRespondOffer(declineModalId, "rejected", declineReason)}
                className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateOffers;
