import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import type { AssessmentItem, ControlStatus } from '../types';
import { CloseIcon, MicrophoneIcon } from './Icons';

const nooraAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeYAAAHxCAYAAABa23SIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAP+lSURBVHhe7J0FWFzVtwdwAgIggoAIIoACIiAoKAhIsiAoKChIkqCCoiiwgggoiAqIoCAgIIoggoCCCIIgKAgICAgICAgICAgICCIIgn901929Xj9n5s2beTN/T3dPd09V1VVPVfX2mXGGMQxjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQ-all';

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

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


const createUpdateFunctionDeclaration = (assessmentType: string): FunctionDeclaration => ({
  name: 'update_assessment_control',
  description: `Updates a single control in the ${assessmentType} assessment with the user's provided information.`,
  parameters: {
    type: Type.OBJECT,
    properties: {
      controlCode: {
        type: Type.STRING,
        description: 'The unique code of the control to update, e.g., "SAMA-1.1.1".',
      },
      currentStatusDescription: {
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
});

const initiateNewAssessmentDeclaration: FunctionDeclaration = {
  name: 'initiate_new_assessment',
  description: 'Initiates a new assessment for the current framework, which will open a confirmation dialog to wipe all existing progress for it.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

const requestEvidenceUploadDeclaration: FunctionDeclaration = {
    name: 'request_evidence_upload',
    description: 'Prompts the user to upload evidence for a specific control when they mention providing a file or document.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            controlCode: {
                type: Type.STRING,
                description: 'The control code for which evidence is being requested.'
            }
        },
        required: ['controlCode']
    }
};

const goToNextControlDeclaration: FunctionDeclaration = {
    name: 'go_to_next_control',
    description: 'Moves the assessment to the next control in the list.',
    parameters: { type: Type.OBJECT, properties: {} },
};

const goToPreviousControlDeclaration: FunctionDeclaration = {
    name: 'go_to_previous_control',
    description: 'Moves the assessment to the previous control in the list.',
    parameters: { type: Type.OBJECT, properties: {} },
};

interface NooraAssistantProps {
    isAssessing: boolean;
    onClose: () => void;
    assessmentData: AssessmentItem[];
    onUpdateItem: (controlCode: string, updatedItem: AssessmentItem) => void;
    currentControlIndex: number;
    onNextControl: () => void;
    onPreviousControl: () => void;
    assessmentType: string;
    onInitiate: () => void;
    onActiveFieldChange: (controlCode: string | null, field: keyof AssessmentItem | null) => void;
    onRequestEvidenceUpload: (controlCode: string) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let nextStartTime = 0;

export const NooraAssistant: React.FC<NooraAssistantProps> = ({ isAssessing, onClose, assessmentData, onUpdateItem, currentControlIndex, onNextControl, onPreviousControl, assessmentType, onInitiate, onActiveFieldChange, onRequestEvidenceUpload }) => {
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [conversation, setConversation] = useState<{ speaker: 'user' | 'assistant', text: string, id: string }[]>([]);
    const conversationRef = useRef<{ speaker: 'user' | 'assistant', text: string, id: string }[]>([]);
    const currentTurnId = useRef<string | null>(null);

    const sessionPromise = useRef<Promise<LiveSession> | null>(null);
    const sources = useRef(new Set<AudioBufferSourceNode>());
    
    const updateFunctionDeclaration = useMemo(() => createUpdateFunctionDeclaration(assessmentType), [assessmentType]);

    const cleanup = useCallback(() => {
        setStatus('idle');
        onActiveFieldChange(null, null);
        sessionPromise.current = null;
    }, [onActiveFieldChange]);


    useEffect(() => {
        if (isAssessing) {
            let stream: MediaStream | null = null;
            let scriptProcessor: ScriptProcessorNode | null = null;
            let inputAudioContext: AudioContext | null = null;
            let outputAudioContext: AudioContext | null = null;

            const startSession = async () => {
                try {
                    if (!process.env.API_KEY) throw new Error("API key is not configured.");
                    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Your browser does not support audio recording.");
                    
                    setConversation([]);
                    conversationRef.current = [];

                    inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    
                    // Resume contexts after user gesture (opening the assistant)
                    await inputAudioContext.resume();
                    await outputAudioContext.resume();
                    
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                    const currentControl = assessmentData[currentControlIndex];
                    const systemInstruction = `You are Noora, an AI consultant conducting a ${assessmentType} assessment. You guide the user through each control via voice, gather their feedback, and immediately update the assessment sheet using functions.

**Your Process for Each Control:**
1.  **Introduce:** Start by greeting the user and clearly stating the current control: "**${currentControl.controlCode}: ${currentControl.controlName}**".
2.  **Question (One by one):** Ask for one piece of information at a time. Start with: "What is the current status description for this control?".
3.  **Listen & Update:** Listen to the response. Once they finish, **immediately narrate and call the \`update_assessment_control\` function** with just the field you asked for (e.g., 'currentStatusDescription'). Example narration: "Got it. Updating the status description now."
4.  **Repeat:** After the update, move to the next field. Ask, "What would you assess the control status to be: Implemented, Partially Implemented, Not Implemented, or Not Applicable?". Listen, then narrate and call the function with the 'controlStatus' field.
5.  **Continue this pattern** for 'Recommendation', 'Management Response', and 'Target Date'. This field-by-field flow makes the assistant feel responsive and "live".
6.  **Evidence Prompt:** If the user mentions a document or file as evidence, call the \`request_evidence_upload\` function.
7.  **Transition:** After all fields are discussed, say "The sheet is updated. When you're ready, just say 'next' or 'previous'". When the user says "next", you **MUST** call the \`go_to_next_control\` function. When they say "previous", you **MUST** call the \`go_to_previous_control\` function.

**Other Functions:**
*   If the user wants to start over, use the \`initiate_new_assessment\` function.

Be conversational and efficient. Your primary function is to act as a scribe, audibly confirming and recording the user's assessment in real-time.`;

                    sessionPromise.current = ai.live.connect({
                        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                        callbacks: {
                            onopen: () => {
                                if (!stream || !inputAudioContext) return;
                                setStatus('listening');
                                const source = inputAudioContext.createMediaStreamSource(stream);
                                scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                                scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                                    const pcmBlob = createBlob(inputData);
                                    if (sessionPromise.current) {
                                       sessionPromise.current.then((session) => {
                                            session.sendRealtimeInput({ media: pcmBlob });
                                        });
                                    }
                                };
                                source.connect(scriptProcessor);
                                scriptProcessor.connect(inputAudioContext.destination);
                            },
                            onmessage: async (message: LiveServerMessage) => {
                                 if (message.serverContent?.inputTranscription) {
                                    const text = message.serverContent.inputTranscription.text;
                                    if (!currentTurnId.current || !currentTurnId.current.endsWith('user')) {
                                        currentTurnId.current = `turn-${Date.now()}-user`;
                                        conversationRef.current = [...conversationRef.current, { speaker: 'user', text, id: currentTurnId.current }];
                                    } else {
                                        conversationRef.current = conversationRef.current.map(turn => 
                                            turn.id === currentTurnId.current ? { ...turn, text: turn.text + text } : turn
                                        );
                                    }
                                    setConversation([...conversationRef.current]);
                                }

                                if (message.serverContent?.outputTranscription) {
                                    const text = message.serverContent.outputTranscription.text;
                                    if (!currentTurnId.current || !currentTurnId.current.endsWith('assistant')) {
                                        currentTurnId.current = `turn-${Date.now()}-assistant`;
                                        conversationRef.current = [...conversationRef.current, { speaker: 'assistant', text, id: currentTurnId.current }];
                                    } else {
                                        conversationRef.current = conversationRef.current.map(turn => 
                                            turn.id === currentTurnId.current ? { ...turn, text: turn.text + text } : turn
                                        );
                                    }
                                    setConversation([...conversationRef.current]);
                                }
                                
                                if (message.serverContent?.turnComplete) {
                                    currentTurnId.current = null;
                                }

                                if (message.toolCall?.functionCalls) {
                                    setStatus('thinking');
                                    for (const fc of message.toolCall.functionCalls) {
                                        if (fc.name === 'update_assessment_control') {
                                            const args = fc.args as Partial<AssessmentItem> & { controlCode: string };
                                            onActiveFieldChange(args.controlCode, null);
                                            const originalItem = assessmentData.find(item => item.controlCode === args.controlCode);
                                            if (originalItem) {
                                                const updatedItem: AssessmentItem = { ...originalItem };
                                                for (const key in args) {
                                                    if (args[key as keyof typeof args] !== undefined && args[key as keyof typeof args] !== null) {
                                                        (updatedItem as any)[key] = args[key as keyof typeof args];
                                                        onActiveFieldChange(args.controlCode, key as keyof AssessmentItem);
                                                    }
                                                }
                                                onUpdateItem(args.controlCode, updatedItem);

                                                sessionPromise.current?.then(session => {
                                                    session.sendToolResponse({
                                                        functionResponses: { id: fc.id, name: fc.name, response: { result: "OK" } }
                                                    });
                                                });
                                            }
                                        }
                                        if (fc.name === 'initiate_new_assessment') {
                                            onInitiate();
                                            sessionPromise.current?.then(session => {
                                                session.sendToolResponse({
                                                    functionResponses: { id: fc.id, name: fc.name, response: { result: "OK, the confirmation dialog has been opened for the user." } }
                                                });
                                            });
                                        }
                                        if (fc.name === 'request_evidence_upload') {
                                            onRequestEvidenceUpload(fc.args.controlCode);
                                            sessionPromise.current?.then(session => {
                                                session.sendToolResponse({
                                                    functionResponses: { id: fc.id, name: fc.name, response: { result: "OK, I have prompted the user to upload evidence." } }
                                                });
                                            });
                                        }
                                        if (fc.name === 'go_to_next_control') {
                                            onNextControl();
                                            sessionPromise.current?.then(session => {
                                                session.sendToolResponse({
                                                    functionResponses: { id: fc.id, name: fc.name, response: { result: "OK, moved to the next control." } }
                                                });
                                            });
                                        }
                                        if (fc.name === 'go_to_previous_control') {
                                            onPreviousControl();
                                            sessionPromise.current?.then(session => {
                                                session.sendToolResponse({
                                                    functionResponses: { id: fc.id, name: fc.name, response: { result: "OK, moved to the previous control." } }
                                                });
                                            });
                                        }
                                    }
                                }

                                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                                if (base64Audio) {
                                    setStatus('speaking');
                                    const audioCtx = outputAudioContext;
                                    if(audioCtx) {
                                        nextStartTime = Math.max(nextStartTime, audioCtx.currentTime);
                                        const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                                        const sourceNode = audioCtx.createBufferSource();
                                        sourceNode.buffer = audioBuffer;
                                        sourceNode.connect(audioCtx.destination);
                                        sourceNode.addEventListener('ended', () => {
                                            sources.current.delete(sourceNode);
                                            if (sources.current.size === 0) {
                                                setStatus('listening');
                                            }
                                        });
                                        sourceNode.start(nextStartTime);
                                        nextStartTime += audioBuffer.duration;
                                        sources.current.add(sourceNode);
                                    }
                                } else if (status === 'speaking' && sources.current.size === 0) {
                                    setStatus('listening');
                                }

                                if (message.serverContent?.interrupted) {
                                    for (const source of sources.current.values()) {
                                        source.stop();
                                        sources.current.delete(source);
                                    }
                                    nextStartTime = 0;
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
                            systemInstruction: systemInstruction,
                            tools: [{ functionDeclarations: [updateFunctionDeclaration, initiateNewAssessmentDeclaration, requestEvidenceUploadDeclaration, goToNextControlDeclaration, goToPreviousControlDeclaration] }],
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
                stream?.getTracks().forEach(track => track.stop());
                scriptProcessor?.disconnect();
                inputAudioContext?.close().catch(console.error);
                outputAudioContext?.close().catch(console.error);
                cleanup();
            };
        }
    }, [isAssessing, currentControlIndex, assessmentData, onUpdateItem, onInitiate, cleanup, onActiveFieldChange, onRequestEvidenceUpload, assessmentType, updateFunctionDeclaration, onNextControl, onPreviousControl]);

    if (!isAssessing) return null;

    const currentControl = assessmentData[currentControlIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[110] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl flex flex-col" style={{height: '90vh', maxHeight: '800px'}}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <img src={nooraAvatar} alt="Noora" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Noora: AI Assessment Assistant</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Live Voice Assessment for {assessmentType}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onPreviousControl} disabled={currentControlIndex === 0} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">
                            &larr; Previous
                        </button>
                        <button onClick={onNextControl} disabled={currentControlIndex >= assessmentData.length - 1} className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400">
                            Next &rarr;
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <CloseIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </header>
                <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <div className="md:w-1/2 p-4 space-y-4 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                         <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300 font-mono">{currentControl?.controlCode}</h3>
                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{currentControl?.controlName}</p>
                        </div>
                         <div className="space-y-3">
                            {conversation.map((turn) => (
                                <div key={turn.id} className={`flex items-start gap-2.5 ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {turn.speaker === 'assistant' && <img src={nooraAvatar} alt="Noora" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                    <div className={`max-w-prose rounded-2xl px-4 py-2 text-sm ${turn.speaker === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                        {turn.text}
                                    </div>
                                </div>
                            ))}
                             {status === 'thinking' && (
                                <div className="flex items-start gap-2.5 justify-start">
                                     <img src={nooraAvatar} alt="Noora" className="w-8 h-8 rounded-full flex-shrink-0" />
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 rounded-bl-none">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-pulse [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-pulse [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 p-4 flex flex-col">
                        <div className="flex-grow overflow-y-auto">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Assessment Sheet (Live View)</h3>
                            {/* Simplified assessment sheet view will go here */}
                             <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-500 dark:text-gray-400">Current Status</p>
                                    <p className="text-gray-800 dark:text-gray-200 h-12">{currentControl?.currentStatusDescription}</p>
                                </div>
                                 <div className="text-sm">
                                    <p className="font-medium text-gray-500 dark:text-gray-400">Control Status</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-semibold">{currentControl?.controlStatus}</p>
                                </div>
                                 <div className="text-sm">
                                    <p className="font-medium text-gray-500 dark:text-gray-400">Recommendation</p>
                                    <p className="text-gray-800 dark:text-gray-200 h-12">{currentControl?.recommendation}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                            <div className="relative inline-block mb-2">
                                <div className={`w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                                    <MicrophoneIcon className={`w-8 h-8 transition-colors ${status === 'listening' ? 'text-blue-500' : status === 'speaking' ? 'text-teal-500' : 'text-gray-400'}`} />
                                </div>
                                <div className={`absolute -inset-1 rounded-full border-2 animate-pulse
                                    ${status === 'listening' ? 'border-blue-400' : ''}
                                    ${status === 'speaking' ? 'border-teal-400' : ''}
                                    ${status === 'thinking' ? 'border-purple-400' : ''}
                                `}></div>
                            </div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 capitalize">{status}</p>
                            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
