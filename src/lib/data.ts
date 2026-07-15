export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "NEW" | "SALE";
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  inStock: boolean;
  sold_by?: string;
  video?: string;
  ingredients?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url?: string;
  subcategories: Subcategory[];
}

export interface VetService {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  initials: string;
}

export const categories: Category[] = [
  {
    id: "cats",
    name: "Cats",
    description: "Everything for your feline friend",
    icon: "cat",
    subcategories: [
      { id: "cats-food", name: "Food", slug: "cats/food" },
      { id: "cats-litter", name: "Litter & Accessories", slug: "cats/litter" },
      { id: "cats-toys", name: "Toys", slug: "cats/toys" },
      { id: "cats-health", name: "Health Care", slug: "cats/health" },
      { id: "cats-beds", name: "Beds & Furniture", slug: "cats/beds" },
      { id: "cats-bowls", name: "Bowls & Feeders", slug: "cats/bowls" },
      { id: "cats-grooming", name: "Grooming", slug: "cats/grooming" },
    ],
  },
  {
    id: "dogs",
    name: "Dogs",
    description: "Premium supplies for your canine companion",
    icon: "dog",
    subcategories: [
      { id: "dogs-food", name: "Food", slug: "dogs/food" },
      { id: "dogs-toys", name: "Toys", slug: "dogs/toys" },
      { id: "dogs-health", name: "Health Care", slug: "dogs/health" },
      { id: "dogs-accessories", name: "Accessories", slug: "dogs/accessories" },
    ],
  },
  {
    id: "birds",
    name: "Birds",
    description: "Premium bird supplies",
    icon: "bird",
    subcategories: [
      { id: "birds-food", name: "Food", slug: "birds/food" },
      { id: "birds-cages", name: "Cages", slug: "birds/cages" },
      { id: "birds-accessories", name: "Accessories", slug: "birds/accessories" },
    ],
  },
  {
    id: "fish",
    name: "Fish & Reptiles",
    description: "Aquariums, terrariums & supplies",
    icon: "fish",
    subcategories: [
      { id: "fish-aquariums", name: "Aquariums & Tanks", slug: "fish/aquariums" },
      { id: "fish-food", name: "Food", slug: "fish/food" },
      { id: "fish-accessories", name: "Accessories", slug: "fish/accessories" },
    ],
  },
  {
    id: "small-pets",
    name: "Rabbits & Hamsters",
    description: "Everything for small pets",
    icon: "rabbit",
    subcategories: [
      { id: "smallpets-food", name: "Food", slug: "small-pets/food" },
      { id: "smallpets-cages", name: "Cages & Accessories", slug: "small-pets/cages" },
    ],
  },
];

export const products: Product[] = [
  // ===== CATS =====
  { id: "c1", name: "Premium Dry Cat Food 2kg", category: "cats", subcategory: "cats-food", price: 32.99, originalPrice: 39.99, image: "https://picsum.photos/seed/c1/400/400", badge: "SALE", rating: 4.7, reviews: 89, description: "High-protein dry cat food with real chicken.", features: ["Real chicken first ingredient", "No artificial colors", "Grain-free option", "Omega-3 fatty acids"], inStock: true },
  { id: "c2", name: "Wet Cat Food Variety Pack 12x85g", category: "cats", subcategory: "cats-food", price: 24.99, image: "https://picsum.photos/seed/c2/400/400", badge: "NEW", rating: 4.8, reviews: 124, description: "Assorted wet food pack with tuna, salmon & chicken.", features: ["12 pouches", "No preservatives", "High moisture content", "Taurine enriched"], inStock: true },
  { id: "c3", name: "Clumping Cat Litter 10kg", category: "cats", subcategory: "cats-litter", price: 18.99, originalPrice: 22.99, image: "https://picsum.photos/seed/c3/400/400", badge: "SALE", rating: 4.6, reviews: 203, description: "Ultra-clumping bentonite cat litter.", features: ["99% dust-free", "Instant clumping", "Odor control", "Natural clay"], inStock: true },
  { id: "c4", name: "Self-Cleaning Litter Box", category: "cats", subcategory: "cats-litter", price: 89.99, image: "https://picsum.photos/seed/c4/400/400", rating: 4.4, reviews: 67, description: "Automatic self-scooping litter box.", features: ["Auto-clean cycle", "Carbon filter", "Low energy", "Easy dump tray"], inStock: true },
  { id: "c5", name: "Interactive Feather Wand Toy", category: "cats", subcategory: "cats-toys", price: 12.99, image: "https://picsum.photos/seed/c5/400/400", rating: 4.5, reviews: 156, description: "Teaser wand with realistic feathers.", features: ["Real feathers", "Retractable string", "Replaceable attachments", "Ergonomic handle"], inStock: true },
  { id: "c6", name: "Catnip Kick Stick Toy Set", category: "cats", subcategory: "cats-toys", price: 9.99, image: "https://picsum.photos/seed/c6/400/400", rating: 4.3, reviews: 98, description: "Set of 3 catnip-filled kicker toys.", features: ["Organic catnip", "Crinkle material", "Assorted colors", "Machine washable"], inStock: true },
  { id: "c7", name: "Flea & Tick Prevention Drops", category: "cats", subcategory: "cats-health", price: 34.99, image: "https://picsum.photos/seed/c7/400/400", rating: 4.7, reviews: 312, description: "Monthly topical flea and tick protection.", features: ["Lasts 30 days", "Water-resistant", "Kills fleas in 12 hours", "For cats over 1.5kg"], inStock: true },
  { id: "c8", name: "Dental Care Kit for Cats", category: "cats", subcategory: "cats-health", price: 19.99, image: "https://picsum.photos/seed/c8/400/400", badge: "NEW", rating: 4.2, reviews: 45, description: "Toothbrush and toothpaste set for feline dental health.", features: ["Soft bristle brush", "Poultry-flavored toothpaste", "Enzymatic formula", "Finger brush included"], inStock: true },
  { id: "c9", name: "Orthopedic Cat Bed - Large", category: "cats", subcategory: "cats-beds", price: 59.99, originalPrice: 79.99, image: "https://picsum.photos/seed/c9/400/400", badge: "SALE", rating: 4.8, reviews: 88, description: "Memory foam orthopedic cat bed with washable cover.", features: ["Memory foam filling", "Machine washable cover", "Anti-slip base", "Water-resistant liner"], inStock: true },
  { id: "c10", name: "Cat Tree Tower 6-Level", category: "cats", subcategory: "cats-beds", price: 139.99, image: "https://picsum.photos/seed/c10/400/400", rating: 4.6, reviews: 73, description: "Multi-level cat tree with sisal scratching posts.", features: ["6 platforms", "Sisal rope posts", "Hanging toy", "Removable cushions"], inStock: true },
  { id: "c11", name: "Stainless Steel Cat Bowls Set", category: "cats", subcategory: "cats-bowls", price: 22.99, image: "https://picsum.photos/seed/c11/400/400", rating: 4.7, reviews: 134, description: "Set of 2 stainless steel bowls with silicone mat.", features: ["Stainless steel", "Non-slip silicone base", "Dishwasher safe", "Raised design"], inStock: true },
  { id: "c12", name: "Automatic Cat Water Fountain", category: "cats", subcategory: "cats-bowls", price: 39.99, image: "https://picsum.photos/seed/c12/400/400", rating: 4.5, reviews: 211, description: "Filtered water fountain with 2L capacity.", features: ["Carbon filter", "Quiet pump", "2L capacity", "BPA-free"], inStock: true },
  { id: "c13", name: "Cat Grooming Brush - Deshedding", category: "cats", subcategory: "cats-grooming", price: 14.99, image: "https://picsum.photos/seed/c13/400/400", rating: 4.4, reviews: 167, description: "Stainless steel deshedding brush.", features: ["Stainless steel blade", "Ergonomic handle", "Self-cleaning button", "Reduces shedding by 90%"], inStock: true },
  { id: "c14", name: "Cat Nail Clippers & File Set", category: "cats", subcategory: "cats-grooming", price: 11.99, image: "https://picsum.photos/seed/c14/400/400", rating: 4.3, reviews: 89, description: "Safety nail clippers with file and guide.", features: ["Safety guard", "Stainless steel", "Nail file included", "Non-slip handles"], inStock: true },

  // ===== DOGS =====
  { id: "d1", name: "Premium Dry Dog Food 3kg", category: "dogs", subcategory: "dogs-food", price: 38.99, originalPrice: 45.99, image: "https://picsum.photos/seed/d1/400/400", badge: "SALE", rating: 4.8, reviews: 245, description: "High-protein dry food with real beef and vegetables.", features: ["Real beef first", "Brown rice & barley", "Glucosamine added", "No corn or soy"], inStock: true },
  { id: "d2", name: "Wet Dog Food Trays 12x100g", category: "dogs", subcategory: "dogs-food", price: 28.99, image: "https://picsum.photos/seed/d2/400/400", rating: 4.6, reviews: 134, description: "Assorted wet food with lamb, chicken & beef.", features: ["12 trays", "Grain-free", "Natural ingredients", "Complete nutrition"], inStock: true },
  { id: "d3", name: "Dental Chew Bones 20-pack", category: "dogs", subcategory: "dogs-food", price: 16.99, image: "https://picsum.photos/seed/d3/400/400", badge: "NEW", rating: 4.5, reviews: 312, description: "Veterinarian-recommended dental chews.", features: ["Reduces plaque", "Low fat", "Digestible", "Sizes for all breeds"], inStock: true },
  { id: "d4", name: "Squeaky Plush Toy Set - 3 Pack", category: "dogs", subcategory: "dogs-toys", price: 19.99, image: "https://picsum.photos/seed/d4/400/400", rating: 4.4, reviews: 178, description: "Soft plush toys with hidden squeakers.", features: ["3 different animals", "Hidden squeaker", "Durable stitching", "Machine washable"], inStock: true },
  { id: "d5", name: "Rope Tug Toy - Heavy Duty", category: "dogs", subcategory: "dogs-toys", price: 12.99, image: "https://picsum.photos/seed/d5/400/400", rating: 4.3, reviews: 92, description: "Knotted cotton rope toy for interactive play.", features: ["100% cotton", "Natural dyes", "Dental cleaning fibers", "Great for fetch"], inStock: true },
  { id: "d6", name: "Heartworm Prevention Monthly", category: "dogs", subcategory: "dogs-health", price: 44.99, image: "https://picsum.photos/seed/d6/400/400", rating: 4.9, reviews: 401, description: "Monthly chewable heartworm prevention.", features: ["Beef-flavored chew", "Prevents heartworm", "Controls roundworms", "For dogs 2-25kg"], inStock: true },
  { id: "d7", name: "Joint Supplement Chews 60ct", category: "dogs", subcategory: "dogs-health", price: 36.99, image: "https://picsum.photos/seed/d7/400/400", badge: "NEW", rating: 4.6, reviews: 267, description: "Glucosamine and chondroitin joint support.", features: ["Glucosamine + chondroitin", "MSM added", "Peanut butter flavor", "Soft chew format"], inStock: true },
  { id: "d8", name: "Adjustable Dog Harness", category: "dogs", subcategory: "dogs-accessories", price: 34.99, image: "https://picsum.photos/seed/d8/400/400", rating: 4.7, reviews: 345, description: "No-pull harness with padded chest plate.", features: ["4 adjustment points", "Reflective stitching", "Padded chest", "Quick-release buckles"], inStock: true },
  { id: "d9", name: "Extendable Dog Leash 5m", category: "dogs", subcategory: "dogs-accessories", price: 29.99, image: "https://picsum.photos/seed/d9/400/400", rating: 4.5, reviews: 156, description: "One-hand brake extendable leash.", features: ["5m length", "One-hand brake", "Ergonomic handle", "Reflective cord"], inStock: true },
  { id: "d10", name: "Collapsible Travel Dog Bowl", category: "dogs", subcategory: "dogs-accessories", price: 14.99, image: "https://picsum.photos/seed/d10/400/400", rating: 4.4, reviews: 89, description: "Portable silicone travel bowl with carabiner.", features: ["Collapsible design", "Food-grade silicone", "Carabiner clip", "Easy to clean"], inStock: true },

  // ===== BIRDS =====
  { id: "b1", name: "Premium Seed Mix 1.5kg", category: "birds", subcategory: "birds-food", price: 16.99, originalPrice: 19.99, image: "https://picsum.photos/seed/b1/400/400", badge: "SALE", rating: 4.6, reviews: 78, description: "Vitamin-enriched seed mix for all bird species.", features: ["Vitamin enriched", "Dried fruits", "No artificial colors", "For all bird types"], inStock: true },
  { id: "b2", name: "Pellets for Parakeets 500g", category: "birds", subcategory: "birds-food", price: 12.99, image: "https://picsum.photos/seed/b2/400/400", rating: 4.5, reviews: 56, description: "Nutritionally complete pelleted diet.", features: ["Complete nutrition", "Small pellet size", "Veggie-based colors", "No mess"], inStock: true },
  { id: "b3", name: "Large Parrot Cage 80x60x120cm", category: "birds", subcategory: "birds-cages", price: 229.99, originalPrice: 289.99, image: "https://picsum.photos/seed/b3/400/400", badge: "SALE", rating: 4.7, reviews: 34, description: "Spacious powder-coated cage with play top.", features: ["Powder-coated steel", "Pull-out tray", "4 feeding doors", "Play top with perch"], inStock: true },
  { id: "b4", name: "Small Bird Travel Cage", category: "birds", subcategory: "birds-cages", price: 54.99, image: "https://picsum.photos/seed/b4/400/400", rating: 4.3, reviews: 28, description: "Portable carrier cage for small birds.", features: ["Lightweight", "Removable perch", "Ventilated", "Carry handle"], inStock: true },
  { id: "b5", name: "Natural Wood Perch Set", category: "birds", subcategory: "birds-accessories", price: 14.99, image: "https://picsum.photos/seed/b5/400/400", rating: 4.4, reviews: 67, description: "Set of 3 natural wood perches varying diameters.", features: ["Natural wood", "Variable diameter", "Easy attachment", "Foot exercise"], inStock: true },
  { id: "b6", name: "Bird Bath & Water Dispenser", category: "birds", subcategory: "birds-accessories", price: 19.99, image: "https://picsum.photos/seed/b6/400/400", badge: "NEW", rating: 4.2, reviews: 41, description: "Dual-function ceramic bath and water dispenser.", features: ["Ceramic construction", "Easy to clean", "Sturdy base", "Dual function"], inStock: true },

  // ===== FISH & REPTILES =====
  { id: "f1", name: "Aquarium Starter Kit 20L", category: "fish", subcategory: "fish-aquariums", price: 89.99, originalPrice: 109.99, image: "https://picsum.photos/seed/f1/400/400", badge: "SALE", rating: 4.5, reviews: 92, description: "Complete starter kit with filter, light and heater.", features: ["20L tank", "LED lighting", "Internal filter", "50W heater"], inStock: true },
  { id: "f2", name: "Terrarium for Reptiles 40x30x30cm", category: "fish", subcategory: "fish-aquariums", price: 119.99, image: "https://picsum.photos/seed/f2/400/400", rating: 4.6, reviews: 47, description: "Glass terrarium with ventilation panels.", features: ["Front ventilation", "Sliding doors", "Screen top", "Waterproof base"], inStock: true },
  { id: "f3", name: "Tropical Fish Flakes 250ml", category: "fish", subcategory: "fish-food", price: 9.99, image: "https://picsum.photos/seed/f3/400/400", rating: 4.4, reviews: 134, description: "Balanced flake food for tropical fish.", features: ["Slow-sinking flakes", "Color enhancing", "Vitamin C added", "For all tropical fish"], inStock: true },
  { id: "f4", name: "Reptile Calcium + D3 Powder", category: "fish", subcategory: "fish-food", price: 11.99, image: "https://picsum.photos/seed/f4/400/400", rating: 4.5, reviews: 78, description: "Calcium supplement for reptiles and amphibians.", features: ["With D3", "Ultra-fine powder", "No phosphorus", "UVB stable"], inStock: true },
  { id: "f5", name: "Aquarium Filter - External 600L/h", category: "fish", subcategory: "fish-accessories", price: 59.99, image: "https://picsum.photos/seed/f5/400/400", rating: 4.6, reviews: 89, description: "External canister filter for aquariums up to 100L.", features: ["600L/h flow rate", "3-stage filtration", "Quiet operation", "Easy priming"], inStock: true },
  { id: "f6", name: "LED Aquarium Light Bar 60cm", category: "fish", subcategory: "fish-accessories", price: 44.99, image: "https://picsum.photos/seed/f6/400/400", badge: "NEW", rating: 4.3, reviews: 56, description: "Full-spectrum LED light with day/night modes.", features: ["Full spectrum", "Day/night cycle", "Adjustable brackets", "Low power"], inStock: true },
  { id: "f7", name: "Submersible Aquarium Heater 100W", category: "fish", subcategory: "fish-accessories", price: 24.99, image: "https://picsum.photos/seed/f7/400/400", rating: 4.4, reviews: 112, description: "Automatic thermostat heater for aquariums.", features: ["Automatic shut-off", "External thermostat", "100W output", "Suitable for 30-60L"], inStock: true },

  // ===== RABBITS & HAMSTERS =====
  { id: "s1", name: "Rabbit Pellet Food 2kg", category: "small-pets", subcategory: "smallpets-food", price: 14.99, image: "https://picsum.photos/seed/s1/400/400", rating: 4.6, reviews: 89, description: "Timothy hay-based pellets for adult rabbits.", features: ["Timothy hay base", "Vitamin fortified", "No added sugar", "High fiber"], inStock: true },
  { id: "s2", name: "Hamster & Gerbil Seed Mix 500g", category: "small-pets", subcategory: "smallpets-food", price: 8.99, image: "https://picsum.photos/seed/s2/400/400", badge: "NEW", rating: 4.3, reviews: 56, description: "Nutritious seed mix with dried vegetables.", features: ["Seed & veggie mix", "Fortified with vitamins", "No artificial colors", "Small animal friendly"], inStock: true },
  { id: "s3", name: "Rabbit Cage 2-Tier Deluxe", category: "small-pets", subcategory: "smallpets-cages", price: 159.99, originalPrice: 189.99, image: "https://picsum.photos/seed/s3/400/400", badge: "SALE", rating: 4.7, reviews: 43, description: "Spacious two-level rabbit hutch with ramp.", features: ["2 levels", "Removable tray", "Ramp included", "Waterproof roof"], inStock: true },
  { id: "s4", name: "Hamster Habitat Starter Kit", category: "small-pets", subcategory: "smallpets-cages", price: 49.99, image: "https://picsum.photos/seed/s4/400/400", rating: 4.5, reviews: 112, description: "Complete hamster home with accessories.", features: ["Wire-top base", "Water bottle", "Exercise wheel", "Hideout house"], inStock: true },
  { id: "s5", name: "Rabbit Hay Feeder & Hay 1kg", category: "small-pets", subcategory: "smallpets-cages", price: 22.99, image: "https://picsum.photos/seed/s5/400/400", rating: 4.4, reviews: 67, description: "Wooden hay feeder with premium timothy hay.", features: ["Wooden feeder", "Timothy hay", "High fiber", "Promotes natural grazing"], inStock: true },
  { id: "s6", name: "Small Animal Bedding 10L", category: "small-pets", subcategory: "smallpets-cages", price: 12.99, image: "https://picsum.photos/seed/s6/400/400", rating: 4.3, reviews: 145, description: "Soft paper-based bedding for small animals.", features: ["Paper-based", "99% dust-free", "Highly absorbent", "Biodegradable"], inStock: true },
];

export const categoryIcons: Record<string, string> = {
  cat: "cat",
  dog: "dog",
  bird: "bird",
  fish: "fish",
  rabbit: "rabbit",
};

export const vetServices: VetService[] = [
  { id: "v1", title: "General Checkup", description: "Comprehensive health examination for your pet", price: 49, duration: "30 min", icon: "stethoscope" },
  { id: "v2", title: "Vaccination", description: "Essential vaccinations for disease prevention", price: 35, duration: "20 min", icon: "syringe" },
  { id: "v3", title: "Dental Care", description: "Professional teeth cleaning and oral health", price: 89, duration: "45 min", icon: "tooth" },
  { id: "v4", title: "Surgery", description: "Safe and advanced surgical procedures", price: 299, duration: "1-2 hrs", icon: "scalpel" },
  { id: "v5", title: "Microchipping", description: "Permanent pet identification", price: 25, duration: "10 min", icon: "smartphone" },
  { id: "v6", title: "Lab Tests", description: "Blood work and diagnostic testing", price: 59, duration: "15 min", icon: "flask" },
  { id: "v7", title: "Grooming", description: "Full grooming service with bath & trim", price: 45, duration: "1 hr", icon: "scissors" },
  { id: "v8", title: "Nutrition Plan", description: "Personalized diet and nutrition counseling", price: 39, duration: "30 min", icon: "apple" },
];

export const groomingPackages = [
  { id: "g1", title: "Basic Grooming", description: "Bath, brush, nail trim & ear cleaning", price: 35, duration: "45 min", includes: ["Bath with premium shampoo", "Brushing & detangling", "Nail trimming", "Ear cleaning"] },
  { id: "g2", title: "Full Grooming", description: "Basic plus haircut & styling", price: 65, duration: "1.5 hrs", includes: ["Everything in Basic", "Full haircut & styling", "Fragrance spray", "Bandana or bow"] },
  { id: "g3", title: "Spa Package", description: "Full grooming with luxury spa treatments", price: 95, duration: "2 hrs", includes: ["Everything in Full", "Deep conditioning", "Paw balm treatment", "Teeth brushing", "Cologne spritz"] },
];

export const team: TeamMember[] = [
  { id: "t1", name: "Dr. Sarah Johnson", role: "Lead Veterinarian", bio: "15+ years of experience in small animal medicine", initials: "SJ" },
  { id: "t2", name: "Dr. Mark Wilson", role: "Veterinary Surgeon", bio: "Specialist in orthopedic and soft tissue surgery", initials: "MW" },
  { id: "t3", name: "Emma Davis", role: "Pet Nutritionist", bio: "Certified animal nutrition specialist", initials: "ED" },
];

export const testimonials: Testimonial[] = [
  { id: "rev1", name: "Sarah M.", text: "The best pet shop in town! My cat loves the organic food and the vet team is incredibly professional.", rating: 5, initials: "SM" },
  { id: "rev2", name: "Ahmed K.", text: "Excellent service and high quality products. The bird cage I bought is perfect for my parakeet.", rating: 5, initials: "AK" },
  { id: "rev3", name: "Lisa R.", text: "I trust Paws & Wings with all my pets' needs. The grooming service is outstanding!", rating: 5, initials: "LR" },
  { id: "rev4", name: "Carlos D.", text: "Affordable prices and premium quality. The staff genuinely cares about animals. Highly recommended!", rating: 5, initials: "CD" },
];

export const siteStats = [
  { label: "Happy Pets", value: "10,000+" },
  { label: "Products", value: "500+" },
  { label: "Years Experience", value: "12+" },
  { label: "Veterinarians", value: "8+" },
];


