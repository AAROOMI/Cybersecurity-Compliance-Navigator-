import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import { CloseIcon, MicrophoneIcon } from './Icons';

// Audio utility functions
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


const navigateToViewDeclaration: FunctionDeclaration = {
  name: 'navigate_to_view',
  description: 'Navigates the user to a specific page or view within the application.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      view: {
        type: Type.STRING,
        description: "The name of the view to navigate to. Must be one of: 'dashboard', 'navigator', 'documents', 'users', 'companyProfile', 'auditLog', 'assessment', 'pdplAssessment', 'samaCsfAssessment', 'userProfile', 'help', 'training', 'riskAssessment'.",
      },
    },
    required: ['view'],
  },
};

type View = 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'userProfile' | 'mfaSetup' | 'help' | 'training' | 'riskAssessment';

interface LiveAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (view: View) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let nextStartTime = 0;

export const LiveAssistantWidget: React.FC<LiveAssistantWidgetProps> = ({ isOpen, onToggle, onNavigate }) => {
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [userTranscript, setUserTranscript] = useState('');
    const [assistantTranscript, setAssistantTranscript] = useState('');
    
    const sessionPromise = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const sources = useRef(new Set<AudioBufferSourceNode>());
    const streamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

    const cleanup = useCallback(() => {
        setStatus('idle');
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close().catch(console.error);
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close().catch(console.error);
        }
        sessionPromise.current = null;
    }, []);

    useEffect(() => {
        if (isOpen) {
            const startSession = async () => {
                try {
                    if (!process.env.API_KEY) throw new Error("API key is not configured.");
                    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Your browser does not support audio recording.");

                    setError(null);
                    setUserTranscript('');
                    setAssistantTranscript('');
                    
                    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

                    sessionPromise.current = ai.live.connect({
                        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                        callbacks: {
                            onopen: () => {
                                setStatus('listening');
                                const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
                                scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                                scriptProcessorRef.current.onaudioprocess = (e) => {
                                    const inputData = e.inputBuffer.getChannelData(0);
                                    const pcmBlob: Blob = {
                                        data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                        mimeType: 'audio/pcm;rate=16000',
                                    };
                                    sessionPromise.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                                };
                                source.connect(scriptProcessorRef.current);
                                scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
                            },
                            onmessage: async (message: LiveServerMessage) => {
                                if (message.serverContent?.inputTranscription) {
                                    setUserTranscript(prev => prev + message.serverContent.inputTranscription.text);
                                }
                                if (message.serverContent?.outputTranscription) {
                                    setAssistantTranscript(prev => prev + message.serverContent.outputTranscription.text);
                                }
                                if (message.serverContent?.turnComplete) {
                                    setUserTranscript('');
                                    setAssistantTranscript('');
                                }

                                if (message.toolCall?.functionCalls) {
                                    setStatus('thinking');
                                    for (const fc of message.toolCall.functionCalls) {
                                        if (fc.name === 'navigate_to_view') {
                                            onNavigate(fc.args.view as View);
                                            sessionPromise.current?.then(session => {
                                                session.sendToolResponse({
                                                    functionResponses: { id: fc.id, name: fc.name, response: { result: "OK, navigation complete." } }
                                                });
                                            });
                                        }
                                    }
                                }

                                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                                if (base64Audio) {
                                    setStatus('speaking');
                                    nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current!.currentTime);
                                    const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current!, 24000, 1);
                                    const sourceNode = outputAudioContextRef.current!.createBufferSource();
                                    sourceNode.buffer = audioBuffer;
                                    sourceNode.connect(outputAudioContextRef.current!.destination);
                                    sourceNode.addEventListener('ended', () => {
                                        sources.current.delete(sourceNode);
                                        if (sources.current.size === 0) setStatus('listening');
                                    });
                                    sourceNode.start(nextStartTime);
                                    nextStartTime += audioBuffer.duration;
                                    sources.current.add(sourceNode);
                                }
                            },
                            onerror: (e) => { console.error('Live session error:', e); setError('A connection error occurred.'); cleanup(); },
                            onclose: () => { cleanup(); },
                        },
                        config: {
                            responseModalities: [Modality.AUDIO],
                            inputAudioTranscription: {},
                            outputAudioTranscription: {},
                            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                            systemInstruction: "You are Gemini, a helpful voice assistant integrated into the Cybersecurity Controls Navigator application. Your goal is to help users by answering their questions and performing actions within the app. You can navigate between different sections. Use the `navigate_to_view` function to switch pages when the user asks. Available views are: 'dashboard', 'navigator', 'documents', 'users', 'companyProfile', 'auditLog', 'assessment', 'pdplAssessment', 'samaCsfAssessment', 'userProfile', 'help', 'training', and 'riskAssessment'. Start the conversation by saying 'Hello, how can I help you navigate your cybersecurity compliance today?'.",
                            tools: [{ functionDeclarations: [navigateToViewDeclaration] }],
                        },
                    });
                } catch (err: any) {
                    setError(err.message || 'Failed to start the voice session.');
                    console.error(err);
                    cleanup();
                }
            };
            startSession();

            return () => {
                sessionPromise.current?.then(session => session.close());
                cleanup();
            };
        }
    }, [isOpen, onNavigate, cleanup]);

    const handleClose = () => {
        sessionPromise.current?.then(session => session.close());
        cleanup();
        onToggle();
    };

    return (
        <>
            <div id="live-assistant-widget-button" className={`fixed bottom-0 right-0 m-6 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'transform scale-0 opacity-0' : 'transform scale-100 opacity-100'}`}>
                <button
                    onClick={onToggle}
                    className="bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    aria-label="Open voice assistant"
                >
                    <MicrophoneIcon className="h-8 w-8" />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg flex flex-col" style={{height: '70vh'}}>
                         <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                             <div className="flex items-center">
                                <MicrophoneIcon className="h-6 w-6 mr-3 text-teal-500" />
                                <div>
                                    <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Live Gemini Assistant</h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini Live</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <CloseIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </header>
                         <main className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                            <div className="relative mb-6">
                                <div className={`w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                                    <MicrophoneIcon className={`w-16 h-16 transition-colors ${status === 'listening' ? 'text-blue-500' : status === 'speaking' ? 'text-teal-500' : 'text-gray-400'}`} />
                                </div>
                                <div className={`absolute -inset-2 rounded-full border-4 animate-pulse
                                    ${status === 'listening' ? 'border-blue-400' : ''}
                                    ${status === 'speaking' ? 'border-teal-400' : ''}
                                    ${status === 'thinking' ? 'border-purple-400' : ''}
                                `}></div>
                            </div>
                            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 capitalize">{status}</p>
                            
                            <div className="mt-6 w-full h-24 text-left p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-y-auto">
                                <p className="text-sm text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-gray-100">You:</strong> {userTranscript}</p>
                                <p className="text-sm text-teal-700 dark:text-teal-300 mt-2"><strong className="text-teal-800 dark:text-teal-200">Gemini:</strong> {assistantTranscript}</p>
                            </div>

                            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                        </main>
                    </div>
                </div>
            )}
        </>
    );
};