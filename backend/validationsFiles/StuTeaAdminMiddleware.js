import jwt from "jsonwebtoken";

export const adminValidation = (req, res, next) => {
  console.log("admin authentication start");
  if (req.user?.role !== "admin") {
    console.log("from admin Validation, you have not admin role");
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  console.log("admin authentication completed");
  next();
};

export const studentValidation = (req, res, next) => {
  console.log("student authentication start");
  if (req.user?.role !== "student") {
    console.log("from student Validation, you have not student role");
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  console.log("student authentication completed");
  next();
};

export const teacherValidation = (req, res, next) => {
  console.log("teacher authenticatio start");
  if (req.user?.role !== "teacher") {
    console.log("from teacherValidation, you have not teacher role");
    return res.status(403).json({ message: "Access denied. Teachers only." });
  }
  console.log("teacher authentication completed");
  next();
};

export const authenticateUser = (req, res, next) => {
  console.log("authentication of user start ");
  const token = req.headers.authorization?.split(" ")[1];
  // const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token provided" });
  console.log("this is token from authenticateUser", token);

  try {
    console.log("trying to authenticate user ");
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("trying to authenticate user ");
    console.log(decode);
    console.log("authenticate user completed");
    req.user = decode.userAvailable; // attach user to the request
    next();
  } catch (error) {
    console.log("error while authenticate user, with error", error);

    return res.status(403).json({ message: "Invalid token" });
  }
};
