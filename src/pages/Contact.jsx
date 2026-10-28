import { useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage(null);

      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      toast.success(data.message || 'Thank you for reaching out!');
      setStatusMessage({ type: 'success', text: data.message });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      toast.error(err.message || 'Error sending message');
      setStatusMessage({ type: 'error', text: err.message || 'Error sending message' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm border p-8 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2">
          <img
            alt="Customer support team representative"
            className="rounded-lg object-cover w-full h-[400px]"
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&auto=format&fit=crop&q=80"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Contact us</h1>
          <p className="text-gray-600 mb-6">
            We&apos;re here to understand your needs and provide tailored solutions. Reach out to our team to explore how we can support your goals and address any questions you may have.
          </p>

          {statusMessage && (
            <div
              className={`p-4 mb-4 rounded-lg text-sm ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
              role="alert"
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="contact-name" className="sr-only">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Name"
                  type="text"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="contact-email" className="sr-only">Email address</label>
                  <input
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email address"
                    type="email"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="contact-phone" className="sr-only">Phone number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone no (optional)"
                    type="tel"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="sr-only">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2.5 w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How can we help you?"
                  required
                />
              </div>
            </div>

            <button
              disabled={submitting}
              className="bg-black hover:bg-gray-800 text-white rounded-lg px-6 py-2.5 font-medium transition disabled:opacity-50"
              type="submit"
            >
              {submitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
