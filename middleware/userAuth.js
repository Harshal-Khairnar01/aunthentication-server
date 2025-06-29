import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  let token;

   if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }


 if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login Again!",
    });
  }
  
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    
    if (tokenDecode.id) {
       req.body = req.body || {};
      req.body.userId = tokenDecode.id;
    } else {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again!",
      });
    }
   

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default userAuth;
