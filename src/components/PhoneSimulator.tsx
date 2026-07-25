import React, { useMemo, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  RotateCw, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  X, 
  Check, 
  Compass, 
  Layers,
  Smartphone,
  Battery,
  Wifi,
  Database,
  Upload,
  Download,
  ArrowRight,
  Users,
  Link2,
  Share2
} from 'lucide-react';
import { PronounSet, PracticeSentence, Person, SessionCard } from '../types';

interface PhoneSimulatorProps {
  activeTab: 'study' | 'learn' | 'library' | 'android-specs';
  setActiveTab: (tab: 'study' | 'learn' | 'library') => void;
  streak: number;
  masteredCount: number;
  pronounSets: PronounSet[];
  sessionDeck: SessionCard[];
  currentCardIndex: number;
  isFlipped: boolean;
  setIsFlipped: (f: boolean) => void;
  handleCardRating: (correct: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingSet: PronounSet | null;
  newSubject: string;
  setNewSubject: (s: string) => void;
  newObject: string;
  setNewObject: (s: string) => void;
  newPossessiveDet: string;
  setNewPossessiveDet: (s: string) => void;
  newPossessivePro: string;
  setNewPossessivePro: (s: string) => void;
  newReflexive: string;
  setNewReflexive: (s: string) => void;
  newNotes: string;
  setNewNotes: (s: string) => void;
  newAssociatedNames: string;
  setNewAssociatedNames: (s: string) => void;
  handleToggleEnable: (id: string, e?: React.MouseEvent) => void;
  handleToggleAll: (enabled: boolean) => void;
  handleCreateOrUpdate: (e: React.FormEvent) => void;
  handleDeleteSet: (id: string, e: React.MouseEvent) => void;
  handleEditClick: (set: PronounSet) => void;
  setSelectedDetailsSet: (set: PronounSet) => void;
  selectedDetailsSet: PronounSet | null;
  formatSentence: (sentence: PracticeSentence, set: PronounSet, reveal: boolean, personName?: string) => React.ReactNode;
  timeString: string;
  handleExportSettings: () => void;
  handleImportSettings: (json: string) => boolean;
  studyMode: 'flashcard' | 'multiple-choice' | 'contextual-mc';
  setStudyMode: (mode: 'flashcard' | 'multiple-choice' | 'contextual-mc') => void;
  selectedOption: string | null;
  isAnswerChecked: boolean;
  handleMultipleChoiceSelect: (option: string) => void;
  handleMultipleChoiceNext: () => void;
  practiceFocus: 'all' | 'people';
  handleSetPracticeFocus: (focus: 'all' | 'people') => void;
  people: Person[];
  handleCreateOrUpdatePerson: (id: string | null, name: string, pronounSetIds: string[]) => void;
  handleDeletePerson: (id: string) => void;
}

export default function PhoneSimulator({
  activeTab,
  setActiveTab,
  streak,
  masteredCount,
  pronounSets,
  sessionDeck,
  currentCardIndex,
  isFlipped,
  setIsFlipped,
  handleCardRating,
  isAddModalOpen,
  setIsAddModalOpen,
  editingSet,
  newSubject,
  setNewSubject,
  newObject,
  setNewObject,
  newPossessiveDet,
  setNewPossessiveDet,
  newPossessivePro,
  setNewPossessivePro,
  newReflexive,
  setNewReflexive,
  newNotes,
  setNewNotes,
  newAssociatedNames,
  setNewAssociatedNames,
  handleToggleEnable,
  handleToggleAll,
  handleCreateOrUpdate,
  handleDeleteSet,
  handleEditClick,
  setSelectedDetailsSet,
  selectedDetailsSet,
  formatSentence,
  timeString,
  handleExportSettings,
  handleImportSettings,
  studyMode,
  setStudyMode,
  selectedOption,
  isAnswerChecked,
  handleMultipleChoiceSelect,
  handleMultipleChoiceNext,
  practiceFocus,
  handleSetPracticeFocus,
  people,
  handleCreateOrUpdatePerson,
  handleDeletePerson
}: PhoneSimulatorProps) {
  // Ensure we don't crash if activeTab is 'android-specs' on mount
  const currentPhoneTab = activeTab === 'android-specs' ? 'study' : activeTab;

  // Many-to-Many Library States
  const [librarySubTab, setLibrarySubTab] = useState<'pronouns' | 'people'>('pronouns');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(() => {
    return people.length > 0 ? people[0].id : null;
  });

  // Person Add/Edit Form State
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [personName, setPersonName] = useState('');
  const [personPronounIds, setPersonPronounIds] = useState<string[]>([]);

  // Prepopulated link generation state & handler
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [githubPagesUrl, setGithubPagesUrl] = useState(() => {
    return localStorage.getItem('pronoun_pocket_github_pages_url') || 'https://icynewyear.github.io/Pocket-pronouns/';
  });

  const handleGenerateShareLink = () => {
    try {
      const dataToShare = {
        app: 'PronounPocket',
        version: 1,
        exportedAt: new Date().toISOString(),
        pronounSets,
        people
      };
      const base64String = btoa(unescape(encodeURIComponent(JSON.stringify(dataToShare))));
      
      // If we are currently running on GitHub Pages, use the current address
      // Otherwise, use the user-configured GitHub Pages base URL
      let baseUrl = githubPagesUrl;
      if (window.location.hostname.endsWith('github.io')) {
        baseUrl = window.location.origin + window.location.pathname;
      }
      
      // Ensure baseUrl ends with a slash or matches cleanly
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const shareUrl = `${cleanBaseUrl}?share=${encodeURIComponent(base64String)}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedShareLink(true);
        setTimeout(() => setCopiedShareLink(false), 2000);
      });
    } catch (e) {
      console.error("Failed to generate share link:", e);
      alert("Could not generate share link.");
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

  // Local helper to format completed sentences for contextual MCQ choices
  const getContextualMCQOptionText = (sentence: PracticeSentence, set: PronounSet, candidatePronoun: string, personName?: string) => {
    let templateString = sentence.template;
    
    // Capitalize if beginning of sentence
    const isBeginning = templateString.startsWith("___");
    const displayPronoun = isBeginning 
      ? candidatePronoun.charAt(0).toUpperCase() + candidatePronoun.slice(1) 
      : candidatePronoun.toLowerCase();

    // Handle verb agreement for plural-agreeing pronouns like 'they'
    if (candidatePronoun.toLowerCase() === 'they') {
      templateString = templateString
        .replace("___ is", "___ are")
        .replace("___ loves", "___ love");
    }

    const activeName = personName || set.associatedNames;

    // Replace hardcoded "Ze" / "Fae" inside reflexive templates with subject pronoun or name
    if (sentence.type === 'reflexive') {
      const subjectCapitalized = set.subject.charAt(0).toUpperCase() + set.subject.slice(1);
      const replacementSubject = activeName ? activeName : subjectCapitalized;
      templateString = templateString
        .replace(/^Ze\b/, replacementSubject)
        .replace(/^Fae\b/, replacementSubject);
    } else if (activeName) {
      // Prepend context sentence with the associated name to customize practice context
      const name = activeName;
      if (sentence.type === 'subject') {
        const verb = candidatePronoun.toLowerCase() === 'they' ? "are" : "is";
        templateString = `${name} is busy. ${templateString}`;
      } else if (sentence.type === 'object') {
        templateString = `${name} is in class. ${templateString}`;
      } else if (sentence.type === 'possessiveDet') {
        templateString = `${name} is creative. ${templateString}`;
      } else if (sentence.type === 'possessivePro') {
        templateString = `${name} made this. ${templateString}`;
      }
    }

    return templateString.replace("___", displayPronoun);
  };

  // Memoized options for Contextual Multiple Choice Mode
  const multipleChoiceOptions = useMemo(() => {
    if (!sessionDeck || sessionDeck.length === 0 || currentCardIndex >= sessionDeck.length) {
      return [];
    }
    const currentCard = sessionDeck[currentCardIndex];
    const { set, sentence } = currentCard;
    const correctValue = getCorrectPronounValue(set, sentence.type);
    
    // Forms of the same neopronoun set
    const sameSetForms = [set.subject, set.object, set.possessiveDet, set.possessivePro, set.reflexive].filter(
      form => form && form.trim().toLowerCase() !== correctValue.toLowerCase()
    );
    
    // Traditional equivalents as context distractors
    const traditionalCounterparts = {
      subject: 'they',
      object: 'them',
      possessiveDet: 'their',
      possessivePro: 'theirs',
      reflexive: 'themself'
    };
    
    const binaryCounterparts = {
      subject: 'she',
      object: 'him',
      possessiveDet: 'his',
      possessivePro: 'hers',
      reflexive: 'herself'
    };

    const options = [correctValue];
    
    // Add 1-2 other forms from same set as primary distractors
    const shuffledSameSet = [...sameSetForms].sort(() => 0.5 - Math.random());
    shuffledSameSet.forEach(opt => {
      if (options.length < 3) {
        options.push(opt);
      }
    });

    // Add traditional counterparts
    const trad = traditionalCounterparts[sentence.type];
    if (trad && !options.includes(trad)) {
      options.push(trad);
    }
    
    const bin = binaryCounterparts[sentence.type];
    if (bin && options.length < 4 && !options.includes(bin)) {
      options.push(bin);
    }

    // Fill remaining up to 4 options
    shuffledSameSet.forEach(opt => {
      if (options.length < 4 && !options.includes(opt)) {
        options.push(opt);
      }
    });

    const fallbackForms = ['ey', 'em', 'eir', 'eirs', 'emself', 'xe', 'xem', 'xyr', 'xyrs', 'xemself'];
    let fallbackIdx = 0;
    while (options.length < 4 && fallbackIdx < fallbackForms.length) {
      const fallback = fallbackForms[fallbackIdx];
      if (!options.includes(fallback)) {
        options.push(fallback);
      }
      fallbackIdx++;
    }

    // Shuffle the 4 options
    return options.sort(() => 0.5 - Math.random());
  }, [sessionDeck, currentCardIndex]);

  return (
    <div className="w-full flex flex-col bg-white dark:bg-slate-900 rounded-[16px] border border-neutral-200 dark:border-slate-800 shadow-sm overflow-hidden select-none">
      
      {/* App Action Bar Header */}
      <div className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-neutral-200 dark:border-slate-850 flex flex-col md:flex-row justify-between items-center gap-4 z-30 select-none transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[6px] bg-[#0F172A] dark:bg-indigo-650 flex items-center justify-center text-white text-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-[#EEF2FF]" />
          </div>
          <span className="font-serif italic font-bold text-base tracking-tight text-[#0F172A] dark:text-slate-100">PronounPocket</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-neutral-100 dark:bg-slate-950 p-1 rounded-full gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('study')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentPhoneTab === 'study' ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-xs' : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-250'}`}
          >
            Study
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('learn')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentPhoneTab === 'learn' ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-xs' : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-250'}`}
          >
            Learn
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentPhoneTab === 'library' ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-xs' : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-250'}`}
          >
            Library
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-[#4338CA] dark:text-indigo-300 px-2.5 py-1 rounded-[6px] border border-indigo-100 dark:border-indigo-900/40">
            🔥 {streak} Streak
          </span>
          <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-[6px] border border-emerald-200 dark:border-emerald-900/50">
            🏆 {masteredCount}/{pronounSets.length} Mastered
          </span>
        </div>
      </div>

      {/* Screen Main Viewport */}
      <div className="flex-1 p-6 flex flex-col gap-6 relative bg-[#FDFBF7] dark:bg-slate-950 transition-colors duration-150">
          
          {/* Tab: STUDY inside phone */}
          {currentPhoneTab === 'study' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-200 text-[#0F172A] dark:text-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400">Study Practice</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-[4px] text-neutral-500 dark:text-slate-400">
                  Card {sessionDeck.length > 0 ? currentCardIndex + 1 : 0}/{sessionDeck.length}
                </span>
              </div>

              {/* Learning Mode Selection Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-100 dark:bg-slate-900/50 p-1.5 rounded-[10px] border border-neutral-200/40 dark:border-slate-800/40 gap-2 mb-1">
                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400 pl-1.5">Learning Mode:</span>
                </div>
                <div className="flex gap-1 bg-white/50 dark:bg-slate-950/40 p-0.5 rounded-[8px] border border-neutral-200/20 dark:border-slate-800/20 w-full sm:w-auto flex-wrap">
                  <button
                    type="button"
                    onClick={() => setStudyMode('flashcard')}
                    className={`flex-1 sm:flex-none px-2.5 py-1 rounded-[6px] text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center whitespace-nowrap ${studyMode === 'flashcard' ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-2xs' : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'}`}
                  >
                    📇 Flashcard
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudyMode('multiple-choice')}
                    className={`flex-1 sm:flex-none px-2.5 py-1 rounded-[6px] text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center whitespace-nowrap ${studyMode === 'multiple-choice' ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-2xs' : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'}`}
                  >
                    🎯 Multiple Choice
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudyMode('contextual-mc')}
                    className={`flex-1 sm:flex-none px-2.5 py-1 rounded-[6px] text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center whitespace-nowrap ${studyMode === 'contextual-mc' ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-2xs' : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'}`}
                  >
                    📝 Contextual MCQ
                  </button>
                </div>
              </div>

              {/* Practice Focus Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-100 dark:bg-slate-900/50 p-1.5 rounded-[10px] border border-neutral-200/40 dark:border-slate-800/40 gap-2 mb-1">
                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400 pl-1.5 flex items-center gap-1">
                    <Users className="w-3 h-3 text-neutral-500" /> Focus Practice:
                  </span>
                </div>
                <div className="flex gap-1 bg-white/50 dark:bg-slate-950/40 p-0.5 rounded-[8px] border border-neutral-200/20 dark:border-slate-800/20 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSetPracticeFocus('all')}
                    className={`flex-1 sm:flex-none px-3 py-1 rounded-[6px] text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${practiceFocus === 'all' ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-2xs' : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'}`}
                  >
                    🌎 All Library
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPracticeFocus('people')}
                    className={`flex-1 sm:flex-none px-3 py-1 rounded-[6px] text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${practiceFocus === 'people' ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-2xs' : 'text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'}`}
                  >
                    👥 Saved People ({people.length})
                  </button>
                </div>
              </div>

              {sessionDeck.length > 0 ? (
                studyMode === 'flashcard' ? (
                  <div className="flex flex-col gap-3">
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="w-full h-72 cursor-pointer select-none [perspective:1000px]"
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                        
                        {/* FRONT */}
                        <div className="absolute inset-0 w-full h-full rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm [backface-visibility:hidden]">
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#0F172A] dark:text-indigo-300 bg-[#EEF2FF] dark:bg-indigo-950/60 border border-[#EEF2FF]/40 dark:border-indigo-900/40 px-2 py-0.5 rounded-[4px]">
                              {sessionDeck[currentCardIndex].sentence.type.toUpperCase()}
                            </span>
                            <span className="text-[8px] text-neutral-400 dark:text-slate-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                              <RotateCw className="w-2.5 h-2.5" /> Tap to flip
                            </span>
                          </div>

                          <div className="text-center my-3">
                            <div className="text-base font-light text-[#0F172A] dark:text-slate-200 leading-relaxed font-serif italic">
                              {formatSentence(sessionDeck[currentCardIndex].sentence, sessionDeck[currentCardIndex].set, false, sessionDeck[currentCardIndex].personName)}
                            </div>
                          </div>

                          <div className="bg-[#FDFBF7] dark:bg-slate-950/40 rounded-[8px] p-2 text-center border border-neutral-200/60 dark:border-slate-800/80">
                            {sessionDeck[currentCardIndex].set.associatedNames ? (
                              <div className="flex flex-col">
                                <span className="text-[8px] uppercase tracking-widest text-[#4338CA] dark:text-indigo-400 font-bold block mb-0.5">PRACTICING FOR:</span>
                                <span className="text-xs font-bold text-[#4338CA] dark:text-indigo-300 capitalize">
                                  {sessionDeck[currentCardIndex].set.associatedNames}
                                </span>
                                <span className="text-[7.5px] text-neutral-400 dark:text-slate-500 mt-1 uppercase font-mono font-bold tracking-tight">
                                  ({sessionDeck[currentCardIndex].set.subject} / {sessionDeck[currentCardIndex].set.object} / {sessionDeck[currentCardIndex].set.possessiveDet})
                                </span>
                              </div>
                            ) : (
                              <>
                                <span className="text-[8px] uppercase tracking-widest text-neutral-400 dark:text-slate-500 font-bold block mb-0.5">TARGET PRONOUN SET:</span>
                                <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 capitalize">
                                  {sessionDeck[currentCardIndex].set.subject} / {sessionDeck[currentCardIndex].set.object} / {sessionDeck[currentCardIndex].set.possessiveDet}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* BACK */}
                        <div className="absolute inset-0 w-full h-full rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#0F172A] dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/40 px-2 py-0.5 rounded-[4px]">
                              REVEALED
                            </span>
                            <span className="text-[8px] text-neutral-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Correct Form</span>
                          </div>

                          <div className="text-center my-3 text-base font-light text-[#0F172A] dark:text-slate-200 leading-relaxed">
                            {formatSentence(sessionDeck[currentCardIndex].sentence, sessionDeck[currentCardIndex].set, true, sessionDeck[currentCardIndex].personName)}
                          </div>

                          {/* Mini forms checklist inside card back */}
                          <div className="grid grid-cols-5 gap-0.5 text-[8px] font-mono text-center bg-[#FDFBF7] dark:bg-slate-950/40 p-1.5 rounded-[6px] border border-neutral-200 dark:border-slate-800">
                            <div className={sessionDeck[currentCardIndex].sentence.type === 'subject' ? 'font-bold text-[#0F172A] dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-950/80 rounded-xs' : 'text-neutral-400 dark:text-slate-500'}>
                              <span>{sessionDeck[currentCardIndex].set.subject}</span>
                            </div>
                            <div className={sessionDeck[currentCardIndex].sentence.type === 'object' ? 'font-bold text-[#0F172A] dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-950/80 rounded-xs' : 'text-neutral-400 dark:text-slate-500'}>
                              <span>{sessionDeck[currentCardIndex].set.object}</span>
                            </div>
                            <div className={sessionDeck[currentCardIndex].sentence.type === 'possessiveDet' ? 'font-bold text-[#0F172A] dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-950/80 rounded-xs' : 'text-neutral-400 dark:text-slate-500'}>
                              <span>{sessionDeck[currentCardIndex].set.possessiveDet}</span>
                            </div>
                            <div className={sessionDeck[currentCardIndex].sentence.type === 'possessivePro' ? 'font-bold text-[#0F172A] dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-950/80 rounded-xs' : 'text-neutral-400 dark:text-slate-500'}>
                              <span>{sessionDeck[currentCardIndex].set.possessivePro}</span>
                            </div>
                            <div className={sessionDeck[currentCardIndex].sentence.type === 'reflexive' ? 'font-bold text-[#0F172A] dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-950/80 rounded-xs' : 'text-neutral-400 dark:text-slate-500'}>
                              <span>{sessionDeck[currentCardIndex].set.reflexive}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Controls inside phone */}
                    <div className="mt-1">
                      {!isFlipped ? (
                        <button
                          type="button"
                          onClick={() => setIsFlipped(true)}
                          className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-[8px] bg-[#0F172A] dark:bg-indigo-600 hover:bg-neutral-800 dark:hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider transition-all select-none active:scale-95 cursor-pointer shadow-sm"
                          style={{ minHeight: '44px' }}
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-indigo-300 animate-spin-slow" />
                          Check Answer
                        </button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleCardRating(false)}
                            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-[8px] border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 hover:bg-red-100/80 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 font-bold text-[10px] uppercase tracking-wider transition-all select-none active:scale-95 cursor-pointer"
                            style={{ minHeight: '44px' }}
                          >
                            <X className="w-3.5 h-3.5 text-red-500" />
                            Got It Wrong
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCardRating(true)}
                            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-[8px] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider transition-all select-none active:scale-95 cursor-pointer"
                            style={{ minHeight: '44px' }}
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Got It Right
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* Card Display */}
                    <div className="w-full rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-sm min-h-[16rem]">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#0F172A] dark:text-indigo-300 bg-[#EEF2FF] dark:bg-indigo-950/60 border border-[#EEF2FF]/40 dark:border-indigo-900/40 px-2 py-0.5 rounded-[4px]">
                          {sessionDeck[currentCardIndex].sentence.type.toUpperCase()}
                        </span>
                        <span className="text-[8px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          🎯 Multiple Choice
                        </span>
                      </div>

                      <div className="text-center my-6">
                        <div className="text-base font-light text-[#0F172A] dark:text-slate-200 leading-relaxed font-serif italic">
                          {formatSentence(sessionDeck[currentCardIndex].sentence, sessionDeck[currentCardIndex].set, isAnswerChecked, sessionDeck[currentCardIndex].personName)}
                        </div>
                      </div>

                      <div className="bg-[#FDFBF7] dark:bg-slate-950/40 rounded-[8px] p-2 text-center border border-neutral-200/60 dark:border-slate-800/80">
                        {sessionDeck[currentCardIndex].set.associatedNames ? (
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-widest text-[#4338CA] dark:text-indigo-400 font-bold block mb-0.5">PRACTICING FOR:</span>
                            <span className="text-xs font-bold text-[#4338CA] dark:text-indigo-300 capitalize">
                              {sessionDeck[currentCardIndex].set.associatedNames}
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className="text-[8px] uppercase tracking-widest text-neutral-400 dark:text-slate-500 font-bold block mb-0.5">TARGET PRONOUN SET:</span>
                            <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 capitalize">
                              {sessionDeck[currentCardIndex].set.subject} / {sessionDeck[currentCardIndex].set.object}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Feedback Message */}
                    <div className="text-center min-h-[1.5rem] flex items-center justify-center">
                      {!isAnswerChecked ? (
                        <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-medium uppercase tracking-wider animate-pulse">
                          Select the correct pronoun to complete the sentence
                        </span>
                      ) : (
                        (() => {
                          const correctVal = getCorrectPronounValue(sessionDeck[currentCardIndex].set, sessionDeck[currentCardIndex].sentence.type);
                          const isCorrect = selectedOption?.toLowerCase() === correctVal.toLowerCase();
                          return (
                            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in duration-150 ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isCorrect ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Perfect! You selected the correct form</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5" />
                                  <span>Incorrect. The correct form is "{correctVal}"</span>
                                </>
                              )}
                            </span>
                          );
                        })()
                      )}
                    </div>

                    {/* Multiple Choice Option Buttons */}
                    <div className="grid grid-cols-1 gap-2">
                      {multipleChoiceOptions.map((option, idx) => {
                        const correctVal = getCorrectPronounValue(sessionDeck[currentCardIndex].set, sessionDeck[currentCardIndex].sentence.type);
                        const isOptionCorrect = option.toLowerCase() === correctVal.toLowerCase();
                        const isOptionSelected = selectedOption?.toLowerCase() === option.toLowerCase();
                        
                        let btnClass = "";
                        let letterBadgeClass = "";
                        let iconToRender = null;

                        const letters = ['A', 'B', 'C', 'D'];

                        if (!isAnswerChecked) {
                          // Unchecked/active state
                          btnClass = "w-full flex items-center justify-between p-3 rounded-[10px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-850 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10 text-neutral-800 dark:text-slate-200 transition-all cursor-pointer font-sans text-xs font-semibold shadow-2xs";
                          letterBadgeClass = "w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-slate-400 rounded-[4px] border border-neutral-200/60 dark:border-slate-700/60 transition-colors";
                        } else {
                          // Checked state
                          if (isOptionCorrect) {
                            // Correct answer highlighted green
                            btnClass = "w-full flex items-center justify-between p-3 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500 dark:border-emerald-500/80 text-emerald-900 dark:text-emerald-300 transition-all font-sans text-xs font-bold shadow-2xs";
                            letterBadgeClass = "w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 rounded-[4px] border border-emerald-200 dark:border-emerald-800/40";
                            iconToRender = <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
                          } else if (isOptionSelected) {
                            // Incorrect chosen answer highlighted red
                            btnClass = "w-full flex items-center justify-between p-3 rounded-[10px] bg-red-50 dark:bg-red-950/20 border-2 border-red-500 dark:border-red-500/80 text-red-900 dark:text-red-300 transition-all font-sans text-xs font-bold shadow-2xs";
                            letterBadgeClass = "w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-400 rounded-[4px] border border-red-200 dark:border-red-800/40";
                            iconToRender = <X className="w-4 h-4 text-red-600 dark:text-red-400" />;
                          } else {
                            // Other answers muted
                            btnClass = "w-full flex items-center justify-between p-3 rounded-[10px] bg-white/40 dark:bg-slate-900/40 border border-neutral-200/50 dark:border-slate-800/50 text-neutral-400 dark:text-slate-500 transition-all font-sans text-xs font-medium opacity-50 cursor-not-allowed";
                            letterBadgeClass = "w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold bg-neutral-100/60 dark:bg-slate-800/60 text-neutral-400 dark:text-slate-500 rounded-[4px] border border-neutral-200/40 dark:border-slate-700/40";
                          }
                        }

                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={isAnswerChecked}
                            onClick={() => handleMultipleChoiceSelect(option)}
                            className={btnClass}
                            style={{ minHeight: '44px' }}
                          >
                            <div className="flex items-center gap-3 text-left">
                              <span className={letterBadgeClass}>
                                {letters[idx]}
                              </span>
                              <span className={studyMode === 'contextual-mc' ? "text-[11px] text-left leading-normal font-sans" : "capitalize font-sans text-left"}>
                                {studyMode === 'contextual-mc'
                                  ? getContextualMCQOptionText(
                                      sessionDeck[currentCardIndex].sentence,
                                      sessionDeck[currentCardIndex].set,
                                      option,
                                      sessionDeck[currentCardIndex].personName
                                    )
                                  : option
                                }
                              </span>
                            </div>
                            {iconToRender}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button when checked */}
                    <div className="mt-1 min-h-[44px]">
                      {isAnswerChecked && (
                        <button
                          type="button"
                          onClick={handleMultipleChoiceNext}
                          className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-[8px] bg-[#0F172A] hover:bg-neutral-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider transition-all select-none active:scale-95 cursor-pointer shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
                          style={{ minHeight: '44px' }}
                        >
                          <span>{currentCardIndex < sessionDeck.length - 1 ? 'Next Card' : 'Finish Practice Session'}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              ) : practiceFocus === 'people' ? (
                <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-[12px] border border-neutral-200 dark:border-slate-800 px-5 flex flex-col items-center animate-in fade-in duration-200">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-[#4338CA] dark:text-indigo-400 mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 mb-1 font-serif italic">No Saved People Found</h3>
                  <p className="text-[10.5px] text-neutral-400 dark:text-slate-400 mb-4 font-light leading-relaxed">
                    You don't have any people saved with associated pronouns yet! Go to the Library tab, toggle to the "Saved People" section, and add a saved person with their associated pronouns to practice them.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab('library');
                      setTimeout(() => {
                        const tabTrigger = document.getElementById('people-tab-trigger');
                        if (tabTrigger) tabTrigger.click();
                      }, 50);
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[8px] uppercase text-[9.5px] tracking-widest font-bold transition cursor-pointer shadow-xs font-sans"
                  >
                    Go to Library
                  </button>
                </div>
              ) : pronounSets.length > 0 ? (
                <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-[12px] border border-neutral-200 dark:border-slate-800 px-5 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 mb-1 font-serif italic">All Pronoun Sets Disabled</h3>
                  <p className="text-[10.5px] text-neutral-400 dark:text-slate-400 mb-4 font-light leading-relaxed">
                    You have pronoun sets in your library, but they are all deactivated. Activate them to start your study practice session!
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    <button 
                      onClick={() => handleToggleAll(true)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[8px] uppercase text-[9.5px] tracking-widest font-bold transition cursor-pointer shadow-xs"
                    >
                      Activate All Sets
                    </button>
                    <button 
                      onClick={() => setActiveTab('library')}
                      className="w-full py-2 bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-800 border border-neutral-200 dark:border-slate-800 text-neutral-700 dark:text-slate-300 rounded-[8px] uppercase text-[9px] tracking-wider font-bold transition cursor-pointer"
                    >
                      Manage Library
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-[12px] border border-neutral-200 dark:border-slate-800 px-4">
                  <p className="text-[11px] text-neutral-400 dark:text-slate-400 mb-3 font-light">No pronouns currently saved in database. Tap below to re-seed or add!</p>
                  <button 
                    onClick={() => setActiveTab('library')}
                    className="px-4 py-2 bg-[#0F172A] dark:bg-indigo-600 hover:bg-neutral-800 dark:hover:bg-indigo-700 text-white rounded-[6px] uppercase text-[9px] tracking-wider font-bold transition cursor-pointer"
                  >
                    Configure Library
                  </button>
                </div>
              )}

              {/* Spaced Repetition Info */}
              <div className="p-3 rounded-[12px] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-[10.5px] transition-colors">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-[8px] block mb-0.5">Spaced Repetition Tip</span>
                <p className="text-indigo-800 dark:text-indigo-450 leading-relaxed font-light">
                  Our local SQLite database assigns a mastery factor. Getting the pronoun correct 3 times in different syntactic frames tags it as <span className="font-serif italic text-[#0F172A] dark:text-slate-200">Mastered</span>!
                </p>
              </div>
            </div>
          )}

          {/* Tab: LEARN inside phone */}
          {currentPhoneTab === 'learn' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200 text-[#0F172A] dark:text-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-slate-400">Grammar Guide</span>
                <p className="text-xs text-neutral-500 dark:text-slate-400 font-light leading-relaxed mt-1">
                  Neopronouns plug seamlessly into standard English verbs exactly like traditional pronouns. Here are the five forms:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="font-serif italic font-bold text-sm text-[#0F172A] dark:text-slate-100 block">1. Subject (Nominative)</span>
                  <p className="text-xs text-neutral-400 dark:text-slate-400 mt-1 font-light">Used as the subject of the clause.</p>
                  <code className="text-[11px] block mt-2 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2.5 py-1.5 rounded-[6px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "<strong>Subject</strong> likes to read."
                  </code>
                </div>

                <div className="p-4 rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="font-serif italic font-bold text-sm text-[#0F172A] dark:text-slate-100 block">2. Object (Accusative)</span>
                  <p className="text-xs text-neutral-400 dark:text-slate-400 mt-1 font-light">The receiver of action in the clause.</p>
                  <code className="text-[11px] block mt-2 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2.5 py-1.5 rounded-[6px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "I went with <strong>Object</strong>."
                  </code>
                </div>

                <div className="p-4 rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="font-serif italic font-bold text-sm text-[#0F172A] dark:text-slate-100 block">3. Possessive Determiner</span>
                  <p className="text-xs text-neutral-400 dark:text-slate-400 mt-1 font-light">Modifies noun to indicate ownership.</p>
                  <code className="text-[11px] block mt-2 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2.5 py-1.5 rounded-[6px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "This is <strong>Poss. Det.</strong> book."
                  </code>
                </div>

                <div className="p-4 rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="font-serif italic font-bold text-sm text-[#0F172A] dark:text-slate-100 block">4. Possessive Pronoun</span>
                  <p className="text-xs text-neutral-400 dark:text-slate-400 mt-1 font-light">Stands alone to show ownership.</p>
                  <code className="text-[11px] block mt-2 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2.5 py-1.5 rounded-[6px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "That opinion is <strong>Poss. Pro.</strong>."
                  </code>
                </div>

                <div className="p-4 rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 shadow-2xs col-span-1 md:col-span-2 lg:col-span-1">
                  <span className="font-serif italic font-bold text-sm text-[#0F172A] dark:text-slate-100 block">5. Reflexive Form</span>
                  <p className="text-xs text-neutral-400 dark:text-slate-400 mt-1 font-light">Refers back to subject clause.</p>
                  <code className="text-[11px] block mt-2 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2.5 py-1.5 rounded-[6px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "Ze made coffee for <strong>Reflexive</strong>."
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Tab: LIBRARY inside phone */}
          {currentPhoneTab === 'library' && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200 text-[#0F172A] dark:text-slate-100">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200/60 dark:border-slate-850 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-slate-400 font-sans">Pronoun Database</span>
                    <span className="text-[9px] uppercase font-mono text-neutral-400 dark:text-slate-500 px-1.5 py-0.5 bg-neutral-100 dark:bg-slate-900 rounded border border-neutral-200/50 dark:border-slate-800/50">sqlite_local.db</span>
                  </div>
                  <h3 className="text-xl font-light font-serif italic text-[#0F172A] dark:text-slate-100 mt-1">
                    {librarySubTab === 'pronouns' ? 'Pronoun Library' : 'Saved People Library'}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 font-light mt-0.5">
                    {librarySubTab === 'pronouns' 
                      ? 'Configure active sets for practice or add your own custom entries.' 
                      : 'Manage people profiles and configure custom pronoun set assignments.'}
                  </p>
                </div>

                {librarySubTab === 'pronouns' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setNewSubject('');
                      setNewObject('');
                      setNewPossessiveDet('');
                      setNewPossessivePro('');
                      setNewReflexive('');
                      setNewNotes('');
                      setNewAssociatedNames('');
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#0F172A] dark:bg-indigo-600 hover:bg-neutral-800 dark:hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    Add Custom Set
                  </button>
                ) : (
                  <button
                    type="button"
                    id="add-person-btn"
                    onClick={() => {
                      setEditingPerson(null);
                      setPersonName('');
                      setPersonPronounIds([]);
                      setIsPersonModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#0F172A] dark:bg-indigo-600 hover:bg-neutral-800 dark:hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    Add Saved Person
                  </button>
                )}
              </div>

              {/* Library Sub-Tabs Selector */}
              <div className="flex border-b border-neutral-200 dark:border-slate-850 gap-4 mb-1">
                <button
                  type="button"
                  onClick={() => setLibrarySubTab('pronouns')}
                  className={`pb-2.5 px-1 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                    librarySubTab === 'pronouns'
                      ? 'text-[#0F172A] dark:text-slate-100 border-b-2 border-indigo-500'
                      : 'text-neutral-400 hover:text-neutral-600 dark:text-slate-500 dark:hover:text-slate-350'
                  }`}
                >
                  Pronoun Sets ({pronounSets.length})
                </button>
                <button
                  type="button"
                  id="people-tab-trigger"
                  onClick={() => setLibrarySubTab('people')}
                  className={`pb-2.5 px-1 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                    librarySubTab === 'people'
                      ? 'text-[#0F172A] dark:text-slate-100 border-b-2 border-indigo-500'
                      : 'text-neutral-400 hover:text-neutral-600 dark:text-slate-500 dark:hover:text-slate-350'
                  }`}
                >
                  Saved People ({people.length})
                </button>
              </div>

              {/* Quick Bulk Activation Controls */}
              <div className="bg-indigo-50/60 dark:bg-indigo-950/20 rounded-[12px] p-4 border border-indigo-100/80 dark:border-indigo-900/30 flex flex-col sm:flex-row justify-between items-center gap-3 transition-colors">
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  {pronounSets.filter(s => s.isEnabled !== false).length} of {pronounSets.length} sets active for study rotation
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleToggleAll(true)}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 rounded-[6px] transition-all cursor-pointer shadow-2xs text-center font-sans"
                  >
                    Activate All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAll(false)}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-850 border border-neutral-200 dark:border-slate-850 rounded-[6px] transition-all cursor-pointer shadow-2xs text-center font-sans"
                  >
                    Deactivate All
                  </button>
                </div>
              </div>

              {/* Backup & Restore Settings Panel */}
              <div className="bg-neutral-50 dark:bg-slate-900/40 rounded-[12px] p-4 border border-neutral-200 dark:border-slate-850 flex flex-col gap-4 transition-colors text-left">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4338CA] dark:text-indigo-400 font-mono">
                    Backup, Sync & Share
                  </span>
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-slate-200">
                    Configuration Portability
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-slate-400 font-light leading-relaxed">
                    Generate a prepopulated link loaded with your custom pronouns and names to share with others, or export/import raw JSON database files.
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-950 border border-neutral-200/80 dark:border-slate-850/80 rounded-[8px] flex flex-col gap-2.5">
                  <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                    GitHub Pages Share Link
                  </span>
                  <p className="text-[10px] text-neutral-500 dark:text-slate-400 leading-normal font-light">
                    Generate a link containing your current <span className="font-semibold text-neutral-700 dark:text-slate-300">{pronounSets.length} pronoun sets</span> and <span className="font-semibold text-neutral-700 dark:text-slate-300">{people.length} profiles</span>. When users click the link, your custom configuration will automatically load on their device.
                  </p>

                  {/* GitHub Pages base URL config */}
                  <div className="flex flex-col gap-1 mt-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-slate-500">
                      GitHub Pages Host URL
                    </label>
                    {window.location.hostname.endsWith('github.io') ? (
                      <div className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] rounded-[6px] font-mono font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live: {window.location.origin + window.location.pathname}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <input
                          type="url"
                          value={githubPagesUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGithubPagesUrl(val);
                            localStorage.setItem('pronoun_pocket_github_pages_url', val);
                          }}
                          placeholder="https://icynewyear.github.io/Pocket-pronouns/"
                          className="w-full px-2.5 py-1.5 text-[11px] bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-[6px] text-neutral-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                        <p className="text-[9px] text-neutral-400 dark:text-slate-500 leading-relaxed font-light">
                          Configure your deployment address so that shared links generated here in AI Studio will point users to your live GitHub Pages site.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateShareLink}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-[6px] transition-all cursor-pointer shadow-2xs font-sans w-full ${
                      copiedShareLink 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#0F172A] hover:bg-neutral-800 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {copiedShareLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Shareable Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3.5 h-3.5 text-indigo-200" />
                        <span>Generate & Copy Share Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                  {/* Export Button */}
                  <button
                    type="button"
                    onClick={handleExportSettings}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-800 border border-neutral-200 dark:border-slate-800 rounded-[6px] transition-all cursor-pointer shadow-2xs font-sans"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-slate-400" />
                    <span>Export JSON Backup</span>
                  </button>

                  {/* Import Button */}
                  <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-[6px] transition-all cursor-pointer shadow-2xs font-sans">
                    <Upload className="w-3.5 h-3.5 text-indigo-100" />
                    <span>Import JSON Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result;
                            if (typeof result === 'string') {
                              handleImportSettings(result);
                            }
                          };
                          reader.readAsText(file);
                        }
                        // Reset file input value so same file can be selected again
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {librarySubTab === 'pronouns' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left side: Pronoun Sets Grid (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pronounSets.map(set => (
                      <div 
                        key={set.id}
                        onClick={() => setSelectedDetailsSet(set)}
                        className={`p-4 rounded-[12px] border transition-all text-left cursor-pointer ${set.isEnabled === false ? 'opacity-65 bg-neutral-50/50 dark:bg-slate-900/40' : 'bg-white dark:bg-slate-900'} ${selectedDetailsSet?.id === set.id ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 dark:ring-indigo-500/30 shadow-xs' : 'border-neutral-200 dark:border-slate-850 hover:border-neutral-300 dark:hover:border-slate-750'}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-serif font-bold capitalize italic text-[#0F172A] dark:text-slate-100">
                            {set.subject} / {set.object}
                          </span>
                          <div className="flex gap-1.5 items-center">
                            {/* Toggle active switch */}
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleEnable(set.id);
                              }}
                              className="flex items-center gap-1.5 cursor-pointer group"
                              title={set.isEnabled !== false ? 'Deactivate set' : 'Activate set'}
                            >
                              <span className={`text-[7.5px] font-bold uppercase tracking-wider ${set.isEnabled !== false ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-400 dark:text-slate-500'}`}>
                                {set.isEnabled !== false ? 'Active' : 'Disabled'}
                              </span>
                              <div className={`w-6.5 h-3.5 rounded-full p-0.5 transition-colors duration-200 ${set.isEnabled !== false ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-slate-700'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full bg-white shadow-xs transition-transform duration-200 ${set.isEnabled !== false ? 'translate-x-3' : 'translate-x-0'}`} />
                              </div>
                            </div>

                            {set.isMastered ? (
                              <span className="text-[7.5px] uppercase font-bold tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-[4px] border border-emerald-200 dark:border-emerald-900/40">
                                Mastered
                              </span>
                            ) : (
                              <span className="text-[7.5px] uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-[4px] border border-indigo-100 dark:border-indigo-900/40">
                                {Math.round((Object.values(set.correctAttempts || {}).reduce((a, b) => a + b, 0) / 15) * 100)}%
                              </span>
                            )}
                            {set.isCustom && (
                              <span className="text-[7.5px] uppercase font-bold tracking-wider bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-[4px] border border-amber-200 dark:border-amber-900/40">
                                User
                              </span>
                            )}
                          </div>
                        </div>

                        {set.associatedNames && (
                          <div className="mt-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
                            For: <strong className="font-semibold">{set.associatedNames}</strong>
                          </div>
                        )}

                        <div className="flex gap-1 flex-wrap text-[9px] font-mono text-neutral-500 dark:text-slate-400 mt-2">
                          <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-slate-800">{set.subject}</span>
                          <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-slate-800">{set.object}</span>
                          <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-slate-800">{set.possessiveDet}</span>
                          <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-slate-800">{set.possessivePro}</span>
                          <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-slate-800">{set.reflexive}</span>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-neutral-100 dark:border-slate-800 text-[10px]">
                          <span className="text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-slate-500 font-bold">
                            Reviews: {set.reviewCount}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(set);
                              }}
                              className="px-2 py-0.5 border border-neutral-200 dark:border-slate-800 rounded-[4px] font-bold uppercase tracking-wider text-[8.5px] text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 hover:bg-neutral-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              Edit / Add Name
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSet(set.id, e)}
                              className="p-0.5 text-neutral-400 dark:text-slate-500 hover:text-red-600 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side: Detailed Inspector (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {selectedDetailsSet ? (
                    <div className="p-5 rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-850 shadow-xs animate-in fade-in duration-200 lg:sticky lg:top-24 text-left">
                      <span className="text-[8.5px] font-bold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-[4px] border border-indigo-100/50 dark:border-indigo-900/40 font-mono">
                        Grammar Inspector
                      </span>
                      <h3 className="text-base font-light text-[#0F172A] dark:text-slate-100 mt-3.5 flex items-center gap-2">
                        Breakdown for <span className="font-serif italic font-normal text-indigo-700 dark:text-indigo-300 capitalize">"{selectedDetailsSet.subject}"</span>
                      </h3>

                      <div className="grid grid-cols-5 gap-1.5 mt-4 font-mono text-center text-[10px]">
                        <div className="p-1.5 rounded-[6px] bg-[#FDFBF7] dark:bg-slate-950 border border-neutral-200/80 dark:border-slate-800">
                          <span className="text-[7px] font-bold text-neutral-400 block uppercase tracking-wider mb-1">Subject</span>
                          <span className="font-serif italic text-neutral-800 dark:text-slate-300 block text-xs">{selectedDetailsSet.subject}</span>
                        </div>
                        <div className="p-1.5 rounded-[6px] bg-[#FDFBF7] dark:bg-slate-950 border border-neutral-200/80 dark:border-slate-800">
                          <span className="text-[7px] font-bold text-neutral-400 block uppercase tracking-wider mb-1">Object</span>
                          <span className="font-serif italic text-neutral-800 dark:text-slate-300 block text-xs">{selectedDetailsSet.object}</span>
                        </div>
                        <div className="p-1.5 rounded-[6px] bg-[#FDFBF7] dark:bg-slate-950 border border-neutral-200/80 dark:border-slate-800">
                          <span className="text-[7px] font-bold text-neutral-400 block uppercase tracking-wider mb-1">Poss Det</span>
                          <span className="font-serif italic text-neutral-800 dark:text-slate-300 block text-xs">{selectedDetailsSet.possessiveDet}</span>
                        </div>
                        <div className="p-1.5 rounded-[6px] bg-[#FDFBF7] dark:bg-slate-950 border border-neutral-200/80 dark:border-slate-800">
                          <span className="text-[7px] font-bold text-neutral-400 block uppercase tracking-wider mb-1">Poss Pro</span>
                          <span className="font-serif italic text-neutral-800 dark:text-slate-300 block text-xs">{selectedDetailsSet.possessivePro}</span>
                        </div>
                        <div className="p-1.5 rounded-[6px] bg-[#FDFBF7] dark:bg-slate-950 border border-neutral-200/80 dark:border-slate-800">
                          <span className="text-[7px] font-bold text-neutral-400 block uppercase tracking-wider mb-1">Reflexive</span>
                          <span className="font-serif italic text-neutral-800 dark:text-slate-300 block text-xs">{selectedDetailsSet.reflexive}</span>
                        </div>
                      </div>

                      {selectedDetailsSet.notes && (
                        <p className="text-xs text-neutral-500 dark:text-slate-400 mt-4 italic font-light pl-3 border-l-2 border-indigo-500">
                          "{selectedDetailsSet.notes}"
                        </p>
                      )}

                      <div className="mt-5 flex flex-col gap-2.5 text-xs">
                        <div className="p-3 bg-[#FDFBF7] dark:bg-slate-950/40 border border-neutral-200 dark:border-slate-800 rounded-[8px]">
                          <span className="font-bold text-[8px] text-neutral-400 dark:text-slate-500 uppercase tracking-wider block mb-1 font-mono">Subject Sentence Example</span>
                          <p className="font-light">{formatSentence({ type: 'subject', template: '___ is going to the library.' }, selectedDetailsSet, true)}</p>
                        </div>
                        <div className="p-3 bg-[#FDFBF7] dark:bg-slate-950/40 border border-neutral-200 dark:border-slate-800 rounded-[8px]">
                          <span className="font-bold text-[8px] text-neutral-400 dark:text-slate-500 uppercase tracking-wider block mb-1 font-mono">Object Sentence Example</span>
                          <p className="font-light">{formatSentence({ type: 'object', template: 'The teacher asked ___ to answer.' }, selectedDetailsSet, true)}</p>
                        </div>
                        <div className="p-3 bg-[#FDFBF7] dark:bg-slate-950/40 border border-neutral-200 dark:border-slate-800 rounded-[8px]">
                          <span className="font-bold text-[8px] text-neutral-400 dark:text-slate-500 uppercase tracking-wider block mb-1 font-mono">Possessive Determiner Example</span>
                          <p className="font-light">{formatSentence({ type: 'possessiveDet', template: 'They borrow ___ notebook.' }, selectedDetailsSet, true)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-[12px] border border-dashed border-neutral-200 dark:border-slate-800 flex flex-col items-center justify-center text-center text-neutral-400 dark:text-slate-500 py-16 sticky top-24">
                      <Layers className="w-10 h-10 text-neutral-300 dark:text-slate-700 mb-3" />
                      <span className="text-xs font-bold uppercase tracking-wider">Select a Pronoun Set</span>
                      <p className="text-xs text-neutral-400 dark:text-slate-600 mt-2 max-w-[220px] font-light leading-relaxed">
                        Click any set in the database to inspect detailed grammar conjugations and syntax context sentences.
                      </p>
                    </div>
                  )}
                </div>

              </div>
              )}

              {/* Saved People Sub-tab View (Many-to-Many Layout) */}
              {librarySubTab === 'people' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left side: Saved People List (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    {people.length === 0 ? (
                      <div className="p-8 rounded-[12px] border border-dashed border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col items-center justify-center text-center text-neutral-400 dark:text-slate-500 py-16">
                        <Users className="w-10 h-10 text-neutral-300 dark:text-slate-700 mb-3 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider">No Saved People Found</span>
                        <p className="text-xs text-neutral-400 dark:text-slate-600 mt-2 max-w-sm font-light leading-relaxed">
                          Create your first saved person using the "Add Saved Person" button above to practice pronouns personalized for your friends, family, or colleagues!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {people.map(person => {
                          const associatedSets = pronounSets.filter(set => person.pronounSetIds.includes(set.id));
                          const isSelected = selectedPersonId === person.id;
                          return (
                            <div
                              key={person.id}
                              onClick={() => setSelectedPersonId(person.id)}
                              className={`p-4 rounded-[12px] border transition-all text-left cursor-pointer bg-white dark:bg-slate-900 ${
                                isSelected
                                  ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 dark:ring-indigo-500/30 shadow-xs'
                                  : 'border-neutral-200 dark:border-slate-850 hover:border-neutral-300 dark:hover:border-slate-750'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-serif italic font-bold text-sm text-[#0F172A] dark:text-slate-100 flex items-center gap-1.5 capitalize">
                                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                                  {person.name}
                                </h4>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingPerson(person);
                                      setPersonName(person.name);
                                      setPersonPronounIds(person.pronounSetIds);
                                      setIsPersonModalOpen(true);
                                    }}
                                    className="px-2 py-0.5 border border-neutral-200 dark:border-slate-800 rounded-[4px] font-bold uppercase tracking-wider text-[8.5px] text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 hover:bg-neutral-50 dark:hover:bg-slate-800 cursor-pointer"
                                    title="Edit Person"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePerson(person.id);
                                    }}
                                    className="p-0.5 text-neutral-400 dark:text-slate-500 hover:text-red-600 cursor-pointer"
                                    title="Delete Person"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-1">
                                {associatedSets.length === 0 ? (
                                  <span className="text-[8px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-100 dark:bg-slate-850 dark:text-slate-500 px-1.5 py-0.5 rounded">
                                    No pronouns assigned
                                  </span>
                                ) : (
                                  associatedSets.map(set => (
                                    <span
                                      key={set.id}
                                      className="text-[8.5px] uppercase font-bold tracking-wide bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-100/50 dark:border-indigo-900/30 font-mono"
                                    >
                                      {set.subject}/{set.object}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Saved Person Detailed Inspector (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    {(() => {
                      const activePerson = people.find(p => p.id === selectedPersonId) || people[0];
                      if (!activePerson) {
                        return (
                          <div className="p-8 rounded-[12px] border border-dashed border-neutral-200 dark:border-slate-800 flex flex-col items-center justify-center text-center text-neutral-400 dark:text-slate-500 py-16 sticky top-24">
                            <Users className="w-10 h-10 text-neutral-300 dark:text-slate-700 mb-3" />
                            <span className="text-xs font-bold uppercase tracking-wider">Select a Person</span>
                            <p className="text-xs text-neutral-400 dark:text-slate-600 mt-2 max-w-[220px] font-light leading-relaxed">
                              Click any person in the list to inspect their custom grammar profiles and personalized context examples.
                            </p>
                          </div>
                        );
                      }

                      const activePersonSets = pronounSets.filter(set => activePerson.pronounSetIds.includes(set.id));

                      return (
                        <div className="p-5 rounded-[12px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-850 shadow-xs animate-in fade-in duration-200 lg:sticky lg:top-24 text-left">
                          <span className="text-[8.5px] font-bold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-[4px] border border-indigo-100/50 dark:border-indigo-900/40 font-mono">
                            Person Profile
                          </span>
                          <h3 className="text-base font-light text-[#0F172A] dark:text-slate-100 mt-3.5 flex items-center gap-2">
                            Interactive profile for <span className="font-serif italic font-normal text-indigo-700 dark:text-indigo-300 capitalize">"{activePerson.name}"</span>
                          </h3>

                          <div className="mt-4 flex flex-col gap-4">
                            <div>
                              <span className="text-[9px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wider font-mono">Pronoun Paradigms Used</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {activePersonSets.length === 0 ? (
                                  <p className="text-xs text-neutral-400 dark:text-slate-500 italic font-light">No associated pronoun sets assigned yet.</p>
                                ) : (
                                  activePersonSets.map(set => (
                                    <div key={set.id} className="px-2 py-1 rounded-[6px] bg-[#FDFBF7] dark:bg-slate-950 border border-neutral-200 dark:border-slate-800 text-[11px] font-mono flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                      <strong>{set.subject}/{set.object}</strong>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>

                            {activePersonSets.length > 0 && (
                              <div className="border-t border-neutral-100 dark:border-slate-850 pt-3">
                                <span className="text-[9px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wider font-mono">Personalized Sentence Examples</span>
                                <div className="mt-2.5 flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                                  {activePersonSets.map(set => (
                                    <div key={set.id} className="p-3 bg-[#FDFBF7] dark:bg-slate-950/40 border border-neutral-200 dark:border-slate-800 rounded-[8px] text-xs">
                                      <span className="text-[8px] uppercase tracking-wider font-bold font-mono text-indigo-700 dark:text-indigo-400 block mb-1">
                                        Using {set.subject}/{set.object}
                                      </span>
                                      <div className="flex flex-col gap-1.5 font-light">
                                        <p>{formatSentence({ type: 'subject', template: '___ is going to the library today.' }, set, true, activePerson.name)}</p>
                                        <p>{formatSentence({ type: 'object', template: 'The teacher asked ___ to answer.' }, set, true, activePerson.name)}</p>
                                        <p>{formatSentence({ type: 'possessiveDet', template: 'This is ___ notebook.' }, set, true, activePerson.name)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Custom Dialog overlay modal - rendered on top of entire layout */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-neutral-950/65 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
            <div className="bg-[#FDFBF7] dark:bg-slate-900 w-full max-w-md rounded-[16px] p-6 shadow-xl border border-neutral-200 dark:border-slate-800 flex flex-col gap-4 max-h-[90%] overflow-y-auto animate-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F172A] dark:text-slate-100 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-500" />
                  {editingSet ? 'Update Pronoun Record' : 'Insert Pronoun Record'}
                </span>
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-200/50 dark:hover:bg-slate-800 text-neutral-400 hover:text-[#0F172A] dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8.5px] uppercase tracking-widest font-bold text-neutral-400 mb-1">1. Subject (Nom)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ze"
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] border border-neutral-200 dark:border-slate-850 focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-950 text-xs text-[#0F172A] dark:text-slate-100 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] uppercase tracking-widest font-bold text-neutral-400 mb-1">2. Object (Acc)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. zir"
                      value={newObject}
                      onChange={e => setNewObject(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] border border-neutral-200 dark:border-slate-850 focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-950 text-xs text-[#0F172A] dark:text-slate-100 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[8.5px] uppercase tracking-widest font-bold text-neutral-400 mb-1">3. Poss Det</label>
                    <input 
                      type="text" 
                      placeholder="e.g. zir"
                      value={newPossessiveDet}
                      onChange={e => setNewPossessiveDet(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] border border-neutral-200 dark:border-slate-850 focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-950 text-xs text-[#0F172A] dark:text-slate-100 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] uppercase tracking-widest font-bold text-neutral-400 mb-1">4. Poss Pro</label>
                    <input 
                      type="text" 
                      placeholder="e.g. zirs"
                      value={newPossessivePro}
                      onChange={e => setNewPossessivePro(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] border border-neutral-200 dark:border-slate-850 focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-950 text-xs text-[#0F172A] dark:text-slate-100 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] uppercase tracking-widest font-bold text-neutral-400 mb-1">5. Reflexive</label>
                    <input 
                      type="text" 
                      placeholder="e.g. zirself"
                      value={newReflexive}
                      onChange={e => setNewReflexive(e.target.value)}
                      className="w-full p-2.5 rounded-[8px] border border-neutral-200 dark:border-slate-850 focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-950 text-xs text-[#0F172A] dark:text-slate-100 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] uppercase tracking-widest font-bold text-neutral-400 mb-1">Usage Notes & Tips</label>
                  <textarea 
                    placeholder="e.g. Pronunciation tips, history or context..."
                    rows={2.5}
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] border border-neutral-200 dark:border-slate-850 focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-950 text-xs text-[#0F172A] dark:text-slate-100 resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] uppercase tracking-widest font-bold text-neutral-400 mb-1 flex justify-between items-center">
                    <span>Associated Name(s)</span>
                    <span className="text-[7.5px] text-indigo-500 dark:text-indigo-400 font-mono normal-case font-bold">Optional</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ash, Taylor"
                    value={newAssociatedNames}
                    onChange={e => setNewAssociatedNames(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] border border-indigo-200/60 dark:border-indigo-900/40 focus:outline-none focus:border-indigo-500 bg-indigo-50/10 dark:bg-slate-950 text-xs text-[#0F172A] dark:text-slate-100 transition-colors"
                  />
                  <p className="text-[8.5px] text-neutral-400 dark:text-slate-500 mt-1 leading-tight font-light">
                    Assigning a name inserts personalized names directly into flashcard practice sentences.
                  </p>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-[8px] border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-700 dark:hover:text-slate-300 hover:bg-neutral-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-[8px] bg-[#0F172A] dark:bg-indigo-650 hover:bg-neutral-800 dark:hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  >
                    {editingSet ? 'Save Changes' : 'Insert Set'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Many-to-Many Person Modal */}
        {isPersonModalOpen && (
          <div className="fixed inset-0 bg-neutral-950/65 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
            <div className="bg-[#FDFBF7] dark:bg-slate-900 w-full max-w-md rounded-[16px] p-6 shadow-xl border border-neutral-200 dark:border-slate-800 flex flex-col gap-4 max-h-[90%] overflow-y-auto animate-in zoom-in-95 duration-200 text-left">
              
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F172A] dark:text-slate-100 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  {editingPerson ? 'Update Person Profile' : 'Insert Person Profile'}
                </span>
                <button 
                  type="button"
                  onClick={() => setIsPersonModalOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-slate-850 text-neutral-400 dark:text-slate-500 hover:text-neutral-700 dark:hover:text-slate-300 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!personName.trim()) {
                    alert("Name is required");
                    return;
                  }
                  if (personPronounIds.length === 0) {
                    alert("Please select at least one pronoun set for this person");
                    return;
                  }
                  handleCreateOrUpdatePerson(editingPerson ? editingPerson.id : null, personName, personPronounIds);
                  setIsPersonModalOpen(false);
                }}
                className="flex flex-col gap-4"
              >
                {/* Person Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400">
                    Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="e.g. Sam, Riley, Ash"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 border border-neutral-200 dark:border-slate-800 rounded-[8px] text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden transition-all placeholder-neutral-400 font-sans"
                  />
                </div>

                {/* Pronoun Sets Checklist / Multiselect */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400">
                    Select Pronoun Sets Used *
                  </label>
                  <p className="text-[10px] text-neutral-400 dark:text-slate-500 font-light leading-relaxed mb-1">
                    Select all pronoun sets that apply to this person. You can choose multiple sets.
                  </p>
                  
                  <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-[8px]">
                    {pronounSets.map(set => {
                      const isChecked = personPronounIds.includes(set.id);
                      return (
                        <label 
                          key={set.id}
                          className="flex items-center gap-2.5 p-1.5 rounded hover:bg-neutral-50 dark:hover:bg-slate-900 cursor-pointer text-xs font-medium"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setPersonPronounIds(personPronounIds.filter(id => id !== set.id));
                              } else {
                                setPersonPronounIds([...personPronounIds, set.id]);
                              }
                            }}
                            className="rounded border-neutral-300 dark:border-slate-700 text-[#0F172A] dark:text-slate-100 focus:ring-indigo-500"
                          />
                          <span className="font-sans text-neutral-800 dark:text-slate-200 capitalize">
                            {set.subject} / {set.object}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-[8px] bg-[#0F172A] dark:bg-indigo-650 hover:bg-neutral-800 dark:hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer font-sans mt-2"
                >
                  {editingPerson ? 'Save Changes' : 'Add Person Profile'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
  );
}
