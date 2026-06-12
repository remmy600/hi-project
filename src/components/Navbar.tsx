/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType } from '../types';
import { Menu, X, Smile, Edit3 } from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  username: string;
  setUsername: (name: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab, username, setUsername }: NavbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(username);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const tabs: { label: string; value: TabType }[] = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Projects', value: 'tasks' },
    { label: 'Archive', value: 'archive' },
    { label: 'Settings', value: 'settings' },
  ];

  return (
    <nav className="border-b border-[#E5E5E5] bg-[#F9F9F9] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab('dashboard')}
          className="text-2xl font-bold tracking-tighter cursor-pointer select-none text-[#111111]"
          id="nav-logo"
        >
          STUDIO.
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-8 text-sm font-medium text-[#666666]" id="nav-tabs">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                id={`tab-btn-${tab.value}`}
                onClick={() => setCurrentTab(tab.value)}
                className={`py-1 transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-[#111111] underline underline-offset-8 decoration-2' 
                    : 'hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Avatar / Editing */}
        <div className="flex items-center space-x-4" id="nav-profile">
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center space-x-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-2 py-1 border border-[#E5E5E5] bg-white text-xs outline-none max-w-[120px] focus:border-[#111111]"
                autoFocus
                maxLength={15}
              />
              <button 
                type="submit" 
                className="text-[10px] uppercase font-bold tracking-wider hover:text-black cursor-pointer"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline text-xs text-[#666666]">
                Hello, <strong className="text-[#111111] font-medium">{username}</strong>
              </span>
              <button
                onClick={() => {
                  setNameInput(username);
                  setIsEditingName(true);
                }}
                title="Edit name"
                className="text-[#999999] hover:text-[#111111] transition-colors"
                id="edit-profile-btn"
              >
                <Edit3 size={12} />
              </button>
            </div>
          )}

          <div 
            onClick={() => {
              setNameInput(username);
              setIsEditingName(true);
            }}
            className="w-8 h-8 rounded-full bg-[#111111] hover:bg-[#333333] transition-colors flex items-center justify-center text-white text-xs cursor-pointer select-none font-semibold font-mono"
            title="Edit profile"
            id="avatar"
          >
            {username.trim() ? username.trim().charAt(0).toUpperCase() : 'U'}
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="md:hidden text-[#111111] focus:outline-none cursor-pointer"
            id="mobile-menu-toggle"
          >
            {isOpenMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Tabs */}
      {isOpenMenu && (
        <div className="md:hidden border-t border-[#E5E5E5] px-6 py-4 bg-[#F9F9F9] flex flex-col space-y-3" id="mobile-nav-menu">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setCurrentTab(tab.value);
                  setIsOpenMenu(false);
                }}
                className={`text-left text-sm py-1.5 font-medium transition-colors ${
                  isActive ? 'text-[#111111] font-bold border-l-2 border-[#111111] pl-2' : 'text-[#666666] pl-2'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
