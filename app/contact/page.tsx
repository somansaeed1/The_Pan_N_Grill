'use client';

import { useState, useEffect, FormEvent } from 'react';
import { showToast } from '@/lib/cartUtils';

export default function ContactPage() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Ensure client-side hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const message = `Hello! I'm contacting you from your website.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/923456500649?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab (client-side only)
    window.open(whatsappUrl, '_blank');
    showToast('Redirecting to WhatsApp...');

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  return (
    <div className="pt-20">
      {/* Contact Hero Section */}
      <section className="bg-primary-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-3 sm:mb-4">Contact Us</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Get in touch with us for reservations, orders, or any questions about our authentic
            Pakistani cuisine
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary-900 mb-6 sm:mb-8">Get In Touch</h2>

              <div className="space-y-6 sm:space-y-8">
                {/* Location */}
                <div className="flex items-start space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                  <div className="bg-gold-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-primary-900 mb-2">Our Location</h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">
                      Adhiwal Chowk, Sargodha Road
                      <br />
                      Jhang Sadar, Jhang, Pakistan
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=31.2681,72.3317"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-gold-500 hover:text-gold-600 transition-colors font-semibold mt-2 inline-block"
                    >
                      View Location on Google Maps →
                    </a>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-gold-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Phone Numbers</h3>
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base md:text-lg text-gray-600">
                        <a href="tel:03181717763" className="hover:text-gold-500 transition-colors">
                          0318-1717763
                        </a>
                      </p>
                      <p className="text-sm sm:text-base md:text-lg text-gray-600">
                        <a href="tel:03217320055" className="hover:text-gold-500 transition-colors">
                          0321-7320055
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-gold-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">WhatsApp</h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2">0345-6500649</p>
                    <a
                      href="https://wa.me/923456500649"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors inline-flex items-center space-x-2 min-h-[44px] touch-manipulation"
                    >
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
                </div>
                <br />
                {/* Opening Hours */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-gold-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v5l3 3" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-primary-900 mb-2">Opening Hours</h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">Monday - Sunday</p>
                    <p className="text-xl sm:text-2xl font-bold text-gold-600">1:00 PM - 1:00 AM</p>
                  </div>
                </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary-900 mb-6 sm:mb-8">Send Us a Message</h2>

              {isClient && (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-sm sm:text-base min-h-[44px]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-sm sm:text-base min-h-[44px]"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-sm sm:text-base min-h-[44px]"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors resize-vertical text-sm sm:text-base"
                      placeholder="Tell us about your inquiry, reservation request, or feedback..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors shadow-lg min-h-[48px] touch-manipulation"
                  >
                    Send Message via WhatsApp
                  </button>

                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    * Required fields. Your message will be sent via WhatsApp for faster response.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}