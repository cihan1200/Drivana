import mongoose from "mongoose";
import Car from "../models/car.model.js";

const carNames = [
  "Lexus IS",
  "BMW M3",
  "Audi RS5",
  "Mercedes C63",
  "Porsche 911",
  "Tesla Model S",
  "Ford Mustang",
  "Chevy Corvette",
  "Toyota Supra",
  "Nissan GT-R",
  "Alfa Romeo Giulia",
  "Genesis G70",
  "Jaguar F-Type",
  "McLaren 570S",
  "Lamborghini Huracán",
  "Ferrari 488",
  "Maserati Ghibli",
  "Dodge Challenger",
  "Cadillac CT5-V",
  "Subaru WRX STI",
  "Honda Civic Type R",
  "Kia Stinger GT",
  "Bentley Continental",
  "Volvo C40",
  "Aston Martin Vantage",
  "Rolls-Royce Ghost",
  "Bugatti Chiron",
  "Pagani Huayra",
  "Koenigsegg Agera",
  "Lotus Emira",
  "Alpine A110",
  "Caterham Seven",
];

const years = [2019, 2020, 2021, 2022, 2023, 2024];

const imagePool = [
  "https://images.unsplash.com/photo-1623910385966-d4191c95f1ab?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1555353540-64fd1b369527?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1503377215949-b5a5b17ebf3c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1584345604476-8cb5e136084a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1607853554439-0069ec0f29b6?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1620012253295-c15bc3e65313?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1599912027806-ce8a27094d1a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1552248524-4d5e9e2a6e25?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1614026480418-bd11fdb9fa06?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1564459031898-61e7e31bc7b0?auto=format&fit=crop&w=1000&q=80",
];

const reviewerNames = [
  "James Mitchell",
  "Sarah Chen",
  "Oliver Bennett",
  "Emma Rodriguez",
  "Luca Ferrari",
  "Sophie Müller",
  "Alex Thompson",
  "Priya Patel",
  "Carlos Mendes",
  "Zoe Williams",
  "Kai Anderson",
  "Natasha Ivanova",
  "Hassan Al-Rashid",
  "Mei Lin",
  "David Okonkwo",
  "Isabella Rossi",
  "Ryan MacLeod",
  "Amara Diallo",
  "Tom Nakamura",
  "Chloe Dubois",
  "Marcus Johnson",
  "Aisha Rahman",
  "Ben Harrington",
  "Yuki Tanaka",
  "Finn O'Brien",
  "Laura Becker",
  "Mateus Costa",
  "Elena Volkov",
  "Jake Summers",
  "Nadia Fontaine",
];

const reviewComments = [
  "Absolutely loved driving this car. The handling was precise and it felt planted on the road at all times.",
  "Incredibly smooth ride. The interior quality exceeded my expectations and every surface feels premium.",
  "Picked this up for a weekend trip and it made the journey genuinely enjoyable from start to finish.",
  "The acceleration is addictive. Every on-ramp becomes the highlight of your day with this machine.",
  "Stunning to look at and even better to drive. Would rent again without a moment's hesitation.",
  "Comfortable for long distances. The seats are supportive and the cabin is impressively quiet at speed.",
  "Felt like a proper sports car. The steering is communicative and the brakes inspire total confidence.",
  "Great visibility, easy to park, and the fuel economy was considerably better than expected.",
  "The exhaust note alone is worth the rental fee. A truly unforgettable experience.",
  "Build quality is exceptional. Every surface feels meticulously crafted and well thought out.",
  "Minor quirk with the infotainment at first but overall a genuinely fantastic drive throughout.",
  "This car turns heads everywhere you go. Had countless people stopping to ask about it.",
  "Perfect balance of comfort and performance. A true daily driver that never feels boring.",
  "The adaptive cruise control made motorway driving completely effortless and stress-free.",
  "Handling feels sharp and beautifully responsive. Far better than I expected from the spec sheet.",
  "Rear visibility could be improved but everything else about this car is simply brilliant.",
  "Genuinely one of the finest cars I have ever driven. Will absolutely be returning.",
  "Very well maintained. Felt almost brand new. Pickup and drop-off was completely seamless.",
  "Impressive torque from the moment you set off. The power delivery is smooth and very linear.",
  "Great car for both the city and motorway. Versatile and engaging in equal measure.",
  "The suspension tuning is spot on. It absorbs bumps without ever sacrificing cornering ability.",
  "Not the most spacious back seat but the driving experience more than compensates.",
  "Electric power delivery is instant and addictive. No going back to combustion after this.",
  "The sound system alone made every journey special. Incredible acoustics throughout the cabin.",
  "A little thirstier than expected but the performance absolutely justifies every drop.",
  "Ran beautifully for the entire trip without a single mechanical hiccup or concern.",
  "The interior makes you feel special every time you get in. Genuinely elevated experience.",
  "Braking performance is exceptional. Gave me complete and utter confidence at higher speeds.",
  "The kind of car that makes you actively look for excuses to take longer routes.",
  "Slightly firm ride around town but transforms completely once you are moving. Totally worth it.",
  "Pickup was straightforward and the car was spotlessly clean. Great rental experience overall.",
  "The gearbox shifts are lightning quick. Makes spirited driving feel effortless and rewarding.",
  "Loved the way it looks from every angle. An absolute head-turner in any car park.",
  "Comfortable enough for a family road trip but exciting enough for a solo blast on the weekend.",
  "The drive modes make a genuine difference. Sport mode transforms the whole character of the car.",
];

const featuresPool = [
  "Free cancellation (48h before pickup)",
  "Unlimited mileage",
  "24/7 roadside assistance",
  "Collision damage waiver",
  "Third-party liability",
  "GPS Navigation included",
  "Child seat available on request",
  "Additional driver allowed",
  "Airport pickup available",
  "Full-to-full fuel policy",
  "Comprehensive insurance included",
  "No deposit required",
  "Wi-Fi hotspot",
  "Leather interior",
  "Sunroof or convertible roof",
  "Delivery to your door",
  "Snow chains available",
  "Bluetooth connectivity",
];

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const engineOptions = [
  "2.0L Turbo",
  "3.0L V6",
  "4.0L V8",
  "Electric Motor",
  "1.5L Turbo",
  "2.5L Naturally Aspirated",
  "3.8L Twin-Turbo",
  "6.5L V12",
  "4.0L Twin-Turbo",
  "5.0L V10",
];
const carClasses = [
  "Sport",
  "Luxury",
  "Supercar",
  "Electric",
  "Gran Turismo",
  "Performance",
  "Compact Sport",
];
const seatOptions = [2, 4, 5];

const descriptions = [
  "A masterpiece of automotive engineering that delivers thrilling performance alongside refined daily usability.",
  "This iconic machine combines cutting-edge technology with timeless design cues that never fail to impress.",
  "Engineered for those who refuse to compromise between exhilarating performance and everyday comfort.",
  "An automotive legend reimagined for the modern era, with dynamic capability that defies expectations.",
  "Where luxury meets performance — this car sets the benchmark in its class and leaves rivals trailing.",
  "Purposefully crafted for driving enthusiasts who demand the very best from every journey.",
  "A perfect fusion of raw power and sophisticated refinement that rewards skilled drivers at every speed.",
  "From its aerodynamic silhouette to its driver-focused cockpit, every detail is designed to excite.",
  "The ultimate expression of what a driver's car should be: fast, precise, and endlessly rewarding.",
  "Combining blistering speed with surprising practicality, this car works as hard as it plays.",
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pickUnique = (arr, count) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateImages = () => {
  const count = randomInt(10, 20);
  return pickUnique(imagePool, count);
};

const generateReviews = () => {
  const count = randomInt(15, 200);
  const shuffledNames = [...reviewerNames].sort(() => Math.random() - 0.5);
  const shuffledComments = [...reviewComments].sort(() => Math.random() - 0.5);

  return Array.from({ length: count }, (_, i) => {
    const ratingWeights = [0, 0, 0, 1, 2, 3];
    const weightedRatings = [3, 3, 3, 4, 4, 4, 4, 5, 5, 5];
    const rating = pickRandom(weightedRatings);

    return {
      reviewer: shuffledNames[i % shuffledNames.length],
      rating,
      comment: shuffledComments[i % shuffledComments.length],
      date: new Date(
        Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000,
      ),
    };
  });
};

const calculateScore = (reviews) => {
  if (!reviews.length) return 4.0;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return parseFloat(avg.toFixed(2));
};

const generateFeatures = () => {
  const count = randomInt(5, 8);
  return pickUnique(featuresPool, count);
};

const generateSpecs = () => ({
  fuelType: pickRandom(fuelTypes),
  engine: pickRandom(engineOptions),
  seats: pickRandom(seatOptions),
  ac: Math.random() > 0.1,
  pricePerDay: randomInt(80, 500),
  class: pickRandom(carClasses),
  description: pickRandom(descriptions),
});

const generateCars = (count) =>
  Array.from({ length: count }, () => {
    const images = generateImages();
    const reviews = generateReviews();
    const score = calculateScore(reviews);

    return {
      name: pickRandom(carNames),
      year: pickRandom(years),
      score,
      image: images[0],
      images,
      reviews,
      features: generateFeatures(),
      specs: generateSpecs(),
    };
  });

const COUNT = parseInt(process.argv[2]) || 24;

async function seed() {
  try {
    await mongoose.connect(
      "mongodb+srv://isikc96_db_user:CwW7zPSYGzUFJ0WY@cluster0.nwk7ok1.mongodb.net/",
    );
    console.log("✅ Connected to MongoDB");

    await Car.deleteMany({});
    console.log("🗑️  Cleared existing cars");

    const cars = generateCars(COUNT);
    await Car.insertMany(cars);
    console.log(`🌱 Seeded ${COUNT} cars successfully`);
    console.log(
      `   → Each car has ${10}–${20} images, ${15}–${200} reviews, ${5}–${8} features, and full specs`,
    );
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
