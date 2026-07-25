import React from 'react';
import { 
  RotateCw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  Play
} from 'lucide-react';
import { PronounSet, PracticeSentence } from '../types';
import { 
  GRADLE_KTS_CODE, 
  THEME_KOTLIN_CODE, 
  ROOM_DB_CODE, 
  VIEWMODEL_CODE, 
  COMPOSE_UI_CODE 
} from '../kotlin_specs';

interface DevWorkbenchProps {
  consoleTab: 'sqlite-inspector' | 'room-query-logs' | 'kotlin-sources' | 'device-workshop';
  setConsoleTab: (tab: 'sqlite-inspector' | 'room-query-logs' | 'kotlin-sources' | 'device-workshop') => void;
  pronounSets: PronounSet[];
  dbLogs: { id: string; timestamp: string; query: string; type: 'select' | 'insert' | 'update' | 'delete' | 'success' | 'system' }[];
  setDbLogs: (logs: any) => void;
  selectedCodeFile: 'gradle' | 'theme' | 'room' | 'viewmodel' | 'ui';
  setSelectedCodeFile: (file: 'gradle' | 'theme' | 'room' | 'viewmodel' | 'ui') => void;
  copiedCodeKey: string | null;
  handleCopyCode: (code: string, key: string) => void;
  handleDebugResetProgress: () => void;
  handleDebugMasterAll: () => void;
  handleDebugAddFaeSet: () => void;
  handleDebugFactoryReset: () => void;
  selectedDetailsSet: PronounSet | null;
  formatSentence: (sentence: PracticeSentence, set: PronounSet, reveal: boolean) => React.ReactNode;
}

export default function DevWorkbench({
  consoleTab,
  setConsoleTab,
  pronounSets,
  dbLogs,
  setDbLogs,
  selectedCodeFile,
  setSelectedCodeFile,
  copiedCodeKey,
  handleCopyCode,
  handleDebugResetProgress,
  handleDebugMasterAll,
  handleDebugAddFaeSet,
  handleDebugFactoryReset,
  selectedDetailsSet,
  formatSentence
}: DevWorkbenchProps) {
  return (
    <div className="flex flex-col gap-6 w-full text-[#0F172A]">
      
      {/* Detailed Grammar Context View (Selected in Phone Library, Inspected in Workbench) */}
      {selectedDetailsSet && (
        <div className="p-5 rounded-[4px] bg-white border border-neutral-200 shadow-sm animate-in fade-in duration-200">
          <span className="text-[9px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-2 py-1 rounded-[4px] border border-indigo-100">
            Room Inspector: Detailed Conjugations
          </span>
          <h3 className="text-base font-light text-[#0F172A] mt-3 flex items-center gap-2">
            Grammar Breakdown for <span className="font-serif italic font-normal text-[#0F172A] capitalize">"{selectedDetailsSet.subject}"</span>
          </h3>

          <div className="grid grid-cols-5 gap-2 mt-4 font-mono text-center text-[10px]">
            <div className="p-2 rounded-[4px] bg-[#FDFBF7] border border-neutral-200">
              <span className="text-[7.5px] font-bold text-neutral-400 block uppercase tracking-wider mb-0.5">Subject</span>
              <span className="font-serif italic text-neutral-800 block text-xs">{selectedDetailsSet.subject}</span>
            </div>
            <div className="p-2 rounded-[4px] bg-[#FDFBF7] border border-neutral-200">
              <span className="text-[7.5px] font-bold text-neutral-400 block uppercase tracking-wider mb-0.5">Object</span>
              <span className="font-serif italic text-neutral-800 block text-xs">{selectedDetailsSet.object}</span>
            </div>
            <div className="p-2 rounded-[4px] bg-[#FDFBF7] border border-neutral-200">
              <span className="text-[7.5px] font-bold text-neutral-400 block uppercase tracking-wider mb-0.5">Poss Det</span>
              <span className="font-serif italic text-neutral-800 block text-xs">{selectedDetailsSet.possessiveDet}</span>
            </div>
            <div className="p-2 rounded-[4px] bg-[#FDFBF7] border border-neutral-200">
              <span className="text-[7.5px] font-bold text-neutral-400 block uppercase tracking-wider mb-0.5">Poss Pro</span>
              <span className="font-serif italic text-neutral-800 block text-xs">{selectedDetailsSet.possessivePro}</span>
            </div>
            <div className="p-2 rounded-[4px] bg-[#FDFBF7] border border-neutral-200">
              <span className="text-[7.5px] font-bold text-neutral-400 block uppercase tracking-wider mb-0.5">Reflexive</span>
              <span className="font-serif italic text-neutral-800 block text-xs">{selectedDetailsSet.reflexive}</span>
            </div>
          </div>

          {selectedDetailsSet.notes && (
            <p className="text-[11px] text-neutral-500 mt-3 italic font-light pl-2 border-l-2 border-indigo-500">
              "{selectedDetailsSet.notes}"
            </p>
          )}

          {/* Simulated sentence pairings */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-[#FDFBF7] border border-neutral-200 rounded-[4px]">
              <span className="font-bold text-[8px] text-neutral-400 uppercase tracking-wider block mb-0.5 font-mono">Subject Example Clause</span>
              <p className="font-light">"Ze is going to the local library today."</p>
            </div>
            <div className="p-2.5 bg-[#FDFBF7] border border-neutral-200 rounded-[4px]">
              <span className="font-bold text-[8px] text-neutral-400 uppercase tracking-wider block mb-0.5 font-mono">Object Example Clause</span>
              <p className="font-light">"The teacher asked xem to answer the question."</p>
            </div>
          </div>
        </div>
      )}

      {/* Developer Workbench with Multi-Tab Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-[8px] shadow-lg flex flex-col overflow-hidden text-slate-300">
        
        {/* Workbench Header */}
        <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className="text-xs font-mono font-bold text-slate-400 ml-1 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Android_Studio_Terminal_Hub
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Offline SQLite DB Connection: ACTIVE</span>
        </div>

        {/* Workbench Navigation Tabs */}
        <div className="bg-slate-900/60 px-4 flex gap-1 border-b border-slate-800 select-none text-xs font-mono">
          <button 
            onClick={() => setConsoleTab('sqlite-inspector')}
            className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${consoleTab === 'sqlite-inspector' ? 'border-indigo-400 text-white bg-slate-950/40 font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            SQLite Inspector
          </button>
          <button 
            onClick={() => setConsoleTab('room-query-logs')}
            className={`px-3 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${consoleTab === 'room-query-logs' ? 'border-indigo-400 text-white bg-slate-950/40 font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Live Room Logs
            {dbLogs.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] text-indigo-400 font-bold flex items-center justify-center border border-slate-700">
                {dbLogs.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setConsoleTab('kotlin-sources')}
            className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${consoleTab === 'kotlin-sources' ? 'border-indigo-400 text-white bg-slate-950/40 font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Kotlin Source Specs
          </button>
          <button 
            onClick={() => setConsoleTab('device-workshop')}
            className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${consoleTab === 'device-workshop' ? 'border-indigo-400 text-white bg-slate-950/40 font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Device Workshop
          </button>
        </div>

        {/* Workbench Body Content */}
        <div className="p-5 flex-1 min-h-[360px] max-h-[500px] overflow-y-auto">
          
          {/* TAB 1: SQLite Table Inspector */}
          {consoleTab === 'sqlite-inspector' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-400" /> DATABASE TABLE: <strong className="text-slate-200">pronoun_set</strong>
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Storage: LocalRoomSQLite</span>
              </div>

              <div className="border border-slate-850 rounded-[6px] overflow-x-auto bg-slate-950/60">
                <table className="w-full text-[10.5px] font-mono text-left text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <th className="p-2 border-r border-slate-800">id</th>
                      <th className="p-2 border-r border-slate-800">subject</th>
                      <th className="p-2 border-r border-slate-800">object</th>
                      <th className="p-2 border-r border-slate-800">is_enabled</th>
                      <th className="p-2 border-r border-slate-800">associated_names</th>
                      <th className="p-2 border-r border-slate-800">is_mastered</th>
                      <th className="p-2 border-r border-slate-800">reviews</th>
                      <th className="p-2">attempts_matrix (S,O,PD,PP,R)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pronounSets.map(row => (
                      <tr key={row.id} className="border-b border-slate-900/60 hover:bg-slate-900/40 transition">
                        <td className="p-2 border-r border-slate-800 text-slate-500 text-[9px] truncate max-w-[60px]">{row.id}</td>
                        <td className="p-2 border-r border-slate-800 text-indigo-400 font-bold">{row.subject}</td>
                        <td className="p-2 border-r border-slate-800">{row.object}</td>
                        <td className="p-2 border-r border-slate-800 text-center font-bold">
                          {row.isEnabled !== false ? (
                            <span className="text-emerald-400 font-bold">1</span>
                          ) : (
                            <span className="text-red-400">0</span>
                          )}
                        </td>
                        <td className="p-2 border-r border-slate-800 text-slate-400 font-light truncate max-w-[120px]">
                          {row.associatedNames || <span className="text-slate-600 italic">NULL</span>}
                        </td>
                        <td className="p-2 border-r border-slate-800 font-bold">
                          {row.isMastered ? (
                            <span className="text-emerald-400 font-bold">1</span>
                          ) : (
                            <span className="text-slate-500">0</span>
                          )}
                        </td>
                        <td className="p-2 border-r border-slate-800 text-yellow-400 font-semibold">{row.reviewCount}</td>
                        <td className="p-2 font-semibold text-slate-400 text-[9px]">
                          {row.correctAttempts?.subject ?? 0},{row.correctAttempts?.object ?? 0},{row.correctAttempts?.possessiveDet ?? 0},{row.correctAttempts?.possessivePro ?? 0},{row.correctAttempts?.reflexive ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                * Values represent real-time persistency. The Room DAO intercepts user choices on the virtual phone and executes compiled SQLite transactional statements, instantly syncing this database.
              </p>
            </div>
          )}

          {/* TAB 2: Live Room Logs */}
          {consoleTab === 'room-query-logs' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">LIVE DATABASE TRANSACTION CONSOLE STREAM:</span>
                <button 
                  onClick={() => setDbLogs([])}
                  className="text-[9px] font-mono text-slate-400 hover:text-white bg-slate-850 px-2.5 py-1 rounded border border-slate-700 cursor-pointer"
                >
                  Clear Log Console
                </button>
              </div>

              {dbLogs.length > 0 ? (
                <div className="bg-slate-950 p-3 rounded-[6px] border border-slate-850 font-mono text-[10.5px] text-slate-300 max-h-80 overflow-y-auto space-y-2 select-all">
                  {dbLogs.map((log) => (
                    <div key={log.id} className="border-b border-slate-900/60 pb-1.5 last:border-0 text-left">
                      <div className="flex justify-between text-[9px] text-slate-500 mb-0.5 font-bold">
                        <span>{log.timestamp}</span>
                        <span className={
                          log.type === 'select' ? 'text-blue-400' :
                          log.type === 'insert' ? 'text-green-400' :
                          log.type === 'update' ? 'text-yellow-400' :
                          log.type === 'delete' ? 'text-red-400' :
                          log.type === 'success' ? 'text-emerald-400' :
                          'text-cyan-400'
                        }>
                          {log.type.toUpperCase()}
                        </span>
                      </div>
                      <p className={`whitespace-pre-wrap leading-relaxed ${
                        log.type === 'success' ? 'text-emerald-400/95' :
                        log.type === 'system' ? 'text-cyan-400' :
                        'text-slate-200'
                      }`}>
                        {log.query}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-850 rounded-[6px]">
                  <p className="text-slate-500 text-xs font-mono">Console idle. Interact with the phone screen on the left to generate live database logs.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Kotlin Source Specs */}
          {consoleTab === 'kotlin-sources' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">ROOM DATABASE & JETPACK COMPOSE SOURCE SCHEMAS:</span>
                <span className="text-[10px] text-slate-500">Android Studio (Kotlin Native)</span>
              </div>

              {/* Android Files selector */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2.5">
                {[
                  { key: 'gradle', label: '1. build.gradle.kts', code: GRADLE_KTS_CODE },
                  { key: 'theme', label: '2. UI Theme.kt', code: THEME_KOTLIN_CODE },
                  { key: 'room', label: '3. PronounRoomDB.kt', code: ROOM_DB_CODE },
                  { key: 'viewmodel', label: '4. PronounViewModel.kt', code: VIEWMODEL_CODE },
                  { key: 'ui', label: '5. Compose Screens.kt', code: COMPOSE_UI_CODE },
                ].map(file => (
                  <button
                    key={file.key}
                    onClick={() => setSelectedCodeFile(file.key as any)}
                    className={`px-3 py-1.5 rounded-[4px] text-[10px] font-mono transition-all border cursor-pointer ${selectedCodeFile === file.key ? 'bg-indigo-400 text-neutral-900 font-bold border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-850 hover:text-white'}`}
                  >
                    {file.label}
                  </button>
                ))}
              </div>

              {/* File code view */}
              <div className="border border-slate-800 rounded-[6px] overflow-hidden flex flex-col bg-slate-950">
                <div className="bg-slate-900 px-4 py-2 flex justify-between items-center text-[10px]">
                  <span className="font-mono font-bold text-slate-400 uppercase">
                    {selectedCodeFile}.{selectedCodeFile === 'gradle' ? 'kts' : 'kt'}
                  </span>
                  <button
                    onClick={() => {
                      const codeText = selectedCodeFile === 'gradle' ? GRADLE_KTS_CODE
                                     : selectedCodeFile === 'theme' ? THEME_KOTLIN_CODE
                                     : selectedCodeFile === 'room' ? ROOM_DB_CODE
                                     : selectedCodeFile === 'viewmodel' ? VIEWMODEL_CODE
                                     : COMPOSE_UI_CODE;
                      handleCopyCode(codeText, selectedCodeFile);
                    }}
                    className="text-slate-300 hover:text-white flex items-center gap-1 font-bold font-mono tracking-wider cursor-pointer"
                  >
                    {copiedCodeKey === selectedCodeFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 text-slate-200 font-mono text-[10px] overflow-x-auto max-h-[260px] select-all leading-relaxed whitespace-pre bg-slate-950">
                  {selectedCodeFile === 'gradle' ? GRADLE_KTS_CODE
                 : selectedCodeFile === 'theme' ? THEME_KOTLIN_CODE
                 : selectedCodeFile === 'room' ? ROOM_DB_CODE
                 : selectedCodeFile === 'viewmodel' ? VIEWMODEL_CODE
                 : COMPOSE_UI_CODE}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Device Workshop Controls */}
          {consoleTab === 'device-workshop' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-left">
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-slate-400 font-mono font-bold">SYSTEM WORKSHOP CONTROLS:</span>
                <span className="text-slate-500 text-[10px]">Directly trigger mobile hardware simulation inputs or database resets.</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDebugResetProgress}
                  className="flex flex-col items-start gap-1 p-3 rounded-[8px] border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 transition cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-200 font-mono">
                    <RotateCw className="w-3.5 h-3.5 text-yellow-500" />
                    Reset Statistics
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-light">Set all correct attempts to 0 and recalculate mastery indicators.</span>
                </button>

                <button
                  onClick={handleDebugMasterAll}
                  className="flex flex-col items-start gap-1 p-3 rounded-[8px] border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 transition cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-200 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Master All Sets
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-light">Set attempts count to 3/3 for every pronoun conjugating form.</span>
                </button>

                <button
                  onClick={handleDebugAddFaeSet}
                  className="flex flex-col items-start gap-1 p-3 rounded-[8px] border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 transition cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-200 font-mono">
                    <Plus className="w-3.5 h-3.5 text-blue-500" />
                    Inject "fae/faer" Set
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-light">Simulate user or network insert of faeries theme neopronouns.</span>
                </button>

                <button
                  onClick={handleDebugFactoryReset}
                  className="flex flex-col items-start gap-1 p-3 rounded-[8px] border border-red-950/40 bg-red-950/15 hover:bg-red-950/25 transition cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2 text-xs font-bold text-red-400 font-mono">
                    <Trash2 className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    Factory Reset System
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-light text-red-300/60">Wipe simulated flash memory & clear persistent SQLite cache.</span>
                </button>
              </div>

              {/* Device Spec details */}
              <div className="p-3 rounded-[6px] bg-slate-900 border border-slate-800 text-[10.5px] font-mono space-y-1 text-slate-400">
                <p className="text-slate-300 font-bold uppercase text-[9px] mb-1">Simulated Device Spec Metadata:</p>
                <p>• Model: <span className="text-slate-200">Google Pixel 8 Pro (Simulated)</span></p>
                <p>• Android OS: <span className="text-slate-200">API 34 (Android 14)</span></p>
                <p>• Persistence Layer: <span className="text-slate-200">androidx.room:room-runtime:2.6.1</span></p>
                <p>• Jetpack Compose: <span className="text-slate-200">androidx.compose.ui:ui:1.6.2</span></p>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
