import { describe, expect, it } from "vitest";
import {
  initialRoutineState,
  selectRoutineView,
  transition,
} from "./stateMachine";

describe("routine state machine", () => {
  it("winds from idle by increasing charge", () => {
    const state = transition(initialRoutineState, { type: "WIND", amount: 20 });

    expect(state.status).toBe("CHARGING");
    expect(state.charge).toBe(20);
  });

  it("does not exceed capacity while winding", () => {
    const state = transition(initialRoutineState, { type: "WIND", amount: 200 });

    expect(state.charge).toBe(initialRoutineState.capacity);
  });

  it("release with charge starts a running session", () => {
    const charged = transition(initialRoutineState, { type: "WIND", amount: 35 });
    const running = transition(charged, { type: "RELEASE" });

    expect(running.status).toBe("RUNNING");
    expect(running.sessionCharge).toBe(35);
  });

  it("release without charge is ignored", () => {
    const state = transition(initialRoutineState, { type: "RELEASE" });

    expect(state).toEqual(initialRoutineState);
  });

  it("tick drains charge and advances progress", () => {
    const charged = transition(initialRoutineState, { type: "WIND", amount: 40 });
    const running = transition(charged, { type: "RELEASE" });
    const ticking = transition(running, { type: "TICK", delta: 10 });
    const view = selectRoutineView(ticking);

    expect(ticking.charge).toBe(30);
    expect(view.progress).toBe(0.25);
    expect(view.activeBeat).toBe(2);
  });

  it("pause and resume preserve charge", () => {
    const charged = transition(initialRoutineState, { type: "WIND", amount: 50 });
    const running = transition(charged, { type: "RELEASE" });
    const paused = transition(running, { type: "PAUSE" });
    const tickWhilePaused = transition(paused, { type: "TICK", delta: 20 });
    const resumed = transition(tickWhilePaused, { type: "RESUME" });

    expect(paused.status).toBe("PAUSED");
    expect(tickWhilePaused.charge).toBe(50);
    expect(resumed.status).toBe("RUNNING");
  });

  it("tick to zero completes the session", () => {
    const charged = transition(initialRoutineState, { type: "WIND", amount: 12 });
    const running = transition(charged, { type: "RELEASE" });
    const done = transition(running, { type: "TICK", delta: 20 });

    expect(done.status).toBe("DONE");
    expect(done.charge).toBe(0);
  });
});
