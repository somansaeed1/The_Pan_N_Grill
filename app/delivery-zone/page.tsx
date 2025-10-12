import CheckDeliveryZone from '@/components/CheckDeliveryZone';

export default function DeliveryZonePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🍽️ The Pan N Grill
          </h1>
          <p className="text-xl text-gray-600">
            Check if we deliver to your location
          </p>
        </div>

        {/* Delivery Zone Checker Component */}
        <CheckDeliveryZone />

        {/* Additional Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📞 Contact Us
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Address:</strong> The Pan N Grill, Jhang, Punjab, Pakistan
              </p>
              <p>
                <strong>Phone:</strong> +92 XXX XXXXXXX
              </p>
              <p>
                <strong>Email:</strong> info@panngrill.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
