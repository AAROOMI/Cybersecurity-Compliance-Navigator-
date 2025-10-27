
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import type { AssessmentItem, ControlStatus } from '../types';
import { CloseIcon, MicrophoneIcon } from './Icons';

const nooraAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeYAAAHxCAYAAABa23SIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAP+lSURBVHhe7J0FWFzVtwdwAgIggoAIIoACIiAoKAhIsiAoKChIkqCCoiiwgggoiAqIoCAgIIoggoCCCIIgKAgICAgICAgICAgICCIIgn901929Xj9n5s2beTN/T3dPd09V1VVPVfX2mXGGMQxjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQ-all';

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
    const [conversation, setConversation] = useState<{ speaker: 'user' | 'assistant', text: string, id: string }[]>([]);
    const conversationRef = useRef<{ speaker: 'user' | 'assistant', text: string, id: string }[]>([]);
    const currentTurnId = useRef<string | null>(null);

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
            inputAudioContextRef.current.close().catch(console.error);
        }
    }, []);

    const cleanup = useCallback(() => {
        setStatus('idle');
        stopMicrophone();
        onActiveFieldChange(null, null);
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close().catch(console.error);
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
                    setConversation([]);
                    conversationRef.current = [];

                    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    
                    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

                    const currentControl = assessmentData[currentControlIndex];
                    const systemInstruction = `You are Noora, an agentic AI consultant conducting a ${assessmentType} assessment. You will guide the user through each control via a voice conversation. Your primary goal is to gather feedback and immediately update the assessment sheet using the provided functions.

**Your Process for Each Control:**
1.  **Introduce:** Start by greeting the user and clearly stating the current control you are assessing. Read its code and name: "**${currentControl.controlCode}: ${currentControl.controlName}**".
2.  **Question:** Ask the user for their assessment of this control. Prompt them for details on the current status, implementation level, recommendations, and management response.
3.  **Listen & Narrate:** As the user speaks, listen carefully. Before you call a function to update the sheet, you **MUST** provide explicit verbal narration of the action you are about to take. This is critical for transparency.
    *   *Example Narration:* "Okay, thank you. I'm now updating the 'Current Status Description' to reflect that 'a basic email system is in place but lacks tracking'."
    *   *Example Narration:* "Understood. I'll set the 'Control Status' to 'Partially Implemented'."
4.  **Function Call:** Immediately after narrating, call the \`update_assessment_control\` function to record the data. The \`controlCode\` for this control is **'${currentControl.controlCode}'**. You must infer the \`controlStatus\` from the user's language (e.g., "we're fully compliant" means 'Implemented').
5.  **Evidence Prompt:** If the user mentions providing a document, file, or screenshot as evidence, you must verbally confirm and then call the \`request_evidence_upload\` function.
    *   *Example Narration:* "Okay, you mentioned a policy document. I'll prompt you to upload that now." Then, call the function.
6.  **Confirmation & Transition:** After the function call is confirmed, verbally state that the sheet has been updated. Then, smoothly transition to the next step. Say, "The sheet is updated. When you're ready for the next control, just say 'next' or click the 'Next Control' button."

**Other Functions:**
*   If the user wants to start over, use the \`initiate_new_assessment\` function.

Be conversational, professional, and efficient. Your primary function is to act as a scribe, visibly and audibly recording the user's assessment in real-time.`;

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
                                    }
                                }

                                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                                if (base64Audio) {
                                    setStatus('speaking');
                                    const audioCtx = outputAudioContextRef.current;
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
                            tools: [{ functionDeclarations: [updateFunctionDeclaration, initiateNewAssessmentDeclaration, requestEvidenceUploadDeclaration] }],
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
    }, [isAssessing, currentControlIndex, onUpdateItem, onInitiate, cleanup, assessmentType, assessmentData, onActiveFieldChange, updateFunctionDeclaration, onRequestEvidenceUpload]);


    const handleClose = () => {
        sessionPromise.current?.then(session => session.close());
        cleanup();
        onClose();
    };
    
    const currentControl = assessmentData[currentControlIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[110] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col" style={{height: '85vh', maxHeight: '800px'}}>
                 <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                     <div className="flex items-center">
                        <img src={nooraAvatar} alt="Noora" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Noora: AI Voice Assessment</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Assessing: {assessmentType}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </header>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Current Control:</p>
                    <p className="font-mono text-teal-600 dark:text-teal-400">{currentControl.controlCode}: <span className="font-sans text-gray-800 dark:text-gray-200 font-normal">{currentControl.controlName}</span></p>
                </div>
                 
                 <main className="flex-1 flex flex-col p-4 overflow-y-auto">
                    <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                        {conversation.map((turn) => (
                             <div key={turn.id} className={`flex items-start gap-2.5 ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {turn.speaker === 'assistant' && <img src={nooraAvatar} alt="Noora" className="w-8 h-8 rounded-full" />}
                                <div className={`max-w-prose rounded-2xl px-4 py-2 text-sm ${turn.speaker === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                    {turn.text}
                                </div>
                            </div>
                        ))}
                         {status === 'thinking' && (
                             <div className="flex items-start gap-2.5 justify-start">
                                 <img src={nooraAvatar} alt="Noora" className="w-8 h-8 rounded-full" />
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
                </main>
                
                 <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button 
                        onClick={onNextControl}
                        disabled={currentControlIndex >= assessmentData.length - 1}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400"
                    >
                        Next Control &rarr;
                    </button>
                </footer>
            </div>
        </div>
    );
};
