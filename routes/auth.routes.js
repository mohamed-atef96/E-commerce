const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER } = require("../models/user.model");
const { UserDto } = require("../dto/user.dto");

// get all user
router.get("/allUsers", async (req, res) => {
  const users = await USER.find().select("-hashPassword");
  if (!users) return res.status(400).json({ msg: "No users Yet" });
  res.status(200).json(users);
});

// get user by id
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await USER.findById(id).select("-hashPassword");
  if (!user) {
    return res.status(400).json({ msg: "user not found" });
  } else {
    return res.status(200).json({ user });
  }
});

// sign Up
router.post("/signUp", async (req, res) => {
  const registered = await USER.findOne({ email: req.body.email });
  if (registered)
    return res.status(400).json({ msg: "This Email is already registered" });

  const user = new USER({
    name: req.body.name,
    email: req.body.email,
    hashPassword: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    address: {
      governorate: req.body.address.governorate,
      city: req.body.address.city,
      street: req.body.address.street,
    },
  });

  await user.save();

  res.status(200).json({ msg: "user created successfully" });
});

// sign in
router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  userExist = await USER.findOne({ email: email });

  if (!(userExist && bcrypt.compareSync(password, userExist.hashPassword))) {
    return res.status(400).json({ msg: "Incorrect   Credentials" });
  }
  const userData = UserDto({
    _id: userExist._id,
    name: userExist.name,
    email: userExist.email,
  });
  const token = jwt.sign(userData, process.env.key);
  res.status(200).json({ user: userData, token });
});

// update user
router.put("/updateUser/:id", async (req, res) => {
  const { id } = req.params;
  const userExist = await USER.findById(id);

  if (!userExist) return res.status(400).json({ msg: "user not found" });
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.hashPassword;
  }

  const userUpdated = await USER.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      hashPassword: newPassword,
      phone: req.body.phone,
      address: {
        governorate: req.body.address.governorate,
        city: req.body.address.city,
        street: req.body.address.street,
      },
    },
    { new: true }
  );

  res.status(200).json({ msg: "user updated successfully", userUpdated });
});

// delete user
router.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await USER.findByIdAndRemove(id);
    if (user) {
      res.status(200).json({ msg: "User deleted successfully" });
    } else {
      res.status(400).json({ msg: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
module.exports = router;
