import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  console.log(" isAuth middleware triggered");

  try {
    const token = req.cookies.token;
    console.log(" Token received:", token);

    if (!token) {
      console.warn(" No token found in cookies");
      return res.status(400).json({ message: "Token not found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" Token verified, userId:", verifyToken.userId);

    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    console.error(" isAuth error:", error.message);
    return res.status(500).json({ message: "isAuth error" });
  }
};

export default isAuth;
