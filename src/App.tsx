import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Shield, 
  Layers, 
  CheckCircle2, 
  Award, 
  Heart,
  Sun,
  Moon,
  Share2,
  Link2,
  Check,
  Twitter,
  Linkedin,
  Mail,
  Download,
  Smartphone,
  X
} from 'lucide-react';
import { PronounSet, PracticeSentence, REQUIRED_CORRECT_ATTEMPTS } from './types';
import PhoneSimulator from './components/PhoneSimulator';

// Default seeded neopronoun sets
const DEFAULT_PRONOUNS: PronounSet[] = [
  {
    id: '1',
    subject: 'ze',
    object: 'zir',
    possessiveDet: 'zir',
    possessivePro: 'zirs',
    reflexive: 'zirself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'Commonly used as a gender-neutral alternative to he/she. Originated in transgender communities in the late 20th century.'
  },
  {
    id: '2',
    subject: 'xe',
    object: 'xem',
    possessiveDet: 'xyr',
    possessivePro: 'xyrs',
    reflexive: 'xemself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'One of the most popular neopronouns. Pronounced zey, zem, zere, zeres, zemself.'
  },
  {
    id: '3',
    subject: 'fae',
    object: 'faer',
    possessiveDet: 'faer',
    possessivePro: 'faers',
    reflexive: 'faerself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'A noun-self pronoun set inspired by faeries/the fae. Often used by individuals with a strong spiritual or thematic connection to nature.'
  },
  {
    id: '4',
    subject: 'ey',
    object: 'em',
    possessiveDet: 'eir',
    possessivePro: 'eirs',
    reflexive: 'emself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'Sometimes referred to as Spivak pronouns, created by mathematician Michael Spivak in 1990.'
  },
  {
    id: '5',
    subject: 've',
    object: 'ver',
    possessiveDet: 'vis',
    possessivePro: 'vis',
    reflexive: 'verself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'Created by writer Hulda Regehr Clark in 1970. Used as a simple gender-neutral singular pronoun set.'
  },
  {
    id: '6',
    subject: 'ne',
    object: 'nem',
    possessiveDet: 'nir',
    possessivePro: 'nirs',
    reflexive: 'nemself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'Popularized by science fiction novels and online gender-neutral databases as a modern pronoun choice.'
  },
  {
    id: '7',
    subject: 'per',
    object: 'per',
    possessiveDet: 'per',
    possessivePro: 'pers',
    reflexive: 'perself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'Short for person. Created by feminist author Marge Piercy in her 1976 utopian novel \'Woman on the Edge of Time\'.'
  },
  {
    id: '8',
    subject: 'sie',
    object: 'hir',
    possessiveDet: 'hir',
    possessivePro: 'hirs',
    reflexive: 'hirself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'A classic gender-neutral set, blending English with German-influenced spellings. Pronounced see and here.'
  },
  {
    id: '9',
    subject: 'ae',
    object: 'aer',
    possessiveDet: 'aer',
    possessivePro: 'aers',
    reflexive: 'aerself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'A futuristic aesthetic pronoun set common in speculative fiction, sci-fi writing, and neurodivergent communities.'
  },
  {
    id: '10',
    subject: 'thon',
    object: 'thon',
    possessiveDet: 'thons',
    possessivePro: 'thons',
    reflexive: 'thonself',
    isCustom: false,
    isMastered: false,
    reviewCount: 0,
    notes: 'One of the oldest documented English neopronouns, coined in 1884 by Charles Crozat Converse as a contraction of \'that one\'.'
  }
];

// Sample practice sentence templates for each category
const SENTENCE_TEMPLATES: PracticeSentence[] = [
  { template: "___ is going to the local library today.", type: 'subject' },
  { template: "___ loves coding offline-first applications.", type: 'subject' },
  { template: "The teacher asked ___ to answer the question.", type: 'object' },
  { template: "I want to invite ___ to join our practice session.", type: 'object' },
  { template: "This is ___ newly designed notebook.", type: 'possessiveDet' },
  { template: "We admire ___ commitment to normalizing inclusive language.", type: 'possessiveDet' },
  { template: "The creative choice was entirely ___.", type: 'possessivePro' },
  { template: "I bought this book thinking it was ___.", type: 'possessivePro' },
  { template: "Ze learned how to play the piano ___.", type: 'reflexive' },
  { template: "Fae cooked a wonderful vegan meal for ___.", type: 'reflexive' }
];

export default function App() {
  // State variables mimicking Room Database sync
  const [pronounSets, setPronounSets] = useState<PronounSet[]>(() => {
    const saved = localStorage.getItem('pronoun_pocket_sets');
    let loaded: PronounSet[] = [];
    if (saved) {
      try {
        loaded = JSON.parse(saved);
        // Automatically merge any missing default pronouns (e.g. from newer app updates)
        const loadedSubjects = new Set(loaded.map(s => s.subject.toLowerCase()));
        DEFAULT_PRONOUNS.forEach(defaultSet => {
          if (!loadedSubjects.has(defaultSet.subject.toLowerCase())) {
            loaded.push(defaultSet);
          }
        });
      } catch (e) {
        loaded = [...DEFAULT_PRONOUNS];
      }
    } else {
      loaded = [...DEFAULT_PRONOUNS];
    }
    return loaded.map(set => {
      const defaultAttempts = set.isMastered ? REQUIRED_CORRECT_ATTEMPTS : 0;
      return {
        ...set,
        isEnabled: set.isEnabled === undefined ? true : set.isEnabled,
        associatedNames: set.associatedNames || undefined,
        correctAttempts: set.correctAttempts || {
          subject: defaultAttempts,
          object: defaultAttempts,
          possessiveDet: defaultAttempts,
          possessivePro: defaultAttempts,
          reflexive: defaultAttempts
        }
      };
    });
  });

  // Navigation tab states
  const [activeTab, setActiveTab] = useState<'study' | 'learn' | 'library' | 'android-specs'>('study');
  
  // Developer Console active tab states
  const [consoleTab, setConsoleTab] = useState<'sqlite-inspector' | 'room-query-logs' | 'kotlin-sources' | 'device-workshop'>('sqlite-inspector');
  
  // Kotlin sub-files tab
  const [selectedCodeFile, setSelectedCodeFile] = useState<'gradle' | 'theme' | 'room' | 'viewmodel' | 'ui'>('room');

  // Dark mode theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Dark mode effect to toggle classes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Physical ticking clock for status bar
  const [currentTime, setCurrentTime] = useState(new Date());

  // DB Logs representing simulated SQLite queries
  const [dbLogs, setDbLogs] = useState<{ id: string; timestamp: string; query: string; type: 'select' | 'insert' | 'update' | 'delete' | 'success' | 'system' }[]>([]);

  // Clock sync
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Share & copy states
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://pronounpocket.app';
  const shareText = "I'm practicing and learning neopronouns with PronounPocket! Normalizing inclusive language has never been easier. Check it out:";
  
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent("Practice Neopronouns with PronounPocket")}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  // PWA One-Click Install States & Event Handlers
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser's default install banner so we can trigger it on-demand
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if running in standalone display mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    
    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isStandalone) {
      setShowInstallBtn(false);
    } else if (isIOS) {
      // iOS doesn't support beforeinstallprompt but we want to show our beautiful instructions!
      setShowInstallBtn(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS) {
      setIsInstallModalOpen(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback for desktop browsers/others where event hasn't fired
      setIsInstallModalOpen(true);
      return;
    }

    // Trigger native browser install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: User response to install prompt: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Helper to log SQL statement queries
  const logQuery = (query: string, type: 'select' | 'insert' | 'update' | 'delete' | 'success' | 'system') => {
    setDbLogs(prev => [
      {
        id: Date.now() + '-' + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        query,
        type
      },
      ...prev
    ].slice(0, 100));
  };

  // Toggle active state for pronoun sets
  const handleToggleEnable = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let nextEnabled = true;
    const updated = pronounSets.map(set => {
      if (set.id === id) {
        nextEnabled = set.isEnabled === false ? true : false;
        logQuery(`sqlite> UPDATE pronoun_set SET is_enabled = ${nextEnabled ? 1 : 0} WHERE id = '${id}';`, 'update');
        logQuery(`RoomDB [SUCCESS]: Pronoun set '${set.subject}/${set.object}' ${nextEnabled ? 'ENABLED' : 'DISABLED'} for practice.`, 'success');
        return {
          ...set,
          isEnabled: nextEnabled
        };
      }
      return set;
    });
    setPronounSets(updated);

    // If we just disabled it, filter out cards of this set from sessionDeck
    if (!nextEnabled) {
      const filteredDeck = sessionDeck.filter(card => card.set.id !== id);
      setSessionDeck(filteredDeck);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } else {
      // Re-trigger/rebuild session deck to incorporate newly enabled set immediately
      const activeSets = updated.filter(set => set.isEnabled !== false);
      const deck: {set: PronounSet; sentence: PracticeSentence}[] = [];
      activeSets.forEach(set => {
        const shuffledTemplates = [...SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random());
        shuffledTemplates.slice(0, 3).forEach(sentence => {
          deck.push({ set, sentence });
        });
      });
      setSessionDeck(deck.sort(() => 0.5 - Math.random()));
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  // Toggle active state for ALL pronoun sets
  const handleToggleAll = (enabled: boolean) => {
    const updated = pronounSets.map(set => ({
      ...set,
      isEnabled: enabled
    }));
    setPronounSets(updated);
    logQuery(`sqlite> UPDATE pronoun_set SET is_enabled = ${enabled ? 1 : 0};`, 'update');
    logQuery(`RoomDB [SUCCESS]: All pronoun sets ${enabled ? 'ENABLED' : 'DISABLED'} for practice.`, 'update');

    if (!enabled) {
      setSessionDeck([]);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } else {
      // Rebuild the deck with all sets
      const deck: {set: PronounSet; sentence: PracticeSentence}[] = [];
      updated.forEach(set => {
        const shuffledTemplates = [...SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random());
        shuffledTemplates.slice(0, 3).forEach(sentence => {
          deck.push({ set, sentence });
        });
      });
      setSessionDeck(deck.sort(() => 0.5 - Math.random()));
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  // Log initial database connection
  useEffect(() => {
    logQuery(`sqlite> SELECT * FROM pronoun_set ORDER BY isCustom DESC, id ASC;`, 'select');
    logQuery(`RoomDB [SUCCESS]: Opened SQLite Connection 'sqlite_local.db' & retrieved ${pronounSets.length} rows successfully.`, 'success');
  }, []);

  // Study session states
  const [sessionDeck, setSessionDeck] = useState<{set: PronounSet; sentence: PracticeSentence}[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(0);

  // Modal / Form States for CRUD
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<PronounSet | null>(null);
  
  // New Set Form State
  const [newSubject, setNewSubject] = useState('');
  const [newObject, setNewObject] = useState('');
  const [newPossessiveDet, setNewPossessiveDet] = useState('');
  const [newPossessivePro, setNewPossessivePro] = useState('');
  const [newReflexive, setNewReflexive] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newAssociatedNames, setNewAssociatedNames] = useState('');

  // Selected pronoun for detailed card viewing
  const [selectedDetailsSet, setSelectedDetailsSet] = useState<PronounSet | null>(DEFAULT_PRONOUNS[0]);

  // Code Copy feedback state
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pronoun_pocket_sets', JSON.stringify(pronounSets));
  }, [pronounSets]);

  // Generate / shuffle a learning session deck
  const generateSessionDeck = () => {
    const activeSets = pronounSets.filter(set => set.isEnabled !== false);
    if (activeSets.length === 0) {
      setSessionDeck([]);
      return;
    }
    
    const deck: {set: PronounSet; sentence: PracticeSentence}[] = [];
    
    // For each active pronoun set, pair it with relevant templates
    activeSets.forEach(set => {
      const shuffledTemplates = [...SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random());
      shuffledTemplates.slice(0, 3).forEach(sentence => {
        deck.push({ set, sentence });
      });
    });

    // Shuffle final deck
    const shuffledDeck = deck.sort(() => 0.5 - Math.random());
    setSessionDeck(shuffledDeck);
    setCurrentCardIndex(0);
    setIsFlipped(false);

    logQuery(`sqlite> SELECT * FROM sentence_template JOIN pronoun_set ON sentence_template.type = pronoun_set.target_form WHERE is_enabled = 1 ORDER BY RANDOM();`, 'select');
    logQuery(`RoomDB [SUCCESS]: Generated new practice deck session containing ${shuffledDeck.length} flashcards in memory.`, 'success');
  };

  // Start initial deck when pronounSets change or component mounts
  useEffect(() => {
    if (sessionDeck.length === 0 && pronounSets.length > 0) {
      generateSessionDeck();
    }
  }, [pronounSets]);

  // Debug & Development helpers
  const handleDebugResetProgress = () => {
    const resetSets = pronounSets.map(set => ({
      ...set,
      isMastered: false,
      reviewCount: 0,
      correctAttempts: {
        subject: 0,
        object: 0,
        possessiveDet: 0,
        possessivePro: 0,
        reflexive: 0
      }
    }));
    setPronounSets(resetSets);
    setStreak(0);
    if (selectedDetailsSet) {
      const updated = resetSets.find(s => s.id === selectedDetailsSet.id);
      setSelectedDetailsSet(updated || null);
    }
    // Force recreate deck
    const deck: {set: PronounSet; sentence: PracticeSentence}[] = [];
    const activeSets = resetSets.filter(set => set.isEnabled !== false);
    activeSets.forEach(set => {
      const shuffledTemplates = [...SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random());
      shuffledTemplates.slice(0, 3).forEach(sentence => {
        deck.push({ set, sentence });
      });
    });
    setSessionDeck(deck.sort(() => 0.5 - Math.random()));
    setCurrentCardIndex(0);
    setIsFlipped(false);

    logQuery(`sqlite> UPDATE pronoun_set SET isMastered = 0, reviewCount = 0, correctAttemptsSubject = 0, correctAttemptsObject = 0, correctAttemptsPossessiveDet = 0, correctAttemptsPossessivePro = 0, correctAttemptsReflexive = 0;`, 'update');
    logQuery(`RoomDB [SUCCESS]: RESET database transaction executed successfully. Stats cleared.`, 'success');
  };

  const handleDebugFactoryReset = () => {
    localStorage.removeItem('pronoun_pocket_sets');
    const freshSets = DEFAULT_PRONOUNS.map(set => ({
      ...set,
      isEnabled: true,
      correctAttempts: {
        subject: 0,
        object: 0,
        possessiveDet: 0,
        possessivePro: 0,
        reflexive: 0
      }
    }));
    setPronounSets(freshSets);
    setStreak(0);
    setSelectedDetailsSet(freshSets[0]);
    // Force recreate deck
    const deck: {set: PronounSet; sentence: PracticeSentence}[] = [];
    const activeSets = freshSets.filter(set => set.isEnabled !== false);
    activeSets.forEach(set => {
      const shuffledTemplates = [...SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random());
      shuffledTemplates.slice(0, 3).forEach(sentence => {
        deck.push({ set, sentence });
      });
    });
    setSessionDeck(deck.sort(() => 0.5 - Math.random()));
    setCurrentCardIndex(0);
    setIsFlipped(false);

    logQuery(`sqlite> DROP TABLE IF EXISTS pronoun_set;`, 'system');
    logQuery(`sqlite> CREATE TABLE pronoun_set (id TEXT PRIMARY KEY, subject TEXT, object TEXT, possessiveDet TEXT, possessivePro TEXT, reflexive TEXT, isCustom INTEGER, isMastered INTEGER, reviewCount INTEGER, notes TEXT, is_enabled INTEGER, associated_names TEXT);`, 'system');
    logQuery(`sqlite> INSERT INTO pronoun_set SELECT * FROM static_seeded_pronouns;`, 'insert');
    logQuery(`RoomDB [SUCCESS]: Factory reset complete. Local database files re-created and re-seeded.`, 'success');
  };

  const handleDebugMasterAll = () => {
    const masteredSets = pronounSets.map(set => ({
      ...set,
      isMastered: true,
      correctAttempts: {
        subject: REQUIRED_CORRECT_ATTEMPTS,
        object: REQUIRED_CORRECT_ATTEMPTS,
        possessiveDet: REQUIRED_CORRECT_ATTEMPTS,
        possessivePro: REQUIRED_CORRECT_ATTEMPTS,
        reflexive: REQUIRED_CORRECT_ATTEMPTS
      }
    }));
    setPronounSets(masteredSets);
    if (selectedDetailsSet) {
      const updated = masteredSets.find(s => s.id === selectedDetailsSet.id);
      setSelectedDetailsSet(updated || null);
    }
    // Force recreate deck
    const deck: {set: PronounSet; sentence: PracticeSentence}[] = [];
    const activeSets = masteredSets.filter(set => set.isEnabled !== false);
    activeSets.forEach(set => {
      const shuffledTemplates = [...SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random());
      shuffledTemplates.slice(0, 3).forEach(sentence => {
        deck.push({ set, sentence });
      });
    });
    setSessionDeck(deck.sort(() => 0.5 - Math.random()));
    setCurrentCardIndex(0);
    setIsFlipped(false);

    logQuery(`sqlite> UPDATE pronoun_set SET isMastered = 1, correctAttemptsSubject = 3, correctAttemptsObject = 3, correctAttemptsPossessiveDet = 3, correctAttemptsPossessivePro = 3, correctAttemptsReflexive = 3;`, 'update');
    logQuery(`RoomDB [SUCCESS]: UPDATE database transaction executed. All records fully mastered in SQLite.`, 'success');
  };

  const handleDebugAddFaeSet = () => {
    if (pronounSets.some(s => s.subject === 'fae')) {
      alert('"fae" set already exists!');
      return;
    }
    const faeSet: PronounSet = {
      id: 'fae-' + Date.now(),
      subject: 'fae',
      object: 'faer',
      possessiveDet: 'faer',
      possessivePro: 'faers',
      reflexive: 'faerself',
      isCustom: true,
      isMastered: false,
      reviewCount: 0,
      isEnabled: true,
      notes: 'A popular neopronoun set inspired by fairies and nature folklore. Usually conjugated like singular "they" or "she".',
      correctAttempts: {
        subject: 0,
        object: 0,
        possessiveDet: 0,
        possessivePro: 0,
        reflexive: 0
      }
    };
    const updated = [...pronounSets, faeSet];
    setPronounSets(updated);
    setSelectedDetailsSet(faeSet);
    
    const deck: {set: PronounSet; sentence: PracticeSentence}[] = [];
    const activeSets = updated.filter(set => set.isEnabled !== false);
    activeSets.forEach(set => {
      const shuffledTemplates = [...SENTENCE_TEMPLATES].sort(() => 0.5 - Math.random());
      shuffledTemplates.slice(0, 3).forEach(sentence => {
        deck.push({ set, sentence });
      });
    });
    setSessionDeck(deck.sort(() => 0.5 - Math.random()));
    setCurrentCardIndex(0);
    setIsFlipped(false);

    logQuery(`sqlite> INSERT INTO pronoun_set (id, subject, object, possessiveDet, possessivePro, reflexive, isCustom, isMastered, reviewCount, notes, is_enabled) VALUES ('${faeSet.id}', 'fae', 'faer', 'faer', 'faers', 'faeself', 1, 0, 0, '${faeSet.notes}', 1);`, 'insert');
    logQuery(`RoomDB [SUCCESS]: Row created successfully. Row ID: '${faeSet.id}' committed.`, 'success');
  };

  // CRUD handlers
  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newObject || !newPossessiveDet || !newPossessivePro || !newReflexive) {
      alert("Please fill in all 5 pronoun forms.");
      return;
    }

    if (editingSet) {
      // Update
      const updated = pronounSets.map(set => {
        if (set.id === editingSet.id) {
          const updatedSet = {
            ...set,
            subject: newSubject.toLowerCase().trim(),
            object: newObject.toLowerCase().trim(),
            possessiveDet: newPossessiveDet.toLowerCase().trim(),
            possessivePro: newPossessivePro.toLowerCase().trim(),
            reflexive: newReflexive.toLowerCase().trim(),
            notes: newNotes.trim(),
            associatedNames: newAssociatedNames.trim() || undefined
          };
          
          logQuery(`sqlite> UPDATE pronoun_set SET subject = '${updatedSet.subject}', object = '${updatedSet.object}', possessiveDet = '${updatedSet.possessiveDet}', possessivePro = '${updatedSet.possessivePro}', reflexive = '${updatedSet.reflexive}', notes = '${updatedSet.notes}', associated_names = '${updatedSet.associatedNames || ''}' WHERE id = '${set.id}';`, 'update');
          logQuery(`RoomDB [SUCCESS]: SQLite write success. Row ID: '${set.id}' updated.`, 'update');
          
          return updatedSet;
        }
        return set;
      });
      setPronounSets(updated);
    } else {
      // Create
      const newSet: PronounSet = {
        id: Date.now().toString(),
        subject: newSubject.toLowerCase().trim(),
        object: newObject.toLowerCase().trim(),
        possessiveDet: newPossessiveDet.toLowerCase().trim(),
        possessivePro: newPossessivePro.toLowerCase().trim(),
        reflexive: newReflexive.toLowerCase().trim(),
        isCustom: true,
        isMastered: false,
        reviewCount: 0,
        isEnabled: true,
        notes: newNotes.trim(),
        associatedNames: newAssociatedNames.trim() || undefined,
        correctAttempts: {
          subject: 0,
          object: 0,
          possessiveDet: 0,
          possessivePro: 0,
          reflexive: 0
        }
      };
      
      logQuery(`sqlite> INSERT INTO pronoun_set (id, subject, object, possessiveDet, possessivePro, reflexive, isCustom, isMastered, reviewCount, notes, is_enabled, associated_names) VALUES ('${newSet.id}', '${newSet.subject}', '${newSet.object}', '${newSet.possessiveDet}', '${newSet.possessivePro}', '${newSet.reflexive}', 1, 0, 0, '${newSet.notes}', 1, '${newSet.associatedNames || ''}');`, 'insert');
      logQuery(`RoomDB [SUCCESS]: SQLite row committed. ID: '${newSet.id}' inserted into database.`, 'success');
      
      setPronounSets([...pronounSets, newSet]);
    }

    // Reset Form
    resetForm();
    setIsAddModalOpen(false);
  };

  const resetForm = () => {
    setNewSubject('');
    setNewObject('');
    setNewPossessiveDet('');
    setNewPossessivePro('');
    setNewReflexive('');
    setNewNotes('');
    setNewAssociatedNames('');
    setEditingSet(null);
  };

  const handleEditClick = (set: PronounSet) => {
    setEditingSet(set);
    setNewSubject(set.subject);
    setNewObject(set.object);
    setNewPossessiveDet(set.possessiveDet);
    setNewPossessivePro(set.possessivePro);
    setNewReflexive(set.reflexive);
    setNewNotes(set.notes || '');
    setNewAssociatedNames(set.associatedNames || '');
    setIsAddModalOpen(true);
  };

  const handleDeleteSet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this pronoun set? This will clear all learning statistics for it.")) {
      const filtered = pronounSets.filter(set => set.id !== id);
      setPronounSets(filtered);
      
      logQuery(`sqlite> DELETE FROM pronoun_set WHERE id = '${id}';`, 'delete');
      logQuery(`RoomDB [SUCCESS]: Row ID: '${id}' deleted from database successfully.`, 'success');

      if (selectedDetailsSet?.id === id) {
        setSelectedDetailsSet(filtered[0] || null);
      }
      // Re-trigger session generation
      setSessionDeck([]);
    }
  };

  // Flashcard Actions
  const handleCardRating = (correct: boolean) => {
    if (sessionDeck.length === 0) return;
    
    const activeCard = sessionDeck[currentCardIndex];
    const formType = activeCard.sentence.type;
    
    // Update neopronoun state
    const updatedSets = pronounSets.map(set => {
      if (set.id === activeCard.set.id) {
        const currentAttempts = set.correctAttempts || {
          subject: 0,
          object: 0,
          possessiveDet: 0,
          possessivePro: 0,
          reflexive: 0
        };
        
        let newAttempts = { ...currentAttempts };
        if (correct) {
          newAttempts[formType] = Math.min(REQUIRED_CORRECT_ATTEMPTS, (currentAttempts[formType] || 0) + 1);
        }
        
        // A set is mastered only if ALL 5 forms have reached REQUIRED_CORRECT_ATTEMPTS
        const allMastered = 
          newAttempts.subject >= REQUIRED_CORRECT_ATTEMPTS &&
          newAttempts.object >= REQUIRED_CORRECT_ATTEMPTS &&
          newAttempts.possessiveDet >= REQUIRED_CORRECT_ATTEMPTS &&
          newAttempts.possessivePro >= REQUIRED_CORRECT_ATTEMPTS &&
          newAttempts.reflexive >= REQUIRED_CORRECT_ATTEMPTS;

        const updatedSet = {
          ...set,
          reviewCount: set.reviewCount + 1,
          correctAttempts: newAttempts,
          isMastered: allMastered
        };

        const colName = formType === 'subject' ? 'subject_correct'
                      : formType === 'object' ? 'object_correct'
                      : formType === 'possessiveDet' ? 'poss_det_correct'
                      : formType === 'possessivePro' ? 'poss_pro_correct'
                      : 'reflexive_correct';

        logQuery(`sqlite> UPDATE pronoun_set SET reviewCount = ${updatedSet.reviewCount}, ${colName} = ${newAttempts[formType]}, isMastered = ${allMastered ? 1 : 0} WHERE id = '${set.id}';`, 'update');
        logQuery(`RoomDB [SUCCESS]: Stats saved for '${set.subject}/${set.object}'. ${formType.toUpperCase()}: ${newAttempts[formType]}/${REQUIRED_CORRECT_ATTEMPTS}.`, 'success');

        return updatedSet;
      }
      return set;
    });

    setPronounSets(updatedSets);

    // Keep selected details set synced
    if (selectedDetailsSet) {
      const updatedDetails = updatedSets.find(s => s.id === selectedDetailsSet.id);
      if (updatedDetails) {
        setSelectedDetailsSet(updatedDetails);
      }
    }

    if (correct) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Navigate to next card
    if (currentCardIndex < sessionDeck.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
      }, 200);
    } else {
      // Finished deck! Re-generate
      alert("Congratulations! You have completed this practice deck. Let's load a fresh batch!");
      generateSessionDeck();
    }
  };

  // Helper to replace placeholder with appropriate form
  const getCorrectPronounValue = (set: PronounSet, type: string) => {
    switch (type) {
      case 'subject': return set.subject;
      case 'object': return set.object;
      case 'possessiveDet': return set.possessiveDet;
      case 'possessivePro': return set.possessivePro;
      case 'reflexive': return set.reflexive;
      default: return set.subject;
    }
  };

  const formatSentence = (sentence: PracticeSentence, set: PronounSet, reveal: boolean) => {
    const pronounValue = getCorrectPronounValue(set, sentence.type);
    const capitalizedPronoun = pronounValue.charAt(0).toUpperCase() + pronounValue.slice(1);
    
    // Handle beginning of sentence capitalization
    const isBeginning = sentence.template.startsWith("___");
    const displayPronoun = isBeginning ? capitalizedPronoun : pronounValue;

    let templateString = sentence.template;

    // Replace hardcoded "Ze" / "Fae" inside reflexive templates with subject pronoun or name
    if (sentence.type === 'reflexive') {
      const subjectCapitalized = set.subject.charAt(0).toUpperCase() + set.subject.slice(1);
      const replacementSubject = set.associatedNames ? set.associatedNames : subjectCapitalized;
      templateString = templateString
        .replace(/^Ze\b/, replacementSubject)
        .replace(/^Fae\b/, replacementSubject);
    } else if (set.associatedNames) {
      // Prepend context sentence with the associated name to customize practice context
      const name = set.associatedNames;
      if (sentence.type === 'subject') {
        templateString = `${name} is busy. ${templateString}`;
      } else if (sentence.type === 'object') {
        templateString = `${name} is in class. ${templateString}`;
      } else if (sentence.type === 'possessiveDet') {
        templateString = `${name} is creative. ${templateString}`;
      } else if (sentence.type === 'possessivePro') {
        templateString = `${name} made this. ${templateString}`;
      }
    }

    if (!reveal) {
      return templateString.replace("___", "_______");
    }
    
    // Reveal pronoun styled with soft editorial highlight
    const parts = templateString.split("___");
    return (
      <span className="font-serif italic font-normal text-[#0F172A] dark:text-slate-200">
        {parts[0]}
        <strong className="px-2.5 py-1 mx-1.5 rounded-[4px] bg-[#EEF2FF] dark:bg-indigo-950/70 text-[#4338CA] dark:text-indigo-300 font-bold border-b-2 border-[#4338CA] dark:border-indigo-500 inline-block not-italic text-xs">
          {displayPronoun}
        </strong>
        {parts[1]}
      </span>
    );
  };

  const handleCopyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2500);
  };

  // Mastered pronouns count
  const masteredCount = pronounSets.filter(s => s.isMastered).length;

  // Format digital time for simulator status bar
  const timeString = currentTime.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(/\s?[A-Za-z]+$/, '');

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-100/80 selection:dark:bg-indigo-950/80 transition-colors duration-150">
      
      {/* Top Welcome Header - Clean web layout */}
      <header className="border-b border-neutral-200 dark:border-slate-850 bg-[#FDFBF7]/90 dark:bg-slate-950/90 backdrop-blur-xs sticky top-0 z-30 px-6 py-4 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[4px] bg-[#0F172A] dark:bg-indigo-650 flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-light tracking-tight text-[#0F172A] dark:text-white">
                  Pronoun<span className="font-serif italic font-semibold text-[#0F172A] dark:text-indigo-200">Pocket</span>
                </h1>
                <span className="text-[9px] uppercase tracking-widest font-bold border border-[#0F172A] dark:border-indigo-500/50 text-[#0F172A] dark:text-indigo-300 px-2 py-0.5 rounded-[4px] bg-white dark:bg-slate-900">
                  Personal Practice App
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5 font-light">
                <Shield className="w-3.5 h-3.5 text-[#0F172A] dark:text-indigo-400 shrink-0" />
                Offline-First Pronoun Practice & Interactive Learning Companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* PWA Install Button */}
            {showInstallBtn && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[8px] text-xs font-semibold cursor-pointer shadow-sm transition-all duration-200 active:scale-95 animate-pulse hover:animate-none border border-indigo-500"
                title="Install PronounPocket on your device"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Install App</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-[8px] border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-100 transition-all cursor-pointer shadow-2xs flex items-center justify-center"
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>

            {/* Quick stats summarizing state */}
            <div className="hidden md:flex items-center gap-4 bg-white/70 dark:bg-slate-900/70 px-4 py-2 rounded-[4px] border border-neutral-200 dark:border-slate-800 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-slate-300">
                <Layers className="w-4 h-4 text-[#0F172A] dark:text-indigo-400" />
                <span>Pronoun Sets: <strong>{pronounSets.length}</strong></span>
              </div>
              <div className="w-px h-4 bg-neutral-200 dark:bg-slate-800"></div>
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0F172A] dark:text-emerald-400" />
                <span>Mastered: <strong>{masteredCount}</strong></span>
              </div>
              <div className="w-px h-4 bg-neutral-200 dark:bg-slate-800"></div>
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-slate-300">
                <Award className="w-4 h-4 text-[#0F172A] dark:text-amber-400" />
                <span>Streak: <strong>{streak}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6 items-stretch">
        
        <PhoneSimulator
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          streak={streak}
          masteredCount={masteredCount}
          pronounSets={pronounSets}
          sessionDeck={sessionDeck}
          currentCardIndex={currentCardIndex}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          handleCardRating={handleCardRating}
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          editingSet={editingSet}
          newSubject={newSubject}
          setNewSubject={setNewSubject}
          newObject={newObject}
          setNewObject={setNewObject}
          newPossessiveDet={newPossessiveDet}
          setNewPossessiveDet={setNewPossessiveDet}
          newPossessivePro={newPossessivePro}
          setNewPossessivePro={setNewPossessivePro}
          newReflexive={newReflexive}
          setNewReflexive={setNewReflexive}
          newNotes={newNotes}
          setNewNotes={setNewNotes}
          newAssociatedNames={newAssociatedNames}
          setNewAssociatedNames={setNewAssociatedNames}
          handleToggleEnable={handleToggleEnable}
          handleToggleAll={handleToggleAll}
          handleCreateOrUpdate={handleCreateOrUpdate}
          handleDeleteSet={handleDeleteSet}
          handleEditClick={handleEditClick}
          setSelectedDetailsSet={setSelectedDetailsSet}
          selectedDetailsSet={selectedDetailsSet}
          formatSentence={formatSentence}
          timeString={timeString}
        />

        {/* Share Section */}
        <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-[16px] p-6 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6 mt-4 select-none transition-all">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Share2 className="w-4.5 h-4.5 text-indigo-500" />
              <h4 className="font-serif italic font-bold text-base text-[#0F172A] dark:text-slate-100">Share PronounPocket</h4>
            </div>
            <p className="text-xs text-neutral-500 dark:text-slate-400 font-light max-w-xl leading-relaxed">
              Help foster inclusion and normalize pronouns by sharing this interactive learning practice tool with your friends, colleagues, or community!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            {/* PWA One-Click Install in Share Section */}
            {showInstallBtn && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-sm transition-all duration-200 active:scale-95 animate-pulse hover:animate-none border border-indigo-500"
              >
                <Download className="w-4 h-4 text-indigo-100 animate-bounce" />
                <span>Install App</span>
              </button>
            )}

            {/* Copy Link button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] border text-xs font-semibold cursor-pointer transition-all duration-200 active:scale-95 ${
                copied
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400'
                  : 'bg-white dark:bg-slate-950 hover:bg-neutral-50 dark:hover:bg-slate-900 border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 text-neutral-500 dark:text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            {/* Twitter / X */}
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border bg-white dark:bg-slate-950 hover:bg-neutral-50 dark:hover:bg-slate-900 border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300 text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              <Twitter className="w-4 h-4 text-[#1DA1F2]" />
              <span>Share on X</span>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border bg-white dark:bg-slate-950 hover:bg-neutral-50 dark:hover:bg-slate-900 border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300 text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              <span>LinkedIn</span>
            </a>

            {/* Email */}
            <a
              href={emailShareUrl}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border bg-white dark:bg-slate-950 hover:bg-neutral-50 dark:hover:bg-slate-900 border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300 text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              <Mail className="w-4 h-4 text-neutral-500 dark:text-slate-400" />
              <span>Email</span>
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 px-8 text-xs text-neutral-500 dark:text-neutral-400 text-center select-none transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="flex items-center gap-1.5 font-light">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> to foster inclusion, normalize pronouns, and accelerate learning.
          </p>
          <div className="flex gap-4">
            <span className="text-[#0F172A] dark:text-slate-300 font-semibold uppercase tracking-wider text-[9px] border-b border-neutral-200 dark:border-slate-800 pb-0.5">Interactive Practice</span>
            <span className="text-[#0F172A] dark:text-slate-300 font-semibold uppercase tracking-wider text-[9px] border-b border-neutral-200 dark:border-slate-800 pb-0.5">Custom Pronoun Sets</span>
            <span className="text-[#0F172A] dark:text-slate-300 font-semibold uppercase tracking-wider text-[9px] border-b border-neutral-200 dark:border-slate-800 pb-0.5">Progress Analytics</span>
          </div>
        </div>
      </footer>

      {/* PWA Installation Guidance Modal */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/40 dark:bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-[16px] max-w-md w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-500 dark:text-neutral-400 cursor-pointer transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-[12px] bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-serif italic font-bold text-lg text-[#0F172A] dark:text-slate-100">Install PronounPocket</h3>
              <p className="text-xs text-neutral-500 dark:text-slate-400 font-light leading-relaxed max-w-sm">
                Install PronounPocket on your device for instant offline access, launch with a single tap, and save on screen space.
              </p>
            </div>

            {/* Platform instructions */}
            <div className="space-y-4 text-xs font-light text-neutral-700 dark:text-slate-300">
              {/* iOS Safari */}
              <div className="p-3.5 bg-neutral-50 dark:bg-slate-950/40 border border-neutral-100 dark:border-slate-850 rounded-[8px]">
                <span className="font-bold text-[9px] text-[#4338CA] dark:text-indigo-400 uppercase tracking-wider block mb-1.5 font-mono">Apple iPhone & iPad</span>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>Open <span className="font-semibold">Safari</span> and navigate to PronounPocket.</li>
                  <li>Tap the <span className="font-semibold">Share button</span> (square with upward arrow) in the toolbar.</li>
                  <li>Scroll down the share sheet and tap <span className="font-semibold">"Add to Home Screen"</span>.</li>
                </ol>
              </div>

              {/* Android & Desktop browsers */}
              <div className="p-3.5 bg-neutral-50 dark:bg-slate-950/40 border border-neutral-100 dark:border-slate-850 rounded-[8px]">
                <span className="font-bold text-[9px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1.5 font-mono">Android & Desktop (Chrome/Edge/Firefox)</span>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>Click/tap the install button (<span className="font-semibold">Download icon</span>) in our header or below.</li>
                  <li>If prompted by the browser, confirm the installation to place an icon on your desktop or home screen.</li>
                  <li>Alternatively, click your browser's menu (three dots icon) and select <span className="font-semibold">"Install App"</span>.</li>
                </ol>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsInstallModalOpen(false)}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[12px] text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
