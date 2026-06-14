# Week 2 CT Assignment Design

## Goal

Complete the Week 2 Engineering CT assignment by extending the Week 1 hourglass work with a wind-up music box. The final prototype must not reproduce either object directly. It must use the shared abstraction between the hourglass and music box to create a new digital interface.

## Assumptions

- The Week 1 hourglass analysis in `1주차/과제_산출물.md` remains valid and can be reused with small Week 2 refinements.
- The target music box is a common wind-up music box: the user winds a key, a spring stores energy, the mechanism releases energy through gears, and a pinned cylinder/plucked comb produces sound until energy runs out.
- The required deliverables are interpreted as four submitted outputs: CT documentation, flowchart, prototype, and supporting prototype screenshots. The CT documentation contains decomposition, pattern recognition, and abstraction.
- The prototype should be React-based and may use UI/icon libraries when practical.

## Source Objects

### Hourglass

An hourglass stores measurable duration as sand positioned in the upper chamber. A flip starts the release. Gravity drains the stored potential through a narrow neck at a near-constant rate. The visible sand distribution communicates remaining time and completion.

### Wind-Up Music Box

A wind-up music box stores usable motion as spring tension. Winding the key increases stored tension. Releasing the mechanism lets the spring unwind through a governor and gear train. The rotating cylinder plucks comb teeth, producing a melody until tension falls below the playable threshold.

## Shared Abstraction

One-line model:

> A finite resource is charged by a physical input, released at a constrained rate, and converted over time into a perceivable output whose intensity or progress reflects the remaining resource.

Core properties:

- `CAPACITY`: maximum stored resource.
- `charge`: current stored resource, `0..CAPACITY`.
- `releaseRate`: resource consumed per tick.
- `outputPattern`: feedback generated while releasing.
- `progress`: consumed resource divided by confirmed session resource.
- `remaining`: current charge divided by release rate.
- `state`: `IDLE`, `CHARGING`, `READY`, `RUNNING`, `PAUSED`, `DONE`.

Scope rule:

An object or interface belongs to this abstraction when it has all three properties:

1. A finite resource can be charged or prepared.
2. The resource is released over time by a regulating mechanism.
3. The release produces visible, audible, or tactile feedback until completion.

## Prototype Concept

Title: **Wound Routine Player**

The user winds a digital key to charge a short routine. The stored charge becomes a sequence of timed "notes" or work beats. When released, the interface plays through the sequence: a wheel rotates, beats light up, and the charge meter drains. The session ends automatically when the stored charge is exhausted.

This is not an hourglass simulation or a music box simulation. It borrows the shared system:

- wind/flip-like input -> charge;
- constrained release -> timed progress;
- visual/audio-style feedback -> routine beats;
- automatic completion -> done state.

## Interface Design

Layout:

- Left: main mechanism surface with charge ring, winding key, and release wheel.
- Right: state panel with current state, remaining time, progress, and active beat pattern.
- Bottom: controls for wind, release, pause/resume, and reset.

Primary interactions:

- Press/hold or click `Wind` to increase `charge`.
- Click `Release` when charge is greater than zero to begin the session.
- While running, ticks drain charge and advance beat cells.
- Click `Pause` to preserve charge.
- Click `Resume` to continue.
- When charge reaches zero, the system enters `DONE`.
- `Reset` returns to `IDLE`.

## Visual Direction

The UI should feel like an engineered study artifact rather than a marketing page. Use compact panels, clear state labels, a visible state machine, and precise numeric readouts. Visual polish should support the concept: brass/ink accents for the wind-up reference, glass/amber progress for the hourglass reference, and restrained controls for repeated testing.

## Data Flow

User input dispatches events into a reducer-like state machine:

- `WIND`: increases `charge`, sets `state` to `CHARGING` or `READY`.
- `RELEASE`: freezes `sessionCharge`, sets `state` to `RUNNING`.
- `TICK`: decreases `charge`, updates `progress`, advances the beat index.
- `PAUSE`: sets `state` to `PAUSED`.
- `RESUME`: returns to `RUNNING`.
- `RESET`: clears charge and session data.

The UI renders only derived values from state:

- `remaining = charge / releaseRate`
- `progress = sessionCharge > 0 ? 1 - charge / sessionCharge : 0`
- `activeBeat = floor(progress * beatCount)`

## Testing And Verification

Minimum verification:

- Automated state-machine tests cover wind, release, pause/resume, completion, and invalid no-op transitions.
- Production build succeeds.
- Browser check confirms the prototype loads, main controls are visible, and a wind/release flow changes state.

## Deliverables

- `2주차/과제_산출물.md`: CT documentation with decomposition, pattern recognition, abstraction, flowchart, and prototype summary.
- `2주차/prototype/`: React prototype source.
- `2주차/prototype/README.md`: run instructions.
- Optional: `2주차/스크린샷/`: visual verification screenshots.

