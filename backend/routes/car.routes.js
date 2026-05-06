import express from "express";
import {
  getCars,
  getCarById,
  reserveCar,
  checkReservation,
  cancelReservation,
} from "../controllers/car.controller.js";

const router = express.Router();

router.get("/", getCars);
router.get("/:id", getCarById);
router.get("/:id/check-reservation", checkReservation); // NEW
router.delete("/:id/cancel-reservation", cancelReservation); // NEW
router.post("/:id/reserve", reserveCar);

export default router;
