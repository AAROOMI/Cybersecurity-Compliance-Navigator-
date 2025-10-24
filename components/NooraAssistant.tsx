


import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import type { AssessmentItem, ControlStatus } from '../types';
import { CloseIcon, MicrophoneIcon } from './Icons';

const nooraAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeYAAAHxCAYAAABa23SIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAP+lSURBVHhe7J0FWFzVtwdwAgIggoAIIoACIiAoKAhIsiAoKChIkqCCoiiwgggoiAqIoCAgIIoggoCCCIIgKAgICAgICAgICAgICCIIgn901929Xj9n5s2beTN/T3dPd09V1VVPVfX2mXGGMQxjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQ-all';

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

interface NooraAssistantProps {
    isAssessing: boolean;
    onClose: () => void;
    assessmentData: AssessmentItem[];
    onUpdateItem: (controlCode: string, updatedItem: AssessmentItem) => void;
    currentControlIndex: number;
    onNextControl: () => void;
    assessmentType: string;
    onInitiate: () => void;
    onActiveFieldChange: (controlCode: string | null, field: keyof AssessmentItem | null) => void;
    onRequestEvidenceUpload: (controlCode: string) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let nextStartTime = 0;

export const NooraAssistant: React.FC<NooraAssistantProps> = ({ isAssessing, onClose, assessmentData, onUpdateItem, currentControlIndex, onNextControl, assessmentType, onInitiate, onActiveFieldChange, onRequestEvidenceUpload }) => {
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [error, setError] = useState<string | null>(null);
    const sessionPromise = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const sources = useRef(new Set<AudioBufferSourceNode>());
    const streamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    
    const updateFunctionDeclaration = useMemo(() => createUpdateFunctionDeclaration(assessmentType), [assessmentType]);

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
            inputAudioContextRef.current.close();
        }
    }, []);

    const cleanup = useCallback(() => {
        setStatus('idle');
        stopMicrophone();
        onActiveFieldChange(null, null);
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
        }
        sessionPromise.current = null;
    }, [stopMicrophone, onActiveFieldChange]);


    useEffect(() => {
        if (isAssessing) {
            const startSession = async () => {
                try {
                    if (!process.env.API_KEY) {
                        throw new Error("API key is not configured.");
                    }
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        throw new Error("Your browser does not support audio recording.");
                    }

                    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    
                    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

                    const currentControl = assessmentData[currentControlIndex];
                    const systemInstruction = `You are Noora, a risk assessment agent specializing in the ${assessmentType} framework. Your role is to conduct a risk assessment by guiding the user through each control via a voice conversation, asking questions, and recording their feedback in a structured format by updating the assessment form.
When the session starts, greet the user and introduce the current control by reading its code and name: "${currentControl.controlCode}: ${currentControl.controlName}".
Then, ask the user to provide their assessment for the following fields:
1. A description of the current status.
2. The control's implementation status ('Implemented', 'Partially Implemented', 'Not Implemented', or 'Not Applicable').
3. Any recommendations for improvement.
4. The management's response to the finding.
5. A target date for remediation, if applicable.
Listen carefully to the user's free-form response.

Your workflow for each user response is:
1.  **Verbal Feedback:** First, provide clear verbal feedback confirming you understood their input (e.g., "Okay, I've noted that the current status is...").
2.  **Compliance Assessment & Written Feedback:** Based on their response, assess it against compliance best practices. If the control is not fully implemented, suggest what a good management response or recommendation would be. For example, if a plan is needed, you might say, "For the management response, we should probably note that the CISO needs to approve the remediation plan by Q3." Generate a concise written summary of this feedback.
3.  **Update the System:** Use the 'update_assessment_control' function to populate the assessment sheet. The 'controlCode' MUST be '${currentControl.controlCode}'. You must infer the 'controlStatus' from the user's language (e.g., "we are fully compliant" means 'Implemented'). All other fields are optional but should be filled if the user provides the information. If the user mentions providing a document or screenshot, verbally prompt them that you are ready for the upload and call the 'request_evidence_upload' function.
4.  **Confirmation and Next Step:** After calling the function and receiving the 'OK' confirmation, verbally confirm to the user that you've updated the assessment sheet. If the control is not 'Implemented', identify the necessary approver for the remediation plan (usually the CISO or department head) and suggest a follow-up action. For instance: "The sheet is updated. For this control, we'll need to track the CISO's approval for the remediation plan." Then, ask them to say 'next' or click the 'Next Control' button when they are ready to proceed.

You can also initiate a new assessment if the user asks you to start over or begin a new assessment. Use the 'initiate_new_assessment' function for this. Be conversational, professional, and encouraging throughout the process.`;

                    sessionPromise.current = ai.live.connect({
                        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                        callbacks: {
                            onopen: () => {
                                setStatus('listening');
                                const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
                                scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                                scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                                    const pcmBlob: Blob = {
                                        data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                        mimeType: 'audio/pcm;rate=16000',
                                    };
                                    if (sessionPromise.current) {
                                       sessionPromise.current.then((session) => {
                                            session.sendRealtimeInput({ media: pcmBlob });
                                        });
                                    }
                                };
                                source.connect(scriptProcessorRef.current);
                                scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
                            },
                            onmessage: async (message: LiveServerMessage) => {
                                if (message.toolCall?.functionCalls) {
                                    setStatus('thinking');
                                    for (const fc of message.toolCall.functionCalls) {
                                        if (fc.name === 'update_assessment_control') {
                                            const args = fc.args;
                                            onActiveFieldChange(args.controlCode, null); // Clear field highlight after update
                                            const originalItem = assessmentData.find(item => item.controlCode === args.controlCode);
                                            if (originalItem) {
                                                const updatedItem: AssessmentItem = { ...originalItem };
                                                for (const key in args) {
                                                    if (args[key] !== undefined && args[key] !== null) {
                                                        (updatedItem as any)[key] = args[key];
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
                                        if (sources.current.size === 0) {
                                            setStatus('listening');
                                        }
                                    });
                                    sourceNode.start(nextStartTime);
                                    nextStartTime += audioBuffer.duration;
                                    sources.current.add(sourceNode);
                                }
                            },
                            onerror: (e: ErrorEvent) => {
                                console.error('Live session error:', e);
                                setError('A connection error occurred.');
                                cleanup();
                            },
                            onclose: () => {
                                cleanup();
                            },
                        },
                        config: {
                            responseModalities: [Modality.AUDIO],
                            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                            systemInstruction: systemInstruction,
                            tools: [{ functionDeclarations: [updateFunctionDeclaration, initiateNewAssessmentDeclaration] }],
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
                if(sessionPromise.current) {
                    sessionPromise.current.then(session => session.close());
                }
                cleanup();
            };
        }
    }, [isAssessing, assessmentData, currentControlIndex, onUpdateItem, cleanup, assessmentType, updateFunctionDeclaration, onInitiate, onActiveFieldChange, onRequestEvidenceUpload]);
    
    const currentControl = assessmentData[currentControlIndex];

    if (!isAssessing) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg flex flex-col" style={{height: '70vh'}}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                     <div className="flex items-center">
                        <img src={nooraAvatar} alt="Noora AI Assistant" className="h-10 w-10 rounded-full mr-3" />
                        <div>
                            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Noora - Voice Assessment</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini Live</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </header>
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                    <div className="relative mb-6">
                        <img src={nooraAvatar} alt="Noora" className="w-32 h-32 rounded-full shadow-lg" />
                        <div className={`absolute -inset-2 rounded-full border-4 animate-pulse
                            ${status === 'listening' ? 'border-blue-400' : ''}
                            ${status === 'speaking' ? 'border-teal-400' : ''}
                            ${status === 'thinking' ? 'border-purple-400' : ''}
                        `}></div>
                    </div>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 capitalize">{status}</p>

                    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg w-full">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Control</p>
                        <p className="text-md font-bold text-gray-900 dark:text-gray-100 mt-1">{currentControl.controlCode}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{currentControl.controlName}</p>
                    </div>

                    {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                </main>
                 <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center gap-4">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                        End Session
                    </button>
                    <button onClick={onNextControl} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
                        Next Control
                    </button>
                </footer>
            </div>
        </div>
    );
};