import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { API_BASE_URL, fetchWithAuth } from "../utils/api";
import { toast } from "react-toastify";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("authToken");

  let userId = "";
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.id || "";
    } catch {
      userId = "";
    }
  }

  const [formData, setFormData] = useState({
    stars: 0,
    description: "",
    userId: userId,
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Fetch Reviews
  useEffect(() => {
    fetch(`${API_BASE_URL}/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reviews");
        return res.json();
      })
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      });
  }, []);

  // Handle Star Click
  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, stars: rating }));
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.stars === 0) {
      toast.warning("Please select a star rating first! ⭐");
      return;
    }

    if (!token) {
      toast.info("Please sign in as a job seeker to submit a review.");
      return;
    }

    try {
      const response = await fetchWithAuth("/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: formData.stars,
          description: formData.description,
        }),
      });

      if (response.ok) {
        toast.success("Review submitted successfully! Thank you.");
        setIsReviewModalOpen(false);
        setFormData({ stars: 0, description: "", userId: userId });
        // Refresh reviews
        const refreshRes = await fetch(`${API_BASE_URL}/reviews`);
        if (refreshRes.ok) {
          const fresh = await refreshRes.json();
          setReviews(Array.isArray(fresh) ? fresh : []);
        }
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review.");
    }
  };

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="bg-white">
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              What Our Candidates Say
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Real reviews from professionals who secured their next career move through our platform.
            </p>
            {token && (
              <div className="mt-4">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap -m-4">
            {safeReviews.map((review) => {
              const reviewerName =
                review.userId?.fullname ||
                review.userId?.name ||
                "Verified Job Seeker";
              const reviewerAvatar =
                review.userId?.profileImg ||
                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

              return (
                <div key={review._id} className="p-4 md:w-1/2 w-full">
                  <div className="h-full border border-gray-200 shadow-sm p-8 rounded-xl bg-gray-50/50">
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }, (_, index) => (
                        <svg
                          key={index}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={index < review.stars ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke={index < review.stars ? "currentColor" : "gray"}
                          className="w-5 h-5 text-yellow-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="leading-relaxed text-gray-700 mb-6 text-sm">
                      {review.description}
                    </p>
                    <div className="inline-flex items-center">
                      <img
                        alt="Candidate avatar"
                        src={reviewerAvatar}
                        className="w-10 h-10 rounded-full flex-shrink-0 object-cover border border-gray-200"
                      />
                      <span className="pl-3">
                        <span className="title-font font-bold text-gray-900 text-sm">
                          {reviewerName}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Review Form Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-xs z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Your Platform Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Rating
                </label>
                <div className="flex space-x-2 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      onClick={() => handleStarClick(num)}
                      className={`text-2xl transition ${
                        num <= formData.stars ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Feedback & Review
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Share how your job search experience went..."
                  className="w-full text-xs border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
