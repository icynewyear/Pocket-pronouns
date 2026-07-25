import React from 'react';
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
  Wifi
} from 'lucide-react';
import { PronounSet, PracticeSentence } from '../types';

interface PhoneSimulatorProps {
  activeTab: 'study' | 'learn' | 'library' | 'android-specs';
  setActiveTab: (tab: 'study' | 'learn' | 'library') => void;
  streak: number;
  masteredCount: number;
  pronounSets: PronounSet[];
  sessionDeck: { set: PronounSet; sentence: PracticeSentence }[];
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
  formatSentence: (sentence: PracticeSentence, set: PronounSet, reveal: boolean) => React.ReactNode;
  timeString: string;
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
  timeString
}: PhoneSimulatorProps) {
  // Ensure we don't crash if activeTab is 'android-specs' on mount
  const currentPhoneTab = activeTab === 'android-specs' ? 'study' : activeTab;

  return (
    <div className="relative w-full max-w-[340px] h-[700px] bg-neutral-900 rounded-[44px] p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] ring-12 ring-neutral-900 flex flex-col overflow-hidden border border-neutral-700/50 select-none">
      
      {/* Speaker & Camera cutout bezel */}
      <div className="absolute top-0 inset-x-0 h-6 bg-neutral-900 flex justify-center items-center z-50">
        <div className="w-20 h-4.5 bg-neutral-900 rounded-b-xl flex items-center justify-center gap-1.5 pb-0.5">
          <div className="w-2 h-2 bg-neutral-950 rounded-full border border-neutral-800/80 ring-1 ring-neutral-700/40"></div>
          <div className="w-7 h-1 bg-neutral-800 rounded-full"></div>
        </div>
      </div>
      
      {/* Screen Content Wrapper */}
      <div className="relative flex-1 bg-[#FDFBF7] dark:bg-slate-950 rounded-[34px] flex flex-col overflow-hidden border border-neutral-950/10 dark:border-slate-900 transition-colors duration-150">
        
        {/* Phone Status Bar */}
        <div className="h-7 pt-1 px-5 flex justify-between items-center bg-[#FDFBF7] dark:bg-slate-950 border-b border-[#EEF2FF] dark:border-slate-900 text-[10px] font-mono text-neutral-800 dark:text-slate-300 font-bold z-40 select-none transition-colors">
          <span>{timeString}</span>
          <div className="w-14 h-4"></div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono font-medium uppercase tracking-wider text-neutral-500 dark:text-slate-400 mr-1">Google Fi</span>
            <div className="flex gap-0.5 items-end h-2.5">
              <div className="w-[2px] h-[3px] bg-neutral-800 dark:bg-slate-300 rounded-xs"></div>
              <div className="w-[2px] h-[5px] bg-neutral-800 dark:bg-slate-300 rounded-xs"></div>
              <div className="w-[2px] h-[7px] bg-neutral-800 dark:bg-slate-300 rounded-xs"></div>
              <div className="w-[2px] h-[9px] bg-neutral-800 dark:bg-slate-300 rounded-xs"></div>
            </div>
            <Wifi className="w-3 h-3 text-neutral-800 dark:text-slate-300" />
            <div className="flex items-center gap-0.5">
              <Battery className="w-3.5 h-3.5 text-neutral-800 dark:text-slate-300" />
              <span className="text-[8.5px]">98%</span>
            </div>
          </div>
        </div>

        {/* Screen App Action Bar */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-4 py-2.5 border-b border-neutral-200 dark:border-slate-800/80 flex justify-between items-center z-30 select-none transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[4px] bg-[#0F172A] dark:bg-indigo-650 flex items-center justify-center text-white text-[10px] shadow-xs">
              <Sparkles className="w-3 h-3 text-[#EEF2FF]" />
            </div>
            <span className="font-serif italic font-bold text-xs tracking-tight text-[#0F172A] dark:text-slate-100">PronounPocket</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-500">
            <span className="flex items-center gap-0.5 bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#0F172A] dark:text-indigo-300 px-1.5 py-0.5 rounded-[4px] border border-[#EEF2FF]/30 dark:border-indigo-900/40">
              🔥 {streak}
            </span>
            <span className="flex items-center gap-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-[4px] border border-emerald-200 dark:border-emerald-900/50">
              🏆 {masteredCount}/{pronounSets.length}
            </span>
          </div>
        </div>

        {/* Screen Main Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 relative">
          
          {/* Tab: STUDY inside phone */}
          {currentPhoneTab === 'study' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-200 text-[#0F172A] dark:text-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400">Study Practice</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-[4px] text-neutral-500 dark:text-slate-400">
                  Card {sessionDeck.length > 0 ? currentCardIndex + 1 : 0}/{sessionDeck.length}
                </span>
              </div>

              {sessionDeck.length > 0 ? (
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
                            {formatSentence(sessionDeck[currentCardIndex].sentence, sessionDeck[currentCardIndex].set, false)}
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
                          {formatSentence(sessionDeck[currentCardIndex].sentence, sessionDeck[currentCardIndex].set, true)}
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
                          onClick={() => handleCardRating(false)}
                          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-[8px] border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 hover:bg-red-100/80 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 font-bold text-[10px] uppercase tracking-wider transition-all select-none active:scale-95 cursor-pointer"
                          style={{ minHeight: '44px' }}
                        >
                          <X className="w-3.5 h-3.5 text-red-500" />
                          Got It Wrong
                        </button>
                        <button
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
            <div className="flex flex-col gap-3 animate-in fade-in duration-200 text-[#0F172A] dark:text-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400">Grammar Guide</span>
              <p className="text-[10.5px] text-neutral-500 dark:text-slate-400 font-light leading-relaxed">
                Neopronouns plug seamlessly into standard English verbs exactly like traditional pronouns. Here are the five forms:
              </p>

              <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-0.5">
                <div className="p-3 rounded-[8px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800">
                  <span className="font-serif italic font-bold text-xs text-[#0F172A] dark:text-slate-100 block">1. Subject (Nominative)</span>
                  <p className="text-[10px] text-neutral-400 dark:text-slate-400 mt-0.5 font-light">Used as the subject of the clause.</p>
                  <code className="text-[10px] block mt-1.5 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2 py-1 rounded-[4px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "<strong>Subject</strong> likes to read."
                  </code>
                </div>

                <div className="p-3 rounded-[8px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800">
                  <span className="font-serif italic font-bold text-xs text-[#0F172A] dark:text-slate-100 block">2. Object (Accusative)</span>
                  <p className="text-[10px] text-neutral-400 dark:text-slate-400 mt-0.5 font-light">The receiver of action in the clause.</p>
                  <code className="text-[10px] block mt-1.5 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2 py-1 rounded-[4px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "I went with <strong>Object</strong>."
                  </code>
                </div>

                <div className="p-3 rounded-[8px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800">
                  <span className="font-serif italic font-bold text-xs text-[#0F172A] dark:text-slate-100 block">3. Possessive Determiner</span>
                  <p className="text-[10px] text-neutral-400 dark:text-slate-400 mt-0.5 font-light">Modifies noun to indicate ownership.</p>
                  <code className="text-[10px] block mt-1.5 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2 py-1 rounded-[4px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "This is <strong>Poss. Det.</strong> book."
                  </code>
                </div>

                <div className="p-3 rounded-[8px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800">
                  <span className="font-serif italic font-bold text-xs text-[#0F172A] dark:text-slate-100 block">4. Possessive Pronoun</span>
                  <p className="text-[10px] text-neutral-400 dark:text-slate-400 mt-0.5 font-light">Stands alone to show ownership.</p>
                  <code className="text-[10px] block mt-1.5 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2 py-1 rounded-[4px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "That opinion is <strong>Poss. Pro.</strong>."
                  </code>
                </div>

                <div className="p-3 rounded-[8px] bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800">
                  <span className="font-serif italic font-bold text-xs text-[#0F172A] dark:text-slate-100 block">5. Reflexive Form</span>
                  <p className="text-[10px] text-neutral-400 dark:text-slate-400 mt-0.5 font-light">Refers back to subject clause.</p>
                  <code className="text-[10px] block mt-1.5 text-[#0F172A] dark:text-indigo-300 bg-[#FDFBF7] dark:bg-slate-950/60 px-2 py-1 rounded-[4px] border border-neutral-200/50 dark:border-slate-800/50 font-mono">
                    "Ze made coffee for <strong>Reflexive</strong>."
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Tab: LIBRARY inside phone */}
          {currentPhoneTab === 'library' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-200 text-[#0F172A] dark:text-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400 font-sans">Pronoun Database</span>
                <span className="text-[9px] uppercase font-mono text-neutral-400 dark:text-slate-500">sqlite_local.db</span>
              </div>

              {/* Quick Bulk Activation Controls */}
              <div className="bg-indigo-50/60 dark:bg-indigo-950/40 rounded-[12px] p-2.5 border border-indigo-100 dark:border-indigo-900/30 flex flex-col gap-2 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-[9.5px] font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {pronounSets.filter(s => s.isEnabled !== false).length} of {pronounSets.length} sets active for practice
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAll(true)}
                    className="text-[8.5px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/40 py-1.5 rounded-[6px] transition-all cursor-pointer shadow-2xs text-center font-sans"
                  >
                    Activate All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAll(false)}
                    className="text-[8.5px] font-bold uppercase tracking-wider text-neutral-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-850 border border-neutral-200 dark:border-slate-800 py-1.5 rounded-[6px] transition-all cursor-pointer shadow-2xs text-center font-sans"
                  >
                    Deactivate All
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-0.5">
                {pronounSets.map(set => (
                  <div 
                    key={set.id}
                    onClick={() => setSelectedDetailsSet(set)}
                    className={`p-3 rounded-[12px] border transition-all text-left cursor-pointer ${set.isEnabled === false ? 'opacity-65 bg-neutral-50/50 dark:bg-slate-900/40' : 'bg-white dark:bg-slate-900'} ${selectedDetailsSet?.id === set.id ? 'border-[#0F172A] dark:border-indigo-500 ring-1 ring-[#0F172A] dark:ring-indigo-500 shadow-xs' : 'border-neutral-200 dark:border-slate-800 hover:border-neutral-300 dark:hover:border-slate-700'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-serif font-bold capitalize italic text-[#0F172A] dark:text-slate-100">
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
                      <div className="mt-1 text-[9px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
                        For: <strong className="font-semibold">{set.associatedNames}</strong>
                      </div>
                    )}

                    <div className="flex gap-1 flex-wrap text-[8.5px] font-mono text-neutral-500 dark:text-slate-400 mt-1.5">
                      <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1 rounded border border-neutral-200 dark:border-slate-800">{set.subject}</span>
                      <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1 rounded border border-neutral-200 dark:border-slate-800">{set.object}</span>
                      <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1 rounded border border-neutral-200 dark:border-slate-800">{set.possessiveDet}</span>
                      <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1 rounded border border-neutral-200 dark:border-slate-800">{set.possessivePro}</span>
                      <span className="bg-[#FDFBF7] dark:bg-slate-950 px-1 rounded border border-neutral-200 dark:border-slate-800">{set.reflexive}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-neutral-100 dark:border-slate-800 text-[9px]">
                      <span className="text-[8px] uppercase tracking-wider text-neutral-400 dark:text-slate-500 font-bold">
                        Reviews: {set.reviewCount}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(set);
                          }}
                          className="px-2 py-0.5 border border-neutral-200 dark:border-slate-800 rounded-[4px] font-bold uppercase tracking-wider text-[8px] text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 hover:bg-neutral-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDeleteSet(set.id, e)}
                          className="p-0.5 text-neutral-400 dark:text-slate-500 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Action Button (FAB) inside screen */}
              <button
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
                className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-[#0F172A] dark:bg-indigo-650 hover:bg-neutral-800 dark:hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-transform active:scale-95 cursor-pointer z-20 hover:scale-105"
                title="Add Custom Set"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

        </div>

        {/* Sliding Bottom Drawer inside Phone Bezel */}
        {isAddModalOpen && (
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-end justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#FDFBF7] dark:bg-slate-900 w-full rounded-t-[20px] p-4 shadow-xl border-t border-neutral-300 dark:border-slate-800 flex flex-col gap-3 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A] dark:text-slate-100">
                  {editingSet ? 'Room SQL: Edit Set' : 'Room SQL: Insert Set'}
                </span>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-200/50 dark:hover:bg-slate-800 text-neutral-400 hover:text-[#0F172A] dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-3 text-[10px] text-left">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest font-bold text-neutral-400 mb-0.5">1. Subject (Nom)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ze"
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      className="w-full p-2.5 rounded-[6px] border border-neutral-300 focus:outline-none focus:border-[#0F172A] bg-white text-xs text-[#0F172A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest font-bold text-neutral-400 mb-0.5">2. Object (Acc)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. zir"
                      value={newObject}
                      onChange={e => setNewObject(e.target.value)}
                      className="w-full p-2.5 rounded-[6px] border border-neutral-300 focus:outline-none focus:border-[#0F172A] bg-white text-xs text-[#0F172A]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest font-bold text-neutral-400 mb-0.5">3. Poss Det</label>
                    <input 
                      type="text" 
                      placeholder="e.g. zir"
                      value={newPossessiveDet}
                      onChange={e => setNewPossessiveDet(e.target.value)}
                      className="w-full p-2 rounded-[6px] border border-neutral-300 focus:outline-none focus:border-[#0F172A] bg-white text-xs text-[#0F172A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest font-bold text-neutral-400 mb-0.5">4. Poss Pro</label>
                    <input 
                      type="text" 
                      placeholder="e.g. zirs"
                      value={newPossessivePro}
                      onChange={e => setNewPossessivePro(e.target.value)}
                      className="w-full p-2 rounded-[6px] border border-neutral-300 focus:outline-none focus:border-[#0F172A] bg-white text-xs text-[#0F172A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest font-bold text-neutral-400 mb-0.5">5. Reflexive</label>
                    <input 
                      type="text" 
                      placeholder="e.g. zirself"
                      value={newReflexive}
                      onChange={e => setNewReflexive(e.target.value)}
                      className="w-full p-2 rounded-[6px] border border-neutral-300 focus:outline-none focus:border-[#0F172A] bg-white text-xs text-[#0F172A]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] uppercase tracking-widest font-bold text-neutral-400 mb-0.5">Usage Notes / Details</label>
                  <textarea 
                    placeholder="e.g. Pronunciation tips, origins..."
                    rows={2}
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className="w-full p-2.5 rounded-[6px] border border-neutral-300 focus:outline-none focus:border-[#0F172A] bg-white text-xs text-[#0F172A] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[8px] uppercase tracking-widest font-bold text-neutral-400 mb-0.5 flex justify-between items-center">
                    <span>Associated Name(s)</span>
                    <span className="text-[7.5px] text-indigo-500 font-mono normal-case">Optional</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ash, Taylor"
                    value={newAssociatedNames}
                    onChange={e => setNewAssociatedNames(e.target.value)}
                    className="w-full p-2.5 rounded-[6px] border border-indigo-200 focus:outline-none focus:border-[#0F172A] bg-indigo-50/20 text-xs text-[#0F172A]"
                  />
                  <p className="text-[8px] text-neutral-400 mt-0.5 leading-tight font-light">
                    Links specific people to this set for tailored context sentences during practice.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3 py-2 rounded-[6px] border border-neutral-300 bg-white text-[10px] font-bold uppercase tracking-wider text-neutral-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-[6px] bg-[#0F172A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                  >
                    {editingSet ? 'Save' : 'Add Set'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Phone App Bottom Navigation Bar */}
        <div className="h-[52px] bg-white border-t border-neutral-200 grid grid-cols-3 items-center text-center z-40 select-none px-2 shadow-sm">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex flex-col items-center justify-center gap-0.5 h-full transition-all duration-200 cursor-pointer ${currentPhoneTab === 'study' ? 'text-[#0F172A]' : 'text-neutral-400 hover:text-[#0F172A]'}`}
          >
            <div className={`px-4 py-1.5 rounded-full flex items-center justify-center transition-all ${currentPhoneTab === 'study' ? 'bg-indigo-50 text-[#0F172A]' : 'bg-transparent'}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold tracking-tight">Study</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center justify-center gap-0.5 h-full transition-all duration-200 cursor-pointer ${currentPhoneTab === 'learn' ? 'text-[#0F172A]' : 'text-neutral-400 hover:text-[#0F172A]'}`}
          >
            <div className={`px-4 py-1.5 rounded-full flex items-center justify-center transition-all ${currentPhoneTab === 'learn' ? 'bg-indigo-50 text-[#0F172A]' : 'bg-transparent'}`}>
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold tracking-tight">Learn</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center justify-center gap-0.5 h-full transition-all duration-200 cursor-pointer ${currentPhoneTab === 'library' ? 'text-[#0F172A]' : 'text-neutral-400 hover:text-[#0F172A]'}`}
          >
            <div className={`px-4 py-1.5 rounded-full flex items-center justify-center transition-all ${currentPhoneTab === 'library' ? 'bg-indigo-50 text-[#0F172A]' : 'bg-transparent'}`}>
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold tracking-tight">Library</span>
          </button>
        </div>

        {/* Gestures pill */}
        <div className="h-4 bg-white flex items-center justify-center select-none pb-1 shrink-0">
          <div className="w-24 h-1 bg-neutral-400 rounded-full"></div>
        </div>

      </div>

    </div>
  );
}
