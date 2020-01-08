import raf from 'raf';

enum MODE {
  MODE_TIMEOUT = 0,
  MODE_INTERVAL = 1,
}

interface Execution {
  fn: Function;
  ms: number;
  args: any;
  mode: MODE;
}

interface NextExecution extends Execution {
  nextTick: number;
}

const fnStacks = new Map<number, NextExecution>();
const runArray = new Set();
let rafStarted = false;
let startId = 0;

function getTimeStamp() {
  return new Date().getTime();
}

function executeFn(value: NextExecution) {
  const { fn, args } = value;
  fn(...args);
}

function runFunction() {
  if (runArray.size === 0) return;
  runArray.forEach(executeFn);
  runArray.clear();
}

const checkTick = (currentTimeTick: number) => (value: NextExecution, id: number) => {
  const { nextTick, ms, mode } = value;
  if (currentTimeTick - nextTick >= 0) {
    runArray.add(value);
    if (mode === MODE.MODE_TIMEOUT) {
      fnStacks.delete(id);
    } else {
      fnStacks.set(id, {
        ...value,
        nextTick: nextTick + ms,
      });
    }
  }
};

function loop() {
  if (fnStacks.size === 0) {
    rafStarted = false;
    return;
  }
  const currentTimeTick = getTimeStamp();
  fnStacks.forEach(checkTick(currentTimeTick));
  runFunction();
  if (fnStacks.size === 0) {
    rafStarted = false;
    return;
  }
  raf(loop);
}

function addId({ fn, ms, args, mode }: Execution) {
  if (!fn) return null;
  const currentId = startId;
  fnStacks.set(currentId, {
    fn,
    ms,
    nextTick: getTimeStamp() + ms,
    args,
    mode,
  });
  if (!rafStarted) {
    rafStarted = true;
    raf(loop);
  }
  startId += 1;
  return currentId;
}

function removeId(id: number) {
  if (fnStacks.has(id)) {
    fnStacks.delete(id);
  }
}

export default {
  setTimeout: (fn: Function, ms = 0, ...args: any) => addId({ fn, ms, args, mode: MODE.MODE_TIMEOUT }),
  clearTimeout: removeId,
  setInterval: (fn: Function, ms = 0, ...args: any) => addId({ fn, ms, args, mode: MODE.MODE_INTERVAL }),
  clearInterval: removeId,
};
