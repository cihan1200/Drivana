import Car from "../models/car.model.js";

export const getCars = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);
    const skip = (page - 1) * limit;

    const [cars, total] = await Promise.all([
      Car.find().skip(skip).limit(limit),
      Car.countDocuments(),
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
