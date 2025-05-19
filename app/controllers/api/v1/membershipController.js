import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import {
  findUserByEmail,
  createUser,
  updateUser,
  profileImage,
} from "../../../models/membershipModel.js";
import { ResponseError } from "../../../errors/responseError.js";
import dotenv from "dotenv";

dotenv.config();
const saltRounds = parseInt(process.env.SALT, 10) || 10;

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ResponseError(400, errors.array()[0].msg);
  }

  const { email, first_name, last_name, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new ResponseError(400, "Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await createUser({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });

    return res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ResponseError(400, errors.array()[0].msg);
    }
    const { email, password } = req.body;

    // Cek user
    const user = await findUserByEmail(email);
    if (!user) {
      throw new ResponseError(401, "Email atau password salah");
    }

    // Bandingkan password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new ResponseError(401, "Email atau password salah");
    }

    // Buat token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    return res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: { token },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    next(err);
  }
};

const getProfile = async (req, res) => {
  try {
    const { email } = req.user; // dari payload JWT
    const user = await findUserByEmail(email);

    if (!user) {
      throw new ResponseError(404, "User tidak ditemukan");
    }

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err.message);
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { email } = req.user; // dari JWT

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ResponseError(400, errors.array()[0].msg);
    }
    const { first_name, last_name } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new ResponseError(404, "User tidak ditemukan");
    }

    const updated = await updateUser(
      email,
      first_name || user.first_name,
      last_name || user.last_name
    );

    if (updated.affectedRows === 0) {
      throw new ResponseError(404, "User tidak ditemukan");
    }

    return res.status(200).json({
      status: 0,
      message: "Update Profile berhasil",
      data: {
        email: user.email,
        first_name,
        last_name,
        profile_image: user.profile_image,
      },
    });
  } catch (err) {
    console.error("Update user error:", err.message);
    next(err);
  }
};

const updateProfileImage = async (req, res, next) => {
  try {
    const email = req.user.email;
    const file = req.file;

    if (!file) throw new ResponseError(400, "Format Image tidak sesuai");

    const imageUrl = `${process.env.API_URL}/uploads/profile/${file.filename}`;
    console.log(imageUrl);

    const upload = await profileImage({ imageUrl, email });
    if (upload.affectedRows === 0) {
      throw new ResponseError(404, "User not found");
    }
    const result = await findUserByEmail(email);

    res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: {
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
        profile_image: result.profile_image,
      },
    });
  } catch (err) {
    console.error("Update profile image error:", err.message);
    next(err);
  }
};

export { register, login, getProfile, updateProfile, updateProfileImage };
