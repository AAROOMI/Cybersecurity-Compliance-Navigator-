import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import type { PolicyDocument, UserRole, DocumentStatus, Control, Subdomain, Domain, GeneratedContent, PrebuiltPolicyTemplate, User, Permission, CompanyProfile } from '../types';
import { eccData } from '../data/controls';
import { policyTemplates } from '../data/templates';
import { CheckIcon, CloseIcon, SparklesIcon } from './Icons';

// Use declare to get libraries from the global scope (from script tags)
declare const jspdf: any;
declare const html2canvas: any;

// Helper to get status color
const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
        case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'Pending CISO Approval':
        case 'Pending CTO Approval':
        case 'Pending CIO Approval':
        case 'Pending CEO Approval': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const statusToRoleMap: Record<string, UserRole> = {
    'Pending CISO Approval': 'CISO',
    'Pending CTO Approval': 'CTO',
    'Pending CIO Approval': 'CIO',
    'Pending CEO Approval': 'CEO',
};


const renderMarkdown = (markdown: string) => {
    // This is a simplified markdown renderer
    let html = markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-8 mb-4">$1</h1>')
        .replace(/^\s*[-*] (.*$)/gim, '<li class="mb-1 ml-4">$1</li>')
        .replace(/<\/li><li/gim, '</li><li') // fix lists
        .replace(/\n/g, '<br/>');

    // Wrap list items in <ul>
    html = html.replace(/<li/gim, '<ul><li').replace(/<\/li><br\/><ul><li/gim, '</li><li').replace(/<\/li><br\/>/gim, '</li></ul><br/>');
    // Clean up any remaining list tags
    const listCount = (html.match(/<ul/g) || []).length;
    const endListCount = (html.match(/<\/ul/g) || []).length;
    if (listCount > endListCount) {
        html += '</ul>'.repeat(listCount - endListCount);
    }
    
    return `<div class="prose max-w-none text-gray-800">${html.replace(/<br\/><br\/>/g, '</p><p>').replace(/<br\/>/g, '')}</div>`;
};

interface DocumentHeaderProps {
  doc: PolicyDocument;
  company: CompanyProfile;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ doc, company }) => {
    const identifierData = useMemo(() => {
        for (const domain of eccData) {
            for (const subdomain of domain.subdomains) {
                const control = subdomain.controls.find(c => c.id === doc.controlId);
                if (control) {
                    return { domain, subdomain, control };
                }
            }
        }
        return null;
    }, [doc.controlId]);

    const controlIdentifier = useMemo(() => {
        if (!identifierData) return '';
        const { domain, subdomain, control } = identifierData;
        return `ECC://${domain.id}/${subdomain.id}/${control.id}`;
    }, [identifierData]);


    if (!identifierData && !doc.controlId.startsWith('REPORT-')) { // Allow reports to render without ECC data
        return null;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border dark:border-gray-700 space-y-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {company.logo && <img src={company.logo} alt={`${company.name} Logo`} className="h-16 w-16 object-contain" />}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{company.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Policy Document</p>
                    </div>
                </div>
            </div>
            {controlIdentifier && (
                <div className="border-t dark:border-gray-700 pt-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Control Identifier</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">{controlIdentifier}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// A dedicated component for clean, off-screen rendering for exports
const ExportableDocumentContent: React.FC<{ doc: PolicyDocument, company: CompanyProfile }> = ({ doc, company }) => {
    return (
        <div className="p-8 bg-white text-black font-sans">
            <DocumentHeader doc={doc} company={company} />
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Policy Document: {doc.controlId}</h1>
            <p className="text-sm text-gray-600 mb-6">{doc.domainName} &gt; {doc.subdomainTitle}</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-gray-800">Policy</h2>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content.policy) }} />

            <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-gray-800">Procedure</h2>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content.procedure) }} />

            <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-gray-800">Guideline</h2>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content.guideline) }} />

            <footer className="mt-12 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Document Verification</h3>
                <div className="flex items-center justify-between gap-4" style={{ pageBreakInside: 'avoid' }}>
                    {doc.qrCodeDataUrl && (
                        <div className="text-center">
                            <img src={doc.qrCodeDataUrl} alt="QR Code" style={{ width: '112px', height: '112px', margin: '0 auto' }} />
                            <p className="text-xs text-gray-500 mt-1">Scan for Document ID</p>
                        </div>
                    )}
                    {doc.barcodeDataUrl && (
                        <div className="text-center flex-1">
                            <img src={doc.barcodeDataUrl} alt="Barcode" style={{ height: '80px', margin: '0 auto' }} />
                            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'monospace' }}>{doc.id}</p>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};


interface DocumentDetailModalProps {
  doc: PolicyDocument;
  onClose: () => void;
  currentUser: User;
  onApprovalAction: (documentId: string, decision: 'Approved' | 'Rejected', comments?: string) => void;
  permissions: Set<Permission>;
  company: CompanyProfile;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({ doc, onClose, currentUser, onApprovalAction, permissions, company }) => {
    const [activeTab, setActiveTab] = useState<'policy' | 'procedure' | 'guideline'>('policy');
    
    const canApprove = permissions.has('documents:approve');
    const isActionable = canApprove && statusToRoleMap[doc.status] === currentUser.role;
    const isPending = doc.status.startsWith('Pending');

    const handleDecision = (decision: 'Approved' | 'Rejected') => {
        const promptMessage = decision === 'Approved'
            ? 'You are about to approve this document. Please provide any optional comments.'
            : 'You are about to reject this document. Please provide any optional comments.';
        const comments = prompt(promptMessage);

        if (comments !== null) {
            onApprovalAction(doc.id, decision, comments || undefined);
        }
    };

    const prepareExportableElement = (docToExport: PolicyDocument): Promise<HTMLElement> => {
        return new Promise((resolve) => {
            const exportContainer = document.createElement('div');
            // Style for off-screen rendering
            exportContainer.style.position = 'absolute';
            exportContainer.style.left = '-9999px';
            exportContainer.style.width = '210mm'; // A4 width
            document.body.appendChild(exportContainer);

            const root = ReactDOM.createRoot(exportContainer);
            root.render(<ExportableDocumentContent doc={docToExport} company={company} />);

            // Short delay to ensure all content (including canvas elements) is rendered
            setTimeout(() => {
                resolve(exportContainer);
            }, 500);
        });
    };

    const cleanupExportableElement = (element: HTMLElement) => {
        // Unmount React component and remove the element from the DOM
        const root = (element as any)._reactRootContainer;
        if (root) {
            root.unmount();
        }
        document.body.removeChild(element);
    };

    const handleDownloadPDF = async () => {
        const exportElement = await prepareExportableElement(doc);
        if (!exportElement) return;

        const { jsPDF } = jspdf;
        const canvas = await html2canvas(exportElement, { scale: 2, useCORS: true });
        
        cleanupExportableElement(exportElement);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = -(pdfHeight - heightLeft);
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`policy-${doc.controlId}.pdf`);
    };

    const handleDownloadWord = async () => {
        const exportElement = await prepareExportableElement(doc);
        if (!exportElement) return;

        const htmlToDocxLib = (window as any).htmlToDocx;

        if (!htmlToDocxLib || typeof htmlToDocxLib.asBlob !== 'function') {
            console.error('html-to-docx-ts library not found or asBlob method is missing.');
            alert('Error: Word export functionality is unavailable.');
            cleanupExportableElement(exportElement);
            return;
        }
        
        const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Policy ${doc.controlId}</title></head><body>${exportElement.innerHTML}</body></html>`;
        
        cleanupExportableElement(exportElement);

        try {
            const blob = await htmlToDocxLib.asBlob(htmlContent, {
                footer: true,
                pageNumber: true,
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `policy-${doc.controlId}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error generating DOCX file:', error);
            alert('An error occurred while generating the Word document.');
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 shrink-0">
                    <div className="flex items-center gap-x-4 sm:gap-x-6">
                        <div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Control</span>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">{doc.controlId}</p>
                        </div>
                        <div className="h-10 border-l border-gray-200 dark:border-gray-600"></div>
                        <div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</span>
                            <p className={`mt-1 px-2.5 py-0.5 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                {doc.status}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <div className="text-right hidden sm:block">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Path</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{doc.domainName} &gt; {doc.subdomainTitle}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <CloseIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <div>
                        <DocumentHeader doc={doc} company={company} />
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                {['policy', 'procedure', 'guideline'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 max-h-[45vh] overflow-y-auto">
                           <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content[activeTab]) }} />
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Approval History</h3>
                        {doc.approvalHistory.length > 0 ? (
                             <ul className="space-y-4">
                                {doc.approvalHistory.map((step, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className={`mt-1 flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full ${step.decision === 'Approved' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                            {step.decision === 'Approved' ? <CheckIcon className="h-4 w-4"/> : <CloseIcon className="h-4 w-4"/>}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{step.decision} by {step.role}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(step.timestamp).toLocaleString()}</p>
                                            {step.comments && (
                                                <blockquote className="mt-2 pl-3 border-l-2 border-gray-200 dark:border-gray-600">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{step.comments}"</p>
                                                </blockquote>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No approval history yet.</p>
                        )}
                    </div>
                    <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Document Verification</h3>
                        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            {doc.qrCodeDataUrl && (
                                <div className="text-center">
                                    <img src={doc.qrCodeDataUrl} alt="QR Code for Document ID" className="w-28 h-28 mx-auto bg-white p-1" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Scan for Document ID</p>
                                </div>
                            )}
                            {doc.barcodeDataUrl && (
                                <div className="text-center flex-1">
                                    <img src={doc.barcodeDataUrl} alt="Barcode for Document ID" className="h-20 mx-auto bg-white p-2 rounded" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">{doc.id}</p>
                                </div>
                            )}
                        </div>
                    </footer>
                </main>
                <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <button onClick={handleDownloadPDF} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Download PDF</button>
                      <button onClick={handleDownloadWord} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Download Word</button>
                    </div>
                    {isPending && isActionable && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDecision('Rejected')}
                                className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                title="Reject this document"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleDecision('Approved')}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                title="Approve this document"
                            >
                                Approve
                            </button>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};

interface TemplatesViewProps {
    onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, generatedBy?: 'user' | 'AI Agent') => void;
    permissions: Set<Permission>;
}

const TemplatesView: React.FC<TemplatesViewProps> = ({ onAddDocument, permissions }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<PrebuiltPolicyTemplate | null>(null);
    const [selectedControl, setSelectedControl] = useState<string>('');
    const [previewTab, setPreviewTab] = useState<'policy' | 'procedure' | 'guideline'>('policy');
    const canApplyTemplate = permissions.has('templates:apply');

    const allControls = useMemo(() => eccData.flatMap(domain => domain.subdomains.flatMap(subdomain => subdomain.controls.map(control => ({...control, subdomain, domain})))), []);
    
    useEffect(() => {
        if (selectedTemplate) {
            setPreviewTab('policy');
        }
    }, [selectedTemplate]);

    const handleUseTemplate = () => {
        if (selectedTemplate && selectedControl) {
            const controlData = allControls.find(c => c.id === selectedControl);
            if(controlData) {
                onAddDocument(controlData, controlData.subdomain, controlData.domain, selectedTemplate.content);
                alert(`Template '${selectedTemplate.title}' applied to control ${selectedControl} and sent for approval.`);
                setSelectedControl('');
                setSelectedTemplate(null);
            }
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Policy Templates</h3>
                {policyTemplates.map(template => (
                    <button key={template.id} onClick={() => setSelectedTemplate(template)} className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${selectedTemplate?.id === template.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{template.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                    </button>
                ))}
            </div>
            {selectedTemplate && (
                 <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 self-start">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Apply Template: <span className="text-teal-600 dark:text-teal-400">{selectedTemplate.title}</span></h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Select a control to apply this policy template to. This will create a new document and start the approval process.</p>
                        <div className="space-y-4">
                            <label htmlFor="control-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Control</label>
                            <select 
                                id="control-select" 
                                value={selectedControl} 
                                onChange={(e) => setSelectedControl(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                            >
                                <option value="">-- Select a Control --</option>
                                {allControls.map(c => <option key={c.id} value={c.id}>{c.id}: {c.description.substring(0, 80)}...</option>)}
                            </select>
                            {canApplyTemplate ? (
                                <button 
                                    onClick={handleUseTemplate} 
                                    disabled={!selectedControl}
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Use This Template
                                </button>
                            ) : (
                                <div className="p-3 text-center bg-gray-100 dark:bg-gray-700/50 rounded-md">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        You do not have permission to apply templates.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">Template Preview</h4>
                        <div className="border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                            <div className="border-b border-gray-200 dark:border-gray-600">
                                <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                                    <button
                                        onClick={() => setPreviewTab('policy')}
                                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${previewTab === 'policy' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                    >
                                        Policy
                                    </button>
                                    <button
                                        onClick={() => setPreviewTab('procedure')}
                                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${previewTab === 'procedure' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                    >
                                        Procedure
                                    </button>
                                    <button
                                        onClick={() => setPreviewTab('guideline')}
                                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${previewTab === 'guideline' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                    >
                                        Guideline
                                    </button>
                                </nav>
                            </div>
                            <div className="p-4 max-h-80 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 rounded-b-md">
                                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedTemplate.content[previewTab]) }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


interface DocumentsPageProps {
  repository: PolicyDocument[];
  currentUser: User;
  onApprovalAction: (documentId: string, decision: 'Approved' | 'Rejected', comments?: string) => void;
  onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, generatedBy?: 'user' | 'AI Agent') => void;
  permissions: Set<Permission>;
  company: CompanyProfile;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ repository, currentUser, onApprovalAction, onAddDocument, permissions, company }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'all' | 'templates'>('tasks');
  const [selectedDoc, setSelectedDoc] = useState<PolicyDocument | null>(null);

  const myTasks = useMemo(() => 
    repository.filter(doc => statusToRoleMap[doc.status] === currentUser.role),
    [repository, currentUser]
  );
  
  const sortedRepo = useMemo(() => 
    [...repository].sort((a, b) => b.updatedAt - a.updatedAt),
    [repository]
  );

  const renderTable = (docs: PolicyDocument[]) => (
    <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Control</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                       {docs.map(doc => (
                           <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{doc.controlId}</span>
                                    {doc.generatedBy === 'AI Agent' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                            <SparklesIcon className="w-3 h-3" />
                                            AI-Generated
                                        </span>
                                    )}
                                   </div>
                                   <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{doc.controlDescription}</div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center space-x-2">
                                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                           {doc.status}
                                       </span>
                                       {doc.status.startsWith('Pending') && statusToRoleMap[doc.status] && (
                                           <div className="flex items-center text-xs text-gray-500 dark:text-gray-400" title={`Waiting for ${statusToRoleMap[doc.status]} approval`}>
                                               <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                                               <span className="font-semibold">{statusToRoleMap[doc.status]}</span>
                                           </div>
                                       )}
                                   </div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(doc.updatedAt).toLocaleDateString()}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                   <button onClick={() => setSelectedDoc(doc)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">View</button>
                               </td>
                           </tr>
                       ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Document Management</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Review, approve, and manage all cybersecurity policy documents.</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('tasks')} className={`relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                My Tasks
                {myTasks.length > 0 && <span className="ml-2 absolute top-3 -right-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{myTasks.length}</span>}
            </button>
            <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}>All Documents</button>
            {permissions.has('templates:read') && (
                <button onClick={() => setActiveTab('templates')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'templates' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}>Templates</button>
            )}
        </nav>
      </div>

      <div>
        {activeTab === 'tasks' && (myTasks.length > 0 ? renderTable(myTasks) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">You have no pending tasks.</p>)}
        {activeTab === 'all' && (sortedRepo.length > 0 ? renderTable(sortedRepo) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">No documents have been generated yet.</p>)}
        {activeTab === 'templates' && <TemplatesView onAddDocument={onAddDocument} permissions={permissions} />}
      </div>
      
      {selectedDoc && <DocumentDetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} currentUser={currentUser} onApprovalAction={onApprovalAction} permissions={permissions} company={company} />}
    </div>
  );
};