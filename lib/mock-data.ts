// ============================================
// MOCK DATA — Replace with real API calls in Week 5
// ============================================

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  brand: string;
  badge?: 'sale' | 'new' | 'best-seller' | 'hot';
  inStock: boolean;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
}

// ─────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────
export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: '3-Gang USB Socket',
    slug: '3-gang-usb-socket',
    price: 16400,
    originalPrice: 20000,
    rating: 4.5,
    reviewCount: 128,
    image: '/images/products/3-gang-usb-socket.jpg',
    category: 'switches-sockets',
    brand: 'schneider',
    badge: 'sale',
    inStock: true,
    description:
      'Premium 3-gang USB socket with fast charging support. Perfect for home and office use.',
  },
  {
    id: 'prod-002',
    name: 'Schneider Avatar On 2-Gang 13A Socket',
    slug: 'schneider-avatar-2-gang-socket',
    price: 28500,
    rating: 4.9,
    reviewCount: 89,
    image: '/images/products/schneider-avatar-socket.jpg',
    category: 'switches-sockets',
    brand: 'schneider',
    badge: 'best-seller',
    inStock: true,
    description:
      'High-quality 2-gang 13A socket from Schneider Avatar series. Durable and reliable.',
  },
  {
    id: 'prod-003',
    name: '200W Mono Solar Panel',
    slug: '200w-mono-solar-panel',
    price: 85000,
    originalPrice: 95000,
    rating: 4.7,
    reviewCount: 203,
    image: '/images/products/200w-solar-panel.jpg',
    category: 'solar-panels',
    brand: 'jinko',
    badge: 'hot',
    inStock: true,
    description:
      'High efficiency 200W monocrystalline solar panel. Ideal for residential solar systems.',
  },
  {
    id: 'prod-004',
    name: '12V 100Ah Lithium Battery',
    slug: '12v-100ah-lithium-battery',
    price: 145000,
    rating: 4.8,
    reviewCount: 156,
    image: '/images/products/lithium-battery-100ah.jpg',
    category: 'lithium-batteries',
    brand: 'luminous',
    badge: 'new',
    inStock: true,
    description:
      'Long-lasting 12V 100Ah lithium iron phosphate battery with built-in BMS protection.',
  },
  {
    id: 'prod-005',
    name: '1.5mm² 100m Copper Cable',
    slug: '1-5mm-copper-cable-100m',
    price: 32000,
    originalPrice: 38000,
    rating: 4.3,
    reviewCount: 74,
    image: '/images/products/copper-cable.jpg',
    category: 'electric-cables',
    brand: 'coleman',
    badge: 'sale',
    inStock: true,
    description: 'Premium 1.5mm² copper electrical cable. 100m roll. Perfect for domestic wiring.',
  },
  {
    id: 'prod-006',
    name: '3.5kVA Pure Sine Wave Inverter',
    slug: '3-5kva-pure-sine-inverter',
    price: 210000,
    rating: 4.6,
    reviewCount: 91,
    image: '/images/products/pure-sine-inverter.jpg',
    category: 'inverters',
    brand: 'luminous',
    inStock: true,
    description: '3.5kVA pure sine wave inverter. Low battery alarm, overload protection included.',
  },
  {
    id: 'prod-007',
    name: 'LED Bulb 12W Warm White',
    slug: 'led-bulb-12w-warm-white',
    price: 2500,
    originalPrice: 3200,
    rating: 4.2,
    reviewCount: 312,
    image: '/images/products/led-bulb-12w.jpg',
    category: 'led-lighting',
    brand: 'philips',
    badge: 'sale',
    inStock: true,
    description:
      'Energy-saving 12W LED bulb with warm white light. E27 base. Lasts up to 25,000 hours.',
  },
  {
    id: 'prod-008',
    name: '40A MPPT Solar Charge Controller',
    slug: '40a-mppt-charge-controller',
    price: 48000,
    rating: 4.5,
    reviewCount: 67,
    image: '/images/products/mppt-charge-controller.jpg',
    category: 'charge-controllers',
    brand: 'epever',
    badge: 'new',
    inStock: true,
    description: '40A MPPT solar charge controller. Compatible with 12V/24V battery systems.',
  },
  {
    id: 'prod-009',
    name: '2-Way Switch Pack (10 pcs)',
    slug: '2-way-switch-pack-10',
    price: 12325,
    rating: 4.4,
    reviewCount: 45,
    image: '/images/products/2-way-switch.jpg',
    category: 'switches-sockets',
    brand: 'legrand',
    inStock: true,
    description: 'Pack of 10 premium 2-way switches. Easy installation, durable finish.',
  },
  {
    id: 'prod-010',
    name: 'Outdoor Floodlight 50W LED',
    slug: 'outdoor-floodlight-50w',
    price: 18500,
    originalPrice: 22000,
    rating: 4.6,
    reviewCount: 88,
    image: '/images/products/outdoor-floodlight.jpg',
    category: 'led-lighting',
    brand: 'philips',
    badge: 'sale',
    inStock: true,
    description: '50W outdoor LED floodlight. IP66 waterproof. Ideal for security lighting.',
  },
];

// ─────────────────────────────────────────
// FEATURED PRODUCTS (homepage)
// ─────────────────────────────────────────
export const mockFeaturedProducts: Product[] = mockProducts.slice(0, 5);

// ─────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────
export const mockCategories: Category[] = [
  {
    id: 'cat-001',
    name: 'Solar Panels',
    slug: 'solar-panels',
    image: '/images/categories/solar-panels.jpg',
    productCount: 24,
  },
  {
    id: 'cat-002',
    name: 'Lithium Batteries',
    slug: 'lithium-batteries',
    image: '/images/categories/lithium-batteries.jpg',
    productCount: 18,
  },
  {
    id: 'cat-003',
    name: 'Switches & Sockets',
    slug: 'switches-sockets',
    image: '/images/categories/switches-sockets.jpg',
    productCount: 56,
  },
  {
    id: 'cat-004',
    name: 'LED Lighting',
    slug: 'led-lighting',
    image: '/images/categories/led-lighting.jpg',
    productCount: 43,
  },
  {
    id: 'cat-005',
    name: 'Electric Cables',
    slug: 'electric-cables',
    image: '/images/categories/electric-cables.jpg',
    productCount: 31,
  },
  {
    id: 'cat-006',
    name: 'Inverters',
    slug: 'inverters',
    image: '/images/categories/inverters.jpg',
    productCount: 15,
  },
  {
    id: 'cat-007',
    name: 'Charge Controllers',
    slug: 'charge-controllers',
    image: '/images/categories/charge-controllers.jpg',
    productCount: 12,
  },
  {
    id: 'cat-008',
    name: 'Appliances',
    slug: 'appliances',
    image: '/images/categories/appliances.jpg',
    productCount: 38,
  },
];

// ─────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────
export const mockBrands: Brand[] = [
  { id: 'brand-001', name: 'Sony', logo: '/images/brands/sony.png', slug: 'sony' },
  { id: 'brand-002', name: 'LG', logo: '/images/brands/lg.png', slug: 'lg' },
  { id: 'brand-003', name: 'Canon', logo: '/images/brands/canon.png', slug: 'canon' },
  { id: 'brand-004', name: 'Samsung', logo: '/images/brands/samsung.png', slug: 'samsung' },
  { id: 'brand-005', name: 'Philips', logo: '/images/brands/philips.png', slug: 'philips' },
  { id: 'brand-006', name: 'Schneider', logo: '/images/brands/schneider.png', slug: 'schneider' },
  { id: 'brand-007', name: 'Luminous', logo: '/images/brands/luminous.png', slug: 'luminous' },
  { id: 'brand-008', name: 'Legrand', logo: '/images/brands/legrand.png', slug: 'legrand' },
];

// ─────────────────────────────────────────
// BLOG POSTS
// ─────────────────────────────────────────
export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog-001',
    title: 'How to Choose the Right Bulb for Every Room',
    slug: 'how-to-choose-right-bulb',
    excerpt:
      "The right lighting can transform any space. Here's how to choose the right bulb temperature for each room in your home.",
    image: '/images/blog/choose-right-bulb.jpg',
    date: '2024-05-15',
    readTime: '4 min read',
    category: 'Lighting Tips',
  },
  {
    id: 'blog-002',
    title: 'Solar Panel Installation: What You Need to Know',
    slug: 'solar-panel-installation-guide',
    excerpt:
      "Thinking about going solar? Here's everything you need to know before installing solar panels in your home or business.",
    image: '/images/blog/solar-installation.jpg',
    date: '2024-05-10',
    readTime: '6 min read',
    category: 'Solar Energy',
  },
  {
    id: 'blog-003',
    title: 'Lithium vs Lead-Acid Batteries: Which is Better?',
    slug: 'lithium-vs-lead-acid-batteries',
    excerpt:
      'Both battery types have their merits. We break down the pros and cons to help you decide which is right for your energy needs.',
    image: '/images/blog/lithium-vs-lead-acid.jpg',
    date: '2024-05-05',
    readTime: '5 min read',
    category: 'Batteries',
  },
];

// ─────────────────────────────────────────
// HERO SLIDES
// ─────────────────────────────────────────
export const mockHeroSlides = [
  {
    id: 'hero-001',
    headline: 'Power Your',
    headlineAccent: 'Home & Office',
    headlineSuffix: 'With Confidence',
    subtext:
      'Premium electrical products — lights, plugs, appliances and everything in between. Quality you can trust.',
    primaryCta: { label: 'Shop Now', href: '/products' },
    secondaryCta: { label: 'View Catalogue', href: '/catalogue' },
    image: '/images/hero/javal-logo-hero.png',
    badge: 'JL',
  },
];

// ─────────────────────────────────────────
// FEATURES BAR
// ─────────────────────────────────────────
export const mockFeatures = [
  {
    id: 'feat-001',
    icon: 'delivery',
    title: 'Free Delivery',
    subtitle: 'Within Nigeria',
  },
  {
    id: 'feat-002',
    icon: 'phone',
    title: 'Give Us a Call',
    subtitle: '+234 000000034',
  },
  {
    id: 'feat-003',
    icon: 'chat',
    title: 'Chat With Us',
    subtitle: 'Live chat Available',
  },
  {
    id: 'feat-004',
    icon: 'price',
    title: 'Best Price',
    subtitle: 'Guaranteed to best price',
  },
];

// ─────────────────────────────────────────
// HELPER: Format price in Naira
// ─────────────────────────────────────────
export const formatPrice = (price: number): string => {
  return `₦${price.toLocaleString('en-NG')}`;
};

// ─────────────────────────────────────────
// HELPER: Get products by category
// ─────────────────────────────────────────
export const getProductsByCategory = (categorySlug: string): Product[] => {
  return mockProducts.filter((p) => p.category === categorySlug);
};

// ─────────────────────────────────────────
// HELPER: Get product by slug
// ─────────────────────────────────────────
export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find((p) => p.slug === slug);
};
