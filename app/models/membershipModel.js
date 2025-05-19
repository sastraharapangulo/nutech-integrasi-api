import db from "../../config/db.js";

const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const createUser = async ({ email, first_name, last_name, password }) => {
  const query = `
    INSERT INTO users (email, first_name, last_name, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, first_name, last_name
  `;
  const values = [email, first_name, last_name, password];
  const result = await db.query(query, values);
  return result.rows[0];
};

const updateUser = async ({ first_name, last_name, email }) => {
  const query = `UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 `;
  const values = [first_name, last_name, email];
  const result = await db.query(query, values);
  return result;
};

const profileImage = async ({ imageUrl, email }) => {
  const query = `UPDATE users SET profile_image = $1 WHERE email = $2 RETURNING email, first_name, last_name, profile_image`;
  const values = [imageUrl, email];
  const result = await db.query(query, values);
  return result;
};

const getUserBalanceByEmail = async (email) => {
  const query = `SELECT balance FROM users WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const updateUserBalance = async (userId, newBalance) => {
  const query = `UPDATE users SET balance = $1 WHERE id = $2`;
  const values = [newBalance, userId];
  const result = await db.query(query, values);
  return result;
};

export {
  findUserByEmail,
  createUser,
  updateUser,
  profileImage,
  getUserBalanceByEmail,
  updateUserBalance,
};
