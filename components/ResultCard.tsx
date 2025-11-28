import React from 'react';
import { MenuItem, AiHealthAnalysis } from '../types';
import { Utensils, Award, Leaf, Flame } from 'lucide-react';

interface ResultCardProps {
  item: MenuItem;
  analysis: AiHealthAnalysis | null;
  onClose: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ item, analysis, onClose }) => {
  const getNutriScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-green-600';
      case 'B': return 'bg-lime-500';
      case 'C': return 'bg-yellow-400';
      case 'D': return 'bg-orange-500';
      case 'E': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-slate-900 p-6 text-center relative">
            <div className="absolute top-4 right-4">
                 {item.is_healthy_option && <Leaf className="text-green-400 w-6 h-6 animate-pulse" />}
            </div>
          <h2 className="text-2xl font-bold text-white mb-1">{item.name_th}</h2>
          <p className="text-slate-300 text-sm">{item.name_en}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-slate-500 text-xs uppercase font-bold">Energy</span>
              <span className="text-slate-900 font-bold">{item.calories_approx} kcal</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
               <Utensils className="w-5 h-5 text-blue-500 mb-1" />
               <span className="text-slate-500 text-xs uppercase font-bold">Cuisine</span>
               <span className="text-slate-900 font-bold">{item.cuisine}</span>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4" /> AI Nutrition Analysis
            </h3>
            
            {analysis ? (
              <div className="space-y-3">
                 <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <span className="font-semibold text-slate-700">Nutri-Score</span>
                    <span className={`${getNutriScoreColor(analysis.nutriScore)} text-white font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-lg`}>
                        {analysis.nutriScore}
                    </span>
                 </div>
                 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <p className="text-indigo-900 text-sm leading-relaxed text-center italic">
                        "{analysis.healthTip}"
                    </p>
                 </div>
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-indigo-600 font-medium">Consulting Nutritionist AI...</span>
                </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-slate-900/20 active:scale-95 transform duration-150"
          >
            Spin Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;