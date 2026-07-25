export interface PronounSet {
  id: string;
  subject: string;      // e.g. Ze
  object: string;       // e.g. Zir
  possessiveDet: string; // e.g. Zir (determiner: "This is zir book")
  possessivePro: string; // e.g. Zirs (pronoun: "This book is zirs")
  reflexive: string;    // e.g. Zirself
  isCustom: boolean;
  isMastered: boolean;
  reviewCount: number;
  notes?: string;
  isEnabled?: boolean;   // Active state toggle
  associatedNames?: string; // Names associated with this set for specific practice
  // Tracks correct attempts for each grammatical form
  correctAttempts?: {
    subject: number;
    object: number;
    possessiveDet: number;
    possessivePro: number;
    reflexive: number;
  };
}

export interface PracticeSentence {
  template: string; // e.g. "___ went to the store." (using subject)
  type: 'subject' | 'object' | 'possessiveDet' | 'possessivePro' | 'reflexive';
}

export interface Person {
  id: string;
  name: string;
  pronounSetIds: string[]; // List of PronounSet IDs associated with this person
}

export interface SessionCard {
  set: PronounSet;
  sentence: PracticeSentence;
  personName?: string; // Optional name of the person being practiced
}

export const REQUIRED_CORRECT_ATTEMPTS = 3;
