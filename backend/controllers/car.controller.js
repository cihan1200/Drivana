import Car from "../models/car.model.js";
import Reservation from "../models/reservation.model.js";

export const reserveCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, pickupDate, returnDate, pickupLocation, totalPrice } =
      req.body;

    if (!userId || !pickupDate || !returnDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Only look for active/confirmed reservations to block re-booking
    const existingReservation = await Reservation.findOne({
      car: id,
      user: userId,
      status: "confirmed", // <-- Added check
    });
    if (existingReservation) {
      return res
        .status(400)
        .json({ message: "You have already reserved this car." });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    const isValid = car.availability.some((window) => {
      return start >= new Date(window.from) && end <= new Date(window.to);
    });

    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Selected dates are outside the available windows." });
    }

    const reservation = await Reservation.create({
      car: id,
      user: userId,
      pickupLocation,
      pickupDate,
      returnDate,
      totalPrice,
    });

    res
      .status(201)
      .json({ message: "Reservation successful!", result: reservation });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to reserve car.", error: err.message });
  }
};

export const checkReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) return res.json({ reserved: false });

    // Only return true if the reservation is confirmed
    const reservation = await Reservation.findOne({
      car: id,
      user: userId,
      status: "confirmed",
    }); // <-- Added status check
    res.json({ reserved: !!reservation, reservation });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to check reservation.", error: err.message });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    // Find the active reservation instead of deleting it immediately
    const reservation = await Reservation.findOne({
      car: id,
      user: userId,
      status: "confirmed",
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    // Update status to cancelled
    reservation.status = "cancelled";
    await reservation.save();

    // Fetch all cancelled reservations for this user, newest first
    const cancelledReservations = await Reservation.find({
      user: userId,
      status: "cancelled",
    }).sort({ createdAt: -1 });

    // If there are more than 10, delete the older ones
    if (cancelledReservations.length > 10) {
      const idsToDelete = cancelledReservations.slice(10).map((r) => r._id);
      await Reservation.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.json({ message: "Reservation cancelled successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to cancel reservation.", error: err.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.pickupLocation) {
      filter.location = {
        $regex: req.query.pickupLocation.trim(),
        $options: "i",
      };
    }

    if (req.query.pickupDate && req.query.returnDate) {
      const pickupDate = new Date(req.query.pickupDate);
      const returnDate = new Date(req.query.returnDate);

      if (
        !isNaN(pickupDate) &&
        !isNaN(returnDate) &&
        pickupDate <= returnDate
      ) {
        filter.availability = {
          $elemMatch: {
            from: { $lte: pickupDate },
            to: { $gte: returnDate },
          },
        };
      }
    }

    if (req.query.carClass) {
      filter["specs.class"] = req.query.carClass;
    }

    const [cars, total] = await Promise.all([
      Car.find(filter).skip(skip).limit(limit),
      Car.countDocuments(filter),
    ]);

    res.json({
      cars,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch cars.", error: err.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found." });
    res.json(car);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch car.", error: err.message });
  }
};
