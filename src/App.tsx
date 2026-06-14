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
              src="/images/img2.jpg" 
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
              src="/images/img1.webp" 
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
