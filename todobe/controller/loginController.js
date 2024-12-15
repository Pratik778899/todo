const Login = require("../model/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = "Pratik@$7809";

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Login.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { email: user.email, password: user.password },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ token, user });
    } else {
      return res.status(400).json({ message: "Password is incorrect" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.register = async (req, res) => {
  const { email, password , role} = req.body;

  try {
    // Check if user already exists
    const existingUser = await Login.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await Login.create({
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token with 18 seconds expiration
    const token = jwt.sign(
      { email: newUser.email, password: newUser.password,role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.logout = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.clearCookie("token").json({ message: "Logout successful" });
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
