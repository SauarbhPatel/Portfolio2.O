// ─────────────────────────────────────────────────────────────
//  All personal facts live here. Edit this file to update the site.
//  Paths starting with "/" point to files in the /public folder.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Saurabh Kumar Patel',
  shortName: 'Saurabh Patel',
  initials: 'SP',
  role: 'Mobile App & MERN Stack Developer',
  city: 'Rewa, Madhya Pradesh',
  country: 'India',
  timezone: 'IST (UTC+5:30)',
  positioning: 'I build mobile apps and take them all the way to the store.',
  currently: { role: 'Full Stack Developer', company: 'Brythm', product: 'Tiffexx' },
  photo: '/saurabh.webp',
  resume: '/Saurabh_Kumar_Patel_Resume.pdf',
  // Used for SEO / social cards. Set this to your real domain once deployed.
  url: '',
  stats: [
    { value: '~4', label: 'years building' },
    { value: '10', label: 'apps live on the stores' },
    { value: '5', label: 'companies' },
  ],
}

export const contact = {
  email: 'saurabhkpatel.dev@gmail.com',
  phone: '+91 9669233736',
  linkedin: 'https://linkedin.com/in/saurabh-patel-79aaa7235',
  github: 'https://github.com/SauarbhPatel',
  // Contact form delivery.
  //  provider: 'formspree' → sends from the page. Put your form ID (e.g. "xyzabcd") in formspreeId.
  //  provider: 'email'     → opens the visitor's email app with the message pre-filled.
  //  provider: 'whatsapp'  → opens WhatsApp with the message pre-filled (uses whatsappNumber).
  form: {
    provider: 'email',
    formspreeId: '',
    whatsappNumber: '919669233736', // digits only, with country code
  },
}

export const about = {
  statement:
    "I'm a mobile app and MERN stack developer from Rewa, Madhya Pradesh. For nearly four years I've built real products — tiffin delivery, radio e-commerce, school ERPs, real-time chat — and shipped ten of them to the Play Store and App Store.",
  bio: [
    'I work across the whole app: React Native and Expo on the phone, Node.js, Express and MongoDB behind it, and real-time pieces like WebSockets, Socket.io and WebRTC when the product needs them.',
    "Right now I'm a Full Stack Developer at Brythm Private Limited, working on Tiffexx — a home-cooked tiffin platform that runs as three apps for customers, kitchens and delivery partners.",
    "I'm open to full-time roles and collaborative projects, remote or with relocation.",
  ],
}

// The four "faces" revealed in the 3D scroll stage.
export const services = [
  {
    id: 'mobile',
    title: 'Mobile apps',
    caption: 'React Native & Expo apps for Android and iOS — built, signed with EAS and released to both stores.',
    tags: ['React Native', 'Expo', 'EAS Build', 'Redux', 'RTK Query'],
    color: '#FF5A1F',
  },
  {
    id: 'backend',
    title: 'Backends & APIs',
    caption: 'REST APIs and data layers with Node.js, Express and MongoDB, with Redis caching where speed matters.',
    tags: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'REST'],
    color: '#9DB8FF',
  },
  {
    id: 'realtime',
    title: 'Real-time',
    caption: 'Live chat, voice and video calls, order tracking and push — WebSockets, Socket.io, WebRTC and FCM.',
    tags: ['WebSockets', 'Socket.io', 'WebRTC', 'FCM'],
    color: '#D8F26B',
  },
  {
    id: 'web',
    title: 'Web & cloud',
    caption: 'Admin panels and web apps in React and Next.js, with media and files on AWS S3, EC2 and Cloudinary.',
    tags: ['React.js', 'Next.js', 'Tailwind CSS', 'AWS S3', 'AWS EC2', 'Cloudinary'],
    color: '#F3EEE6',
  },
]

export const stack = [
  'React Native', 'Expo', 'JavaScript ES6+', 'React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB',
  'Redis', 'Socket.io', 'WebRTC', 'WebSockets', 'FCM', 'Redux', 'Context API', 'AWS S3', 'AWS EC2',
  'Cloudinary', 'Tailwind CSS', 'Git',
]

// Selected work — large case-study cards. `result` is only filled where it is a real, verifiable fact.
export const projects = [
  {
    id: 'tiffexx',
    categories: ['app'],
    name: 'Tiffexx',
    year: '2026',
    kind: '3 apps · Current',
    role: 'Full Stack Developer at Brythm Private Limited',
    image: null, // add '/work/tiffexx.webp' when you have a screenshot
    accent: '#FF5A1F',
    summary: 'Homemade tiffins from local kitchens, delivered to your door.',
    problem:
      'People want home-cooked lunch and dinner, and local home kitchens need a way to sell it — with someone reliable to deliver it.',
    did: [
      'Working on Tiffexx as three apps: one for customers, one for tiffin partners (home kitchens) and one for delivery partners.',
      'Lunch and dinner ordering, one-time or on subscription.',
      'Live order tracking and secure payments.',
    ],
    result: 'All three apps are live on Google Play.',
    tech: ['React Native'],
    links: [
      { label: 'Website', href: 'https://www.tiffexx.com/' },
      { label: 'Customer app', href: 'https://play.google.com/store/apps/details?id=com.tiffexx.user' },
      { label: 'Kitchen app', href: 'https://play.google.com/store/apps/details?id=com.tiffexx.restaurant' },
      { label: 'Delivery app', href: 'https://play.google.com/store/apps/details?id=com.tiffexx.delivery' },
    ],
  },
  {
    id: 'baofeng',
    categories: ['app'],
    name: 'Baofeng Radios',
    year: '2026',
    kind: 'E-commerce app',
    role: 'Built at G. S. Tele Communication Limited',
    image: '/work/baofeng.webp',
    accent: '#4F9BFF',
    summary: 'Shop professional radios and accessories from your phone.',
    problem:
      'Customers of BAOFENG communication devices needed one place to browse radios, order them and pay online — on both Android and iOS.',
    did: [
      'Dynamic product filtering by category, brand and attributes.',
      'Payment gateway integration with secure callback handling, Firebase + FCM push and deep linking.',
      'A QR-based redirect that sends each user to the right app store for their device.',
      'A production EAS Build setup that resolved iOS CocoaPods / Firebase compatibility issues.',
    ],
    result: 'Live on Google Play and the App Store.',
    tech: ['React Native', 'Expo', 'EAS Build', 'Firebase', 'RTK Query', 'FCM'],
    links: [
      { label: 'Website', href: 'https://baofengradios.com/' },
      { label: 'Android', href: 'https://play.google.com/store/apps/details?id=com.baofengradios' },
      { label: 'iOS', href: 'https://apps.apple.com/in/app/baofeng-radios/id6757856127' },
    ],
  },
  {
    id: 'edumug',
    categories: ['app', 'admin'],
    name: 'Edumug ERP & Admin',
    year: '2024 – 26',
    kind: 'School ERP · 2 apps',
    role: null,
    image: '/work/edumug-erp.webp',
    accent: '#8B6CFF',
    summary: 'A school ERP for students, parents, teachers and admins.',
    problem:
      'Schools juggle attendance, grades, timetables, homework and parent communication across separate tools and paper.',
    did: [
      'Edumug ERP: one mobile interface for students, parents and staff covering attendance, grades, timetables and communication.',
      'Edumug Admin: a companion app for teachers and admins to manage attendance, exam marks, homework and student records.',
    ],
    result: 'Both apps are live on Google Play and the App Store.',
    tech: ['React Native', 'Expo', 'Redux', 'TypeScript', 'FCM'],
    links: [
      { label: 'Website', href: 'https://edumug.in/' },
      { label: 'ERP · Android', href: 'https://play.google.com/store/apps/details?id=com.edumug.erp' },
      { label: 'ERP · iOS', href: 'https://apps.apple.com/in/app/edumug-erp/id6746067162' },
      { label: 'Admin · Android', href: 'https://play.google.com/store/apps/details?id=admin.edumug.com&hl=en_IN' },
      { label: 'Admin · iOS', href: 'https://apps.apple.com/in/app/edumug-admin/id6767473999' },
    ],
  },
  {
    id: 'flipchat',
    categories: ['app'],
    name: 'FlipChat',
    year: '2024',
    kind: 'Real-time messaging',
    role: null,
    image: '/work/flipchat.webp',
    accent: '#FF4D5E',
    summary: 'Private chat with voice and video calls.',
    problem: 'A messaging app needs instant delivery, calls that work peer-to-peer, and privacy by default.',
    did: [
      'Text messaging, media sharing and group chats over Socket.io.',
      'Peer-to-peer voice and video calls with WebRTC.',
      'End-to-end encryption for user privacy.',
    ],
    result: null,
    tech: ['React Native', 'WebRTC', 'Socket.io', 'Redux', 'FCM', 'Node.js', 'Express.js', 'MongoDB'],
    links: [],
  },
  {
    id: 'hisaab',
    categories: ['app', 'web'],
    name: 'Hisaab Pro',
    year: '2026',
    kind: 'Finance app',
    role: null,
    image: '/work/hisaab.webp',
    accent: '#3CCB8F',
    summary: 'Expenses, bill-splitting and freelance money in one place.',
    problem:
      'Indian users track personal spending, split bills with friends and manage freelance payments — usually in three different apps.',
    did: [
      'UPI-first expense tracking across 16 categories.',
      'Group bill-splitting with real-time settle-up.',
      'A freelancer dashboard for client payments, team pay and net profit, plus spending reports and income-vs-expense analytics.',
      'JWT + OTP authentication.',
    ],
    result: null,
    tech: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'JWT + OTP'],
    links: [{ label: 'Website', href: 'https://hisaab-pro.netlify.app/' }],
  },
  {
    id: 'theater-crave',
    categories: ['app', 'web', 'admin'],
    name: 'Theater Crave',
    year: '2023',
    kind: 'App + Web admin',
    role: null,
    image: '/work/theater-crave.webp',
    accent: '#FF8A3D',
    summary: 'Order food from your cinema seat without missing the film.',
    problem: 'Moviegoers have to leave their seats — and miss scenes — to get food and drinks.',
    did: [
      'An app to order food and beverages from your seat, delivered in-theater.',
      'Real-time order tracking and payment integration with FCM updates.',
      'A web admin panel for theater staff.',
    ],
    result: 'Live on Google Play.',
    tech: ['React Native', 'Node.js', 'MongoDB', 'Payment Gateway', 'FCM'],
    links: [{ label: 'Android', href: 'https://play.google.com/store/apps/details?id=com.theatercrave&hl=en' }],
  },
]

// Every other project — shown on the "All projects" screen, each with its own case study.
// Same fields as `projects`. `result` is only set where there is a real, public outcome (e.g. a store listing).
export const archive = [
  {
    id: 'glozey',
    name: 'Glozey',
    year: '2025',
    kind: 'App + Web',
    categories: ['app', 'web'],
    image: '/work/glozey.webp',
    accent: '#8A72FF',
    summary: 'Salon-style beauty services, booked to your doorstep.',
    problem: 'Customers want salon services — facials, waxing, hair styling — delivered at home.',
    did: [
      'Customer app and web for browsing and booking beauty services at home.',
      'Booking flow with payment gateway integration and FCM push notifications.',
      'A separate partner app for professional onboarding (see Glozey Partner).',
    ],
    result: null,
    tech: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'Express', 'Payment Gateway', 'FCM'],
    links: [],
  },
  {
    id: 'glozey-partner',
    name: 'Glozey Partner',
    year: '2025',
    kind: 'Partner app',
    categories: ['app', 'admin'],
    image: '/work/glozey-partner.webp',
    accent: '#A08CFF',
    summary: 'The app beauticians use to run their Glozey work.',
    problem: 'Beauticians and salon professionals need one place to join the platform, manage bookings and see what they earn.',
    did: [
      'Partner registration and onboarding.',
      'Managing service bookings.',
      'Tracking daily earnings.',
    ],
    result: null,
    tech: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'Express', 'FCM'],
    links: [],
  },
  {
    id: 'flatshare',
    name: 'Flatshare Karo',
    year: '2026',
    kind: 'Mobile app',
    categories: ['app'],
    image: '/work/flatshare.webp',
    accent: '#8C7BFF',
    summary: 'Find a flatmate or a room nearby in about two minutes.',
    problem: 'Finding a room or a flatmate in a new city is slow and scattered across groups and listings.',
    did: ['City-wise discovery of rooms and flatmates.', 'Detailed room listings.', 'Direct messaging between users.'],
    result: 'Live on Google Play.',
    tech: ['React Native', 'Node.js', 'MongoDB', 'Express'],
    links: [
      { label: 'Website', href: 'https://www.flatsharekaro.in/' },
      { label: 'Android', href: 'https://play.google.com/store/apps/details?id=com.flatsharekaro' },
    ],
  },
  {
    id: 'car-parking',
    name: 'Car Parking Sticker',
    year: '2025',
    kind: 'Mobile app',
    categories: ['app'],
    image: '/work/car-parking.webp',
    accent: '#F2A93B',
    summary: 'QR parking stickers that let people reach a car owner — privately.',
    problem: 'People need a quick, secure way to reach a vehicle owner about a parking issue or an emergency.',
    did: ['A QR-based smart parking sticker linked to the vehicle owner.', 'Secure sharing of emergency contact details when the QR is scanned.'],
    result: 'Live on Google Play and the App Store.',
    tech: ['React Native', 'Expo', 'QR Code'],
    links: [
      { label: 'Website', href: 'https://carparkingsticker.com/' },
      { label: 'Android', href: 'https://play.google.com/store/apps/details?id=com.carparkingsticker&hl=en_IN' },
      { label: 'iOS', href: 'https://apps.apple.com/in/app/car-parking-sticker/id6748760478' },
    ],
  },
  {
    id: 'redelectro',
    name: 'RedElectro',
    year: '2023',
    kind: 'B2B e-commerce',
    categories: ['app'],
    image: '/work/redelectro.webp',
    accent: '#FF4D4D',
    summary: 'Bulk ordering of electrical products for retailers and wholesalers.',
    problem: 'Retailers and wholesalers of electrical products need one place to browse catalogues and place bulk orders.',
    did: ['Catalogue browsing for retailers and wholesalers.', 'Bulk ordering with payment gateway integration.', 'Inventory management.'],
    result: 'Live on Google Play.',
    tech: ['React Native', 'Expo', 'Redux', 'Payment Gateway'],
    links: [
      { label: 'Website', href: 'https://redelectro.in/' },
      { label: 'Android', href: 'https://play.google.com/store/apps/details?id=com.led.redelectro&hl=en_IN' },
    ],
  },
  {
    id: 'masjid',
    name: 'Find Your Masjid',
    year: '2026',
    kind: 'Mobile app',
    categories: ['app'],
    image: '/work/masjid.webp',
    accent: '#2FAF7A',
    summary: 'Nearby masjids, prayer times and community events.',
    problem: 'People want to find the nearest masjid and its prayer times quickly, wherever they are.',
    did: ['Locating nearby masjids on a map with Google Maps.', 'Prayer times and Islamic events.', 'Staying connected with the local community.'],
    result: null,
    tech: ['React Native', 'Expo', 'Google Maps API'],
    links: [{ label: 'Website', href: 'https://namaztimetable.com/' }],
  },
  {
    id: 'prime25',
    name: 'Prime 25 OTT',
    year: '2025',
    kind: 'OTT streaming',
    categories: ['app'],
    image: '/work/prime25.webp',
    accent: '#FFC21A',
    summary: 'Family-friendly streaming on any device.',
    problem: 'Families want family-friendly streaming that works across their devices.',
    did: ['Adaptive streaming with media on Cloudinary and AWS S3.', 'Content filtering and user profiles.', 'Cross-device access.'],
    result: null,
    tech: ['React Native', 'Expo', 'Redux', 'Node.js', 'Cloudinary', 'AWS S3'],
    links: [],
  },
  {
    id: 'leadsync',
    name: 'LeadSync',
    year: '2024',
    kind: 'CRM · App + Web',
    categories: ['app', 'web', 'admin'],
    image: '/work/leadsync.webp',
    accent: '#3FA0E6',
    summary: 'A lead-management CRM for sales teams on the move.',
    problem: 'Sales teams need to score leads, follow up on time and see results — at the desk and on the move.',
    did: ['Lead scoring and automated follow-up workflows.', 'Analytics dashboards on the web.', 'A mobile app for managing the sales team on the go.'],
    result: null,
    tech: ['React Native', 'Expo', 'React.js', 'Node.js', 'MongoDB', 'Express.js'],
    links: [],
  },
  {
    id: 'hunar',
    name: 'Hunar',
    year: '2025',
    kind: 'Business app',
    categories: ['app'],
    image: '/work/hunar.webp',
    accent: '#22A06B',
    summary: 'Run a tailoring business from one dashboard.',
    problem: 'Tailors need to keep customer orders, measurements and delivery dates in one place.',
    did: ['Customer orders and measurements.', 'Delivery schedules.', 'Stitching workflow tracking from a single dashboard.'],
    result: null,
    tech: ['React Native', 'Expo', 'Redux', 'Node.js', 'Express.js', 'MongoDB'],
    links: [],
  },
  {
    id: 'chunav',
    name: 'Digital Chunav Prachar',
    year: '2023',
    kind: 'Campaign app',
    categories: ['app'],
    image: '/work/chunav.webp',
    accent: '#F5B82E',
    summary: 'Election campaign management in one app.',
    problem: 'Election campaigns need to organise voters, activities and constituency data in one place.',
    did: ['Organising voters.', 'Managing campaign activities.', 'Tracking constituency data.'],
    result: null,
    tech: ['React Native', 'Expo', 'Redux', 'Node.js', 'Express.js', 'MongoDB'],
    links: [],
  },
  {
    id: 'todo',
    name: 'TODO — Compliance & Audit',
    year: '2022',
    kind: 'Booking app',
    categories: ['app'],
    image: '/work/todo.webp',
    accent: '#C04FC0',
    summary: 'Book CAs, CSs and lawyers from one app.',
    problem: 'People need an easy way to find and book verified CAs, CSs and lawyers.',
    did: ['Booking appointments with professionals.', 'Scheduling consultations and managing bookings.', 'Connecting with verified experts, with payment gateway integration.'],
    result: null,
    tech: ['React Native', 'Expo', 'Redux', 'Payment Gateway'],
    links: [],
  },
  {
    id: 'notebook',
    name: 'NoteBook',
    year: '2022',
    kind: 'Web app',
    categories: ['web'],
    image: '/work/notebook.webp',
    accent: '#4C7DFF',
    summary: 'Private notes and passwords with end-to-end encryption.',
    problem: 'Sensitive notes and passwords need to stay readable only by their owner.',
    did: ['Secure storage for notes and passwords.', 'End-to-end encryption, so data is accessible only to the user.', 'JWT authentication.'],
    result: null,
    tech: ['React.js', 'Context API', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Crypto'],
    links: [{ label: 'Website', href: 'https://notebook-book.onrender.com/' }],
  },
]

export const allProjects = [...projects, ...archive]

export const experience = [
  {
    company: 'Brythm Private Limited',
    role: 'Full Stack Developer',
    period: 'Oct 2026 — Present',
    place: null,
    outcome: 'Working on Tiffexx — customer, kitchen and delivery apps, all live on Google Play.',
  },
  {
    company: 'G. S. Tele Communication Limited',
    role: 'App Developer',
    period: 'Dec 2025 — Sep 2026',
    place: 'Gurgaon',
    outcome: 'Built the Baofeng Radios app, live on Google Play and the App Store.',
  },
  {
    company: 'ATRN Solution LLP (AETURN)',
    role: 'Software Development Engineer',
    period: 'Aug 2024 — Dec 2025',
    place: 'Noida',
    outcome: 'Built healthcare features across React Native and React/Node.js, with real-time updates over WebSockets and Socket.io.',
  },
  {
    company: 'Abaris Softech Pvt. Ltd.',
    role: 'App Developer',
    period: 'Mar 2024 — Jul 2024',
    place: 'Delhi',
    outcome: 'Shipped client apps with third-party APIs, payment gateways and FCM push, in an ISO 9001:2015 certified team.',
  },
  {
    company: 'MakSoft Pvt. Ltd.',
    role: 'MERN Stack Developer',
    period: 'Dec 2022 — Feb 2024',
    place: 'Rewa',
    outcome: 'Built full-stack MERN web apps, REST APIs and SEO-friendly frontends for digital marketing platforms.',
  },
]

// Real testimonials only: { quote, name, title }. Leave empty to show the "work with me" panel.
export const testimonials = []

export const faq = [
  {
    q: 'Are you open to new roles?',
    a: "Yes — full-time roles and collaborative projects. I'm based in Rewa, India, and open to remote work or relocation.",
  },
  {
    q: 'What kind of work do you do best?',
    a: 'React Native apps end to end: the app, the Node.js / MongoDB backend behind it, and real-time features like chat, calls, live tracking and push notifications.',
  },
  {
    q: 'Can you take an app all the way to the stores?',
    a: "Yes. Ten apps I've worked on are live on Google Play and the App Store, including EAS Build setups for iOS and Android.",
  },
  {
    q: 'Which time zone do you work in?',
    a: 'Indian Standard Time (UTC+5:30).',
  },
  {
    q: "What's the fastest way to reach you?",
    a: 'Email or the form below. You can also download my resume or message me on LinkedIn.',
  },
]
