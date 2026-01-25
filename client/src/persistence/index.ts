// persistence/index.ts
import { serialize, deserialize } from "./snapshot";
import { scheduleIdleSave } from "./scheduler";

const KEY = "__flow_snapshot__";

export const persistFlow = (state: any) => {
  // scheduleIdleSave provides the "lightweight" debouncing you need
  scheduleIdleSave(() => {
    const snapshot = serialize(state);
    localStorage.setItem(KEY, JSON.stringify(snapshot));
    console.log("Flow autosaved to local storage.");
  });
};

export const restoreFlow = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return deserialize(JSON.parse(raw));
  } catch (e) {
    console.error("Failed to restore flow", e);
    return null;
  }
};
