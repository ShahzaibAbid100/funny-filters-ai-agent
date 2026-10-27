export interface Preset {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  type: string;
  mediaType: 'image_to_image' | 'image_to_video';
  credits: number;
}

export const PRESET_CATEGORIES = [
  { id: 'funny-filters', name: 'Funny Filters' },
  { id: 'social-virals', name: 'Social Virals' },
  { id: 'family-portrait', name: 'Family Portrait Generator' },
  { id: 'dance-generator', name: 'Dance Generator' },
  { id: 'ai-couple', name: 'AI Couple Photoshoot' },
  { id: 'image-to-video', name: 'Image to Video Effect' },
];

export const PRESETS: Preset[] = [
  {
    id: 'doll-replica-walk',
    mediaType: 'image_to_video',
    title: 'Doll Replica Walk',
    description:
      'Create a city-street moment where you walk beside a life-size doll replica of you in matching outfits, each holding a coffee cup. Just upload a photo and your video is ready to share.',
    image: '/src/assets/images/doll_replica_walk_1791627372889.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'doll replica', 'city walk'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'real-mugshot',
    mediaType: 'image_to_image',
    title: 'Real Mugshot',
    description:
      'Step into the precinct with a gritty police booking mugshot. Features an official inmate placard with your name and height measurement background grid.',
    image: '/src/assets/images/real_mugshot_filter_1791627391576.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'mugshot', 'viral trend'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'toddler-tantrum',
    mediaType: 'image_to_image',
    title: 'Toddler Tantrum',
    description:
      'Hilarious baby crying transformation with an oversized animated baby head, playroom toys, and dramatic theatrical tantrum expressions.',
    image: '/src/assets/images/toddler_tantrum_preset_1791627409401.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'big head', 'baby face'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'morning-messy-doll',
    mediaType: 'image_to_image',
    title: 'Morning Messy Doll',
    description:
      'Wake up as a whimsical messy-haired doll sipping morning coffee in the kitchen. The perfect blend of morning chaos and cozy chic.',
    image: '/src/assets/images/morning_messy_doll_1791627422201.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'morning doll', 'coffee lover'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'object-overload',
    mediaType: 'image_to_video',
    title: 'Object Overload',
    description:
      'Turn your still frame into a playful editorial moment with one matching object drifting down into a dense pile. Completely surrounded by retro alarm clocks.',
    image: '/src/assets/images/object_overload_clocks_1791627436609.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'video effect', 'editorial'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'wanted-poster',
    mediaType: 'image_to_image',
    title: 'Vintage Wanted Poster',
    description:
      'Wild West wanted poster printed on aged crinkled parchment with 5 gold stars reward banner, vintage wood plank background, and Western saloon typography.',
    image: '/src/assets/images/vintage_wanted_poster_1791627495365.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'wanted poster', 'vintage'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'bobblehead-lego',
    mediaType: 'image_to_image',
    title: 'Bobblehead Sam',
    description:
      'Transform yourself into a real collectible spring-necked bobblehead toy standing on polished hardwood with miniature toy race cars and alphabet blocks.',
    image: '/src/assets/images/bobblehead_lego_figure_1791627512110.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'bobblehead', 'toy figurine'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'comic-funny-faces',
    mediaType: 'image_to_image',
    title: 'Comic Dork Duos',
    description:
      'Go wild with expressive cartoon faces, silly tongue poses, and bursting comic book stickers, zap explosions, hearts, and pop art doodles.',
    image: '/src/assets/images/comic_funny_faces_1791627526967.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'comic doodle', 'pop art'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'emoji-explosion',
    mediaType: 'image_to_image',
    title: 'Emoji Explosion',
    description:
      'Submerge your cheerful face into an ocean of hundreds of bright yellow smiley face emoji spheres. High energy positivity for social feeds.',
    image: '/src/assets/images/emoji_explosion_1791627977448.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'emoji ball', 'social viral'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'head-in-hands',
    mediaType: 'image_to_image',
    title: 'Head in Hands Gallery',
    description:
      'A mind-bending museum optical illusion where you stand casually in a fine art gallery holding your own detached smiling head in your hands.',
    image: '/src/assets/images/head_in_hands_1791627990764.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'optical illusion', 'surreal'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'doll-turkey-chef',
    mediaType: 'image_to_image',
    title: 'Thanksgiving Doll Chef',
    description:
      'A cozy doll host proudly showing off a massive golden-brown roasted Thanksgiving turkey in a vintage country kitchen.',
    image: '/src/assets/images/doll_turkey_chef_1791628003520.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'holiday chef', 'doll scene'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'face-meat-packaging',
    mediaType: 'image_to_image',
    title: 'Supermarket Choice Cut',
    description:
      'Surreal pop art transformation displaying your face vacuum-sealed in a supermarket butcher tray with cellophane wrap and grocery price sticker.',
    image: '/src/assets/images/face_meat_packaging_1791628023072.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'pop art', 'supermarket packaging'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'police-too-good',
    mediaType: 'image_to_image',
    title: 'Too Good To Be Free',
    description:
      'Hilarious glamorous mugshot holding an official booking placard: "POLICE DEPT. TOO GOOD TO BE FREE - 849173" against a height grid.',
    image: '/src/assets/images/police_too_good_mugshot_1791782165338.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'mugshot', 'viral trend'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'bubble-dress',
    mediaType: 'image_to_image',
    title: 'Bubble Balloon Gown',
    description:
      'High fashion viral dress sculpted entirely out of glowing bubble balloons and clear sphere bubbles on a bold studio pink backdrop.',
    image: '/src/assets/images/bubble_dress_balloons_1791782180627.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'fashion', 'viral trend'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'emoji-mask-paddle',
    mediaType: 'image_to_image',
    title: 'Cool Sunglasses Emoji Face',
    description:
      'Street style effect holding an oversized glossy yellow sunglasses smiley emoji paddle mask right over your face.',
    image: '/src/assets/images/emoji_face_mask_paddle_1791782196257.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'emoji', 'street style'],
    type: 'Effect',
    credits: 17,
  },
  {
    id: 'police-stealing-show',
    mediaType: 'image_to_image',
    title: 'Stealing The Show',
    description:
      'Celebratory precinct mugshot with falling gold confetti, glitter outfit, and placard reading "POLICE - STEALING THE SHOW 73491".',
    image: '/src/assets/images/police_stealing_show_1791782212797.jpg',
    category: 'funny-filters',
    tags: ['funny-filters', 'mugshot', 'party effect'],
    type: 'Effect',
    credits: 17,
  },
];

// Resolve image assets through Vite so thumbnails work in dev AND production builds.
const presetImageAssets = import.meta.glob('../assets/images/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
for (const preset of PRESETS) {
  const filename = preset.image.split('/').pop();
  const bundled = filename && presetImageAssets[`../assets/images/${filename}`];
  if (bundled) preset.image = bundled;
}

export interface SampleFace {
  id: string;
  label: string;
  url: string;
}

export const SAMPLE_FACES: SampleFace[] = [
  {
    id: 'face-1',
    label: 'Clara',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f472b6"/><circle cx="50" cy="42" r="24" fill="%23fde047"/><circle cx="43" cy="40" r="3" fill="%231e293b"/><circle cx="57" cy="40" r="3" fill="%231e293b"/><path d="M44 50 Q50 56 56 50" stroke="%23b91c1c" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M26 88 C26 70 38 64 50 64 C62 64 74 70 74 88 Z" fill="%234338ca"/></svg>',
  },
  {
    id: 'face-2',
    label: 'Liam',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2338bdf8"/><circle cx="50" cy="42" r="24" fill="%23fbcfe8"/><circle cx="42" cy="40" r="3" fill="%230f172a"/><circle cx="58" cy="40" r="3" fill="%230f172a"/><path d="M45 52 Q50 55 55 52" stroke="%230f172a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M25 88 C25 68 36 64 50 64 C64 64 75 68 75 88 Z" fill="%23047857"/></svg>',
  },
  {
    id: 'face-3',
    label: 'Maya',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23a855f7"/><circle cx="50" cy="42" r="24" fill="%23fed7aa"/><circle cx="43" cy="39" r="3" fill="%2318181b"/><circle cx="57" cy="39" r="3" fill="%2318181b"/><path d="M42 50 Q50 58 58 50" stroke="%23be185d" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M25 88 C25 70 38 64 50 64 C62 64 75 70 75 88 Z" fill="%23b45309"/></svg>',
  },
  {
    id: 'face-4',
    label: 'Alex',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2310b981"/><circle cx="50" cy="42" r="24" fill="%23fef08a"/><circle cx="42" cy="41" r="3" fill="%231e293b"/><circle cx="58" cy="41" r="3" fill="%231e293b"/><path d="M44 51 Q50 56 56 51" stroke="%231e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M24 88 C24 70 36 65 50 65 C64 65 76 70 76 88 Z" fill="%23e11d48"/></svg>',
  },
];
