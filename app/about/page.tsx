import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* About Hero Section */}
      <section className="bg-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">About The Pan N Grill</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Serving authentic Pakistani cuisine with passion and tradition since our beginning
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                The Pan N Grill was born from a simple dream: to bring the authentic taste of Pakistan
                to the heart of Jhang. Our journey began with a passion for traditional Pakistani
                cuisine and a commitment to serving our community with the finest ingredients and
                time-honored recipes.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Located at the bustling Adhiwal Chowk on Sargodha Road, we have become a beloved
                destination for food lovers who appreciate genuine Pakistani flavors. From our signature
                pizzas infused with local spices to our perfectly grilled shawarmas and juicy burgers,
                every dish tells a story of our culinary heritage.
              </p>
              <p className="text-lg text-gray-600">
                What sets us apart is our dedication to quality and authenticity. We use only the
                freshest ingredients, traditional cooking methods, and recipes that have been perfected
                over generations. Our team takes pride in creating not just meals, but memorable
                experiences for every guest who walks through our doors.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-xl shadow-lg bg-gray-200 h-96"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Owner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Owner Image */}
            <div className="flex-shrink-0 flex justify-center md:justify-end">
              <Image
                src="/images/client.jpg"
                alt="Dr. Muhammad Kashif"
                width={256}
                height={256}
                className="rounded-full shadow-md w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover object-top border-4 border-white"
              />
            </div>

            {/* Owner Content */}
            <div className="w-full text-center md:text-left">
              <h2 className="text-2xl font-heading font-bold text-primary-900 mb-2">
                A Word From Our Founder
              </h2>
              <h3 className="text-xl font-semibold text-gold-600 mb-4">Dr. Muhammad Kashif</h3>
              <p className="text-lg text-gray-700 mb-3 leading-relaxed">
                Dr. Muhammad Kashif is the visionary owner and founder of The Pan N Grill. With a
                deep-rooted passion for authentic Pakistani cuisine and years of experience in the food
                industry, he has dedicated himself to bringing the true flavors of Pakistan to the
                people of Jhang.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Under his leadership, The Pan N Grill has become a beloved destination for food lovers
                seeking quality, tradition, and a welcoming atmosphere. His commitment to excellence
                and customer satisfaction is reflected in every dish served at the restaurant.
              </p>
              <blockquote className="mt-6 border-l-4 border-gold-500 pl-4 italic text-gray-600">
                <p>
                  &quot;Our goal isn&apos;t just to serve food, but to share a piece of our heritage
                  and create a memorable experience for every guest who walks through our doors.&quot;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at The Pan N Grill
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gold-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary-900 mb-4">
                Passion for Food
              </h3>
              <p className="text-gray-600">
                Every dish is prepared with love and dedication, using traditional recipes and the
                finest ingredients to ensure authentic flavors in every bite.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary-900 mb-4">
                Community First
              </h3>
              <p className="text-gray-600">
                We are proud to serve the Jhang community, building relationships with our customers
                and contributing to the local food culture with authentic Pakistani cuisine.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary-900 mb-4">
                Quality Excellence
              </h3>
              <p className="text-gray-600">
                We maintain the highest standards in food preparation, hygiene, and service, ensuring
                every customer receives an exceptional dining experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Experience Authentic Pakistani Cuisine
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Visit us today and taste the difference that passion, quality, and tradition make
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/923456500649"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Order Now
            </a>
            <a
              href="tel:03181717763"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </section> */}
    </div>
  );
}