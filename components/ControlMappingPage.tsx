import React, { useState, useMemo, useCallback } from 'react';
import type { Domain, AssessmentItem, ControlMapping, FrameworkName } from '../types';
import { ArrowsRightLeftIcon, SearchIcon } from './Icons';

interface ControlMappingPageProps {
  eccData: Domain[];
  pdplData: AssessmentItem[];
  samaData: AssessmentItem[];
  cmaData: AssessmentItem[];
  hrsdData: AssessmentItem[];
  mappingData: ControlMapping[];
}

type MappedResult = {
  source: { id: string; description: string };
  target: { id: string; description: string };
  justification: string;
};

const frameworks: FrameworkName[] = ['NCA ECC', 'PDPL', 'SAMA CSF', 'CMA', 'HRSD'];

export const ControlMappingPage: React.FC<ControlMappingPageProps> = ({
  eccData,
  pdplData,
  samaData,
  cmaData,
  hrsdData,
  mappingData,
}) => {
  const [sourceFramework, setSourceFramework] = useState<FrameworkName | ''>('');
  const [targetFramework, setTargetFramework] = useState<FrameworkName | ''>('');
  const [mappedResults, setMappedResults] = useState<MappedResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const allControls = useMemo(() => {
    const controls: Record<FrameworkName, Map<string, string>> = {
      'NCA ECC': new Map(),
      'PDPL': new Map(),
      'SAMA CSF': new Map(),
      'CMA': new Map(),
      'HRSD': new Map(),
    };
    eccData.forEach(domain => 
      domain.subdomains.forEach(subdomain => 
        subdomain.controls.forEach(control => 
          controls['NCA ECC'].set(control.id, control.description)
        )
      )
    );
    pdplData.forEach(item => controls['PDPL'].set(item.controlCode, item.controlName));
    samaData.forEach(item => controls['SAMA CSF'].set(item.controlCode, item.controlName));
    cmaData.forEach(item => controls['CMA'].set(item.controlCode, item.controlName));
    hrsdData.forEach(item => controls['HRSD'].set(item.controlCode, item.controlName));
    return controls;
  }, [eccData, pdplData, samaData, cmaData, hrsdData]);

  const handleMapControls = useCallback(() => {
    if (!sourceFramework || !targetFramework) return;
    
    const results: MappedResult[] = [];
    mappingData
      .filter(m => (m.sourceFramework === sourceFramework && m.targetFramework === targetFramework) || (m.sourceFramework === targetFramework && m.targetFramework === sourceFramework))
      .forEach(mapping => {
        let sourceIsFw1 = mapping.sourceFramework === sourceFramework;
        const sourceId = sourceIsFw1 ? mapping.sourceControlId : mapping.targetControlId;
        const targetId = sourceIsFw1 ? mapping.targetControlId : mapping.sourceControlId;
        const sourceDesc = allControls[sourceFramework].get(sourceId);
        const targetDesc = allControls[targetFramework].get(targetId);

        if (sourceDesc && targetDesc) {
          results.push({
            source: { id: sourceId, description: sourceDesc },
            target: { id: targetId, description: targetDesc },
            justification: mapping.justification,
          });
        }
      });
    setMappedResults(results);
    setShowResults(true);
  }, [sourceFramework, targetFramework, mappingData, allControls]);

  const filteredResults = useMemo(() => {
      if (!searchQuery) return mappedResults;
      const lowerQuery = searchQuery.toLowerCase();
      return mappedResults.filter(result => 
        result.source.id.toLowerCase().includes(lowerQuery) ||
        result.source.description.toLowerCase().includes(lowerQuery) ||
        result.target.id.toLowerCase().includes(lowerQuery) ||
        result.target.description.toLowerCase().includes(lowerQuery)
      );
  }, [mappedResults, searchQuery]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Control Framework Mapping</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Compare and map controls between different cybersecurity frameworks to streamline compliance efforts.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
                <label htmlFor="source-framework" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source Framework</label>
                <select id="source-framework" value={sourceFramework} onChange={e => {setSourceFramework(e.target.value as FrameworkName); setShowResults(false);}} className="mt-1 block w-full input-style">
                    <option value="">Select a framework...</option>
                    {frameworks.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="target-framework" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Framework</label>
                <select id="target-framework" value={targetFramework} onChange={e => {setTargetFramework(e.target.value as FrameworkName); setShowResults(false);}} className="mt-1 block w-full input-style">
                    <option value="">Select a framework...</option>
                    {frameworks.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <button
                onClick={handleMapControls}
                disabled={!sourceFramework || !targetFramework || sourceFramework === targetFramework}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Map Controls
            </button>
        </div>
        {sourceFramework && targetFramework && sourceFramework === targetFramework && (
            <p className="text-center text-sm text-red-500 dark:text-red-400 mt-4">Please select two different frameworks to compare.</p>
        )}
      </div>
      
      {showResults && (
        <div>
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Filter mapped controls..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
            </div>

            <div className="space-y-4">
                {filteredResults.length > 0 ? (
                    filteredResults.map((result, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_2fr] gap-4 items-center">
                                <div>
                                    <h4 className="font-semibold font-mono text-sm text-teal-600 dark:text-teal-400">{result.source.id}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{result.source.description}</p>
                                </div>
                                <ArrowsRightLeftIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto" />
                                <div>
                                    <h4 className="font-semibold font-mono text-sm text-teal-600 dark:text-teal-400">{result.target.id}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{result.target.description}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                    <span className="font-semibold">Justification:</span> {result.justification}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                     <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Mappings Found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {searchQuery ? 'No results match your filter.' : `We don't have any predefined mappings between ${sourceFramework} and ${targetFramework} yet.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
      )}
      <style>{`.input-style {
            background-color: white; border: 1px solid #d1d5db; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.5rem 0.75rem; color: #111827;
        }
        .dark .input-style { background-color: #374151; border-color: #4b5563; color: #f9fafb; }
        .input-style:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #14b8a6; border-color: #14b8a6; }
        `}</style>
    </div>
  );
};