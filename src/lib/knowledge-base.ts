export interface Article {
  id: string;
  title: string;
  category: 'Chemical' | 'Biological' | 'Radiation' | 'Industrial' | 'Home';
  type: 'Protocol' | 'Article';
  summary: string;
  content: string[];
  readTime?: string;
}

export const KNOWLEDGE_BASE: Article[] = [
  // QUICK PROTOCOLS (Action-Oriented Cleanup)
  {
    id: 'mold-remediation',
    title: 'Black Mold Remediation',
    category: 'Biological',
    type: 'Protocol',
    summary: 'Safe step-by-step removal of localized Stachybotrys chartarum (black mold).',
    content: [
      'Seal off the area with plastic sheeting to prevent spore travel.',
      'Wear PPE: N-95 respirator, goggles, and long gloves are mandatory.',
      'Mist the moldy area with water to prevent spores from becoming airborne.',
      'Scrub the surface with a mixture of water and detergent.',
      'Apply a disinfectant: Use a solution of 1 cup bleach to 1 gallon of water.',
      'Dry the area completely within 24 hours using fans and dehumidifiers.',
      'Dispose of cleaning materials in sealed heavy-duty plastic bags.'
    ]
  },
  {
    id: 'chemical-spill-solvent',
    title: 'Solvent Spill Cleanup',
    category: 'Industrial',
    type: 'Protocol',
    summary: 'Immediate response for organic solvent spills (acetone, benzene, toluene).',
    content: [
      'Eliminate all ignition sources immediately (no smoking, no sparks).',
      'Increase ventilation by opening windows or using explosion-proof fans.',
      'Dike the spill using absorbent socks or sand to prevent drainage entry.',
      'Apply absorbent material (activated carbon or universal sorbent).',
      'Use non-sparking tools (plastic shovels) to collect the saturated material.',
      'Place waste in a secondary containment drum for hazardous disposal.',
      'Wash the area with a degreasing agent once the bulk spill is removed.'
    ]
  },
  {
    id: 'lead-dust-control',
    title: 'Lead Dust Management',
    category: 'Home',
    type: 'Protocol',
    summary: 'Reducing exposure during renovation or from old paint dust.',
    content: [
      'Never dry sand or dry scrape lead-based paint.',
      'Use a HEPA-filtered vacuum only; standard vacuums will exhaust lead dust back into the air.',
      'Wet-mop floors and wet-wipe surfaces daily during high-risk periods.',
      'Wash hands and faces of children frequently, especially before eating.',
      'Change clothes and shower before leaving a renovation site.',
      'Isolate work areas using heavy-duty plastic and tape.'
    ]
  },
  {
    id: 'mercury-cleanup',
    title: 'Mercury Spill Response',
    category: 'Chemical',
    type: 'Protocol',
    summary: 'Correct handling of broken thermometers or fluorescent bulbs.',
    content: [
      'Evacuate the room and keep people/pets away.',
      'Open windows and turn off central heating/air conditioning.',
      'Do NOT use a vacuum or broom; this breaks mercury into toxic vapors.',
      'Use stiff paper or cardboard to "herd" beads together.',
      'Use a dropper or sticky tape to pick up beads.',
      'Place all materials and the mercury in a glass jar with a metal lid.',
      'Contact local hazardous waste disposal for drop-off instructions.'
    ]
  },

  // DEEP DIVE ARTICLES (Information-Oriented Literacy)
  {
    id: 'understanding-vocs',
    title: 'The Invisible Threat: VOCs',
    category: 'Home',
    type: 'Article',
    readTime: '5 min',
    summary: 'A deep dive into Volatile Organic Compounds found in everyday household items.',
    content: [
      'VOCs are gases emitted from certain solids or liquids, often found in paints and cleaners.',
      'Concentrations of many VOCs are consistently higher indoors (up to ten times higher) than outdoors.',
      'Health effects include eye/nose irritation, headaches, and damage to the central nervous system.',
      'Key sources: hobby supplies, dry-cleaned clothing, and building materials.',
      'Prevention involves choosing low-VOC products and increasing ventilation.',
      'Long-term exposure can lead to chronic respiratory issues and "Sick Building Syndrome".'
    ]
  },
  {
    id: 'asbestos-science',
    title: 'Asbestos: The Mineral Fibers',
    category: 'Industrial',
    type: 'Article',
    readTime: '7 min',
    summary: 'Understanding why this insulation material remains a global health concern.',
    content: [
      'Asbestos is a group of naturally occurring fibrous minerals with high heat resistance.',
      'Risk occurs when materials are "friable" (easily crumbled), releasing microscopic fibers.',
      'Once inhaled, fibers can remain in the lungs for decades, leading to mesothelioma.',
      'Common locations: pipe insulation, floor tiles, and textured ceilings in pre-1980 buildings.',
      'Testing by a certified laboratory is the only way to confirm its presence.',
      'Proper abatement requires specialized vacuum systems and negative-pressure air units.'
    ]
  }
];
