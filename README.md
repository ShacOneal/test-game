# Ludo Monorepo

A modern, multiplayer Ludo board game built with a strict monorepo architecture. The project separates the pure game logic from the React UI to ensure scalable, testable, and maintainable code.

## Tech Stack & Tooling Summary

**Architecture & Core**

- **NPM Workspaces:** Monorepo management.
- **TypeScript:** End-to-end type safety.
- **Vite:** Blazing fast frontend build tool.
- **Boardgame.io:** Multiplayer state management and networking engine.

**Frontend UI (`packages/client`)**

- **React 19:** UI Library.
- **Tailwind CSS v4 + DaisyUI:** Utility-first styling and component library.
- **Framer Motion:** High-performance layout animations.
- **React Icons:** Scalable vector iconography.

**Code Quality & Automation (Root)**

- **Prettier:** Code formatter (with auto-sorting for Imports, Tailwind classes, and package.json).
- **ESLint v9 (Flat Config):** Strict code linting and auto-fixing.
- **Husky & Lint-Staged:** Pre-commit/pre-push Git hooks.
- **Commitlint:** Enforces Conventional Commits.

**Testing**

- **Jest:** Tests pure game logic (`packages/game`).
- **Vitest:** Tests React components (`packages/client`).

### Tooling & Conventions: Automated Formatting (Prettier)

This repository enforces strict, automated code formatting to ensure consistency across the entire monorepo and to eliminate code-style debates during Pull Requests.

Formatting is handled automatically on save via **Prettier**, enhanced with two specialized plugins.

#### 1. Automated Import Sorting

We use `@trivago/prettier-plugin-sort-imports` to keep the top of our files clean and readable. You never need to manually organize your imports. On save, imports are automatically grouped, alphabetized, and separated by empty lines in the following strict hierarchy:

1. **React core** (`react`, `react-dom`)
2. **Game Engine** (`boardgame.io`)
3. **Third-party NPM packages** (e.g., `framer-motion`, `lucide-react`)
4. **Internal Monorepo Packages** (`@ludo/*`)
5. **Local/Relative imports** (`./components`, `../utils`)

#### 2. Tailwind CSS Class Sorting

We use the official `prettier-plugin-tailwindcss`. This ensures that utility classes are always ordered according to the official Tailwind specification (e.g., layout -> sizing -> typography -> colors -> modifiers).

**Before Save:**
\`\`\`tsx
import { Button } from './Button';
import React, { useState } from 'react';
import { Ludo } from '@ludo/game';

<div className="z-10 p-4 absolute flex bg-red-500 text-white hover:bg-red-600">
\`\`\`

**After Save:**
\`\`\`tsx
import React, { useState } from 'react';

import { Ludo } from '@ludo/game';

import { Button } from './Button';

<div className="absolute z-10 flex bg-red-500 p-4 text-white hover:bg-red-600">
\`\`\`

#### VS Code Integration

To get the intended developer experience, ensure you have the **Prettier - Code formatter** extension installed. The repository includes a `.vscode/settings.json` file that automatically configures your editor to format and sort your code every time you press **Save**.

### Tooling & Conventions: Code Quality & Linting (ESLint)

While Prettier handles how the code _looks_, **ESLint** enforces how the code _behaves_. We use the modern ESLint v9 (Flat Config) applied globally across the monorepo to catch bugs, enforce TypeScript best practices, and maintain a high-quality codebase.

#### 1. Strict Typing & Clean Console

To prevent technical debt and accidental debug code from reaching production, we enforce the following strict rules:

- **No `any` types allowed:** (`@typescript-eslint/no-explicit-any`) Developers must explicitly define TypeScript interfaces and types.
- **No `console.log`:** (`no-console`) Standard logs are blocked to keep the browser console clean. However, `console.warn` and `console.error` are explicitly permitted for actual error handling.

#### 2. Automated Import & Variable Cleanup

We utilize `eslint-plugin-unused-imports` to automatically manage dead code.

- **Auto-deletion:** If you delete a component or hook from your code, ESLint will automatically delete the unused `import` statement at the top of the file the moment you hit **Save**.
- **Smart Variable Tracking:** Unused variables throw a warning to keep memory usage clean. However, if a variable is required by an API but unused in your logic, you can safely ignore it by prefixing it with an underscore (e.g., `_event` or `_req`).

#### VS Code Integration (Auto-Fix on Save)

You do not need to run terminal commands to fix linting errors. Our `.vscode/settings.json` is configured to run ESLint's auto-fix features automatically. When you press **Save**, ESLint will instantly delete unused imports and fix any autocorrectable rule violations alongside Prettier's formatting. To enable this, ensure the official **ESLint** extension is installed in your editor.

### Tooling & Conventions: Testing (Jest & Vitest)

We maintain a dual-testing environment to optimize for both Node-based game logic and browser-based React components.

#### 1. Game Logic (Jest)

All pure game rules and Ludo logic live in `packages/game` and are tested using **Jest**. These tests run in a Node environment for maximum speed.

- **The 80% Rule:** We enforce a strict minimum of 80% test coverage for all game logic (Statements, Branches, Functions, and Lines). If coverage drops below 80%, the CI pipeline and local `git push` commands will fail.

#### 2. Frontend Components (Vitest)

The React client (`packages/client`) uses **Vitest**. Because Vitest shares the same configuration as Vite, it natively understands our CSS imports, env variables, and path aliases without complex mocking. It runs in a simulated browser environment (`jsdom`) to test React rendering and user interactions.

### Tooling & Conventions: Git Workflow & Husky Hooks

To ensure bad code never makes it to the remote repository, this project heavily restricts Git commands using **Husky**.

#### 1. Pre-Commit: Lint-Staged

When you type `git commit`, Husky intercepts the command and runs `lint-staged`. This automatically formats your code with Prettier and attempts to auto-fix any ESLint errors _only on the files you are currently modifying_. If a linting error cannot be auto-fixed (e.g., you used an `any` type), the commit is aborted.

#### 2. Pre-Commit: Conventional Commits

We use **Commitlint** to enforce a standardized Git history. Every commit message must be prefixed with a valid semantic tag. If you attempt a commit message like `"fixed the board"`, it will be rejected.

**Valid Prefixes:**
`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `ci:`, `build:`, `revert:`
_(Example: `feat: add dice roll animation`)_

#### 3. Pre-Push: Branch Naming & Coverage

When you type `git push`, two final checks occur before your code leaves your machine:

1. **Branch Name Validation:** Your branch name must follow the same semantic prefix rules as your commits (e.g., `feat/add-dice`, `fix/board-layout`). If the branch name is invalid, the push is blocked.
2. **Coverage Check:** The entire Jest test suite runs. If any tests fail, or if your game logic coverage has dropped below the required 80% threshold, the push is aborted.
