import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const token = localStorage.getItem("authToken");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const [formData, setFormData] = useState({
        stars: 0,
        description: "",
        userId: userId,
    });

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Fetch Reviews
    useEffect(() => {
        fetch("http://localhost:3000/reviews")
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((err) => console.error("Error fetching reviews:", err));
    }, []);

    console.log(reviews)

    // Handle Star Click
    const handleStarClick = (rating) => {
        setFormData({ ...formData, stars: rating });
    };

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit Review
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.stars === 0) {
            alert("Select Star first! ⭐");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to submit review");

            const newReview = await response.json();
            setReviews([...reviews, newReview]);
            setFormData({ ...formData, stars: 0, description: "" });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="py-10 rounded-lg bg-white">
            {console.log(reviews)}
            {/* Display Reviews */}
            <section className="text-gray-600 body-font">
                <div className="container px-5  mx-auto">
                    <div className="flex justify-between items-center">

                        <h2 className="text-black text-4xl font-bold pb-10">Reviews</h2>
                                             <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="bg-blue-500 text-white px-4 mb-4 py-2 rounded mt-4"
                        >
                            Add Review
                        </button>
                    </div>
                    <div className="flex flex-wrap -m-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="p-4 md:w-1/2 w-full">
                                <div className="h-full border border-gray-400 shadow-lg p-8 rounded">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className="block w-5 h-5 text-gray-700 mb-4"
                                        viewBox="0 0 975.036 975.036"
                                    >
                                        <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                                    </svg>
                                    <div className="flex mb-4">
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <svg
                                                key={index}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill={index < review.stars ? "currentColor" : "none"}
                                                viewBox="0 0 24 24"
                                                className="w-5 h-5 text-yellow-500"
                                            >
                                                <path d="M12 .587l3.668 7.568 8.332 1.207-6.001 5.848 1.417 8.284L12 18.897l-7.416 3.895 1.417-8.284-6.001-5.848 8.332-1.207z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="leading-relaxed text-black mb-6">{review.description}</p>
                                    <a className="inline-flex items-center">
                                        <img
                                            alt="testimonial"
                                            src={ review.userId.profileImg }
                                            className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center"
                                        />
                                        <span className="pl-4">
                                            <span className="title-font font-medium text-gray-900">
                                                {review.userId.name}
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>




            {/* Review Form Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Submit Your Review</h3>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2">
                                <span className="text-gray-700">Your Rating:</span>
                                <div className="flex space-x-1 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <span
                                            key={num}
                                            onClick={() => handleStarClick(num)}
                                            className={`text-2xl ${num <= formData.stars ? "text-yellow-500" : "text-gray-300"
                                                }`}
                                        >
                                            {num <= formData.stars ? "⭐" : "☆"}
                                        </span>
                                    ))}
                                </div>
                            </label>

                            <label className="block mb-2">
                                <span className="text-gray-700">Description:</span>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </label>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
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
