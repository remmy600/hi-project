/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Task, TabType } from './types';
import { INITIAL_TASKS } from './initialData';
import Navbar from './components/Navbar';
import NewTaskModal from './components/NewTaskModal';
import TerminalPanel from './components/TerminalPanel';
import { 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Info, 
  Settings, 
  Database, 
  Layers, 
  ArrowUpRight,
  Terminal,
  Activity,
  User,
  Sliders,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- Persistent States ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('studio_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TASKS;
  });

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('studio_username') || 'Julian';
  });

  // --- Session UX States ---
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');
  
  // Modals & Panels
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [taskModalInitialStage, setTaskModalInitialStage] = useState<Task['stage']>('active');

  // Interactive Uptime & Dates
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [currentDateString, setCurrentDateString] = useState('');

  // Save to persistence
  useEffect(() => {
    localStorage.setItem('studio_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studio_username', username);
  }, [username]);

  // Live ticking clock & container uptime simulation
  useEffect(() => {
    const startUptime = Date.now();
    
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      };
      setCurrentDateString(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(() => {
      setUptimeSeconds(prev => prev + 1);
      updateDateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const taskObj: Task = {
      ...newTask,
      id: String(Math.floor(1000 + Math.random() * 9000)), // short numeric id for terminal ease of use
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [taskObj, ...prev]);
  };

  const handleUpdateTaskStage = (id: string, stage: Task['stage']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let statusLabel = t.statusLabel;
        if (stage === 'active') statusLabel = 'In Progress';
        else if (stage === 'upcoming') statusLabel = 'Scheduled';
        else if (stage === 'review') statusLabel = 'Waiting';
        else if (stage === 'completed') statusLabel = 'Completed';
        return { ...t, stage, statusLabel };
      }
      return t;
    }));
  };

  const handleRemoveTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleResetSeedData = () => {
    setTasks(INITIAL_TASKS);
  };

  const handleClearAll = () => {
    setTasks([]);
  };

  // Get dynamic statistics
  const uniqueProjects = Array.from(new Set(tasks.map(t => t.project)));
  const activeTasks = tasks.filter(t => t.stage === 'active');
  const upcomingTasks = tasks.filter(t => t.stage === 'upcoming');
  const reviewTasks = tasks.filter(t => t.stage === 'review');
  const completedTasks = tasks.filter(t => t.stage === 'completed');

  // Simulated system metrics
  const simulatedDiskPercent = Math.min(99, 15 + tasks.length * 4);
  const simulatedUptimeString = `18D 4H ${Math.floor(uptimeSeconds / 3600)}M ${uptimeSeconds % 60}S`;

  // Filter tasks based on search queries & project tabs
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.id.includes(searchTerm);
    const matchesProject = filterProject === 'ALL' || task.project === filterProject;
    return matchesSearch && matchesProject;
  });

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-white transition-colors duration-300">
      
      {/* Navigation Header */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        username={username}
        setUsername={setUsername}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-6 py-12 md:py-16">
        
        {/* --- DASHBOARD TAB --- */}
        {currentTab === 'dashboard' && (
          <div className="flex-1 flex flex-col justify-between" id="dashboard-tab">
            
            {/* Header greeting */}
            <header className="mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-[#999999] mb-3 md:mb-4 block font-mono">
                {currentDateString || 'Tuesday, October 24'}
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-[80px] leading-[0.95] font-light tracking-tight text-[#111111]" id="hero-greeting">
                Hi, {username}.<br/>
                <span className="text-[#999999]">What are we building today?</span>
              </h1>
            </header>

            {/* Stage columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-4" id="dashboard-grid">
              
              {/* Column 1: Active Task */}
              <div className="border-t border-[#E5E5E5] pt-6 flex flex-col" id="col-active">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#999999] font-mono">01 / Active Task</span>
                  <span className="text-xs font-mono bg-[#E5E5E5] px-2 py-0.5 rounded-full text-[#111111] font-semibold">
                    {activeTasks.length}
                  </span>
                </div>
                
                <div className="space-y-6">
                  {activeTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-[#E5E5E5] p-6 text-center text-xs text-[#999999]">
                      No active tasks. 
                      <button 
                        onClick={() => {
                          setTaskModalInitialStage('active');
                          setIsTaskModalOpen(true);
                        }}
                        className="block w-full mt-2 font-bold text-[#111111] hover:underline cursor-pointer"
                      >
                        + Create Active Task
                      </button>
                    </div>
                  ) : (
                    activeTasks.map((task) => (
                      <TaskNode 
                        key={task.id} 
                        task={task} 
                        onNextStage={(id) => handleUpdateTaskStage(id, 'upcoming')}
                        onComplete={(id) => handleUpdateTaskStage(id, 'completed')}
                        onDelete={handleRemoveTask}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: Upcoming */}
              <div className="border-t border-[#E5E5E5] pt-6 flex flex-col opacity-90 hover:opacity-100 transition-opacity duration-200" id="col-upcoming">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#999999] font-mono">02 / Upcoming</span>
                  <span className="text-xs font-mono bg-[#E5E5E5] px-2 py-0.5 rounded-full text-[#111111] font-semibold">
                    {upcomingTasks.length}
                  </span>
                </div>

                <div className="space-y-6">
                  {upcomingTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-[#E5E5E5] p-6 text-center text-xs text-[#999999]">
                      No upcoming items scheduled.
                      <button 
                        onClick={() => {
                          setTaskModalInitialStage('upcoming');
                          setIsTaskModalOpen(true);
                        }}
                        className="block w-full mt-2 font-bold text-[#111111] hover:underline cursor-pointer"
                      >
                        + Schedule Upcoming
                      </button>
                    </div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <TaskNode 
                        key={task.id} 
                        task={task} 
                        onNextStage={(id) => handleUpdateTaskStage(id, 'review')}
                        onComplete={(id) => handleUpdateTaskStage(id, 'completed')}
                        onDelete={handleRemoveTask}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Review */}
              <div className="border-t border-[#E5E5E5] pt-6 flex flex-col opacity-80 hover:opacity-100 transition-opacity duration-200" id="col-review">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#999999] font-mono">03 / Review</span>
                  <span className="text-xs font-mono bg-[#E5E5E5] px-2 py-0.5 rounded-full text-[#111111] font-semibold">
                    {reviewTasks.length}
                  </span>
                </div>

                <div className="space-y-6">
                  {reviewTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-[#E5E5E5] p-6 text-center text-xs text-[#999999]">
                      No tasks pending audit.
                      <button 
                        onClick={() => {
                          setTaskModalInitialStage('review');
                          setIsTaskModalOpen(true);
                        }}
                        className="block w-full mt-2 font-bold text-[#111111] hover:underline cursor-pointer"
                      >
                        + Register Review Item
                      </button>
                    </div>
                  ) : (
                    reviewTasks.map((task) => (
                      <TaskNode 
                        key={task.id} 
                        task={task} 
                        onNextStage={(id) => handleUpdateTaskStage(id, 'completed')}
                        onComplete={(id) => handleUpdateTaskStage(id, 'completed')}
                        onDelete={handleRemoveTask}
                      />
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}


        {/* --- PROJECTS / TASKS DETAILED LIST TAB --- */}
        {currentTab === 'tasks' && (
          <div className="flex-1 flex flex-col space-y-8" id="tasks-tab">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E5E5] pb-8">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#999999] font-mono block mb-1">PROJECT MANAGER</span>
                <h2 className="text-3xl font-light tracking-tight text-[#111111]">Active Registries</h2>
              </div>
              <button
                onClick={() => {
                  setTaskModalInitialStage('active');
                  setIsTaskModalOpen(true);
                }}
                className="px-4 py-2 bg-[#111111] text-white hover:bg-[#333333] transition-colors flex items-center space-x-2 text-xs font-semibold tracking-wider cursor-pointer font-mono"
                id="add-task-list-btn"
              >
                <Plus size={14} />
                <span>NEW REGISTRY</span>
              </button>
            </div>

            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 w-full sm:w-auto border border-[#E5E5E5] bg-white px-3 py-2" id="search-container">
                <Search size={14} className="text-[#999999]" />
                <input
                  type="text"
                  placeholder="Search metadata or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs outline-none border-none text-[#111111] placeholder-[#999999] w-full sm:w-64"
                />
              </div>

              {/* Project category quick selectors */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto" id="project-filters">
                <button
                  onClick={() => setFilterProject('ALL')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer ${
                    filterProject === 'ALL' 
                      ? 'bg-[#111111] text-white font-bold' 
                      : 'border border-[#E5E5E5] text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  ALL ({tasks.length})
                </button>
                {uniqueProjects.map(proj => (
                  <button
                    key={proj}
                    onClick={() => setFilterProject(proj)}
                    className={`px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer ${
                      filterProject === proj 
                        ? 'bg-[#111111] text-white font-bold' 
                        : 'border border-[#E5E5E5] text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    {proj} ({tasks.filter(t => t.project === proj).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Grid display of filtered items */}
            {filteredTasks.length === 0 ? (
              <div className="border border-dashed border-[#E5E5E5] p-12 text-center text-sm text-[#666666]">
                <Info size={24} className="mx-auto mb-3 text-[#999999]" />
                No direct task match found for query. Try typing something else or seed data.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="tasks-detailed-grid">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="border border-[#E5E5E5] bg-white p-6 flex flex-col justify-between hover:border-[#111111] transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-[#999999] font-mono">
                          ID: [{task.id}] • {task.project}
                        </span>
                        <span className={`text-[10px] px-2.5 py-1 font-mono font-bold uppercase ${
                          task.stage === 'active' ? 'bg-[#EEF2F6] text-[#3B82F6]' :
                          task.stage === 'upcoming' ? 'bg-[#FAF5FF] text-[#A855F7]' :
                          task.stage === 'review' ? 'bg-[#FFFBEB] text-[#D97706]' :
                          'bg-[#ECFDF5] text-[#10B981]'
                        }`}>
                          {task.statusLabel}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-[#111111] mb-2">{task.title}</h3>
                      <p className="text-xs text-[#666666] leading-relaxed mb-6">{task.description}</p>
                    </div>

                    <div className="border-t border-[#F1F1F1] pt-4 flex justify-between items-center">
                      <div className="flex space-x-2">
                        {task.stage !== 'completed' && (
                          <button
                            onClick={() => handleUpdateTaskStage(task.id, 'completed')}
                            className="p-1 px-2.5 border border-[#E5E5E5] text-[10px] uppercase tracking-wider hover:bg-[#111111] hover:text-white transition-colors cursor-pointer text-[#111111] font-bold font-mono"
                            title="Move to completed archive"
                          >
                            COMPLETE
                          </button>
                        )}
                        {task.stage === 'active' && (
                          <button
                            onClick={() => handleUpdateTaskStage(task.id, 'upcoming')}
                            className="p-1 px-2.5 border border-[#E5E5E5] text-[10px] uppercase tracking-wider hover:bg-[#F9F9F9] transition-colors cursor-pointer text-[#666666] font-mono"
                          >
                            PUSH UPCOMING
                          </button>
                        )}
                        {task.stage === 'upcoming' && (
                          <button
                            onClick={() => handleUpdateTaskStage(task.id, 'review')}
                            className="p-1 px-2.5 border border-[#E5E5E5] text-[10px] uppercase tracking-wider hover:bg-[#F9F9F9] transition-colors cursor-pointer text-[#666666] font-mono"
                          >
                            PUSH REVIEW
                          </button>
                        )}
                        {task.stage === 'review' && (
                          <button
                            onClick={() => handleUpdateTaskStage(task.id, 'active')}
                            className="p-1 px-2.5 border border-[#E5E5E5] text-[10px] uppercase tracking-wider hover:bg-[#F9F9F9] transition-colors cursor-pointer text-[#666666] font-mono"
                          >
                            RE-ACTIVATE
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveTask(task.id)}
                        className="text-[#999999] hover:text-[#EF4444] p-1.5 transition-colors cursor-pointer"
                        title="Delete registry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* --- ARCHIVE / HISTORY TAB --- */}
        {currentTab === 'archive' && (
          <div className="flex-1 flex flex-col space-y-8" id="archive-tab">
            <div className="border-b border-[#E5E5E5] pb-8">
              <span className="text-[10px] uppercase tracking-widest text-[#999999] font-mono block mb-1">STABLE VERSION ARCHIVES</span>
              <h2 className="text-3xl font-light tracking-tight text-[#111111]">Completed Tasks Archive</h2>
            </div>

            {completedTasks.length === 0 ? (
              <div className="border-2 border-dashed border-[#E5E5E5] p-16 text-center">
                <p className="text-sm text-[#999999] mb-4">No historic tasks in the completed database buffer.</p>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="px-4 py-2 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white text-xs font-semibold tracking-wider transition-all cursor-pointer"
                >
                  VIEW WORKSPACE
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTasks.map(task => (
                  <div 
                    key={task.id}
                    className="border border-[#E5E5E5] bg-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#111111] transition-all"
                  >
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-[10px] font-mono uppercase bg-[#ECFDF5] text-[#10B981] px-2 py-0.5 font-bold">
                          {task.project} • ID: {task.id}
                        </span>
                        <span className="text-[10px] text-[#999999] font-mono">
                          Completed on {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-base font-medium text-[#111111] line-through decoration-[#999999]">{task.title}</h4>
                      <p className="text-xs text-[#999999]">{task.description}</p>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleUpdateTaskStage(task.id, 'active')}
                        className="px-3 py-1.5 border border-[#E5E5E5] text-[10px] uppercase font-bold tracking-wider hover:bg-[#F9F9F9] text-[#666666] flex items-center space-x-1 cursor-pointer font-mono"
                        title="Restore to active board"
                      >
                        <RotateCcw size={10} />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handleRemoveTask(task.id)}
                        className="px-3 py-1.5 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1 cursor-pointer font-mono"
                        title="Delete permanently"
                      >
                        <Trash2 size={10} />
                        <span>Purge</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* --- SETTINGS TAB --- */}
        {currentTab === 'settings' && (
          <div className="flex-1 flex flex-col space-y-8" id="settings-tab">
            <div className="border-b border-[#E5E5E5] pb-8">
              <span className="text-[10px] uppercase tracking-widest text-[#999999] font-mono block mb-1">OPERATORS CONTROL PANEL</span>
              <h2 className="text-3xl font-light tracking-tight text-[#111111]">Dashboard Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Profile Config */}
              <div className="border border-[#E5E5E5] bg-white p-8">
                <h3 className="text-lg font-medium text-[#111111] mb-6 flex items-center space-x-2">
                  <User size={16} />
                  <span>Profile Credentials</span>
                </h3>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#999999] mb-1.5">
                      Systems Registered Operator Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#111111]"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-[#999999] leading-relaxed">
                    This moniker will calibrate the main screen greets and log entries. Local storage will cache the credential automatically.
                  </p>
                </form>
              </div>

              {/* Development Tooling */}
              <div className="border border-[#E5E5E5] bg-white p-8">
                <h3 className="text-lg font-medium text-[#111111] mb-6 flex items-center space-x-2">
                  <Sliders size={16} />
                  <span>Data Maintenance</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-[#999999] mb-2">
                      Registry Seed Control
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleResetSeedData}
                        className="px-4 py-2 border border-[#E5E5E5] text-[#111111] hover:bg-[#F9F9F9] text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
                      >
                        RE-SEED DEFAULTS
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
                      >
                        PURGE ALL RECORDS
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-[#999999] mb-1">
                      Statistics Metrics
                    </span>
                    <ul className="text-xs font-mono space-y-1 text-[#666666]">
                      <li>• Total Tasks: {tasks.length}</li>
                      <li>• Active Workflow: {activeTasks.length}</li>
                      <li>• Projects Defined: {uniqueProjects.length}</li>
                      <li>• Container State: Nominal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Dynamic Bottom Utility Footbar */}
      <footer className="bg-[#F9F9F9] border-t border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-[11px] text-[#999999] font-mono">
          
          {/* Telemetry log readings */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6">
            <span>DISK USAGE: {simulatedDiskPercent}%</span>
            <span>UPTIME: {simulatedUptimeString}</span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              SYSTEMS NOMINAL
            </span>
          </div>

          {/* Action hotkey macros */}
          <div className="flex space-x-3 w-full md:w-auto justify-center">
            <button 
              onClick={() => {
                setTaskModalInitialStage('active');
                setIsTaskModalOpen(true);
              }}
              className="px-4 py-2 border border-[#E5E5E5] text-[#111111] hover:bg-white hover:border-[#111111] transition-all duration-200 cursor-pointer font-bold uppercase tracking-wider"
              id="footer-new-project-btn"
            >
              NEW PROJECT
            </button>
            <button 
              onClick={() => setIsTerminalOpen(true)}
              className="px-4 py-2 bg-[#111111] text-white hover:bg-[#333333] transition-all duration-200 cursor-pointer flex items-center space-x-1.5 font-bold uppercase tracking-wider"
              id="footer-open-terminal-btn"
            >
              <Terminal size={12} />
              <span>OPEN TERMINAL</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Full Core Modals & Side Shells */}
      <NewTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
        initialStage={taskModalInitialStage}
      />

      <TerminalPanel 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        tasks={tasks}
        onAddTask={handleAddTask}
        onRemoveTask={handleRemoveTask}
        onUpdateTaskStage={handleUpdateTaskStage}
        username={username}
        setUsername={setUsername}
        uptime={uptimeSeconds}
      />

    </div>
  );
}

// --- Auxiliary Small Sub-components for Clean Separation & Density ---

interface TaskNodeProps {
  task: Task;
  onNextStage: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  key?: string;
}

function TaskNode({ task, onNextStage, onComplete, onDelete }: TaskNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group relative border-b border-[#F0F0F0] pb-6 hover:border-[#111111] transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2.5">
        <span className="text-[9px] uppercase tracking-wider text-[#999999] font-mono bg-[#F0F0F0] px-1.5 py-0.5">
          {task.project} • ID: {task.id}
        </span>
        
        {/* Stage Status Bullet Indicator */}
        <div className="flex items-center space-x-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${
            task.stage === 'active' ? 'bg-[#111111]' :
            task.stage === 'upcoming' ? 'bg-[#999999] border border-[#CCCCCC]' :
            'bg-[#E5E5E5]'
          }`} />
          <span className="text-[10px] font-bold text-[#111111]">{task.statusLabel}</span>
        </div>
      </div>

      <h3 className="text-base font-medium text-[#111111] mb-1.5 tracking-tight group-hover:text-black">
        {task.title}
      </h3>
      <p className="text-xs text-[#666666] leading-relaxed mb-4">
        {task.description}
      </p>

      {/* Action buttons (Appear elegant on hover / tap) */}
      <div className="flex items-center space-x-3 text-[10px] font-bold tracking-wider font-mono">
        <button
          onClick={() => onComplete(task.id)}
          className="text-[#111111] hover:underline cursor-pointer flex items-center space-x-1"
          title="Mark done & Send to archive"
        >
          <Check size={11} />
          <span>DONE</span>
        </button>

        {task.stage !== 'review' && (
          <button
            onClick={() => onNextStage(task.id)}
            className="text-[#666666] hover:text-[#111111] hover:underline cursor-pointer flex items-center space-x-0.5"
            title="Advance Stage Workflow"
          >
            <span>NEXT STAGE</span>
            <ArrowRight size={10} />
          </button>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="text-[#999999] hover:text-rose-600 ml-auto transition-colors cursor-pointer"
          title="Purge Task"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </motion.div>
  );
}
