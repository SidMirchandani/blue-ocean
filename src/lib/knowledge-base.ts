export interface Article {
  id: string;
  title: string;
  category: 'Chemical' | 'Biological' | 'Radiation' | 'Industrial' | 'Home' | 'Environmental';
  type: 'Protocol' | 'Article';
  summary: string;
  content: string[];
  readTime?: string;
}

export const KNOWLEDGE_BASE: Article[] = [
  // QUICK PROTOCOLS (Action-Oriented Response/Cleanup)
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
  {
    id: 'pesticide-exposure',
    title: 'Acute Pesticide Exposure',
    category: 'Chemical',
    type: 'Protocol',
    summary: 'Immediate skin or eye decontamination following pesticide contact.',
    content: [
      'Remove contaminated clothing immediately while wearing gloves.',
      'Flush skin with large amounts of cool water and non-abrasive soap.',
      'If eyes are affected, flush with clean water for at least 15 minutes.',
      'Wrap the victim in a blanket if they show signs of shock or chill.',
      'Do not induce vomiting unless specifically instructed by poison control.',
      'Keep the pesticide container/label for identification by emergency responders.'
    ]
  },
  {
    id: 'carbon-monoxide-leak',
    title: 'Carbon Monoxide Response',
    category: 'Home',
    type: 'Protocol',
    summary: 'Action steps when a CO detector alarms or symptoms appear.',
    content: [
      'Immediately evacuate all people and pets to fresh air outside.',
      'Do not stop to open windows or turn off appliances; just get out.',
      'Call 911 or the local fire department once you are safe outside.',
      'Do not re-enter the building until emergency responders have cleared it.',
      'Symptoms: Headache, dizziness, weakness, nausea, or confusion.',
      'Check for symptoms in everyone; CO is odorless and invisible.'
    ]
  },
  {
    id: 'battery-acid-leak',
    title: 'Lead-Acid Battery Leak',
    category: 'Industrial',
    type: 'Protocol',
    summary: 'Handling sulfuric acid leaks from car or industrial batteries.',
    content: [
      'Neutralize the acid spill using baking soda (sodium bicarbonate).',
      'Wait for the fizzing to stop, indicating the acid is neutralized.',
      'Wear acid-resistant gloves and eye protection.',
      'Absorb the neutralized liquid with clay or specialized sorbent.',
      'Place all debris in a plastic container (metal containers will corrode).',
      'Clean the battery terminals with a baking soda paste.',
      'Wash the area with plenty of water after neutralizing.'
    ]
  },
  {
    id: 'oil-spill-driveway',
    title: 'Driveway Oil/Fuel Spill',
    category: 'Environmental',
    type: 'Protocol',
    summary: 'Preventing groundwater contamination from automotive fluid leaks.',
    content: [
      'Cover the spill with kitty litter, sand, or cornstarch.',
      'Let the absorbent sit for at least 30 minutes (or 24 hours for old stains).',
      'Sweep up the material and place it in a sealed bag.',
      'Apply a concentrated degreasing soap to the remaining stain.',
      'Scrub with a stiff brush and a small amount of water.',
      'Rinse the area into a lawn or dirt area, not into the storm drain.',
      'Repeat if the rainbow sheen persists on the surface.'
    ]
  },
  {
    id: 'gas-leak-natural',
    title: 'Natural Gas Leak',
    category: 'Home',
    type: 'Protocol',
    summary: 'Emergency procedures if you smell "rotten eggs".',
    content: [
      'Stop what you are doing. Do not flip light switches or use phones.',
      'Evacuate the premises immediately on foot.',
      'Do not attempt to find the leak or turn off the gas valve.',
      'Do not start cars or use garage door openers nearby.',
      'Call the gas company or 911 from a safe distance away.',
      'Do not return until a professional says it is safe.'
    ]
  },
  {
    id: 'biohazard-cleanup-small',
    title: 'Minor Biohazard Cleanup',
    category: 'Biological',
    type: 'Protocol',
    summary: 'Safe handling of blood or bodily fluid spills.',
    content: [
      'Wear disposable gloves and eye protection.',
      'Cover the spill with paper towels to absorb the bulk of the fluid.',
      'Apply a 1:10 bleach-to-water solution to the area.',
      'Let the disinfectant sit for at least 10 minutes.',
      'Wipe up the residue and place all materials in a biohazard bag.',
      'Clean the area again with soap and water.',
      'Wash hands thoroughly with soap for 20 seconds after removing gloves.'
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
  },
  {
    id: 'pfas-forever-chemicals',
    title: 'PFAS: The Forever Chemicals',
    category: 'Environmental',
    type: 'Article',
    readTime: '8 min',
    summary: 'Explaining Per- and Polyfluoroalkyl Substances and their persistence.',
    content: [
      'PFAS are a group of synthetic chemicals used since the 1940s to resist heat, water, and oil.',
      'They are called "forever chemicals" because they do not break down in the environment or the body.',
      'Common sources include non-stick cookware, stain-resistant carpets, and firefighting foams.',
      'Exposure is linked to hormonal disruption, immune system effects, and increased cancer risk.',
      'Filtration: Activated carbon or reverse osmosis systems can significantly reduce PFAS in water.',
      'Policy: Many states are now setting strict MCLs (Maximum Contaminant Levels) for PFAS in drinking water.'
    ]
  },
  {
    id: 'radon-silent-killer',
    title: 'Radon: The Silent Killer',
    category: 'Radiation',
    type: 'Article',
    readTime: '6 min',
    summary: 'Why the second leading cause of lung cancer is in your basement.',
    content: [
      'Radon is a radioactive gas that comes from the natural decay of uranium in soil.',
      'It typically enters buildings through cracks in foundations or crawl spaces.',
      'You cannot see, smell, or taste radon; testing is the only way to detect it.',
      'The EPA recommends mitigation if levels are at or above 4 pCi/L.',
      'Mitigation usually involves a vent pipe and fan system (sub-slab depressurization).',
      'New homes can be built with radon-resistant features to prevent accumulation.'
    ]
  },
  {
    id: 'microplastics-impact',
    title: 'Microplastics in Our Water',
    category: 'Environmental',
    type: 'Article',
    readTime: '10 min',
    summary: 'The scale of plastic degradation and its entry into the human food chain.',
    content: [
      'Microplastics are plastic particles less than 5mm in size, resulting from debris breakdown.',
      'Primary microplastics are intentionally added to products (like microbeads in cosmetics).',
      'They have been found in tap water, bottled water, seafood, and even human blood.',
      'Chemicals like phthalates and BPA can leach from these particles into tissues.',
      'Current wastewater treatment plants are not fully equipped to filter out the smallest particles.',
      'Reducing single-use plastics and using laundry filters for synthetic clothes can help.'
    ]
  },
  {
    id: 'aqi-explained',
    title: 'Air Quality Index (AQI)',
    category: 'Environmental',
    type: 'Article',
    readTime: '4 min',
    summary: 'Understanding the scale that measures how clean or polluted your air is.',
    content: [
      'The AQI tracks five major air pollutants: ground-level ozone, particle pollution, CO, SO2, and NO2.',
      '0-50 is "Good" (green); 151-200 is "Unhealthy" (red); 300+ is "Hazardous" (maroon).',
      'PM2.5 (fine particles) is the most concerning for deep lung penetration.',
      'Sensitive groups (asthmatics, elderly) should limit outdoor exertion when AQI exceeds 100.',
      'AQI often spikes during wildfire seasons or in heavy industrial corridors.',
      'Use HEPA air purifiers indoors during high AQI events to protect respiratory health.'
    ]
  },
  {
    id: 'uv-radiation-risks',
    title: 'UV Radiation & Home Design',
    category: 'Radiation',
    type: 'Article',
    readTime: '5 min',
    summary: 'How solar radiation affects indoor environments and health.',
    content: [
      'UV radiation includes UVA (aging), UVB (burning), and UVC (absorbed by atmosphere).',
      'Standard window glass blocks most UVB but allows significant UVA through.',
      'Long-term indoor UV exposure can fade furniture and increase cataract risks.',
      'Low-E window coatings can block up to 99% of harmful UV rays.',
      'Testing: UV meters can verify the effectiveness of window films or treatments.',
      'Safety: Wear broad-spectrum sunscreen even if working near large sunny windows.'
    ]
  },
  {
    id: 'heavy-metals-water',
    title: 'Heavy Metals in Drinking Water',
    category: 'Chemical',
    type: 'Article',
    readTime: '7 min',
    summary: 'Identifying Lead, Arsenic, and Chromium in your plumbing.',
    content: [
      'Heavy metals enter water through pipe corrosion or industrial runoff.',
      'Lead exposure in children can lead to permanent developmental delays.',
      'Arsenic is naturally occurring in some well water and is a known carcinogen.',
      'Flushing: If water has sat in pipes for hours, run it for 30 seconds before use.',
      'Certification: Look for filters with NSF/ANSI 53 or 58 certifications.',
      'Well owners should test for heavy metals at least once a year.'
    ]
  },
  {
    id: 'industrial-runoff-science',
    title: 'Industrial Runoff & Ecosystems',
    category: 'Industrial',
    type: 'Article',
    readTime: '9 min',
    summary: 'How manufacturing waste travels from factory to faucet.',
    content: [
      'Runoff is water from rain or snowmelt that flows over surfaces and picks up pollutants.',
      'Common pollutants: heavy metals, solvents, petroleum products, and sediments.',
      'Point source pollution comes from a single pipe; non-point is diffuse (like farm fields).',
      'Biological Oxygen Demand (BOD) increases when organic waste rots in water, killing fish.',
      'Stormwater management includes detention ponds and bio-swales to filter water naturally.',
      'Residents can report illegal dumping or suspicious pipe discharges to the EPA.'
    ]
  },
  {
    id: 'soil-contamination-home',
    title: 'Soil Contamination at Home',
    category: 'Home',
    type: 'Article',
    readTime: '6 min',
    summary: 'Testing your garden for historical pesticides and lead.',
    content: [
      'Soil near older homes often contains high lead levels from historical paint chips.',
      'Legacy pesticides like DDT can persist in garden soil for decades.',
      'Bio-remediation: Certain plants (like sunflowers) can help pull toxins from soil.',
      'Raised beds with clean imported soil are the safest for edible gardening.',
      'Always wear gloves when gardening and leave shoes at the door to prevent tracking.',
      'County extension offices often provide affordable soil testing services.'
    ]
  }
];
