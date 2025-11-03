import React, { useState } from 'react';
import Chat from './components/Chat';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
    const [isChatting, setIsChatting] = useState(false);

    const handleStartChat = () => setIsChatting(true);
    const handleExitChat = () => setIsChatting(false);

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
            <header className="w-full max-w-3xl mx-auto text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                    AI Karnataka Mural Art Visualizer
                </h1>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                    {isChatting
                        ? "Chat with our AI guide to explore the vibrant mural traditions of Karnataka."
                        : "An interactive journey into the heart of South Indian artistry."}
                </p>
            </header>
            <main className="w-full max-w-3xl">
                {isChatting ? (
                    <Chat onExit={handleExitChat} />
                ) : (
                    <WelcomeScreen onStart={handleStartChat} />
                )}
            </main>
        </div>
    );
};

export default App;
