import React, { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import ResultCard from './components/ResultCard';
import { MENU_DATA } from './constants/menus';
import { getHealthAnalysis } from './services/geminiService';
import { MenuItem, AppState, AiHealthAnalysis, MealCategory } from './types';
import { Filter, Info } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [healthAnalysis, setHealthAnalysis] = useState<AiHealthAnalysis | null>(null);
  const [filterCategory, setFilterCategory] = useState<MealCategory | 'ALL'>('ALL');
  
  // Filter items based on selection
  const filteredItems = filterCategory === 'ALL' 
    ? MENU_DATA 
    : MENU_DATA.filter(item => item.category === filterCategory);

  const handleSpin = () => {
    if (appState !== AppState.IDLE) return;
    setAppState(AppState.SPINNING);
    setSelectedItem(null);
    setHealthAnalysis(null);
  };

  const handleSpinEnd = async (item: MenuItem) => {
    setSelectedItem(item);
    setAppState(AppState.ANALYZING);

    // Call Gemini API
    const analysis = await getHealthAnalysis(item.name_th);
    setHealthAnalysis(analysis);
    setAppState(AppState.RESULT);
  };

  const resetGame = () => {
    setAppState(AppState.IDLE);
    setSelectedItem(null);
    setHealthAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-8 px-4 relative">
      
      {/* Header */}
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          WHEEL<span className="text-indigo-600">-OF-</span>MEALS
        </h1>
        <p className="text-slate-500 font-medium">
          What should you eat today? Let AI decide.
        </p>
      </header>

      {/* Controls */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
         <div className="flex items-center gap-2 px-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase">Filter</span>
         </div>
         <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as MealCategory | 'ALL')}
            disabled={appState !== AppState.IDLE}
            className="bg-slate-100 text-slate-700 text-sm font-semibold py-2 px-4 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
         >
            <option value="ALL">All Menus ({MENU_DATA.length})</option>
            <option value={MealCategory.MAIN_COURSE}>Main Course</option>
            <option value={MealCategory.SNACK}>Snack</option>
            <option value={MealCategory.BEVERAGE}>Beverage</option>
         </select>
      </div>

      {/* Main Wheel Area */}
      <div className="w-full max-w-md mb-8 relative">
        <Wheel 
          items={filteredItems} 
          onSpinEnd={handleSpinEnd} 
          isSpinning={appState === AppState.SPINNING} 
        />
        
        {/* Spin Button (Separate from Wheel Center to be more accessible on mobile) */}
        <div className="mt-8 flex justify-center">
            <button
                onClick={handleSpin}
                disabled={appState !== AppState.IDLE}
                className={`
                    relative overflow-hidden group
                    px-10 py-4 rounded-full font-black text-xl tracking-wider shadow-xl
                    transition-all duration-300 transform
                    ${appState === AppState.IDLE 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-indigo-500/40' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95'}
                `}
            >
                <span className="relative z-10">{appState === AppState.SPINNING ? 'SPINNING...' : 'SPIN NOW!'}</span>
                {appState === AppState.IDLE && (
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                )}
            </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-6 text-center">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <Info className="w-4 h-4 text-indigo-500" />
            <span className="text-xs text-slate-500 font-medium">Powered by Gemini AI 2.5 Flash</span>
         </div>
      </div>

      {/* Results Overlay */}
      {(appState === AppState.RESULT || appState === AppState.ANALYZING) && selectedItem && (
        <ResultCard 
            item={selectedItem} 
            analysis={healthAnalysis} 
            onClose={resetGame} 
        />
      )}
    </div>
  );
};

export default App;