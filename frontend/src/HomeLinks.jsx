import React from "react";
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  Briefcase,
  Image,
  Phone,
  UserPlus,
  Library,
  Building,
  ChevronRight,
} from "lucide-react";

const CollegeSections = () => {
  // Define all college sections with their details
  const collegeSections = [
    {
      id: "academics",
      title: "Academics",
      description:
        "Explore degree programs, courses, and academic departments across various disciplines.",
      icon: <BookOpen size={24} />,
      color: "#800000", // Dark maroon
    },
    {
      id: "student-life",
      title: "Student Life",
      description:
        "Discover campus activities, organizations, housing options, and recreational facilities.",
      icon: <Users size={24} />,
      color: "#8B0000", // Deep maroon
    },
    {
      id: "campus-resources",
      title: "Campus Resources",
      description:
        "Access learning centers, technology services, and support resources for student success.",
      icon: <Building size={24} />,
      color: "#A52A2A", // Medium maroon
    },
    {
      id: "campus-gallery",
      title: "Campus Gallery",
      description:
        "View photos highlighting our beautiful campus grounds, facilities, and community.",
      icon: <Image size={24} />,
      color: "#B22222", // Fire brick (maroon variant)
    },
    {
      id: "events",
      title: "Events",
      description:
        "Stay updated with academic calendars, campus events, workshops, and cultural programs.",
      icon: <Calendar size={24} />,
      color: "#8B1A1A", // Reddish maroon
    },
    {
      id: "alumni",
      title: "Alumni",
      description:
        "Connect with graduates, view success stories, and engage with our alumni network.",
      icon: <Award size={24} />,
      color: "#800020", // Burgundy (maroon variant)
    },
    {
      id: "contact",
      title: "Contact",
      description:
        "Find department contact information, campus locations, and ways to reach faculty.",
      icon: <Phone size={24} />,
      color: "#9B1B30", // Crimson maroon
    },
    {
      id: "admissions",
      title: "Get Admission",
      description:
        "Learn about application requirements, deadlines, financial aid, and enrollment processes.",
      icon: <UserPlus size={24} />,
      color: "#8B2500", // Dark reddish maroon
    },
    {
      id: "library",
      title: "Library",
      description:
        "Browse research databases, find study spaces, and access digital and print collections.",
      icon: <Library size={24} />,
      color: "#7F1734", // Burgundy-maroon
    },
    {
      id: "placement",
      title: "Placement Cell",
      description:
        "Explore career services, job opportunities, internships, and recruitment information.",
      icon: <Briefcase size={24} />,
      color: "#9A1750", // Dark rose maroon
    },
  ];

  return (
    <div className="relative w-full mx-auto pt-[250px] md:pt-[500px]">
      <h1
        className="text-3xl md:text-5xl font-bold mb-6 text-center"
        style={{ color: "#800000" }}
      >
        College Directory
      </h1>

      {/* Main container for all sections */}
      <div className="container mx-auto w-full ">
        {/* Grid of all section cards */}
        <div style={{ width: "100%" }} className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-10">
            {collegeSections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ borderTop: `4px solid ${section.color}` }}
              >
                <div className="p-10">
                  <div className="flex items-center mb-3">
                    <div style={{ color: section.color }}>{section.icon}</div>
                    <h2
                      className="ml-2 text-xl font-semibold"
                      style={{ color: section.color }}
                    >
                      {section.title}
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-4 h-20">
                    {section.description}
                  </p>

                  <div className="flex justify-end">
                    <a
                      href={`#${section.id}`}
                      className="flex items-center text-sm font-medium transition-colors duration-200"
                      style={{ color: section.color }}
                    >
                      Learn more
                      <ChevronRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeSections;
