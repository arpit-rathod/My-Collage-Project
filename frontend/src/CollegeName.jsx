import React, { useState, useEffect } from "react";

const ResponsiveAnimatedCollegeNames = () => {
  const collegeNames = [
    "Truba Institute of Engineering and Information Technology",
    "Truba Institute of Pharmacy",
    "Truba Institute of Science and Commerce",
    "Truba Institute of Science and Technology",
  ];

  const [position, setPosition] = useState(0);
  const [screenSize, setScreenSize] = useState("lg");

  // Handle responsive screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("sm");
      } else if (width < 1024) {
        setScreenSize("md");
      } else {
        setScreenSize("lg");
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation effect
  useEffect(() => {
    // Get the width of the content container plus some extra space
    const containerWidth =
      document.getElementById("marquee-container")?.offsetWidth ||
      window.innerWidth;

    // Start offscreen to the right
    setPosition(containerWidth);

    // Adjust speed based on screen size
    const getAnimationSpeed = () => {
      switch (screenSize) {
        case "sm":
          return 3;
        case "md":
          return 5;
        case "lg":
          return 5;
        default:
          return 5;
      }
    };

    const animationSpeed = getAnimationSpeed();

    const animate = () => {
      setPosition((prevPosition) => {
        const contentWidth =
          document.getElementById("marquee-content")?.scrollWidth || 20000;

        // If the entire content has moved past the left edge, reset to the right
        if (prevPosition < -contentWidth) {
          return containerWidth;
        }

        return prevPosition - animationSpeed;
      });

      animationId = requestAnimationFrame(animate);
    };

    let animationId = requestAnimationFrame(animate);

    // Clean up animation frame
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [screenSize]);

  // Get font size based on screen size
  const getFontSize = () => {
    switch (screenSize) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-xl";
      default:
        return "text-base";
    }
  };

  // Get padding based on screen size
  const getPadding = () => {
    switch (screenSize) {
      case "sm":
        return "py-3 px-3";
      case "md":
        return "py-4 px-4";
      case "lg":
        return "py-6 px-6";
      default:
        return "py-4 px-4";
    }
  };
  //${getPadding()}
  return (
    <div
      className={`pt-25 w-full bg-gradient-to-r from-maroon-50 to-maroon-100 overflow-hidden`}
      id="marquee-container"
    >
      {/* Fade effects on the sides */}
      {/* //absolute top-0 */}
      {/* <div className=" left-0 h-full w-16 bg-gradient-to-r from-maroon-50 to-transparent z-10"></div> */}
      {/* <div className="right-0 h-full w-16 bg-gradient-to-l from-maroon-50 to-transparent z-10"></div> */}

      {/* Marquee content */}
      <div
        id="marquee-content"
        className={`whitespace-nowrap inline-block ${getFontSize()}`}
        style={{ transform: `translateX(${position}px)` }}
      >
        {/* Duplicate the list to create a seamless loop */}
        {[...collegeNames, ...collegeNames, ...collegeNames].map(
          (name, index) => (
            <div
              key={index}
              className="inline-block px-4 font-semibold text-maroon-800"
            >
              <span className="py-10 hover:text-maroon-900 transition-colors duration-800 cursor-default text-6xl text-[#981212]">
                {name}
              </span>
              <span className="inline-block mx-4 text-maroon-400">●</span>
            </div>
          )
        )}
      </div>

      {/* Truba group logo/branding */}
      {/* //absolute top-1 */}
      {/* <div
        className={` right-4 bg-white bg-opacity-80 px-2 py-1 rounded-md ${
          screenSize === "sm" ? "text-xs" : "text-sm"
        } font-medium text-maroon-900 shadow-sm z-20`}
      >
        Truba Group
      </div> */}
    </div>
  );
};

export default ResponsiveAnimatedCollegeNames;
