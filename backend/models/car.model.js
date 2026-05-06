import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const availabilitySchema = new mongoose.Schema({
  from: { type: Date, required: true },
  to: { type: Date, required: true },
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
    location: {
      type: String,
      required: true,
      trim: true,
    },
    availability: [availabilitySchema],
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

carSchema.index({ location: 1 });
carSchema.index({ "specs.class": 1 });
carSchema.index({ "availability.from": 1, "availability.to": 1 });

const Car = mongoose.model("Car", carSchema);

export default Car;
