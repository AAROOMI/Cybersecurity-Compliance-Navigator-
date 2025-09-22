import React, { useState } from 'react';
import type { CompanyProfile, User } from '../types';
import { LogoIcon, MoonIcon, SunIcon } from './Icons';

interface CompanySetupPageProps {
  onSetup: (
    profileData: Omit<CompanyProfile, 'id' | 'license'>,
    adminData: Omit<User, 'id' | 'isVerified' | 'role'>
  ) => void;
  onCancel: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const CompanySetupPage: React.FC<CompanySetupPageProps> = ({ onSetup, onCancel, theme, toggleTheme }) => {
  const [companyData, setCompanyData] = useState({
    name: '',
    ceoName: '',
    cioName: '',
    cisoName: '',
    ctoName: '',
  });

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminData.password !== adminData.confirmPassword) {
      alert("Administrator passwords do not match.");
      return;
    }
    
    const { confirmPassword, ...adminPayload } = adminData;
    const profilePayload = { ...companyData, logo: '' }; // Logo can be added later

    onSetup(profilePayload, adminPayload);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-0 right-0 p-6 flex items-center gap-4">
          <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle theme"
          >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
      </div>

      <div className="w-full max-w-2xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <LogoIcon className="mx-auto h-20 w-auto text-teal-600" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                Create Your Company Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Start by setting up your company profile and the first administrator account.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 space-y-8">
                 <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Company Details</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                            <input type="text" name="name" id="companyName" value={companyData.name} onChange={handleCompanyChange} required className="mt-1 block w-full input-style" />
                        </div>
                         <div>
                            <label htmlFor="cisoName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CISO Name</label>
                            <input type="text" name="cisoName" id="cisoName" value={companyData.cisoName} onChange={handleCompanyChange} required className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="ceoName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CEO Name</label>
                            <input type="text" name="ceoName" id="ceoName" value={companyData.ceoName} onChange={handleCompanyChange} required className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="cioName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CIO Name</label>
                            <input type="text" name="cioName" id="cioName" value={companyData.cioName} onChange={handleCompanyChange} required className="mt-1 block w-full input-style" />
                        </div>
                         <div>
                            <label htmlFor="ctoName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CTO Name</label>
                            <input type="text" name="ctoName" id="ctoName" value={companyData.ctoName} onChange={handleCompanyChange} required className="mt-1 block w-full input-style" />
                        </div>
                    </div>
                 </fieldset>

                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Administrator Account</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" name="name" id="adminName" value={adminData.name} onChange={handleAdminChange} required className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input type="email" name="email" id="adminEmail" value={adminData.email} onChange={handleAdminChange} required className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input type="password" name="password" id="adminPassword" value={adminData.password} onChange={handleAdminChange} required className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="adminConfirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                            <input type="password" name="confirmPassword" id="adminConfirmPassword" value={adminData.confirmPassword} onChange={handleAdminChange} required className="mt-1 block w-full input-style" />
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center gap-4">
                 <button type="button" onClick={onCancel} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500">Cancel</button>
                 <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">Create Account</button>
            </div>
        </form>
      </div>
      <style>{`
            .input-style {
                background-color: white;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                padding: 0.5rem 0.75rem;
                color: #111827;
            }
            .input-style:focus {
                outline: 2px solid transparent;
                outline-offset: 2px;
                --tw-ring-color: #14b8a6;
                border-color: #14b8a6;
            }
            .dark .input-style {
                background-color: #374151;
                border-color: #4b5563;
                color: #f9fafb;
            }
        `}</style>
    </div>
  );
};
