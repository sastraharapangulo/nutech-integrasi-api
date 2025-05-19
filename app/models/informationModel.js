import db from "../../config/db.js";

const getAllBanners = async (email) => {
  const query = "SELECT * FROM banners";
  const result = await db.query(query);
  return result.rows;
};

const getAllServices = async (email) => {
  const query = "SELECT * FROM services";
  const result = await db.query(query);
  return result.rows;
};

const findServicesByServiceCode = async (service_code) => {
  const query = "SELECT * FROM services WHERE service_code  = $1";
  const result = await db.query(query, [service_code]);
  return result.rows[0];
};

export { getAllBanners, getAllServices, findServicesByServiceCode };
