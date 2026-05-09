import express from "express";
import {
  getUserReservations,
  updateReservation,
} from "../controllers/reservation.controller.js";

const router = express.Router();

router.get("/user/:userId", getUserReservations);

router.put("/:reservationId", updateReservation);

export default router;
