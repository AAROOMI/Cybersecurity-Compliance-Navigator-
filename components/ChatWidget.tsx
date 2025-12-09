import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { CloseIcon, SendIcon } from './Icons';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}

const nooraAvatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIbGNtcwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABMbGNtcwAAAAAAAAAAAAAAAAAAAQALAQAAAAAATGlubwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY---';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onToggle,
  messages,
  onSendMessage,
  isLoading,
  error,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
  );

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 z-50"
        aria-label="Open AI Assistant"
      >
        <ChatIcon className="h-8 w-8"/>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm h-[70vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src={nooraAvatar} alt="Noora AI Assistant" className="w-10 h-10 rounded-full object-cover" />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Noora AI Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
        <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <CloseIcon className="w-5 h-5 text-gray-500" />
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <img src={nooraAvatar} alt="Assistant" className="w-8 h-8 rounded-full" />
            )}
            <div className={`max-w-[80%] rounded-lg p-3 text-sm break-words ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <img src={nooraAvatar} alt="Assistant" className="w-8 h-8 rounded-full" />
                <div className="max-w-[80%] rounded-lg p-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-2 mx-4 mb-2 text-xs text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-200 border border-red-200 dark:border-red-500/50 rounded-md">
          {error}
        </div>
      )}

      <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Noora anything..."
            className="flex-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-900 dark:text-gray-200"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};
