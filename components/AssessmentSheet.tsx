import React, { useState, useEffect, useRef } from 'react';
import type { AssessmentItem, ControlStatus } from '../types';
import { UploadIcon, PaperClipIcon, CloseIcon, MicrophoneIcon } from './Icons';

const allStatuses: ControlStatus[] = ['Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable'];

interface EditableControlRowProps {
    item: AssessmentItem;
    onUpdateItem: (controlCode: string, updatedItem: AssessmentItem) => void;
    isEditable: boolean;
    canUpdate: boolean;
    index: number;
    isGenerating?: boolean;
    activeField: { controlCode: string | null, field: keyof AssessmentItem | null };
    evidenceRequestControlCode: string | null;
    onEvidenceRequestHandled: () => void;
}

// A component for a single editable control row.
const EditableControlRow: React.FC<EditableControlRowProps> = ({ item, onUpdateItem, isEditable, canUpdate, index, isGenerating, activeField, evidenceRequestControlCode, onEvidenceRequestHandled }) => {
    const [localItem, setLocalItem] = useState(item);
    const [isSaving, setIsSaving] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const rowRef = useRef<HTMLDivElement>(null);
    const [highlightedField, setHighlightedField] = useState<keyof AssessmentItem | null>(null);

    // Speech-to-text state
    const [isListeningFor, setIsListeningFor] = useState<keyof AssessmentItem | null>(null);
    const recognitionRef = useRef<any>(null); // SpeechRecognition

    useEffect(() => {
        setLocalItem(item);
    }, [item]);
    
    useEffect(() => {
        if (activeField.controlCode === item.controlCode && activeField.field) {
            setHighlightedField(activeField.field);
            setTimeout(() => setHighlightedField(null), 2000); // Highlight for 2 seconds
        }
    }, [activeField, item.controlCode]);
    
     useEffect(() => {
        if (evidenceRequestControlCode === item.controlCode) {
            fileInputRef.current?.click();
            onEvidenceRequestHandled();
        }
    }, [evidenceRequestControlCode, item.controlCode, onEvidenceRequestHandled]);

    const handleBlur = () => {
        if (JSON.stringify(localItem) !== JSON.stringify(item)) {
            onUpdateItem(localItem.controlCode, localItem);
            setIsSaving(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = window.setTimeout(() => setIsSaving(false), 2000);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalItem(prev => ({...prev, [name]: value}));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as ControlStatus;
        const newItem = { ...localItem, controlStatus: newStatus };
        setLocalItem(newItem);
        onUpdateItem(newItem.controlCode, newItem);
        setIsSaving(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsSaving(false), 2000);

        if (newStatus === 'Implemented' && !newItem.evidence) {
            if (window.confirm("This control is marked as 'Implemented'. It's recommended to upload supporting evidence (e.g., a policy document, screenshot, or report). Would you like to upload a file now?")) {
                fileInputRef.current?.click();
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("File size cannot exceed 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const dataUrl = loadEvent.target?.result as string;
                const newItem = {
                    ...localItem,
                    evidence: {
                        fileName: file.name,
                        dataUrl: dataUrl
                    }
                };
                setLocalItem(newItem);
                onUpdateItem(newItem.controlCode, newItem);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeEvidence = () => {
        if (window.confirm("Are you sure you want to remove this evidence?")) {
            const { evidence, ...rest } = localItem;
            const newItem = rest as AssessmentItem;
            setLocalItem(newItem);
            onUpdateItem(newItem.controlCode, newItem);
        }
    };

    const toggleSpeechToText = (field: keyof AssessmentItem) => {
        if (isListeningFor === field) {
            recognitionRef.current?.stop();
            setIsListeningFor(null);
            return;
        }

        // FIX: Cast `window` to `any` to resolve TypeScript error for the non-standard SpeechRecognition API.
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported by your browser.");
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => setIsListeningFor(field);
        recognitionRef.current.onend = () => {
            setIsListeningFor(null);
            handleBlur(); // Trigger save on transcription end
        };
        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListeningFor(null);
        };

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript) {
                setLocalItem(prev => ({
                    ...prev,
                    [field]: (prev[field] ? prev[field] + ' ' : '') + transcript
                }));
            }
        };

        recognitionRef.current.start();
    };
    
    const isDisabled = !isEditable || !canUpdate;
    
    const getFieldClass = (fieldName: keyof AssessmentItem) => {
        let baseClass = `mt-1 block w-full text-sm rounded-md bg-transparent border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 transition-shadow`;
        if (highlightedField === fieldName) {
            baseClass += ' ai-active-field';
        }
        return baseClass;
    }
    
    return (
         <div ref={rowRef} className={`p-4 border rounded-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative`}>
             {isSaving && (
                 <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 animate-fade-out">
                     Saved
                 </div>
            )}
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200`}>
                    {index + 1}
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300 font-mono">{item.controlCode}</h3>
                    <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{item.controlName}</p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div className="md:col-span-2 relative">
                            <label htmlFor={`currentStatusDescription-${item.controlCode}`} className={`font-medium text-gray-500 dark:text-gray-400 transition-colors`}>Current Status Description</label>
                            <textarea
                                id={`currentStatusDescription-${item.controlCode}`}
                                name="currentStatusDescription"
                                value={localItem.currentStatusDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isDisabled}
                                rows={2}
                                className={getFieldClass('currentStatusDescription') + ' pr-8'}
                            />
                             {!isDisabled && (
                                <button onClick={() => toggleSpeechToText('currentStatusDescription')} className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-teal-500 rounded-full">
                                    <MicrophoneIcon className={`w-5 h-5 ${isListeningFor === 'currentStatusDescription' ? 'text-red-500 animate-pulse' : ''}`} />
                                </button>
                            )}
                        </div>
                        <div>
                             <label htmlFor={`controlStatus-${item.controlCode}`} className={`font-medium text-gray-500 dark:text-gray-400 transition-colors`}>Control Status</label>
                             <select
                                id={`controlStatus-${item.controlCode}`}
                                name="controlStatus"
                                value={localItem.controlStatus}
                                onChange={handleStatusChange}
                                disabled={isDisabled}
                                className={getFieldClass('controlStatus')}
                            >
                                {allStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="font-medium text-gray-500 dark:text-gray-400">Evidence</label>
                            <div className="mt-1">
                                {localItem.evidence ? (
                                    <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                        <a href={localItem.evidence.dataUrl} download={localItem.evidence.fileName} className="text-sm text-teal-600 dark:text-teal-400 hover:underline truncate flex items-center" title={localItem.evidence.fileName}>
                                            <PaperClipIcon className="w-4 h-4 mr-2 flex-shrink-0"/>
                                            <span className="truncate">{localItem.evidence.fileName}</span>
                                        </a>
                                        {isEditable && canUpdate && (
                                            <button onClick={removeEvidence} className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded-full">
                                                <CloseIcon className="w-4 h-4"/>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-400 italic py-2">No evidence uploaded.</div>
                                )}
                                {isEditable && canUpdate && (
                                     <button type="button" onClick={() => fileInputRef.current?.click()} className={`mt-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center p-1 rounded-md transition-shadow`}>
                                        <UploadIcon className="w-4 h-4 mr-1"/>
                                        {localItem.evidence ? 'Replace Evidence' : 'Upload Evidence'}
                                     </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                                />
                            </div>
                        </div>
                         <div className="md:col-span-2 relative">
                            <label htmlFor={`recommendation-${item.controlCode}`} className={`font-medium text-gray-500 dark:text-gray-400 transition-colors`}>Recommendation</label>
                            <textarea
                                id={`recommendation-${item.controlCode}`}
                                name="recommendation"
                                value={isGenerating ? 'Generating AI recommendation...' : localItem.recommendation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isDisabled || isGenerating}
                                rows={2}
                                className={`${getFieldClass('recommendation')} ${isGenerating ? 'animate-pulse' : ''} pr-8`}
                            />
                            {!isDisabled && !isGenerating && (
                                <button onClick={() => toggleSpeechToText('recommendation')} className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-teal-500 rounded-full">
                                    <MicrophoneIcon className={`w-5 h-5 ${isListeningFor === 'recommendation' ? 'text-red-500 animate-pulse' : ''}`} />
                                </button>
                            )}
                        </div>
                        <div className="relative">
                             <label htmlFor={`managementResponse-${item.controlCode}`} className={`font-medium text-gray-500 dark:text-gray-400 transition-colors`}>Management Response</label>
                            <textarea
                                id={`managementResponse-${item.controlCode}`}
                                name="managementResponse"
                                value={localItem.managementResponse}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isDisabled}
                                rows={2}
                                className={getFieldClass('managementResponse') + ' pr-8'}
                            />
                            {!isDisabled && (
                                <button onClick={() => toggleSpeechToText('managementResponse')} className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-teal-500 rounded-full">
                                    <MicrophoneIcon className={`w-5 h-5 ${isListeningFor === 'managementResponse' ? 'text-red-500 animate-pulse' : ''}`} />
                                </button>
                            )}
                        </div>
                        <div>
                             <label htmlFor={`targetDate-${item.controlCode}`} className={`font-medium text-gray-500 dark:text-gray-400 transition-colors`}>Target Date</label>
                             <input
                                type="date"
                                id={`targetDate-${item.controlCode}`}
                                name="targetDate"
                                value={localItem.targetDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isDisabled}
                                className={getFieldClass('targetDate')}
                            />
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-out {
                    0% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                }
                .animate-fade-out {
                    animation: fade-out 2s ease-out forwards;
                }
                 @keyframes pulse-glow {
                  0%, 100% { box-shadow: 0 0 0 0 rgba(13, 148, 136, 0); }
                  50% { box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.4); }
                }
                .ai-active-field {
                  animation: pulse-glow 1.5s ease-out;
                  border-color: #0d9488 !important; /* teal-600 */
                }
            `}</style>
        </div>
    );
};

interface AssessmentSheetProps {
    filteredDomains: { name: string; items: AssessmentItem[] }[];
    onUpdateItem: (controlCode: string, updatedItem: AssessmentItem) => void;
    isEditable: boolean;
    canUpdate: boolean;
    generatingRecommendationFor?: string | null;
    activeField: { controlCode: string | null, field: keyof AssessmentItem | null };
    evidenceRequestControlCode: string | null;
    onEvidenceRequestHandled: () => void;
}

export const AssessmentSheet: React.FC<AssessmentSheetProps> = ({ filteredDomains, onUpdateItem, isEditable, canUpdate, generatingRecommendationFor, activeField, evidenceRequestControlCode, onEvidenceRequestHandled }) => {
    
    let controlCounter = 0;

    return (
        <div className="space-y-12">
            {filteredDomains.map(({ name: domainName, items: controls }) => {
                const domainStartIndex = controlCounter;
                controlCounter += controls.length;

                return (
                    <div key={domainName} className="bg-transparent space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4">{domainName}</h2>
                        <div className="space-y-6">
                            {controls.map((item, index) => (
                                <EditableControlRow
                                    key={item.controlCode}
                                    item={item}
                                    onUpdateItem={onUpdateItem}
                                    isEditable={isEditable}
                                    canUpdate={canUpdate}
                                    index={domainStartIndex + index}
                                    isGenerating={generatingRecommendationFor === item.controlCode}
                                    activeField={activeField}
                                    evidenceRequestControlCode={evidenceRequestControlCode}
                                    onEvidenceRequestHandled={onEvidenceRequestHandled}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
