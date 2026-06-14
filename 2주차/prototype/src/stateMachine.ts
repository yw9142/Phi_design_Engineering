export type RoutineStatus =
  | "IDLE"
  | "CHARGING"
  | "READY"
  | "RUNNING"
  | "PAUSED"
  | "DONE";

export type RoutineState = {
  status: RoutineStatus;
  capacity: number;
  charge: number;
  sessionCharge: number;
  releaseRate: number;
  beatCount: number;
};

export type RoutineEvent =
  | { type: "WIND"; amount: number }
  | { type: "RELEASE" }
  | { type: "TICK"; delta: number }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET" };

export type RoutineView = {
  progress: number;
  remaining: number;
  activeBeat: number;
};

export const initialRoutineState: RoutineState = {
  status: "IDLE",
  capacity: 120,
  charge: 0,
  sessionCharge: 0,
  releaseRate: 1,
  beatCount: 8,
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export function transition(
  state: RoutineState,
  event: RoutineEvent,
): RoutineState {
  switch (event.type) {
    case "WIND": {
      if (state.status === "RUNNING" || state.status === "PAUSED") {
        return state;
      }

      const charge = clamp(state.charge + event.amount, 0, state.capacity);

      return {
        ...state,
        status: charge > 0 ? "CHARGING" : "IDLE",
        charge,
        sessionCharge: 0,
      };
    }

    case "RELEASE":
      if (state.charge <= 0 || state.status === "RUNNING") {
        return state;
      }

      return {
        ...state,
        status: "RUNNING",
        sessionCharge: state.charge,
      };

    case "TICK": {
      if (state.status !== "RUNNING") {
        return state;
      }

      const charge = clamp(state.charge - event.delta * state.releaseRate, 0, state.capacity);

      return {
        ...state,
        status: charge === 0 ? "DONE" : "RUNNING",
        charge,
      };
    }

    case "PAUSE":
      return state.status === "RUNNING" ? { ...state, status: "PAUSED" } : state;

    case "RESUME":
      return state.status === "PAUSED" ? { ...state, status: "RUNNING" } : state;

    case "RESET":
      return initialRoutineState;
  }
}

export function selectRoutineView(state: RoutineState): RoutineView {
  const progress =
    state.sessionCharge > 0
      ? clamp(1 - state.charge / state.sessionCharge, 0, 1)
      : 0;
  const activeBeat =
    progress >= 1
      ? state.beatCount - 1
      : clamp(Math.floor(progress * state.beatCount), 0, state.beatCount - 1);

  return {
    progress,
    remaining: state.charge / state.releaseRate,
    activeBeat,
  };
}
