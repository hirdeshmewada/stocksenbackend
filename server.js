require('dotenv').config();
const express = require("express");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const userInteraction = require("./router/user/voice");
import { uploadOnCloudinary } from "/util/cloudinary";
const voice = require("./router/voice");
const cors = require("cors");
const User = require("./models/users");
const Product = require("./models/product");

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
  console.log(req.body);
  // res.send("hi");
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("USER: ", user);
    if (user) {
      res.send(user);
      userAuthCheck = user;
    } else {
      res.status(401).send("Invalid Credentials");
      userAuthCheck = null;
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Getting User Details of login user
app.get("/api/login", (req, res) => {
  res.send(userAuthCheck);
});
// ------------------------------------

// Registration API
// app.post("/api/register", (req, res) => {
//   let registerUser = new User({
//     firstName: req?.body?.firstName,
//     lastName: req?.body?.lastName,
//     email: req?.body?.email,
//     password: req?.body?.password,
//     phoneNumber: req?.body?.phoneNumber,
//   });

//   registerUser
//     .save()
//     .then((result) => {
//       res.status(200).send(result);
//     })
//     .catch((err) => {
//       console.log("Signup: ", err);
//       res.status(400).send({ error: "Registration failed" });
//     });
//   console.log("request: ", req.body);
// });

app.post("/api/register", async (req, res) => {

   if (
    [firstName, lastName, email, password,phoneNumber].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ phoneNumber }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
   const avatarLocalPath = req.files?.image[0]?.path;
  if (avatarLocalPath) {
     const avatar = await uploadOnCloudinary(avatarLocalPath);
  
  }
   const user = await User.create({
    firstName: req?.body?.firstName,
    lastName: req?.body?.lastName,
    email,
    password,
    phoneNumber,
  });
    const createdUser = await User.findById(user._id).select(
    "-password);

     if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

   return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

app.get("/testget", async (req, res) => {
  const result = await Product.findOne({ _id: "6429979b2e5434138eda1564" });
  res.json(result);
});

// Here we are listening to the server
app.listen(process.env.PORT, () => {
  console.log(`I am live again ${PORT}` );
});
