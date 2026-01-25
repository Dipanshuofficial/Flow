// persistence/scheduler.ts
let timeout: number | null = null;

export const scheduleIdleSave = (fn: () => void, delay = 800) => {
  if (timeout) clearTimeout(timeout);

  timeout = window.setTimeout(() => {
    requestIdleCallback(fn, { timeout: 1000 });
  }, delay);
};
