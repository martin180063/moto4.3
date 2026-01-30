import React, { useState } from 'react';

interface ChecklistProps {
  title: string;
  items: string[];
}

export const Checklist: React.FC<ChecklistProps> = ({ title, items }) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const progress = Math.round((checkedItems.size / items.length) * 100);

  return (
    <div className="mb-8 rounded-2xl bg-white/85 p-6 shadow-sm border border-white/60 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700">{progress}% 完成</span>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-slate-200/50">
        <div 
          className="h-full bg-gradient-to-r from-sky-400 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <label 
            key={index} 
            className={`group flex cursor-pointer items-center space-x-3 rounded-xl p-3 transition-all hover:bg-white/60
              ${checkedItems.has(index) ? 'opacity-60 bg-slate-50/50' : 'bg-white/40'}
            `}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors
               ${checkedItems.has(index) ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300 bg-white group-hover:border-sky-400'}`}>
               {checkedItems.has(index) && <span className="material-symbols-rounded text-sm font-bold">check</span>}
            </div>
            <span className={`flex-1 text-slate-700 font-medium ${checkedItems.has(index) ? 'line-through text-slate-500' : ''}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};