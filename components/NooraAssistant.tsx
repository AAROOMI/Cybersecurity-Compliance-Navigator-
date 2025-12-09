import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import type { AssessmentItem, ControlStatus } from '../types';
import { CloseIcon } from './Icons';

const nooraAvatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAFAAUADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1VXVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iivOfGfj7xN4e8SXmjaJ4A1bxLY2un6TfvqNjfadaIkt/qE+nyWjLeXVvIXgMQkMgXY6yAIWbKj0avYxmDxGCp0qmIjFRqxVSFqkJS5ZNpPljJyjdp25knpokz5nAY7DY6rWpYWUnKi+WadOcFe8o2TlFRk7xeqbXVPdHFFFeG618VvHGn6rqFjp/wAF/FWqWdneXFtb38GseF44ryGF2jjuESXWI5EWVVDr5iK+GG5VbIHk4rG0MLy+35le9uWnOfS+vJGVuu9j2cFgK+Lcvq/JeNtZzhDW9vsSlftotT3KivCbb4reOLq4t7aH4L+KnkuJY4YlbWPC4BeRlRQSNYJAJYAkAk9ga91p4LGUManLC8XbTmpyhulfTmSu9H0uGZYCvheV1vZuV7ck4VLWXVRlKy1Wm1ziiiivTOAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA8/1/wz8Sp9d1K68O+PdB0rR7iSFrDTL/wAIXOqXVoqQxxyCS+j1q0jmZ5VeVT5CBUdUPzKSfQKKK9vG5hicZRpUK3Ly0Y8sOWnGDSVkuaUUpS0S3bt1Pl8Bl2GwVetXo83PWlzS5pykr3crqLaUXq9krXt0CiiivLPUCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//2Q==';

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


const updateAssessmentControlFunction: FunctionDeclaration = {
  name: 'update_assessment_control',
  description: "Updates a single control in the assessment with the user's provided information.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      controlCode: {
        type: Type.STRING,
        description: 'The unique code of the control to update, e.g., "SAMA-1.1.1".',
      },
      saudiCeramicsCurrentStatus: {
        type: Type.STRING,
        description: "The user's description of the current implementation status.",
      },
      controlStatus: {
        type: Type.STRING,
        description: "The assessed status of the control. Must be one of: 'Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable'.",
      },
      recommendation: {
        type: Type.STRING,
        description: 'The recommended action to improve the control status.',
      },
      managementResponse: {
        type: Type.STRING,
        description: "The management's response to the finding.",
      },
      targetDate: {
        type: Type.STRING,
        description: "The target date for remediation, in YYYY-MM-DD format.",
      },
    },
    required: ['controlCode', 'controlStatus'],
  },
};

interface NooraAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    assessmentData: AssessmentItem[];
    onUpdateItem: (controlCode: string, updatedItem: AssessmentItem) => void;
    currentControlIndex: number;
    onNextControl: () => void;
    frameworkName: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let nextStartTime = 0;

export const NooraAssistant: React.FC<NooraAssistantProps> = ({ isOpen, onClose, assessmentData, onUpdateItem, currentControlIndex, onNextControl, frameworkName }) => {
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [error, setError] = useState<string | null>(null);
    const sessionPromise = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const sources = useRef(new Set<AudioBufferSourceNode>());
    const streamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

    const stopMicrophone = useCallback(() => {
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
            inputAudioContextRef.current = null;
        }
    }, []);

    const stopPlayback = useCallback(() => {
        if (sources.current.size > 0) {
            sources.current.forEach(source => source.stop());
            sources.current.clear();
        }
        nextStartTime = 0;
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close().catch(console.error);
            outputAudioContextRef.current = null;
        }
    }, []);

    const cleanup = useCallback(() => {
        stopMicrophone();
        stopPlayback();
        if (sessionPromise.current) {
            sessionPromise.current.then(session => session.close()).catch(console.error);
            sessionPromise.current = null;
        }
        setStatus('idle');
    }, [stopMicrophone, stopPlayback]);

    const handleClose = () => {
        cleanup();
        onClose();
    };

    const startSession = useCallback(async () => {
        setError(null);
        if (!process.env.API_KEY) {
            setError("API_KEY environment variable is not set.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext)({ sampleRate: 24000 });
            
            const currentControl = assessmentData[currentControlIndex];
            const systemInstruction = `You are Noora, an AI assistant conducting a ${frameworkName} assessment. Guide the user through the controls one by one. For each control, read its title and description, then ask the user for their assessment. You must then call the 'update_assessment_control' function with the information provided by the user. Do not make up information. Ask clarifying questions if needed. Be concise and professional.
            
            Current Control Context:
            - Control Code: ${currentControl.controlCode}
            - Control Name: ${currentControl.controlName}
            - Current Status: ${currentControl.saudiCeramicsCurrentStatus || 'Not yet assessed.'}
            - Recommendation: ${currentControl.recommendation || 'Not yet provided.'}
            
            Start by saying: "Let's review control ${currentControl.controlCode}: ${currentControl.controlName}. Please provide your assessment."`;
            
            sessionPromise.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('listening');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                            setStatus('speaking');
                            const base64EncodedAudioString = message.serverContent.modelTurn.parts[0].inlineData.data;
                            nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current!.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputAudioContextRef.current!, 24000, 1);
                            const source = outputAudioContextRef.current!.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current!.destination);
                            source.onended = () => {
                                sources.current.delete(source);
                                if (sources.current.size === 0) {
                                    setStatus('listening');
                                }
                            };
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.current.add(source);
                        }
                        
                        if (message.toolCall?.functionCalls) {
                           setStatus('thinking');
                           for(const fc of message.toolCall.functionCalls) {
                               if(fc.name === 'update_assessment_control') {
                                   const args = fc.args;
                                   const currentItem = assessmentData.find(item => item.controlCode === args.controlCode);
                                   if (currentItem) {
                                       const updated: AssessmentItem = { ...currentItem, ...args };
                                       onUpdateItem(args.controlCode, updated);
                                       sessionPromise.current?.then(session => {
                                           session.sendToolResponse({
                                               functionResponses: { id: fc.id, name: fc.name, response: { result: "OK, control updated." } }
                                           });
                                       });
                                       setTimeout(() => { // Give a moment for the state to update visually
                                           onNextControl();
                                       }, 1000);
                                   }
                               }
                           }
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        setError(`Session error: ${e.message}`);
                        cleanup();
                    },
                    onclose: () => {
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction,
                    tools: [{ functionDeclarations: [updateAssessmentControlFunction] }]
                },
            });

        } catch (err) {
            setError("Failed to get microphone permissions. Please enable them in your browser settings.");
            console.error(err);
        }
    }, [assessmentData, currentControlIndex, onUpdateItem, onNextControl, cleanup, frameworkName]);

    useEffect(() => {
        if (isOpen) {
            startSession();
        } else {
            cleanup();
        }

        return () => {
            cleanup();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);
    
    // Relaunch session when control index changes
    useEffect(() => {
        if(isOpen && currentControlIndex > 0) {
             cleanup();
             setTimeout(() => startSession(), 100); // Small delay to ensure resources are released
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentControlIndex]);

    if (!isOpen) return null;

    const getStatusText = () => {
        switch (status) {
            case 'listening': return 'Listening...';
            case 'thinking': return 'Thinking...';
            case 'speaking': return 'Speaking...';
            default: return 'Initializing...';
        }
    };
    
    const currentControl = assessmentData[currentControlIndex];

    return (
        <div className="fixed inset-0 bg-black/80 z-[200] flex flex-col items-center justify-center p-4 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-white/10 dark:bg-gray-800/50 rounded-2xl p-8 w-full max-w-2xl text-white text-center" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                     <div className="text-left">
                        <p className="text-sm text-gray-400">{frameworkName} Voice Assessment</p>
                        <p className="font-semibold">{`Control ${currentControlIndex + 1} of ${assessmentData.length}`}</p>
                     </div>
                     <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/20">
                        <CloseIcon className="w-6 h-6 text-white" />
                    </button>
                </div>
                
                <div className="relative w-48 h-48 mx-auto mb-6">
                    <div className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
                        status === 'listening' ? 'border-blue-500 animate-pulse' :
                        status === 'thinking' ? 'border-purple-500 animate-spin' :
                        status === 'speaking' ? 'border-teal-400 scale-110' :
                        'border-gray-500'
                    }`}></div>
                    <img src={nooraAvatar} alt="Noora AI Assistant" className="w-full h-full rounded-full object-cover p-2"/>
                </div>

                <p className="text-xl font-medium h-8">{getStatusText()}</p>
                
                <div className="mt-8 p-4 bg-black/20 rounded-lg text-left">
                    <p className="font-mono text-teal-400 text-sm">{currentControl.controlCode}</p>
                    <p className="mt-1 font-semibold">{currentControl.controlName}</p>
                </div>

                {error && <p className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            </div>
        </div>
    );
};
