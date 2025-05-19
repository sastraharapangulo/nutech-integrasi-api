import { body, query } from "express-validator";

const topUpValidationRules = () => [
  body("top_up_amount")
    .notEmpty()
    .withMessage("Top up amount tidak boleh kosong")
    .isNumeric()
    .withMessage(
      "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
    )
    .custom((value) => value > 0)
    .withMessage(
      "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
    ),
];

const transactionValidationRules = () => [
  body("service_code")
    .notEmpty()
    .withMessage("Service code tidak boleh kosong"),
];

const historyValidationRules = () => [
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit harus berupa angka >= 1"),

  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset harus berupa angka >= 0"),
];

export {
  topUpValidationRules,
  transactionValidationRules,
  historyValidationRules,
};
