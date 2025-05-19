import { body } from "express-validator";

const registerValidationRules = () => [
  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Paramter email tidak sesuai format"),
  body("first_name").notEmpty().withMessage("Nama depan wajib diisi"),
  body("last_name").notEmpty().withMessage("Nama belakang wajib diisi"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),
];

const loginValidationRules = () => [
  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Paramter email tidak sesuai format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),
];

const updateProfileValidationRules = () => [
  body("first_name").notEmpty().withMessage("Nama depan wajib diisi"),
  body("last_name").notEmpty().withMessage("Nama belakang wajib diisi"),
];

export {
  registerValidationRules,
  loginValidationRules,
  updateProfileValidationRules,
};
