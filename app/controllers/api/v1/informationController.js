import {
  getAllBanners,
  getAllServices,
} from "../../../models/informationModel.js";

const getBanners = async (req, res, next) => {
  try {
    const banners = await getAllBanners();
    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: banners,
    });
  } catch (err) {
    console.error("Get banners error:", err.message);
    next(err);
  }
};

const getServices = async (req, res, next) => {
  try {
    const services = await getAllServices();
    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: services,
    });
  } catch (err) {
    console.error("Get services error:", err.message);
    next(err);
  }
};

export { getBanners, getServices };
