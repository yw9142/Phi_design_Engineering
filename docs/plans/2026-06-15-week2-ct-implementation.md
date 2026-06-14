# Week 2 CT Assignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Week 2 Engineering CT deliverables for hourglass + wind-up music box, including CT documentation, flowchart, and a React prototype based on their shared abstraction.

**Architecture:** Keep the documentation and prototype isolated under `2주차/`. The React app uses a small state machine module for the abstract charge-release behavior, then renders a polished single-screen interface around it. Tests target the state machine instead of brittle animation details.

**Tech Stack:** React, Vite, TypeScript, Vitest, Testing Library where useful, lucide-react icons, CSS modules or plain CSS.

---

### Task 1: Create React Prototype Scaffold

**Files:**
- Create: `2주차/prototype/package.json`
- Create: `2주차/prototype/index.html`
- Create: `2주차/prototype/src/main.tsx`
- Create: `2주차/prototype/src/App.tsx`
- Create: `2주차/prototype/src/App.css`
- Create: `2주차/prototype/src/stateMachine.ts`
- Create: `2주차/prototype/src/stateMachine.test.ts`
- Create: `2주차/prototype/src/test/setup.ts`
- Create: `2주차/prototype/vite.config.ts`
- Create: `2주차/prototype/tsconfig.json`
- Create: `2주차/prototype/README.md`

**Step 1: Initialize package metadata**

Create a Vite React package with scripts:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "jsdom": "latest"
  }
}
```

**Step 2: Install dependencies**

Run:

```powershell
npm install
```

Expected: dependencies install with a `package-lock.json`.

---

### Task 2: Test The Shared State Machine First

**Files:**
- Create: `2주차/prototype/src/stateMachine.test.ts`
- Create: `2주차/prototype/src/stateMachine.ts`

**Step 1: Write failing tests**

Cover:

- winding from `IDLE` increases `charge`;
- releasing with charge enters `RUNNING`;
- tick drains charge and advances progress;
- pause/resume preserves charge;
- tick to zero enters `DONE`;
- invalid release with zero charge stays idle.

**Step 2: Run tests to verify failure**

Run:

```powershell
npm test
```

Expected: FAIL until `stateMachine.ts` is implemented.

**Step 3: Implement minimal state machine**

Define:

- `MachineState`
- `RoutineStatus`
- `RoutineEvent`
- `initialRoutineState`
- `transition(state, event)`
- `selectRoutineView(state)`

Keep all transition rules explicit and deterministic.

**Step 4: Run tests to verify pass**

Run:

```powershell
npm test
```

Expected: PASS.

---

### Task 3: Build The React Interface

**Files:**
- Modify: `2주차/prototype/src/App.tsx`
- Modify: `2주차/prototype/src/App.css`
- Modify: `2주차/prototype/src/main.tsx`

**Step 1: Render the usable shell**

Add:

- title and artifact label;
- mechanism panel;
- charge ring;
- beat grid;
- state strip;
- control buttons.

**Step 2: Wire interactions**

Map buttons to state-machine events:

- Wind -> `WIND`
- Release -> `RELEASE`
- Pause -> `PAUSE`
- Resume -> `RESUME`
- Reset -> `RESET`

Add a `setInterval` tick only while `status === "RUNNING"`.

**Step 3: Style the interface**

Use responsive CSS with:

- fixed dimensions for mechanism controls;
- compact dashboard layout;
- accessible contrast;
- no nested card-heavy layout;
- clear disabled states.

**Step 4: Run tests/build**

Run:

```powershell
npm test
npm run build
```

Expected: both pass.

---

### Task 4: Write Week 2 CT Documentation

**Files:**
- Create: `2주차/과제_산출물.md`

**Step 1: Add decomposition**

Include separate decomposition trees:

- hourglass, refined from Week 1;
- wind-up music box, new decomposition.

Each low-level item must be numeric or boolean where possible.

**Step 2: Add pattern recognition**

Create a comparison matrix with rows:

- energy source;
- input trigger;
- storage medium;
- regulator;
- output feedback;
- release loop;
- termination condition;
- controllability;
- constraints.

Then write common patterns and difference patterns.

**Step 3: Add abstraction**

Write:

- one-line model;
- constants, variables, states, triggers;
- object-to-abstraction mapping;
- scope test table.

**Step 4: Add flowchart**

Use Mermaid state/flow diagram plus state transition table.

**Step 5: Add prototype summary**

Explain why Wound Routine Player is derived from the abstraction and not a direct copy of the objects.

---

### Task 5: Browser Verification And Screenshots

**Files:**
- Create directory: `2주차/스크린샷/`
- Optional create: `2주차/스크린샷/desktop.png`
- Optional create: `2주차/스크린샷/mobile.png`

**Step 1: Start dev server**

Run:

```powershell
npm run dev -- --port 5174
```

Expected: Vite serves the prototype locally.

**Step 2: Verify with browser tooling**

Check:

- page loads without console errors;
- wind button increases charge;
- release starts running state;
- pause/resume works;
- reset returns idle;
- layout is not broken on desktop and mobile viewport.

**Step 3: Final build**

Run:

```powershell
npm run build
```

Expected: production build succeeds.

