/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  stage: 'active' | 'upcoming' | 'review' | 'completed';
  project: string;
  createdAt: string;
  statusLabel: string;
}

export type TabType = 'dashboard' | 'tasks' | 'archive' | 'settings';

export interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}
