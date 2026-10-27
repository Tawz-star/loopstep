// LoopStep Product & Engineering Data
// Primary reference: Hackathon Abstract & Presentation

export const SOLE_EDITIONS = [
  {
    id: 'standard',
    name: 'Standard Edition',
    subtitle: 'Everyday Comfort & City Pavement',
    price: 200,
    mfgCost: 70,
    profit: 130,
    thickness: '8 mm',
    durometer: '50-55 Shore A',
    weight: '145g',
    intendedUse: 'Daily city walking, casual wear, office commutes',
    treadPattern: 'Wave Flex Grooves',
    cushioning: 'Compression-molded EVA Foam with natural rubber contact pads',
    materials: ['Recycled EVA Foam Core', 'Natural Rubber Tread Outsole', 'PA66-GF30 Twist-Lock Ring'],
    image: '/images/sole-standard.jpg',
    colors: ['#2C312E', '#F7F5F2', '#C6F135', '#3A3A3A'],
    defaultColor: '#2C312E',
    features: [
      'Ultra-light 8mm profile for relaxed natural foot motion',
      'Wave flex channel grooves for smooth heel-to-toe roll',
      'Dual bayonet retention lugs for zero slippage',
      'Ships in 100% recycled cardboard packaging'
    ],
    rating: 4.8,
    reviewsCount: 142
  },
  {
    id: 'sports',
    name: 'Sports Edition',
    subtitle: 'Active Performance & Kinetic Rebound',
    price: 500,
    mfgCost: 170,
    profit: 330,
    thickness: '12 mm',
    durometer: '60 Shore A',
    weight: '190g',
    intendedUse: 'Running, training, gym workouts, lateral athletic motion',
    treadPattern: 'Dynamic Hex & Chevron Lug System',
    cushioning: 'High-density EVA + responsive TPU kinetic rebound insert',
    materials: ['High-Density EVA', 'TPU Rebound Cushion Layer', 'Carbon Rubber Traction Pods', 'PA66-GF30 Ring'],
    image: '/images/sole-sports.jpg',
    colors: ['#1A1A1A', '#C6F135', '#00F0FF', '#E7A93B'],
    defaultColor: '#1A1A1A',
    features: [
      '12mm dual-density stack with embedded shock absorption pocket',
      'Carbon-infused rubber tread pods for high-abrasion durability',
      'High torsional rigidity preventing midsole twisting during sprint cuts',
      'Rated for 600+ km of athletic activity before sole swap'
    ],
    rating: 4.9,
    reviewsCount: 98
  },
  {
    id: 'trail',
    name: 'Trail Edition',
    subtitle: 'Rough Terrain & Rock Protection',
    price: 700,
    mfgCost: 250,
    profit: 450,
    thickness: '15 mm',
    durometer: '68 Shore A',
    weight: '240g',
    intendedUse: 'Hiking, gravel trails, rocky outdoor terrain, wet muddy slopes',
    treadPattern: 'Deep 5mm Geometric Lugs with Self-Cleaning Channels',
    cushioning: 'Reinforced TPU chassis with embedded rock plate shield',
    materials: ['High-Grip Vulcanized Rubber', 'Reinforced TPU Rock Plate', 'Mud-Shedding Channels', 'PA66-GF30 Ring'],
    image: '/images/sole-trail.jpg',
    colors: ['#4A6141', '#2C312E', '#E7A93B', '#B4553B'],
    defaultColor: '#4A6141',
    features: [
      'Deep 5mm multi-angle perimeter lugs with biting edges',
      'Integrated ballistic rock plate shielding against sharp stones',
      'High-traction wet-grip compound engineered for slick mud & shale',
      'Reinforced locking teeth with sealed mud-exclusion gasket'
    ],
    rating: 4.95,
    reviewsCount: 76
  }
];

export const COMPLETE_SHOES = [
  {
    id: 'shoe-terra',
    name: 'LoopStep Terra',
    tagline: 'The Everyday Keeper',
    price: 2499,
    originalPrice: 3000,
    category: 'Lifestyle & Urban',
    description: 'Engineered for seamless urban living. Crafted with a 100% recycled ocean-plastic knit upper that conforms to your foot like a second skin, married to a natural rubber cage and our proprietary moulded twist-lock ring.',
    image: '/images/shoe-terra.jpg',
    includedSole: 'Standard Edition (8 mm fitted)',
    upperMaterial: 'Recycled Ocean-Plastic Knit + Natural Rubber Cage',
    soleStandard: 'Standard Twist-Lock Ring (PA66-GF30)',
    lifespan: 'Upper rated for 3+ years of continuous wear',
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    colors: ['Ocean Sand & Charcoal', 'Graphite Black', 'Chalk White'],
    specs: {
      weight: '280g (Size 42 with Standard Sole)',
      closure: 'Recycled Polyester Lacing with quick-lock eyelets',
      drop: '6 mm',
      breathability: 'High airflow zoned knit'
    }
  },
  {
    id: 'shoe-drift',
    name: 'LoopStep Drift',
    tagline: 'Built to Run, Made to Last',
    price: 2899,
    originalPrice: 3499,
    category: 'Performance Running',
    description: 'Lightweight performance runner designed for daily road training and gym sessions. High-tensile recycled mesh with lateral TPU frame holding your heel locked in place through every sprint.',
    image: '/images/shoe-drift.jpg',
    includedSole: 'Sports Edition (12 mm fitted)',
    upperMaterial: 'Engineered Performance Weave + Lateral TPU Counter',
    soleStandard: 'Standard Twist-Lock Ring (PA66-GF30)',
    lifespan: 'Upper rated for 3,000+ running km',
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    colors: ['Deep Graphite / Signal Lime', 'Midnight Carbon', 'Solar Ember'],
    specs: {
      weight: '310g (Size 42 with Sports Sole)',
      closure: 'Dynamic lacing cage with padded tongue gusset',
      drop: '8 mm',
      breathability: 'Active moisture-wicking weave'
    }
  },
  {
    id: 'shoe-ridge',
    name: 'LoopStep Ridge',
    tagline: 'Trail-Ready, Sole-Swappable',
    price: 2999,
    originalPrice: 3699,
    category: 'Outdoor & Hiking',
    description: 'Heavy-duty trail shoe with an abrasion-resistant ripstop upper, mudguard rubber wrap, and water-shedding gusset. Ready for jagged gravel, wet roots, and rugged backcountry paths.',
    image: '/images/shoe-ridge.jpg',
    includedSole: 'Trail Edition (15 mm fitted)',
    upperMaterial: 'Recycled Ripstop Textile + TPU Abrasion Overlays',
    soleStandard: 'Standard Twist-Lock Ring (PA66-GF30)',
    lifespan: 'Upper rated for 4+ years of outdoor expeditions',
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    colors: ['Deep Moss / Bark Brown', 'Blackout Stealth', 'Alpine Rust'],
    specs: {
      weight: '360g (Size 42 with Trail Sole)',
      closure: 'Heavy-duty Kevlar-reinforced eyelet lace harness',
      drop: '10 mm',
      breathability: 'Durable water-repellent (DWR) ripstop'
    }
  }
];

export const REFIT_ADAPTER = {
  id: 'refit-adapter-kit',
  name: 'LoopStep ReFit™ Universal Adapter Kit',
  subtitle: 'Convert ANY brand shoe into a twist-lock modular shoe',
  price: 50,
  mfgCost: 35,
  profit: 15,
  description: 'The right to repair applies to all footwear. Our ReFit kit contains a calibrated 2mm PA66-GF30 twist-lock adapter plate, specialized industrial polyurethane bonding adhesive, sandpaper preparation pad, and a foolproof alignment stencil. Turn your favorite worn Nike, Adidas, Puma, or Converse into a LoopStep sole receiver in 15 minutes.',
  image: '/images/refit-adapter.jpg',
  contents: [
    '2x PA66-GF30 Reinforced Twist-Lock Adapter Plates (Left & Right)',
    '1x Industrial Polyurethane Contact Adhesive Tube (50ml)',
    '2x Abrasive surface prep pads',
    '1x Universal alignment and sizing template',
    '1x Step-by-step illustrated manual & QR video guide'
  ],
  specs: {
    material: 'PA66 Glass Fiber Reinforced (30%)',
    thickness: '2.2 mm ultra-low profile',
    bondStrength: 'Exceeds 4.5 MPa shear resistance',
    curingTime: 'Initial hold in 10 mins, full cure in 12 hours'
  }
};

export const ENGINEERING_SPECS = {
  material: 'Polyamide 66 with 30% Glass Fiber Reinforcement (PA66-GF30)',
  tensileStrength: '170 – 200 MPa',
  compressiveStrength: '180 – 250 MPa',
  flexuralStrength: '220 – 280 MPa',
  serviceTemperature: '-40°C to 120°C',
  safeLoadCapacity: '~7,000 N (Tested vertical and shear resistance)',
  ultimateDesignCapacity: '8,000 – 10,000 N (Engineering target for extreme shock loads)',
  twistAngle: '45-degree rotation engagement with tactile sprung detent',
  swapTime: 'Under 10 seconds without tools or heating',
  cycleLife: '10,000+ lock/unlock mechanical cycles without tooth degradation',
  density: '1.35 g/cm³',
  upperMaterials: [
    { name: 'Recycled Ocean-Plastic Mesh', purpose: 'Breathable, durable upper reducing virgin petroleum polymers' },
    { name: 'Natural Rubber', purpose: 'Sustainable side cage overlays providing lateral support' },
    { name: 'Compression-Molded EVA', purpose: 'Lightweight responsive midsole cushioning' },
    { name: 'PU Memory Foam', purpose: 'Contoured anatomical insole arch support' },
    { name: 'Recycled Polyester', purpose: 'Reinforced heel collars and tongue lining' },
    { name: 'Nylon Thread & PU Adhesive', purpose: 'Industrial non-delaminating structural seams' },
    { name: 'Recycled Cardboard Packaging', purpose: '100% biodegradable zero-plastic delivery box' }
  ]
};

export const BUSINESS_MODEL = {
  completeShoe: {
    sellingPrice: 3000,
    mfgCost: 1740,
    operatingExpenses: 500,
    totalCost: 2240,
    profit: 760,
    netMarginPercent: 25.3
  },
  replacementProducts: [
    { name: 'Standard Sole', mfgCost: 70, sellingPrice: 200, profit: 130, margin: '65%' },
    { name: 'Sports Sole', mfgCost: 170, sellingPrice: 500, profit: 330, margin: '66%' },
    { name: 'Trail Sole', mfgCost: 250, sellingPrice: 700, profit: 450, margin: '64%' },
    { name: 'Universal ReFit Adapter', mfgCost: 35, sellingPrice: 50, profit: 15, margin: '30%' }
  ],
  revenueScenarios: [
    { unitsSold: 1000, soleSwaps: 2500, grossRevenue: 3950000, profit: 1215000, solesDonated: 1000 },
    { unitsSold: 5000, soleSwaps: 16000, grossRevenue: 21400000, profit: 6720000, solesDonated: 5000 },
    { unitsSold: 25000, soleSwaps: 95000, grossRevenue: 118500000, profit: 37950000, solesDonated: 25000 }
  ]
};

export const SUSTAINABILITY_METRICS = {
  sdgFocus: [
    {
      code: 'SDG 12',
      title: 'Responsible Consumption & Production',
      desc: 'Decoupling upper wear from sole wear extends footwear lifespan by 3x–5x and cuts shoe landfill waste by up to 70%.'
    },
    {
      code: 'SDG 13',
      title: 'Climate Action',
      desc: 'Manufacturing a replacement sole produces 82% less carbon emissions compared to manufacturing an entire new pair of sneakers.'
    },
    {
      code: 'SDG 8',
      title: 'Decent Work & Economic Growth',
      desc: 'Our 1:1 Social Impact Model donates one spare sole for every complete pair sold to local shoe-repair micro-enterprises in underserved communities.'
    }
  ],
  assumptions: {
    co2PerWholeShoeKg: 14.5,
    co2PerSoleOnlyKg: 2.6,
    landfillWastePerShoeKg: 0.85,
    landfillWastePerSoleKg: 0.22,
    avgWaterSavedPerSoleLitres: 1200
  }
};

export const FAQ_LIST = [
  {
    q: "What makes LoopStep different from conventional shoes?",
    a: "In conventional footwear, 90% of discarded shoes still have a perfectly serviceable upper, but are thrown away because only the rubber outsole wore out. LoopStep introduces a reinforced mechanical twist-lock ring that lets you detach a worn sole in 10 seconds and click in a new one starting at just ₹200. You keep the shoe you already broke in."
  },
  {
    q: "How does the mechanical twist-lock system work?",
    a: "The shoe midsole houses a high-strength PA66-GF30 polymer ring with precision radial bayonet teeth. The outsole has matching interlocking lugs. Align the index markers, rotate 45 degrees, and an audible mechanical detent clicks to lock it solidly into place. No batteries, motors, or magnets — pure mechanical engineering."
  },
  {
    q: "Can I replace the sole myself without any tools?",
    a: "Yes! The twist-lock system requires zero tools, heat, or adhesives for LoopStep native shoes. You simply twist counter-clockwise by hand, pull off the old sole, align the replacement, and twist clockwise until the click confirms positive engagement."
  },
  {
    q: "Which sole is best for my everyday lifestyle?",
    a: "The Standard Edition (₹200) is 8mm thick with smooth wave flex grooves, ideal for city walking, commuting, and casual wear. If you run or do gym training, the Sports Edition (₹500) offers 12mm thickness with a kinetic TPU rebound layer. For hiking and off-road trails, the Trail Edition (₹700) provides 15mm thickness with deep 5mm lugs and a ballistic rock plate."
  },
  {
    q: "Can I convert my existing Nike, Adidas, or Converse sneakers with ReFit?",
    a: "Yes. Our universal ReFit Adapter Kit (₹50) includes a low-profile twist-lock adapter plate and industrial polyurethane adhesive. Follow our 4-step home guide to bond the plate to the flat base of your existing shoe, and it can take LoopStep modular soles forever."
  },
  {
    q: "How strong is the twist-lock connection? Will it detach while running?",
    a: "The locking mechanism has been tested up to 7,000 N of vertical and shear force (exceeding 700 kg of load, far greater than human athletic impact). A dual retention detent prevents unintended rotation under forward or lateral athletic cuts."
  },
  {
    q: "How does the 3D scanning and smart fitment work?",
    a: "You can either use your phone/laptop webcam or upload a photo with your foot placed on standard A4 paper. The app calculates your exact foot length, breadth, and arch profile, tailoring sole geometry and durometer before you place an order."
  },
  {
    q: "What is the One-for-One sole donation program?",
    a: "For every complete pair of LoopStep shoes sold, we fund and donate one spare replacement sole directly to cobblers and shoe-repair micro-enterprises in underserved communities. This creates circular employment and supports local repair livelihoods."
  },
  {
    q: "What is the Sole Exchange program?",
    a: "When your LoopStep sole finally wears down, send it back in the prepaid return sleeve to receive 10% off your next replacement sole. We shred the retired soles and blend the vulcanized rubber into new tread compounds."
  },
  {
    q: "Are the engineering specs and figures verified certifications?",
    a: "The 170–200 MPa tensile strength and 7,000 N load resistance are design specifications and bench-tested prototype data from the project engineering abstract. Formal ISO/ASTM certification testing is ongoing as we prepare for scaled production."
  }
];

export const BRAND_COMPATIBILITY_LIST = [
  { brand: 'Nike', models: ['Air Force 1', 'Pegasus 39/40', 'Court Vision', 'Revolution 6'], status: 'Verified Match', adapterNeeded: 'Standard ReFit 40-44' },
  { brand: 'Adidas', models: ['Stan Smith', 'Ultraboost 1.0-5.0', 'Superstar', 'Duramo'], status: 'Verified Match', adapterNeeded: 'Standard ReFit 39-45' },
  { brand: 'Puma', models: ['Suede Classic', 'Smash v2', 'Velocity Nitro'], status: 'Verified Match', adapterNeeded: 'Standard ReFit 38-44' },
  { brand: 'Converse', models: ['Chuck Taylor All Star', 'Chuck 70'], status: 'Verified Match', adapterNeeded: 'Flat Base ReFit 38-46' },
  { brand: 'Vans', models: ['Old Skool', 'Authentic', 'Era'], status: 'Verified Match', adapterNeeded: 'Flat Base ReFit 38-45' },
  { brand: 'Asics', models: ['Gel-Kayano', 'Gel-Nimbus', 'GT-2000'], status: 'Potential Match', adapterNeeded: 'Requires Arch Inspection' },
  { brand: 'New Balance', models: ['574', '327', '990v5'], status: 'Verified Match', adapterNeeded: 'Standard ReFit 39-45' }
];
