
import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import type { PolicyDocument, UserRole, DocumentStatus, Control, Subdomain, Domain, GeneratedContent, PrebuiltPolicyTemplate, User, Permission, CompanyProfile } from '../types';
import { eccData } from '../data/controls';
import { policyTemplates } from '../data/templates';
import { CheckIcon, CloseIcon, ShieldCheckIcon } from './Icons';

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
    const listCount = (html.match(/<ul/g) || []).length;
    const endListCount = (html.match(/<\/ul/g) || []).length;
    if (listCount > endListCount) {
        html += '</ul>'.repeat(listCount - endListCount);
    }
    
    return `<div class="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">${html.replace(/<br\/><br\/>/g, '</p><p>').replace(/<br\/>/g, '')}</div>`;
};

interface DocumentHeaderProps {
  doc: PolicyDocument;
  company: CompanyProfile;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ doc, company }) => {
    // Simple visual barcode representation since we don't have a specific font loaded
    const Barcode = ({ id }: { id: string }) => (
        <div className="flex flex-col items-center">
            <div className="h-12 flex items-end gap-0.5" aria-hidden="true">
                {id.split('').map((char, i) => (
                    <div key={i} className={`w-1 bg-black ${i % 2 === 0 ? 'h-full' : 'h-3/4'}`}></div>
                ))}
                {/* Random filler bars for visual effect */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`fill-${i}`} className={`w-0.5 bg-black ${Math.random() > 0.5 ? 'h-full' : 'h-1/2'}`}></div>
                ))}
            </div>
            <span className="text-[10px] font-mono mt-1 tracking-widest">{id}</span>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-300 mb-6 font-serif text-black">
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-4">
                <div className="flex items-center gap-4">
                    {company.logo && <img src={company.logo} alt="Company Logo" className="h-16 w-auto" />}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                        <p className="text-sm text-gray-600 uppercase tracking-wide">Cybersecurity Compliance Framework</p>
                    </div>
                </div>
                <div className="text-right">
                    {doc.qrCodeUrl && <img src={doc.qrCodeUrl} alt="Document QR" className="h-20 w-20 ml-auto" />}
                </div>
            </div>
            
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Control Identifier: <span className="font-mono text-base font-normal">{doc.controlId}</span></h2>
                    <p className="text-sm text-gray-600">{doc.domainName} &gt; {doc.subdomainTitle}</p>
                </div>
                {doc.barcodeId && <Barcode id={doc.barcodeId} />}
            </div>
        </div>
    );
};

const DigitalSignatureBlock: React.FC<{ doc: PolicyDocument }> = ({ doc }) => {
    const signatures = doc.approvalHistory.filter(step => step.decision === 'Approved' || step.decision === 'Passed');
    
    if (signatures.length === 0) return null;

    return (
        <div className="mt-12 pt-8 border-t-2 border-gray-800 break-inside-avoid">
            <h3 className="text-lg font-bold mb-6 text-gray-800 uppercase tracking-widest">Digital Signatures & Approvals</h3>
            <div className="grid grid-cols-2 gap-8">
                {signatures.map((sig, idx) => (
                    <div key={idx} className="border border-gray-300 p-4 rounded bg-gray-50 relative">
                        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                            {sig.role === 'AI_AGENT' ? 'Automated Verification' : 'Management Approval'}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            {sig.role === 'AI_AGENT' ? <ShieldCheckIcon className="w-8 h-8 text-teal-700" /> : <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-serif font-bold text-gray-600">{sig.role[0]}</div>}
                            <div>
                                <p className="font-bold text-gray-900 font-serif">{sig.agentName || sig.role}</p>
                                <p className="text-xs text-gray-500">{new Date(sig.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-green-700 font-bold uppercase text-xs border border-green-700 px-1 rounded">
                                {sig.decision.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">{sig.signatureId || `SIG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`}</span>
                        </div>
                        {sig.comments && <p className="text-xs text-gray-600 mt-2 italic border-l-2 border-gray-300 pl-2">"{sig.comments}"</p>}
                    </div>
                ))}
            </div>
            <div className="mt-6 text-center text-[10px] text-gray-400 uppercase">
                Generated by CyberNav Agentic Workforce • Top-to-Bottom Methodology • Securely Signed
            </div>
        </div>
    );
};

const ExportableDocumentContent: React.FC<{ doc: PolicyDocument, company: CompanyProfile }> = ({ doc, company }) => {
    return (
        <div className="p-10 bg-white text-black font-serif leading-relaxed max-w-[210mm] mx-auto min-h-[297mm]">
            <DocumentHeader doc={doc} company={company} />
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 border-b-2 border-gray-200 pb-2">Policy Document</h1>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content.policy) }} />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Procedures</h2>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content.procedure) }} />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Guidelines</h2>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content.guideline) }} />
            </div>

            <DigitalSignatureBlock doc={doc} />
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
    const canApprove = permissions.has('documents:approve');
    const isActionable = canApprove && statusToRoleMap[doc.status] === currentUser.role;
    const isPending = doc.status.startsWith('Pending');

    const handleDecision = (decision: 'Approved' | 'Rejected') => {
        const comments = prompt(decision === 'Approved' ? 'Approve with comments?' : 'Reject reason:');
        if (comments !== null) onApprovalAction(doc.id, decision, comments || undefined);
    };

    const handleDownloadPDF = async () => {
        // Create container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);
        
        const root = ReactDOM.createRoot(container);
        root.render(<ExportableDocumentContent doc={doc} company={company} />);
        
        // Wait for render
        await new Promise(r => setTimeout(r, 1000));

        const { jsPDF } = jspdf;
        const canvas = await html2canvas(container, { scale: 2, logging: false });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${doc.controlId}_Policy_Signed.pdf`);
        
        root.unmount();
        document.body.removeChild(container);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{doc.controlId} Details</h2>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6 text-gray-500" /></button>
                </header>
                
                <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8">
                    {/* Preview of the printable document */}
                    <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm] transform scale-90 origin-top">
                        <ExportableDocumentContent doc={doc} company={company} />
                    </div>
                </div>

                <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <button onClick={handleDownloadPDF} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 font-medium">Download PDF</button>
                    {isPending && isActionable && (
                        <div className="flex gap-2">
                            <button onClick={() => handleDecision('Rejected')} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Reject</button>
                            <button onClick={() => handleDecision('Approved')} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Approve</button>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};

interface DocumentsPageProps {
  repository: PolicyDocument[];
  currentUser: User;
  onApprovalAction: (documentId: string, decision: 'Approved' | 'Rejected', comments?: string) => void;
  onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent) => void;
  permissions: Set<Permission>;
  company: CompanyProfile;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ repository, currentUser, onApprovalAction, onAddDocument, permissions, company }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'all' | 'templates'>('tasks');
  const [selectedDoc, setSelectedDoc] = useState<PolicyDocument | null>(null);

  const myTasks = useMemo(() => repository.filter(doc => statusToRoleMap[doc.status] === currentUser.role), [repository, currentUser]);
  const sortedRepo = useMemo(() => [...repository].sort((a, b) => b.updatedAt - a.updatedAt), [repository]);

  const renderTable = (docs: PolicyDocument[]) => (
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Control</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Signatures</th>
                  <th className="px-6 py-3 text-right"></th>
              </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {docs.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{doc.controlId}</div>
                          <div className="text-xs text-gray-500">{doc.subdomainTitle}</div>
                      </td>
                      <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(doc.status)}`}>{doc.status}</span>
                      </td>
                      <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                              {doc.approvalHistory.filter(h => h.decision === 'Passed' || h.decision === 'Approved').map((h, i) => (
                                  <div key={i} className="w-6 h-6 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title={h.agentName || h.role}>
                                      {(h.agentName || h.role)[0]}
                                  </div>
                              ))}
                          </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedDoc(doc)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 font-medium text-sm">View</button>
                      </td>
                  </tr>
              ))}
          </tbody>
      </table>
  );

  return (
    <div className="space-y-8">
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => setActiveTab('tasks')} className={`pb-2 px-4 border-b-2 font-medium ${activeTab === 'tasks' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500'}`}>My Tasks</button>
          <button onClick={() => setActiveTab('all')} className={`pb-2 px-4 border-b-2 font-medium ${activeTab === 'all' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500'}`}>All Documents</button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {activeTab === 'tasks' && renderTable(myTasks)}
          {activeTab === 'all' && renderTable(sortedRepo)}
      </div>

      {selectedDoc && <DocumentDetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} currentUser={currentUser} onApprovalAction={onApprovalAction} permissions={permissions} company={company} />}
    </div>
  );
};
