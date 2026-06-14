/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Activity, User, Ruler, Weight, ArrowRight, Info, Sparkles, Flame, TrendingUp, BookOpen, Apple, Droplet, Plus, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type AppState = 'input' | 'result';

interface BmiResultInfo {
  category: string;
  color: string;
  bgElement: string;
  borderColor: string;
  shadowColor: string;
  tip: string;
  dietPlan: string[];
}

const getBmiInfo = (bmi: number): BmiResultInfo => {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: 'text-sky-600',
      bgElement: 'bg-sky-50',
      borderColor: 'border-sky-200',
      shadowColor: 'shadow-sky-500/20',
      tip: 'Focus on nutrient-dense foods and strength training to build muscle mass safely.',
      dietPlan: [
        'Increase daily caloric intake with nutrient-dense foods.',
        'Eat 5-6 smaller meals throughout the day instead of 3 large ones.',
        'Include healthy fats like avocados, nuts, seeds, and olive oil.',
        'Choose lean proteins like chicken, fish, eggs, and legumes.'
      ],
    };
  }
  if (bmi >= 18.5 && bmi < 25) {
    return {
      category: 'Normal Weight',
      color: 'text-emerald-600',
      bgElement: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      shadowColor: 'shadow-emerald-500/20',
      tip: 'Great job! Maintain your balanced lifestyle with regular physical activity and a nutritious diet.',
      dietPlan: [
        'Maintain a balanced diet rich in whole foods.',
        'Include a wide variety of colorful fruits and vegetables.',
        'Choose whole grains like brown rice, oats, and quinoa.',
        'Ensure adequate protein intake to support daily activities.'
      ],
    };
  }
  if (bmi >= 25 && bmi < 30) {
    return {
      category: 'Overweight',
      color: 'text-amber-600',
      bgElement: 'bg-amber-50',
      borderColor: 'border-amber-200',
      shadowColor: 'shadow-amber-500/20',
      tip: 'Consider incorporating more aerobic exercises and portion control into your daily routine.',
      dietPlan: [
        'Focus on a slight caloric deficit for gradual weight loss.',
        'Practice portion control and mindful eating.',
        'Increase intake of fiber-rich vegetables to feel full longer.',
        'Prioritize lean protein to preserve muscle while losing fat.'
      ],
    };
  }
  return {
    category: 'Obese',
    color: 'text-rose-600',
    bgElement: 'bg-rose-50',
    borderColor: 'border-rose-200',
    shadowColor: 'shadow-rose-500/20',
    tip: 'Small, sustainable changes make a big difference. Consulting a healthcare provider can help tailor a safe plan for you.',
    dietPlan: [
      'Consult a dietitian for a customized, sustainable plan.',
      'Focus on high-volume, low-calorie foods such as leafy greens.',
      'Significantly reduce added sugars and ultra-processed foods.',
      'Incorporate lean proteins and healthy fats to manage hunger.'
    ],
  };
};

const BmiInfoRanges = () => {
  const ranges = [
    { cat: 'Underweight', range: '< 18.5', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', advice: 'Focus on nutrient-dense foods (nuts, whole grains, lean proteins) and strength training to safely build muscle mass.' },
    { cat: 'Normal Weight', range: '18.5 - 24.9', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', advice: 'Maintain health with a balanced diet, hydration, and about 150 minutes of moderate physical activity per week.' },
    { cat: 'Overweight', range: '25.0 - 29.9', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', advice: 'Prioritize portion control, reduce processed foods, and gently increase daily movement or aerobic exercises.' },
    { cat: 'Obese', range: '≥ 30.0', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', advice: 'Focus on sustainable lifestyle changes over time. Consult a healthcare provider for a tailored, safe health plan.' },
  ];

  return (
    <div className="mt-8 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-slate-500">
          <BookOpen size={20} />
        </div>
        <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Understanding BMI</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ranges.map((r, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${r.bg} ${r.border} flex flex-col gap-2 transition-all hover:shadow-sm`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold text-sm uppercase tracking-wider ${r.color}`}>{r.cat}</h4>
              <span className={`font-display font-medium text-sm px-2 py-0.5 rounded-md bg-white/60 ${r.color}`}>{r.range}</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{r.advice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HydrationTracker = () => {
  const [glasses, setGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem('hydrationTracker');
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toLocaleDateString();
        if (parsed.date === today) {
          return parsed.count;
        }
      }
      return 0;
    } catch {
      return 0;
    }
  });

  const dailyGoal = 8;

  const updateGlasses = (newCount: number) => {
    const validCount = Math.max(0, newCount);
    setGlasses(validCount);
    localStorage.setItem('hydrationTracker', JSON.stringify({
      date: new Date().toLocaleDateString(),
      count: validCount
    }));
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="w-full max-w-md mx-auto mt-2 bg-slate-50 border border-slate-200 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Droplet size={18} className="text-blue-500" />
          <span className="font-medium text-xs tracking-wide uppercase">Daily Hydration</span>
        </div>
        <span className="text-xs font-medium text-slate-400">
          Goal: {dailyGoal} glasses
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <button 
          onClick={() => updateGlasses(glasses - 1)}
          disabled={glasses === 0}
          className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={20} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-4xl font-display font-bold text-blue-500">{glasses}</span>
          <span className="text-xs text-slate-400 font-medium">/ {dailyGoal}</span>
        </div>

        <button 
          onClick={() => updateGlasses(glasses + 1)}
          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="mt-5 flex gap-1 justify-center">
        {Array.from({ length: Math.max(dailyGoal, glasses) }).map((_, i) => (
          <div 
            key={i} 
            className={`h-6 w-full rounded-sm transition-colors duration-300 ${i < glasses ? 'bg-blue-400' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface NumberControlProps {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (val: number) => void;
  info?: string;
}

function NumberControl({ icon: Icon, label, value, unit, min, max, onChange, info }: NumberControlProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Icon size={18} className="text-sky-500" />
          <span className="font-medium text-sm tracking-wide uppercase">{label}</span>
        </div>
        <div className="font-display text-2xl font-semibold text-slate-900 tracking-tight">
          {value} <span className="text-sm text-slate-500 font-sans tracking-normal">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 focus:ring-offset-white"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-3 font-medium">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {info && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
          <Info size={14} className="text-sky-500/90 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{info}</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [status, setStatus] = useState<AppState>('input');
  
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmi, setBmi] = useState<number>(0);
  const [history, setHistory] = useState<{ date: string, bmi: number }[]>(() => {
    try {
      const saved = localStorage.getItem('bmiHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleCalculate = () => {
    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    const finalBmi = parseFloat(calculatedBmi.toFixed(1));
    setBmi(finalBmi);
    setStatus('result');

    const newHistory = [...history, { 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      bmi: finalBmi 
    }].slice(-7); // Keep last 7 entries
    setHistory(newHistory);
    localStorage.setItem('bmiHistory', JSON.stringify(newHistory));
  };

  const handleRecalculate = () => {
    setStatus('input');
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.08),rgba(255,255,255,0))] flex flex-col items-center justify-start py-12 p-4 sm:p-6 font-sans text-slate-900 selection:bg-sky-500/20">
      <div className="w-full max-w-[80%] relative">
        {/* Glow behind the card */}
        <div className="absolute inset-0 bg-sky-500/5 blur-3xl rounded-[3rem] pointer-events-none" />

        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          <div className="w-full relative rounded-2xl overflow-hidden mb-8 shadow-sm">
            <img 
              src="data:image/jpeg;base64,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" 
              alt="Healthy Lifestyle Header" 
              className="w-full h-auto object-contain" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md text-white border border-white/20">
                <Activity size={20} />
              </div>
              <h1 className="text-xl font-display font-semibold text-white tracking-tight">BMI Calculator</h1>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === 'input' ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <NumberControl
                    icon={User}
                    label="Age"
                    unit="years"
                    value={age}
                    min={18}
                    max={120}
                    onChange={setAge}
                  />
                  <NumberControl
                    icon={Ruler}
                    label="Height"
                    unit="cm"
                    value={height}
                    min={120}
                    max={250}
                    onChange={setHeight}
                    info="Converted to meters and squared (m²) in the calculation. This standardizes your mass relative to your vertical frame."
                  />
                  <NumberControl
                    icon={Weight}
                    label="Mass"
                    unit="kg"
                    value={weight}
                    min={30}
                    max={300}
                    onChange={setWeight}
                    info="Used as the baseline numerator. Divided by your squared height to calculate your body mass distribution."
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 active:scale-[0.98]"
                >
                  Calculate BMI
                  <ArrowRight size={20} className="stroke-[2.5]" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col items-center text-center py-4"
              >
                <h2 className="text-slate-500 font-medium tracking-wide uppercase text-sm mb-8">
                  Your Result
                </h2>

                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                  className={`w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 ${getBmiInfo(bmi).borderColor} ${getBmiInfo(bmi).bgElement} shadow-[0_0_60px_rgba(0,0,0,0)] ${getBmiInfo(bmi).shadowColor}`}
                >
                  <span className={`text-6xl font-display font-bold tracking-tighter ${getBmiInfo(bmi).color}`}>
                    {bmi}
                  </span>
                  <span className="text-xs font-medium text-slate-500 mt-2 tracking-[0.2em]">BMI</span>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 flex flex-col gap-4 w-full items-center"
                >
                  <h3 className={`text-3xl font-display font-bold mb-1 ${getBmiInfo(bmi).color}`}>
                    {getBmiInfo(bmi).category}
                  </h3>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 leading-relaxed max-w-md w-full mx-auto">
                    Based on an adult computing at <strong className="text-slate-900">{age} years</strong> old, 
                    with a mass of <strong className="text-slate-900">{weight} kg</strong> and 
                    a height of <strong className="text-slate-900">{height} cm</strong>.
                  </div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={`p-4 rounded-xl border ${getBmiInfo(bmi).bgElement} ${getBmiInfo(bmi).borderColor} flex gap-3.5 text-left w-full mx-auto max-w-md`}
                  >
                    <Sparkles size={20} className={`${getBmiInfo(bmi).color} shrink-0 mt-0.5`} />
                    <p className={`text-sm ${getBmiInfo(bmi).color} leading-relaxed font-medium`}>
                      {getBmiInfo(bmi).tip}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="w-full max-w-md mx-auto mt-2 bg-slate-50 border border-slate-200 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-200 pb-3">
                      <Apple size={18} className={getBmiInfo(bmi).color} />
                      <span className="font-medium text-xs tracking-wide uppercase">Recommended Diet Plan</span>
                    </div>
                    <ul className="flex flex-col gap-3 text-left">
                      {getBmiInfo(bmi).dietPlan.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2.5">
                          <span className={`${getBmiInfo(bmi).color} shrink-0 mt-0.5 font-bold`}>•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-md mx-auto mt-2 bg-slate-50 border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3 text-slate-500 border-b border-slate-200 pb-2">
                      <Flame size={16} className="text-orange-500" />
                      <span className="font-medium text-xs tracking-wide uppercase">Basal Metabolic Rate</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Male</span>
                        <div className="font-display font-semibold text-lg text-slate-900">
                          {Math.round(10 * weight + 6.25 * height - 5 * age + 5)} <span className="text-xs text-slate-500 font-sans font-normal font-medium">kcal/day</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start border-l border-slate-200 pl-4">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Female</span>
                        <div className="font-display font-semibold text-lg text-slate-900">
                          {Math.round(10 * weight + 6.25 * height - 5 * age - 161)} <span className="text-xs text-slate-500 font-sans font-normal font-medium">kcal/day</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-md mx-auto mt-2 bg-slate-50 border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-200 pb-2">
                      <TrendingUp size={16} className="text-sky-500" />
                      <span className="font-medium text-xs tracking-wide uppercase">BMI History</span>
                    </div>
                    {history.length > 0 ? (
                      <div className="h-32 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={history}>
                            <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} stroke="#94a3b8" />
                            <YAxis domain={['auto', 'auto']} fontSize={10} tickLine={false} axisLine={false} tickMargin={8} stroke="#94a3b8" width={30} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                              itemStyle={{ color: '#0ea5e9', fontWeight: 600 }}
                            />
                            <Line type="monotone" dataKey="bmi" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-24 flex items-center justify-center text-xs text-slate-400 text-center px-4">
                        Calculate again to see your trend over time.
                      </div>
                    )}
                  </motion.div>

                  <HydrationTracker />
                </motion.div>

                <button
                  onClick={handleRecalculate}
                  className="mt-10 w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-slate-200 hover:border-slate-300 shadow-sm active:scale-[0.98]"
                >
                  <RefreshCw size={18} />
                  Recalculate
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 w-full rounded-2xl overflow-hidden shadow-sm relative">
            <img 
              src="https://www.usz.ch/app/uploads/2025/03/usz-bmi-calculator-group.jpg" 
              alt="Healthy Lifestyle Footer" 
              className="w-full h-auto object-contain" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
          </div>

        </div>

        <BmiInfoRanges />
      </div>
    </div>
  );
}
