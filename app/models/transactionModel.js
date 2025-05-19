import db from "../../config/db.js";

const insertTransaction = async ({
  user_id,
  invoice_number,
  transaction_type,
  total_amount,
  service_code,
  service_name,
}) => {
  const query = `
    INSERT INTO transactions (user_id, invoice_number, transaction_type, total_amount, service_code, service_name)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING invoice_number, service_code, service_name, transaction_type, created_on
  `;
  const values = [
    user_id,
    invoice_number,
    transaction_type,
    total_amount,
    service_code,
    service_name,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getTransactionHistoryFromDb = async (userId, limit, offset) => {
  let query = `
    SELECT invoice_number, transaction_type, service_name AS description, total_amount, created_on
    FROM transactions
    WHERE user_id = $1
    ORDER BY created_on DESC
  `;

  const params = [userId];

  if (limit !== null) {
    query += ` LIMIT $2 OFFSET $3`;
    params.push(limit, offset);
  }

  const result = await db.query(query, params);
  return result.rows;
};

export { insertTransaction, getTransactionHistoryFromDb };
