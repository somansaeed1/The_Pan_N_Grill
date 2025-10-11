export default function GalleryPage() {
  return (
    <section className="pt-20 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-heading font-bold text-primary-900 mb-6">Gallery</h2>
        <p className="text-gray-600 mb-8">A collection of dishes and restaurant moments.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4 text-left">
                <p className="text-gray-700">Delicious item #{i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}