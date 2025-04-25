"use client";
// import { Variants } from "motion/react"
import React, { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";

export default function Variants() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef < HTMLDivElement > null;
  const { height } = useDimensions(containerRef);
  const sideBar = document.getElementById("menubar");
  if (isOpen) {
    // this because not run in first until the dom does not load;
    console.log("function fun  13 line");
    document.addEventListener("click", (event) => {
      const clickedElement = event.target;
      if (!sideBar.contains(clickedElement)) {
        setIsOpen(false);
      }
    });
  }

  return (
    <div id="menubar">
      <div style={container}>
        <motion.nav
          initial={false}
          animate={isOpen ? "open" : "closed"}
          custom={height}
          ref={containerRef}
          style={nav}
        >
          <motion.div
            // className="bg-blue-500 rounded-lg fixed top-0 left-0 p-4"
            style={background}
            variants={sidebarVariants}
          />
          <Navigation />
          <MenuToggle toggle={() => setIsOpen(!isOpen)} />
        </motion.nav>
      </div>
    </div>
  );
}

const navVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.4 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const Navigation = () => (
  <motion.ul style={list} variants={navVariants}>
    {[0, 1, 2, 3, 4].map((i) => (
      <MenuItem i={i} key={i} />
    ))}
  </motion.ul>
);

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -200 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];
const menuOption = [
  "Home",
  "First year",
  "Second year",
  "Third year",
  "Fourth year",
];
// : { i: number }
const MenuItem = ({ i }) => {
  const border = `2px solid ${colors[i]}`;
  return (
    <motion.li
      style={{ ...textPlaceholder, listItem }}
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="m-3"
    >
      {/* <div style={{...iconPlaceholder,list}} className="text-amber-50" >{i + 1}</div> */}
      <div className="text-amber-50 font-bold text-2xl grid place-content-start px-3 ">
        {menuOption[i]}
      </div>
    </motion.li>
  );
};

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 30px 30px)`,
    // clipPath: "inset(22px 233px 342px 17px round 10px)",
    // clipPath: "inset(10px 20px 10px 20px)",
    // transition: {
    //   type: "string",
    //   stiffness: 20,
    //   restDelta: 2,
    // },
  }),
  closed: {
    // clipPath: "circle(20px at 40px 40px)",
    clipPath: "inset(22px 233px 342px 17px round 10px)",
    transition: {
      delay: 0.5,
      // type: "load",
      stiffness: 400,
      damping: 40,
    },
    // initial: { y: -100, opacity: 0 }, // Start from top
    // animate: { y: 0, opacity: 1 }, // Move to normal position
    // exit: { y: 100, opacity: 0 }, // Move down when unmounting
    // transition: { type: "spring", stiffness: 100, damping: 8 },
  },
};

// interface PathProps {
//     d?: string
//     variants: Variants
//     transition?: { duration: number }
// }

const Path = (props) => (
  <motion.path
    fill="transparent" //transparent
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

// : { toggle: () => void }
const MenuToggle = ({ toggle }) => (
  <button style={toggleContainer} onClick={toggle}>
    <svg width="23" height="23" viewBox="0 0 29 20">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

const container = {
  position: "relative",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flex: 1,
  width: 200,
  maxWidth: "100%",
  height: 400,
  backgroundColor: "var(--accent)",
  // backgroundColor: "white",
  borderRadius: 50,
  // overflow: "hidden",
};

const nav = {
  width: 300,
  // backgroundColor:"#b7032c"
};

const background = {
  // backgroundColor: "white",//#b7032c
  backgroundColor: "#b7032c", //#b7032c
  position: "absolute",
  top: 0,
  left: 15,
  bottom: 0,
  width: 300,
};

const toggleContainer = {
  outline: "none",
  border: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  cursor: "pointer",
  position: "absolute",
  top: 15,
  left: 45,
  width: 50,
  height: 50,
  borderRadius: "50%",
  background: "transparent", //transparent
};

const list = {
  listStyle: "none",
  padding: 25,
  margin: 0,
  position: "absolute",
  top: 80,
  width: 230,
};

const listItem = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: 0,
  margin: 0,
  height: 50,
  listStyle: "none",
  marginBottom: 20,
  cursor: "pointer",
};

const iconPlaceholder = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  flex: "40px 0",
  marginRight: 20,
};

const textPlaceholder = {
  borderRadius: 5,
  width: 250,
  height: 30,
  flex: 1,
};

/**
 * ==============   Utils   ================
 */

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
// ref: React.RefObject<HTMLDivElement | null>
const useDimensions = (ref) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};
