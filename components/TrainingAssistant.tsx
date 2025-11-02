

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import type { TrainingCourse, UserTrainingProgress, Lesson } from '../types';
import { CloseIcon, MicrophoneIcon } from './Icons';

const nooraAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeYAAAHxCAYAAABa23SIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAP+lSURBVHhe7J0FWFzVtwdwAgIggoAIIoACIiAoKAhIsiAoKChIkqCCoiiwgggoiAqIoCAgIIoggoCCCIIgKAgICAgICAgICAgICCIIgn901929Xj9n5s2beTN/T3dPd09V1VVPVfX2mXGGMQxjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQ-all';

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

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let nextStartTime = 0;

interface TrainingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  courses: TrainingCourse[];
  userProgress: UserTrainingProgress;
  onUpdateProgress: (courseId: string, lessonId: string, score?: number) => void;
  onSelectCourse: (course: TrainingCourse) => void;
}

export const TrainingAssistant: React.FC<TrainingAssistantProps> = ({ isOpen, onClose, courses, userProgress, onUpdateProgress, onSelectCourse }) => {
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [conversation, setConversation] = useState<{ speaker: 'user' | 'assistant', text: string, id: string }[]>([]);
    
    // Internal state for tracking training progress
    const [activeCourse, setActiveCourse] = useState<TrainingCourse | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [quizResults, setQuizResults] = useState<boolean[]>([]);

    const conversationRef = useRef(conversation);
    const currentTurnId = useRef<string | null>(null);

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
        setActiveCourse(null);
        setActiveLesson(null);
        setQuestionIndex(0);
        setQuizResults([]);
    }, []);
    
    const functionDeclarations = useMemo<FunctionDeclaration[]>(() => [
        { name: 'select_course', description: 'Selects a training course to begin.', parameters: { type: Type.OBJECT, properties: { courseId: { type: Type.STRING } }, required: ['courseId'] } },
        { name: 'select_lesson', description: 'Selects a lesson to start.', parameters: { type: Type.OBJECT, properties: { lessonId: { type: Type.STRING } }, required: ['lessonId'] } },
        { name: 'answer_question', description: 'Submits an answer for the current quiz question.', parameters: { type: Type.OBJECT, properties: { answerIndex: { type: Type.NUMBER } }, required: ['answerIndex'] } },
        { name: 'complete_lesson', description: 'Marks the current lesson as complete.', parameters: { type: Type.OBJECT, properties: {}, required: [] } },
        { name: 'go_back', description: 'Goes back to the previous context (e.g., from lesson to course list).', parameters: { type: Type.OBJECT, properties: {}, required: [] } }
    ], []);

    const systemInstruction = useMemo(() => {
        let instruction = `You are Noora, an AI Training Mentor. Guide the user through their cybersecurity training via voice. Use the provided functions to navigate and complete training modules.`;

        if (activeLesson?.quiz && activeLesson.quiz.questions[questionIndex]) {
            const q = activeLesson.quiz.questions[questionIndex];
            instruction += ` You are in a quiz for lesson "${activeLesson.title}". Read the question and options, then use 'answer_question' with the user's choice. Question ${questionIndex + 1}: "${q.question}". Options are: ${q.options.map((o, i) => `${i}: ${o}`).join(', ')}.`;
        } else if (activeLesson) {
            instruction += ` You are in lesson "${activeLesson.title}". You can read the lesson content if asked. If there's no quiz, ask the user if they'd like to mark it as complete using 'complete_lesson'. Content summary: ${activeLesson.content.substring(0, 200)}`;
        } else if (activeCourse) {
            const lessonList = activeCourse.lessons.map(l => `ID ${l.id}, Title: ${l.title}`).join('; ');
            instruction += ` You are in course "${activeCourse.title}". Ask which lesson to start. Lessons: ${lessonList}. Use 'select_lesson'.`;
        } else {
            const courseList = courses.map(c => `ID ${c.id}, Title: ${c.title}`).join('; ');
            instruction += ` Welcome! Ask which course to start. Available courses: ${courseList}. Use 'select_course'.`;
        }
        return instruction;
    }, [activeCourse, activeLesson, questionIndex, courses]);

    useEffect(() => {
        if (isOpen) {
            const startSession = async () => {
                try {
                    if (!process.env.API_KEY) throw new Error("API key not configured.");
                    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Audio recording not supported.");

                    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    streamRef.current = stream;

                    sessionPromise.current = ai.live.connect({
                        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                        callbacks: {
                            onopen: () => {
                                setStatus('listening');
                                if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed' || !stream) return;
                                const source = inputAudioContextRef.current.createMediaStreamSource(stream);
                                scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                                scriptProcessorRef.current.onaudioprocess = (e) => {
                                    const inputData = e.inputBuffer.getChannelData(0);
                                    const pcmBlob: Blob = { data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)), mimeType: 'audio/pcm;rate=16000' };
                                    sessionPromise.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
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

                                if (message.toolCall?.functionCalls) {
                                    setStatus('thinking');
                                    for (const fc of message.toolCall.functionCalls) {
                                        let result = { result: "OK" };
                                        if (fc.name === 'select_course') {
                                            const course = courses.find(c => c.id === fc.args.courseId);
                                            if(course) setActiveCourse(course);
                                        } else if (fc.name === 'select_lesson' && activeCourse) {
                                            const lesson = activeCourse.lessons.find(l => l.id === fc.args.lessonId);
                                            if(lesson) setActiveLesson(lesson);
                                        } else if (fc.name === 'answer_question' && activeLesson?.quiz) {
                                            const q = activeLesson.quiz.questions[questionIndex];
                                            const isCorrect = q.correctAnswer === fc.args.answerIndex;
                                            const newResults = [...quizResults, isCorrect];
                                            setQuizResults(newResults);

                                            if (questionIndex < activeLesson.quiz.questions.length - 1) {
                                                setQuestionIndex(prev => prev + 1);
                                            } else {
                                                const score = (newResults.filter(Boolean).length / newResults.length) * 100;
                                                if (score >= 50) onUpdateProgress(activeCourse!.id, activeLesson.id, score);
                                                setActiveLesson(null); // Finish lesson
                                            }
                                        } else if (fc.name === 'complete_lesson' && activeCourse && activeLesson) {
                                            onUpdateProgress(activeCourse.id, activeLesson.id);
                                            setActiveLesson(null);
                                        } else if (fc.name === 'go_back') {
                                            if (activeLesson) setActiveLesson(null);
                                            else if (activeCourse) setActiveCourse(null);
                                        }
                                        sessionPromise.current?.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: result } }));
                                    }
                                }

                                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                                if (base64Audio) {
                                    const audioCtx = outputAudioContextRef.current;
                                    if (!audioCtx) return;
                                    if (audioCtx.state === 'suspended') {
                                        audioCtx.resume();
                                    }
                                    setStatus('speaking');
                                    nextStartTime = Math.max(nextStartTime, audioCtx.currentTime);
                                    const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                                    const sourceNode = audioCtx.createBufferSource();
                                    sourceNode.buffer = audioBuffer;
                                    sourceNode.connect(audioCtx.destination);
                                    sourceNode.addEventListener('ended', () => {
                                        sources.current.delete(sourceNode);
                                        if (sources.current.size === 0) setStatus('listening');
                                    });
                                    sourceNode.start(nextStartTime);
                                    nextStartTime += audioBuffer.duration;
                                    sources.current.add(sourceNode);
                                }
                            },
                            onerror: (e) => { console.error(e); setError('Connection error.'); cleanup(); },
                            onclose: () => { cleanup(); },
                        },
                        config: {
                            responseModalities: [Modality.AUDIO], inputAudioTranscription: {}, outputAudioTranscription: {},
                            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                            systemInstruction, tools: [{ functionDeclarations }],
                        },
                    });
                } catch (err: any) {
                    setError(err.message || 'Failed to start session.');
                    cleanup();
                }
            };
            
            // Re-start session if system instruction changes (e.g., new context)
            sessionPromise.current?.then(s => s.close());
            cleanup();
            startSession();

            return () => {
                sessionPromise.current?.then(s => s.close());
                cleanup();
            };
        }
    }, [isOpen, cleanup, functionDeclarations, systemInstruction, courses, onUpdateProgress, activeCourse, activeLesson, questionIndex, quizResults]);

    const handleClose = () => {
        sessionPromise.current?.then(s => s.close());
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[110] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col" style={{height: '85vh', maxHeight: '800px'}}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                     <div className="flex items-center">
                        <img src={nooraAvatar} alt="Noora" className="w-10 h-10 rounded-full mr-3" />
                        <div><h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">AI Training Mentor</h2></div>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><CloseIcon className="w-6 h-6 text-gray-500" /></button>
                </header>
                 <main className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                    <div className="relative mb-6">
                         <div className={`w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                            <MicrophoneIcon className={`w-16 h-16 transition-colors ${status === 'listening' ? 'text-blue-500' : status === 'speaking' ? 'text-teal-500' : 'text-gray-400'}`} />
                        </div>
                        <div className={`absolute -inset-2 rounded-full border-4 animate-pulse ${status === 'listening' ? 'border-blue-400' : ''} ${status === 'speaking' ? 'border-teal-400' : ''} ${status === 'thinking' ? 'border-purple-400' : ''}`}></div>
                    </div>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 capitalize">{status}</p>
                    <div className="mt-6 w-full h-24 text-left p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-y-auto">
                        {conversation.map(c => <div key={c.id}><strong>{c.speaker}: </strong>{c.text}</div>)}
                    </div>
                    {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                </main>
            </div>
        </div>
    );
};