import React from 'react';

// An SVG component for the animated brush stroke effect.
const BrushStroke = () => (
    <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-1/3 -translate-y-1/2 w-full h-auto opacity-70 dark:opacity-50 pointer-events-none"
        viewBox="0 0 600 100"
        preserveAspectRatio="none"
    >
        <defs>
            <linearGradient id="paintGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-indigo-300 dark:text-indigo-800" stopColor="currentColor" />
                <stop offset="100%" className="text-purple-300 dark:text-purple-800" stopColor="currentColor" />
            </linearGradient>
        </defs>
        <path
            d="M0,50 Q150,0 300,50 T600,50"
            stroke="url(#paintGradient)"
            strokeWidth="100"
            fill="none"
            strokeLinecap="round"
            className="animate-paint-stroke"
            style={{ animationDelay: '0.1s' }}
        />
    </svg>
);

interface WelcomeScreenProps {
    onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="relative w-full max-w-3xl bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center flex flex-col items-center overflow-hidden backdrop-blur-lg min-h-[40vh]">
            <BrushStroke />
            
            <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                <div className="relative">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        The Walls That Speak
                    </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                    Journey into the heart of Karnataka's ancient mural traditions. Converse with an AI art historian, unveil the stories behind each stroke, and create your own digital masterpiece inspired by centuries of artistry.
                </p>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                    <button
                        onClick={onStart}
                        className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800"
                    >
                        Begin Your Journey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;