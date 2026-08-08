import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CITIES = [
  { name: 'Prishtinë', nameAlbanian: 'Prishtinë', slug: 'prishtine', lat: 42.6629, lng: 21.1655 },
  { name: 'Prizren', nameAlbanian: 'Prizren', slug: 'prizren', lat: 42.2139, lng: 20.7397 },
  { name: 'Pejë', nameAlbanian: 'Pejë', slug: 'peje', lat: 42.6593, lng: 20.2885 },
  { name: 'Gjilan', nameAlbanian: 'Gjilan', slug: 'gjilan', lat: 42.4642, lng: 21.4694 },
  { name: 'Ferizaj', nameAlbanian: 'Ferizaj', slug: 'ferizaj', lat: 42.3703, lng: 21.1553 },
  { name: 'Mitrovicë', nameAlbanian: 'Mitrovicë', slug: 'mitrovice', lat: 42.8914, lng: 20.8660 },
  { name: 'Gjakovë', nameAlbanian: 'Gjakovë', slug: 'gjakove', lat: 42.3803, lng: 20.4283 },
  { name: 'Podujevë', nameAlbanian: 'Podujevë', slug: 'podujeve', lat: 42.9115, lng: 21.1898 },
  { name: 'Vushtrri', nameAlbanian: 'Vushtrri', slug: 'vushtrri', lat: 42.8232, lng: 20.9689 },
  { name: 'Lipjan', nameAlbanian: 'Lipjan', slug: 'lipjan', lat: 42.5228, lng: 21.1228 },
  { name: 'Suharekë', nameAlbanian: 'Suharekë', slug: 'suhareke', lat: 42.3597, lng: 20.8289 },
  { name: 'Rahovec', nameAlbanian: 'Rahovec', slug: 'rahovec', lat: 42.3997, lng: 20.6553 },
  { name: 'Drenas', nameAlbanian: 'Drenas', slug: 'drenas', lat: 42.6262, lng: 20.8942 },
  { name: 'Malishevë', nameAlbanian: 'Malishevë', slug: 'malisheve', lat: 42.4836, lng: 20.7461 },
  { name: 'Istog', nameAlbanian: 'Istog', slug: 'istog', lat: 42.7828, lng: 20.4867 },
  { name: 'Deçan', nameAlbanian: 'Deçan', slug: 'decan', lat: 42.5383, lng: 20.2892 },
  { name: 'Dragash', nameAlbanian: 'Dragash', slug: 'dragash', lat: 42.0608, lng: 20.6533 },
  { name: 'Kamenicë', nameAlbanian: 'Kamenicë', slug: 'kamenice', lat: 42.5808, lng: 21.5806 },
  { name: 'Viti', nameAlbanian: 'Viti', slug: 'viti', lat: 42.3214, lng: 21.3578 },
  { name: 'Kaçanik', nameAlbanian: 'Kaçanik', slug: 'kacanik', lat: 42.2319, lng: 21.2586 },
  { name: 'Obiliq', nameAlbanian: 'Obiliq', slug: 'obiliq', lat: 42.6886, lng: 21.0697 },
  { name: 'Fushë Kosovë', nameAlbanian: 'Fushë Kosovë', slug: 'fushe-kosove', lat: 42.6358, lng: 21.0986 },
  { name: 'Shtime', nameAlbanian: 'Shtime', slug: 'shtime', lat: 42.4336, lng: 21.0378 },
  { name: 'Skenderaj', nameAlbanian: 'Skenderaj', slug: 'skenderaj', lat: 42.7483, lng: 20.7892 },
  { name: 'Leposaviq', nameAlbanian: 'Leposaviq', slug: 'leposaviq', lat: 43.1028, lng: 20.8025 },
  { name: 'Zubin Potok', nameAlbanian: 'Zubin Potok', slug: 'zubin-potok', lat: 42.9153, lng: 20.6867 },
  { name: 'Zveçan', nameAlbanian: 'Zveçan', slug: 'zvecan', lat: 42.9069, lng: 20.8350 },
  { name: 'Novobërdë', nameAlbanian: 'Novobërdë', slug: 'novoberde', lat: 42.5989, lng: 21.4383 },
  { name: 'Ranilug', nameAlbanian: 'Ranilug', slug: 'ranilug', lat: 42.5689, lng: 21.6317 },
  { name: 'Partesh', nameAlbanian: 'Partesh', slug: 'partesh', lat: 42.4119, lng: 21.6025 },
  { name: 'Kllokot', nameAlbanian: 'Kllokot', slug: 'kllokot', lat: 42.3758, lng: 21.3903 },
  { name: 'Graçanicë', nameAlbanian: 'Graçanicë', slug: 'gracanice', lat: 42.5989, lng: 21.1942 },
  { name: 'Hani i Elezit', nameAlbanian: 'Hani i Elezit', slug: 'hani-i-elezit', lat: 42.1519, lng: 21.2997 },
  { name: 'Mamushë', nameAlbanian: 'Mamushë', slug: 'mamoshe', lat: 42.3236, lng: 20.7142 },
  { name: 'Junik', nameAlbanian: 'Junik', slug: 'junik', lat: 42.4797, lng: 20.2783 },
  { name: 'Gllogovc', nameAlbanian: 'Gllogovc', slug: 'gllogovc', lat: 42.6192, lng: 20.8928 },
  { name: 'Štrpce', nameAlbanian: 'Shtërpcë', slug: 'shterpc', lat: 42.2394, lng: 21.0167 },
];

const PRISHTINE_NEIGHBORHOODS = [
  'Dardania', 'Arbëria', 'Kalabria', 'Sunny Hill', 'Bregu i Diellit',
  'Ulpiana', 'Lakrishte', 'Matiqan', 'Veternik', 'Qyteza Pejton',
  'Dragodan', 'Taslixhe', 'Medreseya', 'Kodra e Trimave', 'Aktashi',
  'Sofali', 'Rilindja', 'Ramiz Sadiku', 'Fushë Kosovë', 'Hajvali',
];

async function seed() {
  console.log('🌱 Starting seed...');

  // Create cities
  const cities: any[] = [];
  for (const city of CITIES) {
    const created = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
    cities.push(created);
  }
  console.log(`✅ Created ${cities.length} cities`);

  // Create neighborhoods for Prishtinë
  const prishtine = cities.find(c => c.slug === 'prishtine')!;
  for (const name of PRISHTINE_NEIGHBORHOODS) {
    await prisma.neighborhood.upsert({
      where: { cityId_slug: { cityId: prishtine.id, slug: name.toLowerCase().replace(/\s+/g, '-') } },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        cityId: prishtine.id,
      },
    });
  }
  console.log('✅ Created Prishtinë neighborhoods');

  // Create amenities
  const amenities = [
    { name: 'WiFi', icon: 'wifi', category: 'Technology' },
    { name: 'Air Conditioning', icon: 'wind', category: 'Climate' },
    { name: 'Central Heating', icon: 'flame', category: 'Climate' },
    { name: 'Elevator', icon: 'arrow-up', category: 'Building' },
    { name: 'Security System', icon: 'shield', category: 'Security' },
    { name: 'CCTV', icon: 'camera', category: 'Security' },
    { name: 'Intercom', icon: 'phone', category: 'Security' },
    { name: 'Parking', icon: 'car', category: 'Outdoor' },
    { name: 'Garden', icon: 'plant', category: 'Outdoor' },
    { name: 'Balcony', icon: 'home', category: 'Outdoor' },
    { name: 'Terrace', icon: 'home', category: 'Outdoor' },
    { name: 'Pool', icon: 'droplet', category: 'Outdoor' },
    { name: 'Gym', icon: 'dumbbell', category: 'Fitness' },
    { name: 'Sauna', icon: 'thermometer', category: 'Wellness' },
    { name: 'Laundry Room', icon: 'shirt', category: 'Utilities' },
    { name: 'Storage Room', icon: 'archive', category: 'Utilities' },
    { name: 'Furnished', icon: 'sofa', category: 'Interior' },
    { name: 'Dishwasher', icon: 'droplet', category: 'Appliances' },
    { name: 'Washing Machine', icon: 'rotate', category: 'Appliances' },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    });
  }
  console.log('✅ Created amenities');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kosovorealestate.com' },
    update: {},
    create: {
      email: 'admin@kosovorealestate.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // Create sample agent users
  const agentPassword = await bcrypt.hash('Agent@123456', 12);
  const agentUser1 = await prisma.user.upsert({
    where: { email: 'ardian.krasniqi@example.com' },
    update: {},
    create: {
      email: 'ardian.krasniqi@example.com',
      password: agentPassword,
      firstName: 'Ardian',
      lastName: 'Krasniqi',
      phone: '+383 44 123 456',
      role: 'AGENT',
      isVerified: true,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  });

  const agentUser2 = await prisma.user.upsert({
    where: { email: 'mimoza.berisha@example.com' },
    update: {},
    create: {
      email: 'mimoza.berisha@example.com',
      password: agentPassword,
      firstName: 'Mimoza',
      lastName: 'Berisha',
      phone: '+383 44 654 321',
      role: 'AGENT',
      isVerified: true,
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
  });

  // Create agency
  const agency = await prisma.agency.upsert({
    where: { slug: 'era-real-estate-prishtine' },
    update: {},
    create: {
      name: 'ERA Real Estate Prishtinë',
      slug: 'era-real-estate-prishtine',
      description: 'One of Kosovo\'s most trusted real estate agencies with over 15 years of experience.',
      email: 'info@era-ks.com',
      phone: '+383 38 123 456',
      address: 'Rr. Nënë Tereza Nr. 12, Prishtinë',
      cityId: prishtine.id,
      isVerified: true,
      rating: 4.8,
      reviewCount: 124,
    },
  });

  // Create agents
  const agent1 = await prisma.agent.upsert({
    where: { userId: agentUser1.id },
    update: {},
    create: {
      userId: agentUser1.id,
      agencyId: agency.id,
      bio: 'Specialist in residential properties in Prishtinë with 8 years of experience.',
      yearsExperience: 8,
      specializations: ['Residential', 'Luxury', 'Investment'],
      languages: ['Albanian', 'English', 'Serbian'],
      rating: 4.9,
      reviewCount: 67,
      listingCount: 23,
      isVerified: true,
    },
  });

  const agent2 = await prisma.agent.upsert({
    where: { userId: agentUser2.id },
    update: {},
    create: {
      userId: agentUser2.id,
      agencyId: agency.id,
      bio: 'Expert in commercial and investment properties across Kosovo.',
      yearsExperience: 6,
      specializations: ['Commercial', 'Investment', 'Land'],
      languages: ['Albanian', 'English', 'German'],
      rating: 4.7,
      reviewCount: 42,
      listingCount: 18,
      isVerified: true,
    },
  });

  console.log('✅ Created users, agents, agency');

  // Create sample listings
  const sampleListings = [
    {
      title: 'Apartament Modern 2+1 në Dardania',
      description: 'Apartament i ri me cilësi të lartë ndërtimi në lagjen Dardania. Ndriçim natyral i shkëlqyer, pamje nga qyteti, vendndodhje e favorshme pranë qendrës.',
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      price: 95000,
      area: 82,
      bedrooms: 2,
      bathrooms: 1,
      floor: 4,
      totalFloors: 8,
      yearBuilt: 2020,
      hasBalcony: true,
      hasElevator: true,
      hasHeating: true,
      address: 'Rr. Hysni Zajmi, Dardania, Prishtinë',
      lat: 42.6601,
      lng: 21.1542,
      isFeatured: true,
      status: 'ACTIVE' as const,
      citySlug: 'prishtine',
    },
    {
      title: 'Vila Luksoze me Kopësht në Sunny Hill',
      description: 'Vila e mrekullueshme me 4 dhoma gjumi, kopësht të madh privat dhe garazh 2-veturor. Ndërtim 2019, materiale premium europiane.',
      listingType: 'SALE' as const,
      propertyType: 'VILLA' as const,
      price: 385000,
      area: 280,
      bedrooms: 4,
      bathrooms: 3,
      floor: 0,
      totalFloors: 2,
      yearBuilt: 2019,
      hasGarden: true,
      hasPool: true,
      hasBalcony: true,
      hasTerrace: true,
      hasSecurity: true,
      hasAirCon: true,
      hasHeating: true,
      parkingSpaces: 2,
      garageSpaces: 2,
      address: 'Rr. Ilir Konushevci, Sunny Hill, Prishtinë',
      lat: 42.6720,
      lng: 21.1720,
      isFeatured: true,
      status: 'ACTIVE' as const,
      citySlug: 'prishtine',
    },
    {
      title: 'Apartament 1+1 me Qira në Ulpiana',
      description: 'Apartament i mobiluar plotësisht me kuzhinë të pajisur, internet fiber optik dhe parkingë. Ideal për profesionistë.',
      listingType: 'RENT' as const,
      propertyType: 'APARTMENT' as const,
      price: 350,
      area: 55,
      bedrooms: 1,
      bathrooms: 1,
      floor: 2,
      totalFloors: 5,
      hasBalcony: true,
      hasFurnished: true,
      hasAirCon: true,
      hasHeating: true,
      address: 'Rr. Fehmi Agani, Ulpiana, Prishtinë',
      lat: 42.6545,
      lng: 21.1612,
      status: 'ACTIVE' as const,
      citySlug: 'prishtine',
    },
    {
      title: 'Truall Ndërtimor 800m² në Prizren',
      description: 'Truall me leje ndërtimi të aprovuar për ndërtesë 4-katëshe. Vendndodhje qendrore pranë Kalasë historike të Prizrenit.',
      listingType: 'SALE' as const,
      propertyType: 'LAND' as const,
      price: 160000,
      area: 800,
      address: 'Rr. Remzi Ademi, Prizren',
      lat: 42.2150,
      lng: 20.7420,
      status: 'ACTIVE' as const,
      citySlug: 'prizren',
    },
    {
      title: 'Objekt Komercial në Qendër të Gjilan',
      description: 'Objekt biznesi 3-katësh me zyrë, magazinë dhe parking. I përshtatshëm për biznes të çdo lloji.',
      listingType: 'RENT' as const,
      propertyType: 'COMMERCIAL' as const,
      price: 1200,
      area: 450,
      floor: 0,
      totalFloors: 3,
      parkingSpaces: 5,
      address: 'Rr. Dëshmorët e Kombit, Gjilan',
      lat: 42.4630,
      lng: 21.4680,
      status: 'ACTIVE' as const,
      citySlug: 'gjilan',
    },
    {
      title: 'Shtëpi 3+1 me Oborr në Pejë',
      description: 'Shtëpi e re me 3 dhoma gjumi, oborr 300m² dhe pamje nga malet e Rugovës. Ndërtim 2021.',
      listingType: 'SALE' as const,
      propertyType: 'HOUSE' as const,
      price: 145000,
      area: 160,
      bedrooms: 3,
      bathrooms: 2,
      hasGarden: true,
      yearBuilt: 2021,
      address: 'Rr. Ismail Qemali, Pejë',
      lat: 42.6580,
      lng: 20.2890,
      isFeatured: true,
      status: 'ACTIVE' as const,
      citySlug: 'peje',
    },
    {
      title: 'Studio moderne në Qendër të Prishtinës',
      description: 'Studio e re, e mobiluar me dizajn bashkëkohor. Vendndodhje perfekte në zemër të kryeqytetit, 2 minuta nga Sheshi Nënë Tereza.',
      listingType: 'RENT' as const,
      propertyType: 'STUDIO' as const,
      price: 250,
      area: 38,
      bathrooms: 1,
      floor: 3,
      hasFurnished: true,
      hasAirCon: true,
      address: 'Rr. Nënë Tereza, Prishtinë',
      lat: 42.6632,
      lng: 21.1620,
      status: 'ACTIVE' as const,
      citySlug: 'prishtine',
    },
    {
      title: 'Duplex 4+1 në Kodra e Trimave',
      description: 'Duplex i jashtëzakonshëm me 4 dhoma gjumi, 3 banjo, 2 terraca dhe garazh nëntokësor. Sistem ngrohje nëntokësor, sistem sigurie.',
      listingType: 'SALE' as const,
      propertyType: 'DUPLEX' as const,
      price: 220000,
      area: 210,
      bedrooms: 4,
      bathrooms: 3,
      floor: 1,
      totalFloors: 2,
      yearBuilt: 2022,
      hasTerrace: true,
      hasElevator: false,
      hasSecurity: true,
      hasHeating: true,
      garageSpaces: 2,
      address: 'Rr. Faik Konica, Kodra e Trimave, Prishtinë',
      lat: 42.6680,
      lng: 21.1480,
      isFeatured: true,
      status: 'ACTIVE' as const,
      citySlug: 'prishtine',
    },
    {
      title: 'Shtëpi Familjare 3+1 në Mitrovicë',
      description: 'Shtëpi e mirëmbajtur mirë me oborr të gjelbëruar dhe hapësirë shtesë për zgjerim. Afër shkollave dhe qendrës së qytetit.',
      listingType: 'SALE' as const,
      propertyType: 'HOUSE' as const,
      price: 98000,
      area: 175,
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 2015,
      hasGarden: true,
      hasHeating: true,
      address: 'Rr. Isa Boletini, Mitrovicë',
      lat: 42.8914,
      lng: 20.8660,
      status: 'ACTIVE' as const,
      citySlug: 'mitrovice',
    },
    {
      title: 'Apartament 2+1 me Qira në Gjakovë',
      description: 'Apartament i mobiluar plotësisht në një nga lagjet më të kërkuara të Gjakovës, pranë tregut qendror.',
      listingType: 'RENT' as const,
      propertyType: 'APARTMENT' as const,
      price: 320,
      area: 68,
      bedrooms: 2,
      bathrooms: 1,
      floor: 2,
      totalFloors: 4,
      hasBalcony: true,
      hasFurnished: true,
      hasHeating: true,
      address: 'Rr. Nënë Tereza, Gjakovë',
      lat: 42.3803,
      lng: 20.4283,
      status: 'ACTIVE' as const,
      citySlug: 'gjakove',
    },
    {
      title: 'Truall 500m² pranë Autostradës në Ferizaj',
      description: 'Truall me qasje direkte nga autostrada Prishtinë-Ferizaj, ideal për biznes ose ndërtim rezidencial.',
      listingType: 'SALE' as const,
      propertyType: 'LAND' as const,
      price: 75000,
      area: 500,
      address: 'Rr. Skënderbeu, Ferizaj',
      lat: 42.3703,
      lng: 21.1553,
      status: 'ACTIVE' as const,
      citySlug: 'ferizaj',
    },
    {
      title: 'Apartament i Ri 1+1 në Podujevë',
      description: 'Apartament në ndërtim të ri me çertifikatë energjetike të lartë, parking privat dhe ashensor.',
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      price: 62000,
      area: 58,
      bedrooms: 1,
      bathrooms: 1,
      floor: 3,
      totalFloors: 6,
      yearBuilt: 2024,
      hasElevator: true,
      hasBalcony: true,
      hasHeating: true,
      address: 'Rr. Zahir Pajaziti, Podujevë',
      lat: 42.9115,
      lng: 21.1898,
      status: 'ACTIVE' as const,
      citySlug: 'podujeve',
    },
    {
      title: 'Hapësirë Zyre 120m² në Qendër të Prishtinës',
      description: 'Zyre moderne e gatshme për punë, me hapësirë të hapur, dy zyra private dhe sallë mbledhjesh. Ndërtesë me siguri 24/7.',
      listingType: 'RENT' as const,
      propertyType: 'OFFICE' as const,
      price: 900,
      area: 120,
      floor: 5,
      totalFloors: 9,
      hasElevator: true,
      hasAirCon: true,
      hasSecurity: true,
      address: 'Bulevardi Bill Klinton, Prishtinë',
      lat: 42.6656,
      lng: 21.1656,
      isFeatured: true,
      status: 'ACTIVE' as const,
      citySlug: 'prishtine',
    },
    {
      title: 'Vilë Panoramike me Pamje nga Kalaja e Prizrenit',
      description: 'Vilë ekskluzive me pamje 360° drejt qytetit të vjetër dhe Kalasë së Prizrenit. Ndërtim cilësor, kopësht privat.',
      listingType: 'SALE' as const,
      propertyType: 'VILLA' as const,
      price: 310000,
      area: 240,
      bedrooms: 4,
      bathrooms: 3,
      yearBuilt: 2021,
      hasGarden: true,
      hasTerrace: true,
      hasSecurity: true,
      hasHeating: true,
      garageSpaces: 1,
      address: 'Lagjja Kurillë, Prizren',
      lat: 42.2170,
      lng: 20.7390,
      isFeatured: true,
      status: 'ACTIVE' as const,
      citySlug: 'prizren',
    },
    {
      title: 'Studio e Vogël pranë Bulevardit në Pejë',
      description: 'Studio kompakte, ideale për studentë ose çift të ri. E mobiluar, gati për banim.',
      listingType: 'RENT' as const,
      propertyType: 'STUDIO' as const,
      price: 220,
      area: 32,
      bathrooms: 1,
      floor: 1,
      hasFurnished: true,
      address: 'Bulevardi Dëshmorët e Kombit, Pejë',
      lat: 42.6600,
      lng: 20.2870,
      status: 'ACTIVE' as const,
      citySlug: 'peje',
    },
    {
      title: 'Shtëpi 4+1 me Garazh në Gjilan',
      description: 'Shtëpi e madhe familjare me 4 dhoma gjumi, garazh 2-veturor dhe oborr të gjerë. Lagje e qetë rezidenciale.',
      listingType: 'SALE' as const,
      propertyType: 'HOUSE' as const,
      price: 135000,
      area: 220,
      bedrooms: 4,
      bathrooms: 2,
      yearBuilt: 2017,
      hasGarden: true,
      hasHeating: true,
      garageSpaces: 2,
      parkingSpaces: 2,
      address: 'Rr. Adem Jashari, Gjilan',
      lat: 42.4610,
      lng: 21.4650,
      status: 'ACTIVE' as const,
      citySlug: 'gjilan',
    },
    {
      title: 'Depo 600m² në Zonën Industriale të Prishtinës',
      description: 'Depo e madhe me hapësirë ngarkim-shkarkimi, lartësi 6m dhe qasje të lehtë për kamionë. Ideale për logjistikë.',
      listingType: 'RENT' as const,
      propertyType: 'WAREHOUSE' as const,
      price: 1800,
      area: 600,
      parkingSpaces: 8,
      address: 'Zona Industriale, Prishtinë',
      lat: 42.6450,
      lng: 21.1100,
      status: 'ACTIVE' as const,
      citySlug: 'prishtine',
    },
    {
      title: 'Apartament 2+1 në Qendër të Suharekës',
      description: 'Apartament i ri me finiturat më të fundit, pranë qendrës së qytetit dhe të gjitha shërbimeve.',
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      price: 68000,
      area: 72,
      bedrooms: 2,
      bathrooms: 1,
      floor: 2,
      totalFloors: 5,
      yearBuilt: 2023,
      hasBalcony: true,
      hasElevator: true,
      hasHeating: true,
      address: 'Rr. Skënderbeu, Suharekë',
      lat: 42.3597,
      lng: 20.8289,
      status: 'ACTIVE' as const,
      citySlug: 'suhareke',
    },
  ];

  const cityMap = new Map(cities.map(c => [c.slug, c.id]));
  const placeholderImages = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
  ];

  for (let i = 0; i < sampleListings.length; i++) {
    const { citySlug, ...listingData } = sampleListings[i];

    const slug = `${listingData.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}-${i + 1}`;

    await prisma.listing.upsert({
      where: { slug },
      update: {},
      create: {
        ...listingData,
        slug,
        cityId: cityMap.get(citySlug) || prishtine.id,
        userId: agentUser1.id,
        agentId: i % 2 === 0 ? agent1.id : agent2.id,
        agencyId: agency.id,
        publishedAt: new Date(),
        images: {
          create: [
            { url: placeholderImages[i % placeholderImages.length], isCover: true, order: 0, alt: listingData.title },
            { url: placeholderImages[(i + 1) % placeholderImages.length], isCover: false, order: 1 },
            { url: placeholderImages[(i + 2) % placeholderImages.length], isCover: false, order: 2 },
          ],
        },
      },
    });
  }
  console.log(`✅ Created ${sampleListings.length} sample listings`);

  // Create blog posts
  const blogPosts = [
    {
      title: 'Si të Blesh Pronën e Parë në Kosovë: Udhëzuesi i Plotë',
      slug: 'si-te-blesh-pronen-e-pare-ne-kosove',
      excerpt: 'Gjithçka që duhet të dini para se të bëni investimin më të madh të jetës suaj.',
      content: 'Blerja e pronës së parë është një nga vendimet më të rëndësishme financiare...',
      category: 'buying-guide',
      tags: ['blerje', 'prishtinë', 'investim', 'fillestare'],
      authorName: 'Ardian Krasniqi',
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
      coverImage: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800',
    },
    {
      title: 'Tregu i Pronave në Prishtinë 2024: Analiza e Plotë',
      slug: 'tregu-i-pronave-ne-prishtine-2024',
      excerpt: 'Çmimet e apartamenteve, trendet dhe parashikimet për vitin 2024.',
      content: 'Tregu i pasurive të paluajtshme në Prishtinë ka shënuar rritje të vazhdueshme...',
      category: 'market-analysis',
      tags: ['treg', 'prishtinë', '2024', 'analiza'],
      authorName: 'Mimoza Berisha',
      isPublished: true,
      publishedAt: new Date('2024-02-10'),
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    },
    {
      title: 'Investimi në Prona: Prizreni si Destinacion i Ardhshëm',
      slug: 'investimi-ne-prona-prizreni-destinacion',
      excerpt: 'Pse Prizreni po bëhet gjithnjë e më tërheqës për investitorët e pronave.',
      content: 'Prizreni, qyteti historik me potencial të madh turistik dhe ekonomik...',
      category: 'investment',
      tags: ['prizren', 'investim', 'turizëm', 'potencial'],
      authorName: 'Ardian Krasniqi',
      isPublished: true,
      publishedAt: new Date('2024-03-05'),
      coverImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('✅ Created blog posts');

  console.log('\n🎉 Seed completed successfully!');
  console.log('📧 Admin: admin@kosovorealestate.com / Admin@123456');
  console.log('👤 Agent 1: ardian.krasniqi@example.com / Agent@123456');
  console.log('👤 Agent 2: mimoza.berisha@example.com / Agent@123456');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
