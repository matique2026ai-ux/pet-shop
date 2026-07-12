export interface Product {
  id: string
  name: string
  category: "cats" | "birds" | "accessories"
  subcategory: string
  price: number
  description: string
  image: string
  features: string[]
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
  salePrice?: number
}

export interface VetService {
  id: string
  title: string
  description: string
  icon: string
  price: string
  duration: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
}

export interface Testimonial {
  id: string
  name: string
  pet: string
  text: string
  rating: number
  image: string
}

export const products: Product[] = [
  {
    id: "premium-cat-food",
    name: "Premium Cat Food Salmon",
    category: "cats",
    subcategory: "Food",
    price: 2800,
    description: "Premium quality salmon-based cat food rich in omega-3 for a shiny coat and healthy skin. Made with 70% fresh salmon, sweet potatoes, and essential vitamins.",
    image: "/images/cat-food.jpg",
    features: ["70% fresh salmon", "Grain-free recipe", "Omega-3 & 6", "No artificial colors", "Supports digestion"],
    inStock: true,
    isNew: true,
  },
  {
    id: "organic-cat-treats",
    name: "Organic Cat Treats",
    category: "cats",
    subcategory: "Treats",
    price: 1200,
    description: "Irresistible organic cat treats made with real chicken and catnip. Perfect for training or spoiling your feline friend.",
    image: "/images/cat-treats.jpg",
    features: ["100% organic", "Real chicken", "With catnip", "No preservatives", "Crunchy texture"],
    inStock: true,
  },
  {
    id: "luxury-cat-bed",
    name: "Luxury Donut Cat Bed",
    category: "cats",
    subcategory: "Bedding",
    price: 4500,
    description: "Ultra-soft donut-shaped cat bed with raised edges for head support. Machine washable cover for easy cleaning.",
    image: "/images/cat-bed.jpg",
    features: ["Donut shape", "Raised edges", "Machine washable", "Anti-slip base", "Available in 3 colors"],
    inStock: true,
    isNew: true,
  },
  {
    id: "cat-scratching-post",
    name: "Premium Scratching Post",
    category: "cats",
    subcategory: "Toys",
    price: 3500,
    description: "180cm tall scratching post with natural sisal rope, dangling toys, and a cozy perch. Keeps your furniture safe.",
    image: "/images/cat-scratcher.jpg",
    features: ["180cm height", "Natural sisal", "Dangling toys", "Cozy perch", "Sturdy base"],
    inStock: true,
  },
  {
    id: "cat-litter-box",
    name: "Self-Cleaning Litter Box",
    category: "cats",
    subcategory: "Litter",
    price: 12000,
    description: "Automatic self-cleaning litter box with carbon filter and odor control. Smart sensor detects your cat and cleans automatically.",
    image: "/images/cat-litter.jpg",
    features: ["Automatic cleaning", "Carbon filter", "Odor control", "Smart sensor", "Low noise"],
    inStock: true,
  },
  {
    id: "cat-water-fountain",
    name: "Stainless Steel Water Fountain",
    category: "cats",
    subcategory: "Accessories",
    price: 3200,
    description: "3-liter stainless steel water fountain with triple filtration. Encourages your cat to drink more water for better health.",
    image: "/images/cat-fountain.jpg",
    features: ["3L capacity", "Triple filtration", "Stainless steel", "Quiet pump", "Dishwasher safe"],
    inStock: true,
    isSale: true,
    salePrice: 2800,
  },
  {
    id: "premium-bird-seed",
    name: "Premium Bird Seed Mix",
    category: "birds",
    subcategory: "Food",
    price: 1500,
    description: "Hand-selected premium seed mix with sunflower seeds, millet, and dried fruits. Suitable for all pet birds.",
    image: "/images/bird-seed.jpg",
    features: ["Sunflower seeds", "Millet", "Dried fruits", "Vitamin enriched", "No fillers"],
    inStock: true,
    isNew: true,
  },
  {
    id: "bird-pellets",
    name: "Nutritional Bird Pellets",
    category: "birds",
    subcategory: "Food",
    price: 2200,
    description: "Complete nutritional pellets formulated by avian veterinarians. Balanced diet for all bird species.",
    image: "/images/bird-pellets.jpg",
    features: ["Complete nutrition", "Vet formulated", "All species", "No artificial colors", "Easy to digest"],
    inStock: true,
  },
  {
    id: "bird-cage-large",
    name: "Deluxe Large Bird Cage",
    category: "birds",
    subcategory: "Cages",
    price: 15000,
    description: "Spacious 80x50x100cm bird cage with powder-coated finish, multiple perches, feeding doors, and a pull-out tray.",
    image: "/images/bird-cage.jpg",
    features: ["80x50x100cm", "Powder-coated", "Multiple perches", "Pull-out tray", "Feeding doors"],
    inStock: true,
    isNew: true,
  },
  {
    id: "bird-toy-set",
    name: "Bird Toy Variety Pack",
    category: "birds",
    subcategory: "Toys",
    price: 1800,
    description: "Set of 5 interactive bird toys including bells, ropes, and wooden blocks. Keeps your bird entertained for hours.",
    image: "/images/bird-toys.jpg",
    features: ["5 toys", "Bells & ropes", "Wooden blocks", "Safe materials", "For all bird sizes"],
    inStock: true,
  },
  {
    id: "bird-perch-set",
    name: "Natural Wood Perch Set",
    category: "birds",
    subcategory: "Accessories",
    price: 900,
    description: "Set of 3 natural wood perches of varying diameters for foot health. Untreated, chemical-free wood.",
    image: "/images/bird-perch.jpg",
    features: ["3 perches", "Natural wood", "Various diameters", "Chemical-free", "Foot health"],
    inStock: true,
  },
  {
    id: "bird-bath",
    name: "Bird Bath with Mirror",
    category: "birds",
    subcategory: "Accessories",
    price: 1400,
    description: "Attachable bird bath with integrated mirror. Encourages natural bathing behavior and preening.",
    image: "/images/bird-bath.jpg",
    features: ["Easy attach", "With mirror", "Encourages bathing", "Durable plastic", "Easy clean"],
    inStock: true,
  },
  {
    id: "pet-bowl-set",
    name: "Ceramic Pet Bowl Set",
    category: "accessories",
    subcategory: "Bowls",
    price: 2500,
    description: "Set of 2 handcrafted ceramic bowls with non-slip silicone base. Elegant design for both cats and birds.",
    image: "/images/bowl-set.jpg",
    features: ["Handcrafted ceramic", "Non-slip base", "Dishwasher safe", "2 bowls", "Elegant design"],
    inStock: true,
    isNew: true,
  },
  {
    id: "pet-carrier",
    name: "Ventilated Pet Carrier",
    category: "accessories",
    subcategory: "Travel",
    price: 6500,
    description: "Comfortable ventilated pet carrier with padded interior and secure lock. Perfect for vet visits and travel.",
    image: "/images/pet-carrier.jpg",
    features: ["Ventilated", "Padded interior", "Secure lock", "Foldable", "Carry handle"],
    inStock: true,
  },
  {
    id: "grooming-kit",
    name: "Professional Grooming Kit",
    category: "accessories",
    subcategory: "Grooming",
    price: 4000,
    description: "Complete 8-piece grooming kit with brush, comb, nail clippers, and deshedding tool for cats.",
    image: "/images/grooming-kit.jpg",
    features: ["8 pieces", "Deshedding tool", "Nail clippers", "Soft brush", "Travel case"],
    inStock: true,
    isSale: true,
    salePrice: 3500,
  },
  {
    id: "pet-tag",
    name: "Personalized Pet ID Tag",
    category: "accessories",
    subcategory: "Identification",
    price: 800,
    description: "Stainless steel personalized ID tag with your pet's name and your phone number. Engraved for durability.",
    image: "/images/pet-tag.jpg",
    features: ["Stainless steel", "Personalized", "Engraved", "Durable", "Heart shape"],
    inStock: true,
  },
  {
    id: "pet-bed-mats",
    name: "Orthopedic Pet Bed Mat",
    category: "accessories",
    subcategory: "Bedding",
    price: 3800,
    description: "Memory foam orthopedic bed mat with washable cover. Provides joint support for aging pets.",
    image: "/images/pet-mat.jpg",
    features: ["Memory foam", "Orthopedic", "Washable cover", "Non-slip", "Joint support"],
    inStock: true,
    isNew: true,
  },
  {
    id: "food-storage",
    name: "Airtight Pet Food Storage",
    category: "accessories",
    subcategory: "Storage",
    price: 3000,
    description: "10-liter airtight container with airtight seal and pouring spout. Keeps pet food fresh and pest-free.",
    image: "/images/food-storage.jpg",
    features: ["10L capacity", "Airtight seal", "Pouring spout", "BPA free", "Transparent body"],
    inStock: true,
  },
]

export const vetServices: VetService[] = [
  {
    id: "consultation",
    title: "General Consultation",
    description: "Complete health check-up including physical examination, weight monitoring, and dietary advice for your pet.",
    icon: "stethoscope",
    price: "1500 DZD",
    duration: "30 min",
  },
  {
    id: "vaccination",
    title: "Vaccination Program",
    description: "Comprehensive vaccination schedule for cats and birds following international standards for disease prevention.",
    icon: "syringe",
    price: "2500 DZD",
    duration: "20 min",
  },
  {
    id: "surgery",
    title: "Surgical Services",
    description: "State-of-the-art surgical suite for spaying, neutering, and other minor surgeries with full anesthesia monitoring.",
    icon: "scalpel",
    price: "From 8000 DZD",
    duration: "1-2 hours",
  },
  {
    id: "grooming",
    title: "Pet Grooming",
    description: "Professional grooming service including bathing, brushing, nail trimming, and feather care for birds.",
    icon: "scissors",
    price: "2000 DZD",
    duration: "45 min",
  },
  {
    id: "dental",
    title: "Dental Care",
    description: "Professional teeth cleaning, tartar removal, and oral health assessment to keep your pet's smile bright.",
    icon: "tooth",
    price: "3500 DZD",
    duration: "30 min",
  },
  {
    id: "laboratory",
    title: "Laboratory Analysis",
    description: "In-house lab testing including blood work, fecal analysis, and parasite screening for accurate diagnosis.",
    icon: "microscope",
    price: "From 3000 DZD",
    duration: "Varies",
  },
  {
    id: "emergency",
    title: "Emergency Care",
    description: "24/7 emergency veterinary services for urgent medical situations. Call ahead for immediate assistance.",
    icon: "ambulance",
    price: "From 5000 DZD",
    duration: "As needed",
  },
  {
    id: "nutrition",
    title: "Nutritional Counseling",
    description: "Personalized diet plans for your pets based on their breed, age, weight, and specific health requirements.",
    icon: "apple",
    price: "2000 DZD",
    duration: "30 min",
  },
]

export const team: TeamMember[] = [
  {
    id: "dr-amina",
    name: "Dr. Amina Benali",
    role: "Chief Veterinarian",
    image: "/images/team-1.jpg",
    bio: "With over 12 years of experience in small animal and avian medicine, Dr. Amina leads our clinic with passion and expertise.",
  },
  {
    id: "dr-youssef",
    name: "Dr. Youssef Meziane",
    role: "Veterinary Surgeon",
    image: "/images/team-2.jpg",
    bio: "Specialized in veterinary surgery with advanced training in minimally invasive procedures for companion animals.",
  },
  {
    id: "nadia",
    name: "Nadia Khelifa",
    role: "Veterinary Nurse",
    image: "/images/team-3.jpg",
    bio: "Certified veterinary nurse with a gentle touch and a special love for caring for birds and exotic pets.",
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Mansouri",
    pet: "Milo (Cat)",
    text: "The best pet store in town! My cat Milo loves their premium food, and the vet clinic is exceptional. Dr. Amina saved Milo's life last year.",
    rating: 5,
    image: "/images/testimonial-1.jpg",
  },
  {
    id: "2",
    name: "Karim Bensalem",
    pet: "Coco (Parrot)",
    text: "I've been coming here for 3 years for my parrot Coco. The bird section is incredible - from cages to toys, everything is top quality.",
    rating: 5,
    image: "/images/testimonial-2.jpg",
  },
  {
    id: "3",
    name: "Lyla Oukaci",
    pet: "Simba & Luna (Cats)",
    text: "The grooming service is wonderful! My two cats come out looking and feeling amazing. The staff truly cares about animals.",
    rating: 5,
    image: "/images/testimonial-3.jpg",
  },
  {
    id: "4",
    name: "Amine Touati",
    pet: "Kiwi (Budgie)",
    text: "Found the perfect cage for my budgie Kiwi at an affordable price. The team helped me set it up too. Highly recommended!",
    rating: 4,
    image: "/images/testimonial-4.jpg",
  },
]

export const categories = [
  { id: "cats", name: "Cats", description: "Premium food, toys, beds & accessories for your feline friend", icon: "cat", count: 6 },
  { id: "birds", name: "Birds", description: "Seed mixes, cages, toys & perches for happy birds", icon: "bird", count: 6 },
  { id: "accessories", name: "Accessories", description: "Bowls, carriers, grooming tools & more", icon: "package", count: 6 },
]
