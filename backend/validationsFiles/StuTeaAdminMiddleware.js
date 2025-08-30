import jwt from "jsonwebtoken";
// import cookies from "cookies";

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
     console.log("teacher validation start");
     if (req.user?.role !== "teacher") {
          console.log("from teacher Validation, you have not teacher role");
          return res.status(403).json({ message: "Access denied. Teachers only." });
     }
     console.log("teacher validation completed");
     next();
};

export const authenticateUser = (req, res, next) => {
     console.log("user authentication start ");
     try {
          console.log(req?.body);
          console.log(req?.query);
          console.log(req?.params);
          const auth_token = req.cookies?.auth_token; // 👈 from the cookie
          if (!auth_token) {
               console.log("No token provided");
               return res.status(401).json({ message: "No token provided" });
          }
          console.log("auth_token is present in cookies");
          const decode = jwt.verify(auth_token, process.env.JWT_SECRET);
          if (!decode?.userAvailable) {
               console.log("Invalid token");
               return res.status(401).json({ message: "Invalid token" });
          }
          req.user = decode?.userAvailable; // attach user to the request
          console.log("user authentication completed");
          next();
     } catch (error) {
          console.log("error while user authentication, with error", error);
          return res.status(500).json({ message: "error during user authentication", error });
     }
     // console.log(req.headers.authorization);
     // const token = req.headers.authorization?.split(" ")[1];
};
