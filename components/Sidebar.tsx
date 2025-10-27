import React from 'react';
import { DocumentIcon, UsersIcon, BuildingOfficeIcon, DashboardIcon, ClipboardListIcon, BeakerIcon, ClipboardCheckIcon, ShieldKeyholeIcon, LandmarkIcon, IdentificationIcon, QuestionMarkCircleIcon, GraduationCapIcon, SparklesIcon } from './Icons';
import type { Domain, Permission } from '../types';

interface SidebarProps {
  domains: Domain[];
  selectedDomain: Domain;
  onSelectDomain: (domain: Domain) => void;
  currentView: 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'userProfile' | 'mfaSetup' | 'help' | 'training' | 'complianceAgent';
  onSetView: (view: 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'userProfile' | 'mfaSetup' | 'help' | 'training' | 'complianceAgent') => void;
  permissions: Set<Permission>;
}

export const Sidebar: React.FC<SidebarProps> = ({ domains, selectedDomain, onSelectDomain, currentView, onSetView, permissions }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto hidden md:flex md:flex-col">
      <nav className="mb-6">
        <ul>
          {permissions.has('dashboard:read') && (
            <li>
              <button
                  onClick={() => onSetView('dashboard')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'dashboard'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <DashboardIcon className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                </button>
            </li>
          )}
          {permissions.has('company:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('companyProfile')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'companyProfile'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <BuildingOfficeIcon className="w-5 h-5 mr-3" />
                  <span>Company Profile</span>
                </button>
            </li>
          )}
          {permissions.has('userProfile:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('userProfile')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'userProfile'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <IdentificationIcon className="w-5 h-5 mr-3" />
                  <span>My Profile</span>
                </button>
            </li>
          )}
          {permissions.has('users:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('users')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'users'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <UsersIcon className="w-5 h-5 mr-3" />
                  <span>User Management</span>
                </button>
            </li>
          )}
          {permissions.has('complianceAgent:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('complianceAgent')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'complianceAgent'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <SparklesIcon className="w-5 h-5 mr-3" />
                  <span>Compliance Agent</span>
                </button>
            </li>
          )}
          {permissions.has('documents:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('documents')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'documents'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <DocumentIcon className="w-5 h-5 mr-3" />
                  <span>Document Management</span>
                </button>
            </li>
          )}
          {permissions.has('training:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('training')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'training'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <GraduationCapIcon className="w-5 h-5 mr-3" />
                  <span>Training & Awareness</span>
                </button>
            </li>
          )}
          {permissions.has('assessment:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('assessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'assessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ClipboardCheckIcon className="w-5 h-5 mr-3" />
                  <span>NCA ECC Assessment</span>
                </button>
            </li>
          )}
          {permissions.has('pdplAssessment:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('pdplAssessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'pdplAssessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ShieldKeyholeIcon className="w-5 h-5 mr-3" />
                  <span>PDPL Assessment</span>
                </button>
            </li>
          )}
          {permissions.has('samaCsfAssessment:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('samaCsfAssessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'samaCsfAssessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <LandmarkIcon className="w-5 h-5 mr-3" />
                  <span>SAMA CSF Assessment</span>
                </button>
            </li>
          )}
          {permissions.has('audit:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('auditLog')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'auditLog'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ClipboardListIcon className="w-5 h-5 mr-3" />
                  <span>Audit Log</span>
                </button>
            </li>
          )}
          {permissions.has('help:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('help')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'help'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <QuestionMarkCircleIcon className="w-5 h-5 mr-3" />
                  <span>Help & Support</span>
                </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase tracking-wider">AI Studio Apps</h2>
           <a
              href="https://ai.studio/apps/drive/1HM3zXzqtZ6N--AdXXUu3EZ