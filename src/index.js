import raf from 'raf';

const MODE_TIMEOUT = 0;
const MODE_INTERVAL = 1;
const fnStacks = new Map();
const runArray = new Set();
let rafStarted = false;
let startId = 0;

function getTimeStamp() {
  return new Date().getTime();
}

function executeFn(value) {
  const { fn, args } = value;
  fn(...args);
}

function runFunction() {
  if (runArray.size === 0) return;
  runArray.forEach(executeFn);
  runArray.clear();
}

const checkTick = currentTimeTick => (value, id) => {
  const { nextTick, ms, mode } = value;
  if (currentTimeTick - nextTick >= 0) {
    runArray.add(value);
    if (mode === MODE_TIMEOUT) {
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
  const currentTimeTick = getTimeStamp();
  fnStacks.forEach(checkTick(currentTimeTick));
  runFunction();
  if (fnStacks.size === 0) {
    rafStarted = false;
    return;
  }
  raf(loop);
}

function addId({ fn, ms = 0, args, mode }) {
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

function removeId(id) {
  if (fnStacks.has(id)) {
    fnStacks.delete(id);
  }
  if (fnStacks.size === 0) {
    rafStarted = false;
  }
}

export default {
  setTimeout: (fn, ms = 0, ...args) => addId({ fn, ms, args, mode: MODE_TIMEOUT }),
  clearTimeout: removeId,
  setInterval: (fn, ms = 0, ...args) => addId({ fn, ms, args, mode: MODE_INTERVAL }),
  clearInterval: removeId,
};
