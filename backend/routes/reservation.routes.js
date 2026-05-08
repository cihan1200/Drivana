import express from "express";
import {
  getUserReservations,
  updateReservation,
} from "../controllers/reservation.controller.js";

const router = express.Router();

// GET all reservations for a user (populated with car data)
router.get("/user/:userId", getUserReservations);

// PUT update reservation dates
router.put("/:reservationId", updateReservation);

export default router;
