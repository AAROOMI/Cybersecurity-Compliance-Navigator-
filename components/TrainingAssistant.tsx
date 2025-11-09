import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import type { TrainingCourse, UserTrainingProgress, Lesson } from '../types';
import { CloseIcon, MicrophoneIcon } from './Icons';

const nooraAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeYAAAHxCAYAAABa23SIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAP+lSURBVHhe7J0FWFzVtwdwAgIggoAIIoACIiAoKAhIsiAoKChIkqCCoiiwgggoiAqIoCAgIIoggoCCCIIgKAgICAgICAgICAgICCIIgn901929Xj9n5s2beTN/T3dPd09V1VVPVfX2mXGGMQxjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQ-all';

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


interface TrainingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  courses: TrainingCourse[];
  userProgress: UserTrainingProgress;
  onUpdateProgress: (courseId: string, lessonId: string, score?: number) => void;
  onSelectCourse: (course: TrainingCourse) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let nextStartTime = 0;

export const TrainingAssistant: React.FC<TrainingAssistantProps> = ({ isOpen, onClose, courses, userProgress, onUpdateProgress, onSelectCourse }) => {
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [conversation, setConversation] = useState<{ speaker: 'user' | 'assistant', text: string, id: string }[]>([]);
    const conversationRef = useRef(conversation);
    const currentTurnId = useRef<string | null>(null);

    const [activeCourse, setActiveCourse] = useState<TrainingCourse | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [quizState, setQuizState] = useState<{ questionIndex: number, results: boolean[] } | null>(null);

    const sessionPromise = useRef<Promise<LiveSession> | null>(null);
    const sources = useRef(new Set<AudioBufferSourceNode>());
    
    const cleanup = useCallback(() => {
        setStatus('idle');
        sessionPromise.current = null;
        setActiveCourse(null);
        setActiveLesson(null);
        setQuizState(null);
    }, []);

    useEffect(() => {
        if (isOpen) {
            let stream: MediaStream | null = null;
            let scriptProcessor: ScriptProcessorNode | null = null;
            let inputAudioContext: AudioContext | null = null;
            let outputAudioContext: AudioContext | null = null;

            const startSession = async () => {
                try {
                    if (!process.env.API_KEY) throw new Error("API key is not configured.");
                    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Your browser does not support audio recording.");

                    setError(null);
                    setConversation([]);
                    conversationRef.current = [];
                    
                    inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

                    await inputAudioContext.resume();
                    await outputAudioContext.resume();
                    
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                    const systemInstruction = `You are Noora, an AI Training Mentor for the Cybersecurity Controls Navigator. Your goal is to guide users through training courses in a conversational, voice-first manner.
                    - Start by greeting the user and asking which course they'd like to work on. Use the \`list_courses\` function to tell them what's available.
                    - When a user chooses a course, use \`navigate_to_course\` to show it in the UI and then list its lessons using \`list_lessons\`.
                    - When a user wants to start a lesson, use the \`start_lesson\` function. Then, read the lesson's content to them.
                    - If a lesson has a quiz, you must administer it. Read each question and its options clearly. Parse the user's spoken answer (e.g., "The second one," "B," "Integrity") and call \`submit_quiz_answer\` with the corresponding option index (0, 1, 2, etc.). Announce if they were correct or not.
                    - After the quiz is finished, announce their final score and use \`complete_lesson\` to save their progress if they passed (50% or higher).
                    - For lessons without a quiz, simply ask the user to confirm when they're done, then use \`complete_lesson\`.`;
                    
                    const functionDeclarations: FunctionDeclaration[] = [
                        { name: 'list_courses', description: 'Lists all available training courses.', parameters: { type: Type.OBJECT, properties: {}, required: [] } },
                        { name: 'navigate_to_course', description: 'Opens the detail page for a specific course.', parameters: { type: Type.OBJECT, properties: { course_id: { type: Type.STRING, description: 'The ID of the course to open, e.g., "course-fundamentals".' } }, required: ['course_id'] } },
                        { name: 'list_lessons', description: 'Lists all lessons for the currently active course.', parameters: { type: Type.OBJECT, properties: {}, required: [] } },
                        { name: 'start_lesson', description: 'Starts a specific lesson and reads its content.', parameters: { type: Type.OBJECT, properties: { lesson_id: { type: Type.STRING, description: 'The ID of the lesson to start, e.g., "fundamentals-l1".' } }, required: ['lesson_id'] } },
                        { name: 'submit_quiz_answer', description: 'Submits the user\'s answer for the current quiz question.', parameters: { type: Type.OBJECT, properties: { answer_index: { type: Type.NUMBER, description: 'The 0-based index of the user\'s selected answer.' } }, required: ['answer_index'] } },
                        { name: 'complete_lesson', description: 'Marks the current lesson as complete.', parameters: { type: Type.OBJECT, properties: {}, required: [] } }
                    ];

                    sessionPromise.current = ai.live.connect({
                        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                        callbacks: {
                            onopen: () => {
                                if (!stream || !inputAudioContext) return;
                                setStatus('listening');
                                const source = inputAudioContext.createMediaStreamSource(stream);
                                scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                                scriptProcessor.onaudioprocess = (e) => {
                                    const inputData = e.inputBuffer.getChannelData(0);
                                    const pcmBlob = createBlob(inputData);
                                    sessionPromise.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
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
                                        let result: any = { result: "OK" };
                                        
                                        if (fc.name === 'list_courses') {
                                            result = { result: `Available courses are: ${courses.map(c => c.title).join(', ')}.` };
                                        } else if (fc.name === 'navigate_to_course') {
                                            const course = courses.find(c => c.id === fc.args.course_id);
                                            if (course) {
                                                setActiveCourse(course);
                                                onSelectCourse(course);
                                                result = { result: `Navigated to ${course.title}.` };
                                            } else {
                                                result = { result: `Could not find course with ID ${fc.args.course_id}.` };
                                            }
                                        } else if (fc.name === 'list_lessons') {
                                            if (activeCourse) {
                                                result = { result: `Lessons for ${activeCourse.title} are: ${activeCourse.lessons.map(l => l.title).join(', ')}.` };
                                            } else {
                                                result = { result: 'Please select a course first.' };
                                            }
                                        } else if (fc.name === 'start_lesson') {
                                            const lesson = activeCourse?.lessons.find(l => l.id === fc.args.lesson_id);
                                            if (lesson) {
                                                setActiveLesson(lesson);
                                                if (lesson.quiz) {
                                                    setQuizState({ questionIndex: 0, results: [] });
                                                }
                                                result = { result: `Starting lesson: ${lesson.title}. ${lesson.content}` };
                                            } else {
                                                result = { result: `Could not find lesson with ID ${fc.args.lesson_id}.` };
                                            }
                                        } else if (fc.name === 'submit_quiz_answer' && activeLesson?.quiz && quizState) {
                                            const question = activeLesson.quiz.questions[quizState.questionIndex];
                                            const isCorrect = fc.args.answer_index === question.correctAnswer;
                                            const newResults = [...quizState.results, isCorrect];
                                            setQuizState({ ...quizState, results: newResults });
                                            result = { result: isCorrect ? 'Correct!' : `Sorry, the correct answer was ${question.options[question.correctAnswer]}.` };
                                        } else if (fc.name === 'complete_lesson' && activeCourse && activeLesson) {
                                            const score = quizState ? (quizState.results.filter(Boolean).length / activeLesson.quiz!.questions.length) * 100 : undefined;
                                            onUpdateProgress(activeCourse.id, activeLesson.id, score);
                                            setActiveLesson(null);
                                            setQuizState(null);
                                            result = { result: 'Lesson marked as complete.' };
                                        }
                                        
                                        sessionPromise.current?.then(session => session.sendToolResponse({
                                            functionResponses: { id: fc.id, name: fc.name, response: result }
                                        }));
                                    }
                                }
                                
                                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                                if (base64Audio && outputAudioContext) {
                                    setStatus('speaking');
                                    nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                                    const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                                    const sourceNode = outputAudioContext.createBufferSource();
                                    sourceNode.buffer = audioBuffer;
                                    sourceNode.connect(outputAudioContext.destination);
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
                            onerror: (e) => { console.error('Live session error:', e); setError('A connection error occurred.'); cleanup(); },
                            onclose: () => { cleanup(); },
                        },
                        config: {
                            responseModalities: [Modality.AUDIO],
                            inputAudioTranscription: {},
                            outputAudioTranscription: {},
                            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                            systemInstruction,
                            tools: [{ functionDeclarations }],
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
    }, [isOpen, onSelectCourse, onUpdateProgress, cleanup, courses]);
    
    const handleClose = () => {
        sessionPromise.current?.then(session => session.close());
        cleanup();
        onClose();
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[110] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col" style={{height: '85vh', maxHeight: '800px'}}>
                 <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                     <div className="flex items-center">
                        <img src={nooraAvatar} alt="Noora" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">AI Training Mentor</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Live Voice Assistant</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </header>
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
            </div>
        </div>
    );
};
