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

  services: {
    scaping: {
      name: 'Cali Scaping', numeral: 'I', status: 'active',
      line: 'Landscape Design & Outdoor Living',
      statement: 'Award-winning landscape design — outdoor rooms composed, built and lit as one.',
      url: 'https://caliscaping.com/', domain: 'caliscaping.com',
      // Cali Scaping's own project photography
      image: { src: 'assets/img/scaping.webp', alt: 'Cedar deck opening onto a stone-path garden with outdoor kitchen and fire pit' },
      copy: { badge: '', kicker: 'Landscape Design & Outdoor Living', title: 'Outdoor rooms, composed, built and lit as one.', status: 'Now building', cta: 'Enter Cali Scaping' },
      vision: ['Landscape design', 'Outdoor kitchens', 'Hardscape + stone', 'Garden lighting'],
    },
    home: {
      name: 'Cali Home Improvements', numeral: 'II', status: 'active',
      line: 'Home Remodeling & Improvements',
      statement: 'Premium kitchen, bath and interior renovations — every room considered, every finish intentional.',
      url: 'https://calihomeimprovements.com/', domain: 'calihomeimprovements.com',
      image: { src: 'assets/img/home.jpg', alt: 'Living room with a full-height walnut wall' }, // PLACEHOLDER
      copy: { badge: '', kicker: 'Home Remodeling & Improvements', title: 'Every room considered. Every finish intentional.', status: 'Now building', cta: 'Enter Cali Home' },
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
