/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'UI Kit Refinement',
    description: 'Standardizing the design tokens for the new banking dashboard interface.',
    stage: 'active',
    project: 'STUDIO',
    createdAt: new Date().toISOString(),
    statusLabel: 'In Progress',
  },
  {
    id: '2',
    title: 'Client Presentation',
    description: 'Preparing the final deck for the quarterly review with the engineering team.',
    stage: 'upcoming',
    project: 'STUDIO',
    createdAt: new Date().toISOString(),
    statusLabel: 'Scheduled',
  },
  {
    id: '3',
    title: 'Design Audit',
    description: 'Evaluating visual consistency across the mobile application prototype.',
    stage: 'review',
    project: 'STUDIO',
    createdAt: new Date().toISOString(),
    statusLabel: 'Waiting',
  }
];
