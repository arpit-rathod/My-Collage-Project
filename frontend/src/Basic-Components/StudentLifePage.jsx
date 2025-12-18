import React, { useState } from 'react';
import { Heart, Users, Music, Trophy, Book, Camera, X, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';

const StudentLifePage = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const eventAlbums = [
    {
      id: 1,
      title: 'Annual Cultural Fest 2024',
      category: 'Cultural',
      date: 'March 15-17, 2024',
      location: 'Main Campus Auditorium',
      icon: <Music className="w-6 h-6" />,
      coverColor: 'from-pink-500 to-rose-500',
      images: [
        { caption: 'Grand opening ceremony with traditional lamp lighting', color: 'bg-gradient-to-br from-pink-400 to-rose-400' },
        { caption: 'Students performing classical dance fusion', color: 'bg-gradient-to-br from-purple-400 to-pink-400' },
        { caption: 'Live band performance energizing the crowd', color: 'bg-gradient-to-br from-rose-400 to-orange-400' },
        { caption: 'Fashion show showcasing student creativity', color: 'bg-gradient-to-br from-fuchsia-400 to-pink-400' },
        { caption: 'Award ceremony recognizing talented performers', color: 'bg-gradient-to-br from-pink-400 to-red-400' }
      ]
    },
    {
      id: 2,
      title: 'Tech Symposium 2024',
      category: 'Technical',
      date: 'February 10-12, 2024',
      location: 'Engineering Block',
      icon: <Trophy className="w-6 h-6" />,
      coverColor: 'from-blue-500 to-cyan-500',
      images: [
        { caption: 'Hackathon participants coding innovative solutions', color: 'bg-gradient-to-br from-blue-400 to-cyan-400' },
        { caption: 'Robotics competition with autonomous bots', color: 'bg-gradient-to-br from-cyan-400 to-teal-400' },
        { caption: 'Guest speaker from leading tech company', color: 'bg-gradient-to-br from-indigo-400 to-blue-400' },
        { caption: 'Project exhibition showcasing student innovations', color: 'bg-gradient-to-br from-blue-400 to-purple-400' },
        { caption: 'Winners receiving prizes and recognition', color: 'bg-gradient-to-br from-cyan-400 to-blue-400' }
      ]
    },
    {
      id: 3,
      title: 'Sports Week Championship',
      category: 'Sports',
      date: 'January 20-26, 2024',
      location: 'Sports Complex',
      icon: <Trophy className="w-6 h-6" />,
      coverColor: 'from-green-500 to-emerald-500',
      images: [
        { caption: 'Cricket tournament final match intensity', color: 'bg-gradient-to-br from-green-400 to-emerald-400' },
        { caption: 'Basketball championship showcasing teamwork', color: 'bg-gradient-to-br from-emerald-400 to-teal-400' },
        { caption: 'Athletics track events breaking records', color: 'bg-gradient-to-br from-lime-400 to-green-400' },
        { caption: 'Volleyball tournament with enthusiastic crowd', color: 'bg-gradient-to-br from-green-400 to-cyan-400' },
        { caption: 'Champions holding their victory trophies', color: 'bg-gradient-to-br from-emerald-400 to-green-400' }
      ]
    },
    {
      id: 4,
      title: 'Fresher\'s Welcome 2024',
      category: 'Social',
      date: 'August 5, 2024',
      location: 'Central Lawn',
      icon: <Heart className="w-6 h-6" />,
      coverColor: 'from-purple-500 to-indigo-500',
      images: [
        { caption: 'Senior students welcoming new batch with flowers', color: 'bg-gradient-to-br from-purple-400 to-indigo-400' },
        { caption: 'Ice-breaking activities and fun games', color: 'bg-gradient-to-br from-indigo-400 to-blue-400' },
        { caption: 'Talent show featuring freshman performances', color: 'bg-gradient-to-br from-violet-400 to-purple-400' },
        { caption: 'Group photo of the entire freshman class', color: 'bg-gradient-to-br from-purple-400 to-pink-400' },
        { caption: 'Evening celebration with music and dance', color: 'bg-gradient-to-br from-indigo-400 to-purple-400' }
      ]
    },
    {
      id: 5,
      title: 'Social Outreach Program',
      category: 'Community',
      date: 'November 12, 2024',
      location: 'Local Villages',
      icon: <Users className="w-6 h-6" />,
      coverColor: 'from-orange-500 to-amber-500',
      images: [
        { caption: 'Students conducting health awareness camps', color: 'bg-gradient-to-br from-orange-400 to-amber-400' },
        { caption: 'Teaching underprivileged children with dedication', color: 'bg-gradient-to-br from-amber-400 to-yellow-400' },
        { caption: 'Tree plantation drive for environmental conservation', color: 'bg-gradient-to-br from-green-400 to-lime-400' },
        { caption: 'Distributing educational materials to rural schools', color: 'bg-gradient-to-br from-orange-400 to-red-400' },
        { caption: 'Community gathering with villagers and students', color: 'bg-gradient-to-br from-amber-400 to-orange-400' }
      ]
    },
    {
      id: 6,
      title: 'Literary Festival',
      category: 'Academic',
      date: 'October 8-9, 2024',
      location: 'Library Auditorium',
      icon: <Book className="w-6 h-6" />,
      coverColor: 'from-teal-500 to-cyan-500',
      images: [
        { caption: 'Poetry recitation by talented students', color: 'bg-gradient-to-br from-teal-400 to-cyan-400' },
        { caption: 'Debate competition on contemporary issues', color: 'bg-gradient-to-br from-cyan-400 to-blue-400' },
        { caption: 'Book reading session with renowned author', color: 'bg-gradient-to-br from-teal-400 to-green-400' },
        { caption: 'Creative writing workshop inspiring young writers', color: 'bg-gradient-to-br from-cyan-400 to-teal-400' },
        { caption: 'Quiz competition testing literary knowledge', color: 'bg-gradient-to-br from-blue-400 to-cyan-400' }
      ]
    }
  ];

  const handlePrevImage = () => {
    if (selectedAlbum) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedAlbum) {
      setSelectedImageIndex((prev) =>
        prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-300 to-purple-400 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-red-800">Student Li fe</h1>
          <p className="text-xl text-red-800 max-w-3xl mx-auto">
            Experience the vibrant campus life filled with memorable moments, exciting events, and lifelong friendships
          </p>
        </div>
      </div>

      {/* Event Albums Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Event Albums</h2>
        <p className="text-center text-gray-600 mb-12">Click on any album to view the complete photo gallery</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => {
                setSelectedAlbum(album);
                setSelectedImageIndex(0);
              }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div className={`bg-gradient-to-r ${album.coverColor} h-48 flex items-center justify-center relative`}>
                <Camera className="w-20 h-20 text-white/30 absolute" />
                <div className="relative z-10 text-white text-center">
                  {album.icon}
                  <div className="text-2xl font-bold mt-2 ">{album.images.length}</div>
                  <div className="text-sm">Photos</div>
                </div>
              </div>

              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-purple-100 text-red-800 rounded-full text-sm font-semibold mb-3">
                  {album.category}
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-3">{album.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{album.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{album.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedAlbum(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="max-w-5xl w-full">
            <div className="text-white text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">{selectedAlbum.title}</h2>
              <p className="text-gray-300">
                Photo {selectedImageIndex + 1} of {selectedAlbum.images.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className={`${selectedAlbum.images[selectedImageIndex].color} h-96 flex items-center justify-center`}>
                <Camera className="w-32 h-32 text-white/20" />
              </div>
              <div className="p-6 bg-gray-50">
                <p className="text-gray-700 text-lg text-center">
                  {selectedAlbum.images[selectedImageIndex].caption}
                </p>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex justify-center gap-2 mt-6 overflow-x-auto pb-2">
              {selectedAlbum.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg ${img.color} flex-shrink-0 transition-all ${selectedImageIndex === idx ? 'ring-4 ring-white scale-110' : 'opacity-50 hover:opacity-100'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campus Life Highlights */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Campus Life Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">Cultural Events</h3>
              <p className="text-gray-600">Annual fests, music nights, and cultural celebrations</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">Sports Activities</h3>
              <p className="text-gray-600">Inter-college tournaments and fitness programs</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">Student Clubs</h3>
              <p className="text-gray-600">50+ clubs covering diverse interests and hobbies</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-2">Social Impact</h3>
              <p className="text-gray-600">Community service and outreach programs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLifePage;