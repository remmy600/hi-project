/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { TerminalLog, Task } from '../types';
import { Terminal, X, ChevronRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TerminalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onRemoveTask: (id: string) => void;
  onUpdateTaskStage: (id: string, stage: Task['stage']) => void;
  username: string;
  setUsername: (name: string) => void;
  uptime: number;
}

export default function TerminalPanel({
  isOpen,
  onClose,
  tasks,
  onAddTask,
  onRemoveTask,
  onUpdateTaskStage,
  username,
  setUsername,
  uptime,
}: TerminalPanelProps) {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<TerminalLog[]>([
    { id: 'init-1', type: 'success', text: `STUDIO SHELL v2.4.0 (node-19.01)` },
    { id: 'init-2', type: 'output', text: `Type 'help' to see list of automated workspace directives.` },
  ]);

  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of logs
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  // Direct focus to input on click anywhere on terminal body
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => focusInput(), 100);
    }
  }, [isOpen]);

  const formatUptimeValue = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}D ${h}H ${m}M ${s}S`;
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const commandLine = inputVal.trim();
    if (!commandLine) return;

    // Add input to logs
    const newLogs = [...logs, { id: String(Date.now()), type: 'input' as const, text: `$ ${commandLine}` }];
    
    // Parse commands
    const lowercaseCmd = commandLine.toLowerCase();
    const parts = commandLine.split(' ');
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let responseText = '';
    let responseType: 'output' | 'success' | 'error' = 'output';

    switch (mainCommand) {
      case 'help':
        responseText = `Available Commands:
  - list            : List all registered workspace tasks
  - add [title]     : Register a new active task (e.g. add Design Audit)
  - complete [id]   : Complete and archive a task by ID (e.g. complete 1)
  - delete [id]     : Destructively purge a task by ID (e.g. delete 2)
  - username [name] : Reassign active operator's registry name
  - uptime          : Display system core container telemetry
  - clear           : Wipe shell logs from current session buffer`;
        break;

      case 'list':
        if (tasks.length === 0) {
          responseText = 'No registered tasks in active workspace database.';
        } else {
          responseText = '--- WORKSPACE REGISTRY DATABASE ---\n' + 
            tasks.map(t => `ID: [${t.id}] Project: ${t.project} | ${t.title} (${t.stage.toUpperCase()} - ${t.statusLabel})`).join('\n');
        }
        break;

      case 'add':
        if (!args.trim()) {
          responseText = 'Error: Specify task title. Syntax: add [Task Title]';
          responseType = 'error';
        } else {
          const titleText = args.trim();
          onAddTask({
            title: titleText,
            description: 'Created dynamically from terminal shell invocation.',
            stage: 'active',
            project: 'STUDIO',
            statusLabel: 'In Progress'
          });
          responseText = `Successfully created active task: "${titleText}"`;
          responseType = 'success';
        }
        break;

      case 'complete':
        if (!args.trim()) {
          responseText = 'Error: Complete command requires targeted Task ID. Usage: complete [id]';
          responseType = 'error';
        } else {
          const target = tasks.find(t => t.id === args.trim());
          if (target) {
            onUpdateTaskStage(target.id, 'completed');
            responseText = `Task ID [${target.id}] "${target.title}" stage set to COMPLETED (Archived).`;
            responseType = 'success';
          } else {
            responseText = `Error: No task found with ID "${args.trim()}". Try running "list".`;
            responseType = 'error';
          }
        }
        break;

      case 'delete':
        if (!args.trim()) {
          responseText = 'Error: Delete command requires targeted Task ID. Usage: delete [id]';
          responseType = 'error';
        } else {
          const target = tasks.find(t => t.id === args.trim());
          if (target) {
            onRemoveTask(target.id);
            responseText = `Task ID [${target.id}] "${target.title}" successfully purged from database.`;
            responseType = 'success';
          } else {
            responseText = `Error: No task found with ID "${args.trim()}".`;
            responseType = 'error';
          }
        }
        break;

      case 'username':
        if (!args.trim()) {
          responseText = `Current Registry Operator: ${username}`;
        } else {
          setUsername(args.trim());
          responseText = `Operator registry successfully updated to: "${args.trim()}"`;
          responseType = 'success';
        }
        break;

      case 'uptime':
        responseText = `CONTAINER CORE NODE TELEMETRY:
  - Uptime          : ${formatUptimeValue(uptime)}
  - Status          : NOMINAL (Active)
  - Memory Usage    : 142MB / 512MB
  - Process Ingress : PORT 3000 -> Reverse Proxy Enabled`;
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      default:
        responseText = `Unknown terminal directive: "${mainCommand}". Type 'help' for instructions guide.`;
        responseType = 'error';
    }

    setLogs([...newLogs, { id: String(Date.now() + 1), type: responseType, text: responseText }]);
    setInputVal('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000] z-40"
          />

          {/* Terminal Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] md:w-[600px] bg-[#111111] text-[#E5E5E5] border-l border-[#222222] shadow-2xl z-50 flex flex-col font-mono"
            id="terminal-panel"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#222222] bg-[#1a1a1a]">
              <div className="flex items-center space-x-3 text-white">
                <Terminal size={16} className="text-white" />
                <span className="text-xs font-bold uppercase tracking-wider">INTEGRATED STUDIO TERMINAL</span>
              </div>
              <button
                onClick={onClose}
                className="text-[#999999] hover:text-white transition-colors cursor-pointer p-0.5"
                id="close-terminal-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Terminal Body */}
            <div 
              onClick={focusInput}
              className="flex-1 p-6 overflow-y-auto space-y-4 text-xs leading-relaxed"
            >
              <div className="space-y-3">
                {logs.map((log) => {
                  let textColor = 'text-[#CCCCCC]';
                  if (log.type === 'input') textColor = 'text-white font-semibold';
                  else if (log.type === 'success') textColor = 'text-emerald-400';
                  else if (log.type === 'error') textColor = 'text-rose-400';

                  return (
                    <div key={log.id} className="whitespace-pre-wrap">
                      <p className={textColor}>{log.text}</p>
                    </div>
                  );
                })}
                <div ref={outputEndRef} />
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleCommand} className="border-t border-[#222222] bg-[#161616] py-3 px-6 flex items-center">
              <ChevronRight size={14} className="text-[#999999] mr-2 shrink-0 animate-pulse" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter system command (e.g. add Create API, list)..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-transparent text-[#FFFFFF] text-xs outline-none border-none placeholder-[#555555]"
                id="terminal-cli-input"
              />
              <button 
                type="submit"
                className="p-1.5 ml-2 hover:bg-[#222222] text-[#999999] hover:text-white transition-colors rounded cursor-pointer"
                title="Execute command"
              >
                <CornerDownLeft size={12} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
