import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse, generateMuralImage } from '../services/geminiService';
import { LoadingSpinnerIcon, ExclamationTriangleIcon, SendIcon, SparklesIcon, SignOutIcon } from './icons';

type Message = {
    id: number;
    role: 'user' | 'model';
    text: string;
    imageUrl?: string;
    isLoadingImage?: boolean;
    error?: string;
};

interface ChatProps {
    onExit: () => void;
}

const Chat: React.FC<ChatProps> = ({ onExit }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([
            {
                id: Date.now(),
                role: 'model',
                text: "Greetings! I am your personal guide to the vibrant world of Karnataka's mural art. Feel free to ask me anything, or ask me to show you a picture of something, like 'a Chittara wall painting'.",
            },
        ]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            text: input,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatResponse = await generateChatResponse(input);
            const promptPrefix = '[PROMPT]:';
            
            let modelText = chatResponse;
            let imagePrompt: string | null = null;
            
            if (chatResponse.includes(promptPrefix)) {
                const parts = chatResponse.split(promptPrefix);
                modelText = parts[0].trim();
                imagePrompt = parts[1].trim();
            }

            const modelMessage: Message = {
                id: Date.now() + 1,
                role: 'model',
                text: modelText,
                isLoadingImage: !!imagePrompt,
            };
            setMessages(prev => [...prev, modelMessage]);

            if (imagePrompt) {
                try {
                    const imageUrl = await generateMuralImage(imagePrompt);
                    setMessages(prev => prev.map(msg =>
                        msg.id === modelMessage.id ? { ...msg, imageUrl, isLoadingImage: false } : msg
                    ));
                } catch (imgError) {
                    const errorText = imgError instanceof Error ? imgError.message : 'Unknown image generation error.';
                     setMessages(prev => prev.map(msg =>
                        msg.id === modelMessage.id ? { ...msg, error: errorText, isLoadingImage: false } : msg
                    ));
                }
            }
        } catch (chatError) {
             const errorText = chatError instanceof Error ? chatError.message : 'Unknown error.';
             const errorMessage: Message = {
                id: Date.now() + 1,
                role: 'model',
                text: `Sorry, I encountered an error.`,
                error: errorText,
             };
             setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[75vh] bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-indigo-500" />
                    <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Art Guide</h2>
                </div>
                <button
                    onClick={onExit}
                    aria-label="Exit chat"
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                    <SignOutIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                         {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white" /></div>}
                        <div className={`max-w-lg p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.isLoadingImage && (
                                <div className="mt-4 p-4 border-t border-slate-200 dark:border-slate-600">
                                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                                        <LoadingSpinnerIcon className="w-5 h-5 mr-2" />
                                        <span>Generating your image...</span>
                                    </div>
                                </div>
                            )}
                            {msg.imageUrl && (
                                <div className="mt-4 aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-600">
                                    <img src={msg.imageUrl} alt="Generated Mural Art" className="w-full h-full object-cover" />
                                </div>
                            )}
                             {msg.error && (
                                <div className="mt-4 p-2 border-t border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/50 rounded-md">
                                    <div className="flex items-start text-red-600 dark:text-red-300">
                                        <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">Image Generation Failed</p>
                                            <p className="text-xs">{msg.error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                         {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0"></div>}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white" /></div>
                        <div className="max-w-lg p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse mr-2"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75 mr-2"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>
                 )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about Karnataka's mural art..."
                        className="flex-1 w-full px-4 py-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
