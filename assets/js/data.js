/*
 * Content payload. In WordPress this object is emitted by the theme
 * (wp_localize_script / REST) from the Business Lines + Site Settings pages.
 * Nothing below is hardcoded in the experience itself.
 *
 * The mother page only introduces Trinity and routes to each business line.
 * Imagery marked PLACEHOLDER is Unsplash until Trinity's own photography lands.
 */
window.TRINITY = {
  settings: {
    ga4: '',          // e.g. G-XXXXXXX  — configured in Site Settings
    gtm: '',          // e.g. GTM-XXXXXX
    metaPixel: '',
    email: 'hello@trinitymasterbuilders.com',
    phone: '925-381-1815',
  },

  hero: { image: 'assets/img/hero.jpg', alt: 'Garden path at dusk leading to a lit stone-wall patio under a cedar pergola' }, // Trinity project

  // Our story — the founder's own words (Trinity's Instagram series), one beat per scroll step.
  // `chapter` indexes story.chapters; body may use <b> for emphasis; the last beat closes on the Trinity mark.
  // Photos are crops of the posts until the original files arrive.
  story: {
    chapters: [
      { logo: 'scaping', numeral: 'I', name: 'Cali Scaping', note: 'Outside · since 2021' },
      { logo: 'home', numeral: 'II', name: 'Cali Home Improvements', note: 'Inside' },
      { logo: 'tmb', numeral: 'III', name: 'Trinity Master Builders', note: 'Together' },
    ],
    beats: [
      { chapter: 0, title: 'It started with my father.',
        body: 'He was a jack-of-all-trades and <b>my greatest mentor.</b> Growing up at his side, I didn\u2019t just learn how to build. <b>I learned</b> to listen to nature, work with intention, and show up with total pride in <b>everything I touched.</b>',
        images: [{ src: 'assets/img/story/story-founder.jpg', alt: 'The founder standing on a newly built retaining wall and stone stairs' }] },
      { chapter: 0, title: 'Working with nature, not against it.',
        body: '<b>He taught me</b> that outdoor spaces aren\u2019t just dirt and stones; they are <b>where memories happen.</b> Long before launching <b>Cali Scaping in 2021,</b> the foundation was already laid in those quiet afternoon lessons about <b>resourcefulness, care, and creative problem-solving.</b>',
        images: [{ src: 'assets/img/story/story-garden.jpg', alt: 'Drought-tolerant garden with a stepping-stone path and flowering lilac' }, { src: 'assets/img/story/story-stone.jpg', alt: 'Standing stone in a river-rock garden bed' }] },
      { chapter: 0, title: 'Scaping your dreams.',
        body: 'That\u2019s where our name comes from. \u201cCali\u201d grounds us in home, but \u201cScaping\u201d comes from <b>taking what exists in your imagination</b> and carefully shaping it into reality. Every project is my <b>opportunity to honor</b> what he taught me: to <b>transform a space</b> into something that truly <b>changes how you live.</b>',
        images: [{ src: 'assets/img/story/story-house.jpg', alt: 'Terraced hillside garden with flagstone paths and a horizontal cedar fence' }] },
      { chapter: 0, title: 'Carrying the torch every day.',
        body: 'Today, those quiet lessons are the exact reason our work is recognized <b>with industry awards.</b> <b>Behind every award</b> is the spirit of the man who taught me to do things right. <b>Every space we transform</b> is my way of <b>honoring his memory</b> and saying thank you.',
        images: [{ src: 'assets/img/story/story-award.jpg', alt: 'The founder receiving a CLCA landscape award' }] },
      { chapter: 1, title: '\u201cCan you bring this inside?\u201d',
        body: 'After years of <b>transforming yards</b> and engineering outdoor spaces through Cali Scaping, something special started happening. Our clients would walk out into their newly built backyards, look back at their houses, and ask: <b>\u201cCan you bring this same level of craftsmanship inside?\u201d</b>',
        images: [{ src: 'assets/img/scaping.webp', alt: 'Cedar deck opening onto a stone-path garden with outdoor kitchen and fire pit' }] },
      { chapter: 1, title: 'Built on earned trust.',
        body: 'Finding <b>a contractor you can actually trust</b> with your home isn\u2019t easy. You already knew our work ethic, our transparency, and <b>our refusal to cut corners outdoors.</b> <b>Cali Home</b> was born out of that exact bond, to give our clients a <b>seamless, worry-free experience</b> for their entire property, from the inside out.',
        images: [{ src: 'assets/img/story/story-kitchen.jpg', alt: 'Remodeled kitchen with warm under-cabinet lighting and wood floors' }, { src: 'assets/img/story/story-kitchen-2.jpg', alt: 'Open kitchen with a waterfall island and glass pantry' }] },
      { chapter: 1, title: 'Elevating how you live indoors.',
        body: '\u201cCali\u201d still grounds us in home, but <b>Cali Home</b> focuses on the sanctuary within your walls. From <b>custom kitchen</b> redesigns to complete interior transformations, <b>we apply the same structural integrity,</b> budget transparency, and master craftsmanship to your <b>indoor living spaces.</b>',
        images: [{ src: 'assets/img/story/story-bath.jpg', alt: 'Remodeled bathroom with backlit vanity mirror and veined stone walls' }] },
      { chapter: 2, mark: true, title: 'One name. Every space.',
        body: 'The garden, the rooms, and next, the water. <b>Cali Scaping, Cali Home Improvements and Cali WaterScapes</b> now stand together as <b>Trinity Master Builders:</b> one standard, carried from the first idea to the final detail.' },
    ],
  },

  services: {
    scaping: {
      name: 'Cali Scaping', numeral: 'I', status: 'active',
      line: 'Landscape Design & Outdoor Living',
      statement: 'Award-winning landscape design — outdoor rooms composed, built and lit as one.',
      url: 'https://caliscaping.com/', domain: 'caliscaping.com',
      // Cali Scaping's own project photography
      image: { src: 'assets/img/scaping.webp', alt: 'Cedar deck opening onto a stone-path garden with outdoor kitchen and fire pit' },
      copy: { badge: '', kicker: 'Professional Landscaping', title: 'Designed to inspire. Built to last.', status: 'Now building', cta: 'Enter Cali Scaping' },
      vision: ['Landscape design', 'Outdoor kitchens', 'Hardscape + stone', 'Garden lighting'],
    },
    home: {
      name: 'Cali Home Improvements', numeral: 'II', status: 'active',
      line: 'Home Remodeling & Improvements',
      statement: 'Premium kitchen, bath and interior renovations — every room considered, every finish intentional.',
      url: 'https://calihomeimprovements.com/', domain: 'calihomeimprovements.com',
      image: { src: 'assets/img/home-kitchen.jpg', alt: 'Remodeled kitchen with warm under-cabinet lighting' }, // Cali Home Improvements project
      copy: { badge: '', kicker: 'Interior Remodeling Services', title: 'Designed with vision. Built with precision.', status: 'Now building', cta: 'Enter Cali Home' },
      vision: ['Kitchens', 'Bathrooms', 'Interiors', 'Whole-home remodels'],
    },
    water: {
      name: 'Cali WaterScapes', numeral: 'III',
      status: 'coming_soon', // 'coming_soon' | 'active'  ← switch in WordPress
      line: 'Custom Pools & Water Features',
      url: '', domain: '', // set when the site launches
      image: { src: 'assets/img/water.jpg', alt: 'Courtyard pool glowing at night' }, // PLACEHOLDER
      copy: {
        coming_soon: { badge: 'Coming soon', kicker: 'Custom Pools & Water Features', title: 'The future of outdoor living is coming.', status: 'Being drawn now', cta: 'Be the first to know' },
        active: { badge: '', kicker: 'Custom Pools & Water Features', title: 'Water, designed as architecture.', status: 'Now building', cta: 'Enter Cali WaterScapes' },
      },
      vision: ['Custom pools', 'Water features', 'Fire + water', 'Light after dark'],
    },
  },
};
