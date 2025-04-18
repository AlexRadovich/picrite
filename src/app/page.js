export default function Home() {
  const sampleImages = [
    "https://via.placeholder.com/1200x800/0000FF/808080?Text=Image+1",
    "https://via.placeholder.com/1200x800/FF6347/FFFFFF?Text=Image+2",
    "https://via.placeholder.com/1200x800/32CD32/FFFFFF?Text=Image+3",
    "https://via.placeholder.com/1200x800/FFD700/FFFFFF?Text=Image+4",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Title Section */}
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-600"> Images</h1>
      </header>

      {/* Image Scrolling Section */}
      <section className="overflow-y-auto max-h-screen">
        <div className="flex flex-col space-y-4 py-8">
          {/* Displaying the images */}
          {sampleImages.map((image, index) => (
            <div key={index} className="flex-none w-full h-auto">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
