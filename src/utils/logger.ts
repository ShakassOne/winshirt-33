const isDebug = import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true';

const logger = {
  log: (...args: unknown[]) => {
    if (isDebug) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDebug) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isDebug) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  },
};

export default logger;
export { logger };
