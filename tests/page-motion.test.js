import test from 'node:test';
import assert from 'node:assert/strict';
import {
  startCarouselAutoplay,
  scrollToSection,
  cancelSectionScroll,
} from '../lib/page-motion.js';
import {
  getCarouselInterval,
  getContactHref,
  siteConfig,
} from '../lib/site-config.js';

for (const [width, delay] of [
  [390, 3000],
  [767, 3000],
  [768, 6000],
  [1023, 6000],
  [1024, 10000],
  [1440, 10000],
]) {
  test(`autoplay: ${width}px advances every ${delay}ms and wraps around`, (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    let index = 4;
    const stop = startCarouselAutoplay(
      () => {
        index = (index + 1) % 5;
      },
      getCarouselInterval(width),
      () => false,
    );
    t.mock.timers.tick(delay - 1);
    assert.equal(index, 4);
    t.mock.timers.tick(1);
    assert.equal(index, 0);
    t.mock.timers.tick(delay);
    assert.equal(index, 1);
    stop();
    t.mock.timers.tick(delay);
    assert.equal(index, 1, 'unmounted carousel must not leave a running timer');
  });
}

test('hidden tab pauses advancement; viewport change replaces the desktop timer', (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  let advances = 0;
  let hidden = true;
  const advance = () => {
    advances += 1;
  };
  let stop = startCarouselAutoplay(
    advance,
    getCarouselInterval(1440),
    () => hidden,
  );
  t.mock.timers.tick(10000);
  assert.equal(advances, 0);
  hidden = false;
  t.mock.timers.tick(10000);
  assert.equal(advances, 1);
  stop();
  stop = startCarouselAutoplay(advance, getCarouselInterval(390), () => hidden);
  t.mock.timers.tick(9000);
  assert.equal(advances, 4);
  t.mock.timers.tick(1000);
  assert.equal(advances, 4, 'old desktop interval must have been cleared');
  stop();
});

function mockPage(t) {
  const saved = ['document', 'window'].map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ]);
  const positions = { servicos: 800, candidatura: 4200, portfolio: 2200 };
  const frames = new Map();
  const listeners = new Map();
  const calls = [];
  const historyCalls = [];
  const state = { route: 'preserve-me' };
  let frameId = 0;
  const window = {
    scrollY: 0,
    innerHeight: 800,
    location: { hash: '' },
    history: {
      state,
      pushState: (...args) => {
        historyCalls.push(args);
        window.location.hash = args[2];
      },
    },
    getComputedStyle: () => ({
      scrollPaddingTop: '32px',
      scrollMarginTop: '0px',
    }),
    requestAnimationFrame: (callback) => {
      frames.set(++frameId, callback);
      return frameId;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    scrollTo: (options) => {
      calls.push(options);
      window.scrollY = options.top;
    },
    addEventListener: (name, listener) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(listener);
    },
    removeEventListener: (name, listener) =>
      listeners.get(name)?.delete(listener),
  };
  const document = {
    documentElement: { scrollHeight: 4400 },
    getElementById: (id) =>
      id in positions
        ? {
            getBoundingClientRect: () => ({
              top: positions[id] - window.scrollY,
            }),
          }
        : null,
  };
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: document,
  });
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: window,
  });
  t.after(() => {
    cancelSectionScroll();
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return {
    calls,
    historyCalls,
    state,
    window,
    frames,
    listeners,
    frame(timestamp) {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(timestamp));
    },
    dispatch(name, event = {}) {
      [...(listeners.get(name) ?? [])].forEach((listener) => listener(event));
    },
  };
}
function click(overrides = {}) {
  return {
    button: 0,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    ...overrides,
  };
}
for (const [id, destination] of [
  ['servicos', 768],
  ['candidatura', 3600],
  ['portfolio', 2168],
]) {
  test(`${id} animates actual intermediate positions before setting the hash`, (t) => {
    const page = mockPage(t);
    const event = click();
    scrollToSection(event, `#${id}`);
    assert.equal(event.defaultPrevented, true);
    assert.equal(page.calls.length, 0, 'click must not jump immediately');
    assert.deepEqual(
      page.historyCalls,
      [],
      'hash must not change during the animation',
    );
    page.frame(0);
    page.frame(400);
    assert.ok(
      page.window.scrollY > 0 && page.window.scrollY < destination,
      'there must be a visible intermediate position',
    );
    assert.deepEqual(page.historyCalls, []);
    page.frame(1200);
    assert.equal(page.window.scrollY, destination);
    assert.ok(
      page.calls.every((call) => call.behavior === 'instant'),
      'individual frames must not create native smooth-scroll animations',
    );
    assert.deepEqual(page.historyCalls, [[page.state, '', `#${id}`]]);
    assert.equal(page.frames.size, 0);
    assert.ok([...page.listeners.values()].every((set) => set.size === 0));
  });
}
test('wheel input interrupts animation without committing a destination hash', (t) => {
  const page = mockPage(t);
  scrollToSection(click(), '#servicos');
  page.frame(0);
  page.frame(200);
  const partialPosition = page.window.scrollY;
  page.dispatch('wheel');
  page.frame(1500);
  assert.equal(page.window.scrollY, partialPosition);
  assert.deepEqual(page.historyCalls, []);
  assert.equal(page.frames.size, 0);
});
test('new section click cancels the previous animation and starts from the current position', (t) => {
  const page = mockPage(t);
  scrollToSection(click(), '#servicos');
  page.frame(0);
  page.frame(200);
  const origin = page.window.scrollY;
  scrollToSection(click(), '#portfolio');
  assert.equal(page.frames.size, 1);
  page.frame(300);
  assert.equal(page.window.scrollY, origin);
  page.frame(1500);
  assert.equal(page.window.scrollY, 2168);
  assert.deepEqual(page.historyCalls, [[page.state, '', '#portfolio']]);
});
test('scrolling keys and page cleanup cancel pending animation', (t) => {
  const page = mockPage(t);
  scrollToSection(click(), '#servicos');
  page.dispatch('keydown', { key: 'a' });
  assert.equal(page.frames.size, 1);
  page.dispatch('keydown', { key: 'ArrowDown' });
  assert.equal(page.frames.size, 0);
  scrollToSection(click(), '#servicos');
  cancelSectionScroll();
  assert.equal(page.frames.size, 0);
  assert.ok([...page.listeners.values()].every((set) => set.size === 0));
});
test('modified clicks and missing targets retain native anchor behavior', (t) => {
  const page = mockPage(t);
  for (const override of [
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ]) {
    const event = click(override);
    scrollToSection(event, '#servicos');
    assert.equal(event.defaultPrevented, false);
  }
  const event = click();
  scrollToSection(event, '#inexistente');
  assert.equal(event.defaultPrevented, false);
  assert.equal(page.frames.size, 0);
});
test('contact CTA goes to Instagram while official email remains available', () => {
  assert.equal(getContactHref(), 'https://www.instagram.com/turingtecnologia/');
  assert.equal(siteConfig.contact.email, 'turing.tecnologia@ufersa.edu.br');
});
