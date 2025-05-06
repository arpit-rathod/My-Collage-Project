import React, { useState, useEffect,memo} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MaroonSlideshow = () => {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        // Using a placeholder API - replace with your actual API endpoint
        const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=10');
        
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const data = await response.json();
        setPhotos(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, photos.length]);

  // Maroon color palette
  const colors = {
    primary: '#800000', // Dark maroon
    secondary: '#A52A2A', // Medium maroon
    light: '#D8BFD8', // Light maroon/lavender
    dark: '#4A0000', // Very dark maroon
    text: '#FFFFFF', // White text
    overlay: 'rgba(128, 0, 0, 0.7)' // Transparent maroon overlay
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading photos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="absolute top-52 w-full  mx-auto overflow-hidden rounded-lg shadow-xl">
      {/* Main slideshow */}
      <div className="relative h-64 md:h-96 lg:h-128">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Using placeholder image from the API */}
{/*             <img 
              src="/api/placeholder/1200/600" 
              alt={photo.title}
              className="object-cover w-full h-full"
            /> */}
            <div 
              className="absolute inset-0" 
              style={{ backgroundColor: colors.overlay }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black to-transparent">
              <h3 className="text-lg font-semibold truncate">{photo.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        className="absolute left-0 z-11 p-2 transform -translate-y-1/2 rounded-r-lg top-1/2 bg-opacity-70"
        style={{ backgroundColor: colors.primary }}
        onClick={goToPrevious}
      >
        <ChevronLeft size={24} color={colors.text} />
      </button>
      <button 
        className="absolute right-0 z-11 p-2 transform -translate-y-1/2 rounded-l-lg top-1/2 bg-opacity-70"
        style={{ backgroundColor: colors.primary }}
        onClick={goToNext}
      >
        <ChevronRight size={24} color={colors.text} />
      </button>

      {/* Dots navigation */}
      {/* <div className="absolute bottom-0 left-0 right-0 z-11 flex justify-center p-3">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === currentIndex ? 'bg-amber-300' : 'bg-white bg-opacity-90'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div> */}
    </div>
  );
};

export default memo(MaroonSlideshow);
