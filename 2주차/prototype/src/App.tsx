import { Pause, Play, RefreshCw, RotateCw, TimerReset } from "lucide-react";
import { useEffect, useMemo, useReducer } from "react";
import type { CSSProperties } from "react";
import {
  initialRoutineState,
  selectRoutineView,
  transition,
} from "./stateMachine";

const STATUS_LABEL = {
  IDLE: "대기",
  CHARGING: "충전 중",
  READY: "준비 완료",
  RUNNING: "작동 중",
  PAUSED: "일시정지",
  DONE: "완료",
} as const;

const BEAT_NAMES = ["준비", "호흡", "집중", "정렬", "작업", "점검", "정리", "종료"];

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export default function App() {
  const [state, dispatch] = useReducer(transition, initialRoutineState);
  const view = selectRoutineView(state);
  const chargePercent = Math.round((state.charge / state.capacity) * 100);
  const progressPercent = Math.round(view.progress * 100);
  const canRelease =
    state.charge > 0 && state.status !== "RUNNING" && state.status !== "PAUSED";
  const canWind = state.status !== "RUNNING" && state.status !== "PAUSED";

  useEffect(() => {
    if (state.status !== "RUNNING") {
      return;
    }

    const id = window.setInterval(() => {
      dispatch({ type: "TICK", delta: 1 });
    }, 1000);

    return () => window.clearInterval(id);
  }, [state.status]);

  const dialStyle = useMemo(
    () =>
      ({
        "--charge": `${chargePercent}%`,
        "--progress": `${progressPercent}%`,
      }) as CSSProperties,
    [chargePercent, progressPercent],
  );

  return (
    <main className="app-shell" data-state={state.status}>
      <section className="workbench" aria-label="Wound Routine Player">
        <header className="app-header">
          <div>
            <p className="eyebrow">Engineering CT · 2주차</p>
            <h1>Wound Routine Player</h1>
          </div>
          <div className="status-pill" data-status={state.status}>
            <span className="status-dot" />
            <span>{STATUS_LABEL[state.status]}</span>
          </div>
        </header>

        <div className="prototype-grid">
          <section className="mechanism-panel" aria-label="충전 방출 메커니즘">
            <div className="dial" style={dialStyle}>
              <div className="dial-ring" />
              <button
                className="wind-key"
                type="button"
                onClick={() => dispatch({ type: "WIND", amount: 12 })}
                disabled={!canWind}
              >
                <RotateCw size={24} aria-hidden="true" />
                <span>감기</span>
              </button>
              <div className="release-wheel" aria-hidden="true">
                <div className="tooth tooth-a" />
                <div className="tooth tooth-b" />
                <div className="tooth tooth-c" />
                <div className="tooth tooth-d" />
              </div>
            </div>

            <div className="readout-row">
              <div>
                <span className="readout-label">잔여</span>
                <strong>{formatTime(view.remaining)}</strong>
              </div>
              <div>
                <span className="readout-label">진행</span>
                <strong>{progressPercent}%</strong>
              </div>
              <div>
                <span className="readout-label">충전</span>
                <strong>{chargePercent}%</strong>
              </div>
            </div>
          </section>

          <aside className="state-panel" aria-label="상태와 출력">
            <div className="state-strip">
              {Object.entries(STATUS_LABEL).map(([key, label]) => (
                <span
                  className={state.status === key ? "state-node active" : "state-node"}
                  key={key}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="beat-grid" aria-label="루틴 비트">
              {BEAT_NAMES.map((beat, index) => (
                <div
                  className={
                    index === view.activeBeat && state.status !== "IDLE"
                      ? "beat-cell active"
                      : index < view.activeBeat && state.status !== "IDLE"
                        ? "beat-cell passed"
                        : "beat-cell"
                  }
                  key={beat}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{beat}</strong>
                </div>
              ))}
            </div>

            <dl className="metric-list">
              <div>
                <dt>세션 자원</dt>
                <dd>{formatTime(state.sessionCharge || state.charge)}</dd>
              </div>
              <div>
                <dt>방출 속도</dt>
                <dd>{state.releaseRate.toFixed(1)} / sec</dd>
              </div>
              <div>
                <dt>출력 패턴</dt>
                <dd>{BEAT_NAMES[view.activeBeat]}</dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className="control-bar" aria-label="프로토타입 조작">
          <button
            className="primary-action"
            type="button"
            onClick={() => dispatch({ type: "RELEASE" })}
            disabled={!canRelease}
          >
            <Play size={18} aria-hidden="true" />
            <span>방출</span>
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "PAUSE" })}
            disabled={state.status !== "RUNNING"}
          >
            <Pause size={18} aria-hidden="true" />
            <span>일시정지</span>
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "RESUME" })}
            disabled={state.status !== "PAUSED"}
          >
            <RefreshCw size={18} aria-hidden="true" />
            <span>재개</span>
          </button>
          <button type="button" onClick={() => dispatch({ type: "RESET" })}>
            <TimerReset size={18} aria-hidden="true" />
            <span>초기화</span>
          </button>
        </div>
      </section>
    </main>
  );
}
