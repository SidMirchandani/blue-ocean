export interface Article {
  id: string;
  title: string;
  category: 'Critical' | 'Injury' | 'Environmental' | 'Other';
  summary: string;
  content: string[];
  image: string;
}

export const KNOWLEDGE_BASE: Article[] = [
  {
    id: 'cpr-adult',
    title: 'Adult CPR',
    category: 'Critical',
    summary: 'Essential steps for performing Cardiopulmonary Resuscitation on an adult.',
    image: 'cpr-guide',
    content: [
      'Check the scene for safety.',
      'Check for responsiveness. Tap shoulder and shout "Are you okay?".',
      'If unresponsive, call emergency services immediately.',
      'Check for breathing for no more than 10 seconds.',
      'Give 30 chest compressions: Push hard and fast in the center of the chest.',
      'Give 2 rescue breaths: Tilt head back, lift chin, and blow into the mouth.',
      'Continue cycles of 30 compressions and 2 breaths until help arrives or an AED is available.'
    ]
  },
  {
    id: 'choking-adult',
    title: 'Choking (Heimlich Maneuver)',
    category: 'Critical',
    summary: 'How to clear an airway obstruction in a conscious adult.',
    image: 'choking-rescue',
    content: [
      'Confirm the person is choking (cannot breathe, cough, or speak).',
      'Stand behind the person and wrap your arms around their waist.',
      'Make a fist with one hand and place the thumb side against their abdomen, just above the navel.',
      'Grasp your fist with your other hand.',
      'Perform quick, upward thrusts into the abdomen.',
      'Continue until the object is forced out or the person becomes unconscious.'
    ]
  },
  {
    id: 'burns-treatment',
    title: 'Burn Care',
    category: 'Injury',
    summary: 'First aid for thermal, chemical, or electrical burns.',
    image: 'burns-care',
    content: [
      'Stop the burning process: Remove the source of heat.',
      'Cool the burn: Run cool (not cold) tap water over the area for 10-20 minutes.',
      'Remove jewelry or restrictive clothing before swelling occurs.',
      'Cover loosely with a sterile, non-stick bandage or clean cloth.',
      'Do not apply ice, butter, or ointments to a severe burn.',
      'Seek medical attention for large burns, burns on face/hands, or chemical/electrical burns.'
    ]
  },
  {
    id: 'severe-bleeding',
    title: 'Severe Bleeding',
    category: 'Critical',
    summary: 'Steps to control heavy blood loss from a wound.',
    image: 'hero-bg',
    content: [
      'Put on gloves if available.',
      'Apply direct pressure to the wound using a clean cloth or sterile bandage.',
      'If the cloth soaks through, add more layers without removing the first one.',
      'Maintain steady pressure until bleeding stops or help arrives.',
      'If bleeding is life-threatening and on a limb, consider applying a tourniquet high and tight.',
      'Keep the person warm and treat for shock.'
    ]
  }
];
