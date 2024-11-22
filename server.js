require('dotenv').config();
const express = require("express");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const userInteraction = require("./router/user/voice");

const voice = require("./router/voice");
const cors = require("cors");
const User = require("./models/users");
const Product = require("./models/product");
const { upload } = require("./middleware/multer.middleware");
const { uploadOnCloudinary } = require("./util/cloudinary");

const app = express();
const PORT = 4000;
main();
app.use(express.json());
app.use(cors());

// Store API
app.use("/api/store", storeRoute);

// Products API
app.use("/api/product", productRoute);

// Purchase API
app.use("/api/purchase", purchaseRoute);

// Sales API
app.use("/api/sales", salesRoute);

app.use("/api/gemini", voice);
app.use("/api/user/gemini", userInteraction);

// ------------- Signin --------------
let userAuthCheck;
app.post("/api/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    }).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Getting User Details of login user
app.get("/api/login", (req, res) => {
  res.send(userAuthCheck);
});
// ------------------------------------

// Registration endpoint with image upload
app.post("/api/register", upload.single('image'), async (req, res) => {
  try {
    // 1. Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 3. Handle image upload to Cloudinary
    let imageUrl;
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file);
      if (cloudinaryResponse) {
        imageUrl = cloudinaryResponse.url;
      }
    }

    // 4. Create new user
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // In production, hash this password
      phoneNumber: req.body.phoneNumber,
      image: imageUrl
    });

    // 5. Save user to database
    const savedUser = await newUser.save();

    // 6. Send success response
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        ...savedUser.toObject(),
        password: undefined // Remove password from response
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: "Registration failed", 
      details: error.message 
    });
  }
});

app.get("/testget", async (req, res) => {
  const result = await Product.findOne({ _id: "6429979b2e5434138eda1564" });
  res.json(result);
});

// Here we are listening to the server
app.listen(process.env.PORT, () => {
  console.log(`I am live again ${PORT}` );
});
