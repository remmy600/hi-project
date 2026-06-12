/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task } from '../types';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  initialStage?: 'active' | 'upcoming' | 'review' | 'completed';
}

export default function NewTaskModal({ isOpen, onClose, onAddTask, initialStage = 'active' }: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<'active' | 'upcoming' | 'review' | 'completed'>(initialStage);
  const [project, setProject] = useState('STUDIO');
  const [statusLabel, setStatusLabel] = useState('In Progress');

  // Sync statusLabel option when stage changes
  const handleStageChange = (newStage: 'active' | 'upcoming' | 'review' | 'completed') => {
    setStage(newStage);
    if (newStage === 'active') setStatusLabel('In Progress');
    else if (newStage === 'upcoming') setStatusLabel('Scheduled');
    else if (newStage === 'review') setStatusLabel('Waiting');
    else setStatusLabel('Completed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !project.trim()) return;
    
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      stage,
      project: project.trim().toUpperCase(),
      statusLabel,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setStage('active');
    setProject('STUDIO');
    setStatusLabel('In Progress');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#000000]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ ease: 'easeOut', duration: 0.25 }}
            className="relative w-full max-w-lg bg-white border border-[#E5E5E5] p-8 shadow-2xl flex flex-col z-10"
            id="new-task-modal"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#999999] block mb-1">WORKSPACE REGISTRY</span>
                <h3 className="text-xl font-bold tracking-tight text-[#111111]">Register Project Task</h3>
              </div>
              <button 
                onClick={onClose}
                className="text-[#999999] hover:text-[#111111] transition-colors p-1 cursor-pointer"
                id="close-modal-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#999999] mb-1.5">
                  Project Category
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STUDIO, DESIGN, REVENUE"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#111111] transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#999999] mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Task Header Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#111111] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#999999] mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Provide concise operational specs layout..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#111111] transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#999999] mb-1.5">
                    Workflow Target Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => handleStageChange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#111111] transition-colors"
                  >
                    <option value="active">01 / Active Task</option>
                    <option value="upcoming">02 / Upcoming</option>
                    <option value="review">03 / Review</option>
                    <option value="completed">04 / Archive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#999999] mb-1.5">
                    Status Node Label
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="In Progress, Completed..."
                    value={statusLabel}
                    onChange={(e) => setStatusLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#111111] transition-colors"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs border border-[#E5E5E5] text-[#111111] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-[#111111] text-white hover:bg-[#333333] transition-colors cursor-pointer font-bold tracking-wider"
                >
                  ADD TASK
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
