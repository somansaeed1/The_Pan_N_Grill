'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredCategories = [
    {
      id: 'special-pizza',
      name: 'Special Pizzas',
      image: '/images/pizza.jpg',
      description: 'Authentic Pakistani-style pizzas with traditional flavors',
    },
    {
      id: 'special-shawarmas',
      name: 'Shawarmas',
      image: '/images/Shawarmas.jpg',
      description: 'Fresh and flavorful shawarmas made with premium ingredients',
    },
    {
      id: 'chorizo-burger',
      name: 'Burgers',
      image: '/images/Burgers.jpg',
      description: 'Juicy burgers with Pakistani spices and fresh toppings',
    },
    {
      id: 'fried-items',
      name: 'Fried Items',
      image: '/images/Fried.jpg',
      description: 'Crispy and delicious fried chicken and broast',
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 hero-pattern">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="w-full text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-4 sm:mb-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white text-center mx-auto">
                Welcome to
              </h1>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="font-logo text-gold-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mt-2 text-center mx-auto block"
                style={{ textAlign: 'center', display: 'block', width: '100%' }}
              >The Pan N Grill</motion.div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto text-center"
            >
              Authentic Pakistani Taste in the Heart of Jhang
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="text-base sm:text-lg text-gray-200 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto text-center"
            >
              Experience the finest Pakistani cuisine with our signature pizzas, shawarmas, burgers,
              and traditional dishes. Made with love, served with pride.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/menu"
                  className="block w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  Explore Our Menu
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/contact"
                  className="block w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 text-center"
                >
                  Order Now
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-4">
              Our Specialties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular dishes, crafted with authentic Pakistani flavors and the finest
              ingredients
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                className="w-full"
              >
                <Link
                  href={`/menu#${category.id}`}
                  className="featured-card group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 card-shadow cursor-pointer flex flex-col h-full hover:shadow-2xl"
                >
                  <div className="h-48 sm:h-56 md:h-48 overflow-hidden">
                    <motion.img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl font-heading font-semibold text-primary-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 flex-1">{category.description}</p>
                    <div className="mt-2 sm:mt-4">
                      <motion.span 
                        className="text-sm sm:text-base text-gold-500 group-hover:text-gold-600 font-semibold transition-colors inline-flex items-center"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        View Menu →
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
                Authentic Pakistani Cuisine Since Day One
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At The Pan N Grill, we bring you the authentic taste of Pakistan with every dish. Our
                chefs use traditional recipes passed down through generations, combined with the freshest
                ingredients to create an unforgettable dining experience.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From our signature pizzas with Pakistani spices to our perfectly grilled shawarmas and
                juicy burgers, every item on our menu is crafted with passion and served with pride.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/about"
                  className="bg-primary-900 hover:bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-block shadow-lg hover:shadow-xl"
                >
                  Learn More About Us
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="rounded-xl shadow-lg bg-gray-200 h-96"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Visit Us Today</h2>
            <p className="text-xl text-gray-200">
              Experience authentic Pakistani flavors in the heart of Jhang
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Location",
                content: (
                  <>
                    Adhiwal Chowk, Sargodha Road
                    <br />
                    Jhang Sadar, Jhang, Pakistan
                  </>
                )
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                ),
                title: "Phone",
                content: (
                  <>
                    <a href="tel:03181717763" className="hover:text-gold-400 transition-colors">
                      0318-1717763
                    </a>
                    <br />
                    <a href="tel:03217320055" className="hover:text-gold-400 transition-colors">
                      0321-7320055
                    </a>
                  </>
                )
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ),
                title: "Social Media",
                content: (
                  <div className="flex justify-center space-x-4">
                    <motion.a
                      href="https://www.facebook.com/share/1AgzKa1R8s/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gold-400 transition-colors"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </motion.a>
                    <motion.a
                      href="https://wa.me/923456500649"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gold-400 transition-colors"
                      whileHover={{ scale: 1.2, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                    </motion.a>
                  </div>
                )
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut" 
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div 
                  className="bg-gold-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <div className="text-gray-200">{item.content}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}