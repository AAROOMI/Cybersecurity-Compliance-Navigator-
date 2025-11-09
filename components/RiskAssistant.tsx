import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import type { Risk } from '../types';
import { CloseIcon, MicrophoneIcon } from './Icons';

const nooraAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeYAAAHxCAYAAABa23SIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAP+lSURBVHhe7J0FWFzVtwdwAgIggoAIIoACIiAoKAhIsiAoKChIkqCCoiiwgggoiAqIoCAgIIoggoCCCIIgKAgICAgICAgICAgICCIIgn901929Xj9n5s2beTN/T3dPd09V1VVPVfX2mXGGMQxjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQhjGMMYxjCGgQ-all';

// Audio utility functions
// ... (encode, decode, decodeAudioData, createBlob functions as defined in other assistants)

interface RiskAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    riskToAssess: Risk | null;
    onUpdateRisk: (updatedRisk: Risk) => void;
    onSetActiveField: (riskId: string | null, field: keyof Risk | null) => void;
    onRequestEvidenceUpload: (risk: Risk) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let nextStartTime = 0;

export const RiskAssistant: React.FC<RiskAssistantProps> = ({ isOpen, onClose, riskToAssess, onUpdateRisk, onSetActiveField, onRequestEvidenceUpload }) => {
    // ... (State for status, error, conversation, refs for session, sources, etc.)

    const functionDeclarations = useMemo<FunctionDeclaration[]>(() => [
        // ... (Function declarations for update_risk_field, prompt_for_evidence, etc.)
    ], []);

    useEffect(() => {
        if (isOpen && riskToAssess) {
            // ... (Full Gemini Live API setup logic from NooraAssistant/RiskAssistant)
            // The system instruction will be dynamic based on `riskToAssess`
            const systemInstruction = `You are Noora, an AI Risk Consultant. You will guide the user through assessing risk ID ${riskToAssess.id}. 
            Your process is to ask for one piece of information at a time, wait for the user's response, and then immediately call the function to update that single field.
            1. Start by asking for 'assessmentNotes'.
            2. Then ask for 'mitigation'. If they mention a file, call 'prompt_for_evidence'.
            3. Then ask for 'likelihood' and 'impact', parsing their spoken answer (e.g., 'high', '3') into a number from 1-5.
            4. Finally, ask for the overall 'status' (e.g., 'Assessed', 'Mitigated').
            5. After each user response, call 'update_risk_field' and verbally confirm the update.`;

            // ... (The rest of the `ai.live.connect` call with callbacks)
        }
    }, [isOpen, riskToAssess, onUpdateRisk, onSetActiveField, onRequestEvidenceUpload]);

    // ... (handleClose function)
    
    if (!isOpen || !riskToAssess) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[110] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col" style={{height: '85vh'}}>
                {/* ... (Modal Header with risk ID and title) ... */}
                <main className="flex-1 flex flex-col p-4 overflow-y-auto">
                    {/* ... (Conversation transcript UI) ... */}
                    {/* ... (Status indicator UI) ... */}
                </main>
            </div>
        </div>
    );
};
