import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Sidebar } from './components/Sidebar';
import { ContentView } from './components/ContentView';
import { ChatWidget } from './components/ChatWidget';
import { LogoIcon, SearchIcon } from './components/Icons';
import { eccData } from './data/controls';
import type { Domain, Control, Subdomain, SearchResult, ChatMessage } from './types';

const App: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<Domain>(eccData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeControlId, setActiveControlId] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatSession = useRef<Chat | null>(null);

  const allControls = useMemo((): SearchResult[] => {
    return eccData.flatMap(domain =>
      domain.subdomains.flatMap(subdomain =>
        subdomain.controls.map(control => ({
          control,
          subdomain,
          domain,
        }))
      )
    );
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.length > 2) {
      const results = allControls.filter(({ control }) => {
        const query = debouncedSearchQuery.toLowerCase();
        return (
          control.id.toLowerCase().includes(query) ||
          control.description.toLowerCase().includes(query)
        );
      });
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, allControls]);

  const handleSelectDomain = useCallback((domain: Domain) => {
    setSelectedDomain(domain);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    setSelectedDomain(result.domain);
    setActiveControlId(result.control.id);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };
  
  const highlightText = (text: string, highlight: string) => {
    const trimmedHighlight = highlight.trim();
    if (!trimmedHighlight) {
      return <span>{text}</span>;
    }

    const escapeRegExp = (str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const escapedHighlight = escapeRegExp(trimmedHighlight);

    if (escapedHighlight === '') {
        return <span>{text}</span>;
    }

    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === trimmedHighlight.toLowerCase() ? (
            <strong key={i} className="bg-teal-100 text-teal-800">{part}</strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const initializeChat = () => {
    if (!process.env.API_KEY) {
      setChatError("API_KEY environment variable not set. Cannot initialize chat.");
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const controlsContext = JSON.stringify(eccData);
    chatSession.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an expert AI assistant for the National Cybersecurity Authority's Essential Cybersecurity Controls (ECC). Your knowledge base is the following JSON data representing the complete ECC framework: ${controlsContext}. Answer user questions based *only* on the provided data. If the answer cannot be found in the data, say so. Be concise, helpful, and format your answers for readability.`,
      },
    });
    setChatMessages([
      { role: 'assistant', content: "Hello! I'm your AI assistant. How can I help you navigate the Essential Cybersecurity Controls today?" }
    ]);
  };

  useEffect(() => {
    if (isChatOpen && !chatSession.current) {
      initializeChat();
    }
  }, [isChatOpen]);

  const handleSendMessage = async (message: string) => {
    if (!chatSession.current) {
      setChatError("Chat is not initialized. Please try again.");
      return;
    }
    
    setChatError(null);
    setIsChatLoading(true);
    
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMessage]);

    try {
      const stream = await chatSession.current.sendMessageStream({ message });
      
      let assistantResponse = '';
      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

      for await (const chunk of stream) {
        assistantResponse += chunk.text;
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = "Sorry, I encountered an error. Please check the API key and try again.";
      setChatError(errorMessage);
      setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsChatLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <LogoIcon className="h-12 w-12 text-teal-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">National Cybersecurity Authority</h1>
            <p className="text-sm text-gray-500">Essential Cybersecurity Controls (ECC) Navigator</p>
          </div>
        </div>
        <div className="relative w-full max-w-md">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search controls by ID or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)} // Delay to allow click
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
            </div>
            {isSearchFocused && searchResults.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {searchResults.map((result) => (
                        <li
                            key={result.control.id}
                            onMouseDown={() => handleResultClick(result)}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-teal-50"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold font-mono text-teal-700">
                                    {result.control.id}
                                </span>
                                <span className="text-sm text-gray-600 truncate">
                                    {highlightText(result.control.description, debouncedSearchQuery)}
                                </span>
                                <span className="text-xs text-gray-400 mt-1">
                                    {result.domain.name} &gt; {result.subdomain.title}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar domains={eccData} selectedDomain={selectedDomain} onSelectDomain={handleSelectDomain} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <ContentView domain={selectedDomain} activeControlId={activeControlId} setActiveControlId={setActiveControlId} />
        </main>
      </div>
       <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
        error={chatError}
      />
    </div>
  );
};

export default App;
