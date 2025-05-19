import { validationResult } from "express-validator";
import { ResponseError } from "../../../errors/responseError.js";
import {
  findUserByEmail,
  getUserBalanceByEmail,
  updateUserBalance,
} from "../../../models/membershipModel.js";
import generateInvoiceNumber from "../../../utils/generateInvoiceNumber.js";
import {
  getTransactionHistoryFromDb,
  insertTransaction,
} from "../../../models/transactionModel.js";
import { findServicesByServiceCode } from "../../../models/informationModel.js";

const getBalance = async (req, res, next) => {
  try {
    const email = req.user.email; // email dari payload JWT

    const user = await getUserBalanceByEmail(email);
    if (!user) {
      throw new ResponseError(404, "User tidak ditemukan");
    }

    res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: user.balance,
      },
    });
  } catch (err) {
    console.error("Get balance error:", err.message);
    next(err);
  }
};

const topUpBalance = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ResponseError(400, errors.array()[0].msg);
    }
    const email = req.user.email;
    const { top_up_amount } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      throw new ResponseError(404, "User tidak ditemukan");
    }

    const newBalance = Number(user.balance) + Number(top_up_amount);
    const updateBalance = await updateUserBalance(user.id, newBalance);

    if (updateBalance.affectedRows === 0) {
      throw new ResponseError(404, "User not found");
    }

    const invoice_number = await generateInvoiceNumber();
    await insertTransaction({
      user_id: user.id,
      invoice_number,
      transaction_type: "TOPUP",
      total_amount: top_up_amount,
      service_code: null,
      service_name: "Top Up balance",
    });

    res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: newBalance,
      },
    });
  } catch (err) {
    next(err);
  }
};

const transaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ResponseError(400, errors.array()[0].msg);
    }

    const email = req.user.email;
    const { service_code } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      throw new ResponseError(404, "User tidak ditemukan");
    }

    const getBalance = await getUserBalanceByEmail(email);
    if (getBalance.length === 0) {
      throw new ResponseError(404, "User tidak ditemukan");
    }

    const service = await findServicesByServiceCode(service_code);
    if (!service) {
      throw new ResponseError(404, "Layanan tidak ditemukan");
    }

    if (getBalance < service.service_tariff) {
      throw new ResponseError(400, "Saldo tidak mencukupi");
    }

    const newBalance = Number(user.balance) - Number(service.service_tariff);
    const updateBalance = await updateUserBalance(user.id, newBalance);

    if (updateBalance.affectedRows === 0) {
      throw new ResponseError(404, "User tidak ditemukan");
    }

    const invoice_number = await generateInvoiceNumber();
    const result = await insertTransaction({
      user_id: user.id,
      invoice_number,
      transaction_type: "PAYMENT",
      total_amount: service.service_tariff,
      service_code: service_code,
      service_name: service.service_name,
    });
    console.log(result);

    res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number: result.invoice_number,
        service_code: result.service_code,
        service_name: result.service_name,
        transaction_type: result.transaction_type,
        total_amount: service.service_tariff,
        created_on: result.created_on,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTransactionHistory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ResponseError(400, errors.array()[0].msg);
    }

    const userId = req.user.userId;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const history = await getTransactionHistoryFromDb(userId, limit, offset);

    res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset,
        limit: limit ?? history.length,
        records: history,
      },
    });
  } catch (error) {
    console.error("Error caught:", error);
    next(error);
  }
};

export { getBalance, topUpBalance, transaction, getTransactionHistory };
