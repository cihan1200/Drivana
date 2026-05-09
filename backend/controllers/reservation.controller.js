import Reservation from "../models/reservation.model.js";

export const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = await Reservation.find({ user: userId })
      .populate("car", "name year image specs location")
      .sort({ createdAt: -1 });

    res.json({ reservations });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch reservations.", error: err.message });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { pickupDate, returnDate, totalPrice } = req.body;

    if (!pickupDate || !returnDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      return res
        .status(400)
        .json({ message: "Return date must be after pickup date." });
    }

    const reservation =
      await Reservation.findById(reservationId).populate("car");
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    if (reservation.status !== "confirmed") {
      return res
        .status(400)
        .json({ message: "Only confirmed reservations can be edited." });
    }

    const car = reservation.car;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    const isValid = car.availability.some((window) => {
      return start >= new Date(window.from) && end <= new Date(window.to);
    });

    if (!isValid) {
      return res.status(400).json({
        message:
          "Selected dates are outside the available windows for this car.",
      });
    }

    const updated = await Reservation.findByIdAndUpdate(
      reservationId,
      { pickupDate, returnDate, totalPrice },
      { new: true },
    ).populate("car", "name year image specs location");

    res.json({
      message: "Reservation updated successfully.",
      reservation: updated,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update reservation.", error: err.message });
  }
};
