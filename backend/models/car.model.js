import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    image: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    reviews: [reviewSchema],
    features: [{ type: String }],
    specs: {
      fuelType: { type: String },
      engine: { type: String },
      seats: { type: Number },
      ac: { type: Boolean },
      pricePerDay: { type: Number },
      class: { type: String },
      description: { type: String },
    },
  },
  { timestamps: true },
);

const Car = mongoose.model("Car", carSchema);

export default Car;
