import express from "express";
import {
  getProfile,
  login,
  register,
  updateProfile,
  updateProfileImage,
} from "../app/controllers/api/v1/membershipController.js";
import {
  loginValidationRules,
  registerValidationRules,
  updateProfileValidationRules,
} from "../app/utils/membershipValidation.js";
import { authenticate } from "../app/middlewares/authMiddleware.js";
import { upload } from "../app/middlewares/upload.js";
import {
  getBanners,
  getServices,
} from "../app/controllers/api/v1/informationController.js";
import {
  getBalance,
  getTransactionHistory,
  topUpBalance,
  transaction,
} from "../app/controllers/api/v1/transactionController.js";
import {
  historyValidationRules,
  topUpValidationRules,
  transactionValidationRules,
} from "../app/utils/transactionValidation.js";

const apiRouter = express.Router();

apiRouter.post("/registration", registerValidationRules(), register);
apiRouter.post("/login", loginValidationRules(), login);
apiRouter.get("/profile", authenticate, getProfile);
apiRouter.put(
  "/profile/update",
  authenticate,
  updateProfileValidationRules(),
  updateProfile
);
apiRouter.put(
  "/profile/image",
  authenticate,
  upload.single("image"),
  updateProfileImage
);

apiRouter.get("/banner", getBanners);
apiRouter.get("/services", authenticate, getServices);

apiRouter.get("/balance", authenticate, getBalance);
apiRouter.post("/topup", authenticate, topUpValidationRules(), topUpBalance);
apiRouter.post(
  "/transaction",
  authenticate,
  transactionValidationRules(),
  transaction
);
apiRouter.get(
  "/transaction/history",
  authenticate,
  historyValidationRules(),
  getTransactionHistory
);

export default apiRouter;
