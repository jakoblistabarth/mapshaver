"use client";

import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
// import { handleSimplify } from "../helpers/handleSimplify";
import useAppStore from "../helpers/store";

const REVEAL_WINDOW = 1000;
const REVEAL_PRESSES = 3;

/**
 * Whether a key press belongs to a control which reads typing of its own.
 */
const isTypingInto = (target: EventTarget | null) =>
  target instanceof Element &&
  !!target.closest(
    'input, textarea, select, [contenteditable="true"], [role="combobox"], [role="listbox"], [role="textbox"]',
  );

const Hotkeys = () => {
  const {
    removeSource,
    setActiveSnapshot,
    prevSnapshot,
    nextSnapshot,
    snapshotList,
    toggleDebug,
    toggleViewMode,
  } = useAppStore();
  /** When "d" was last pressed, most recent last. */
  const presses = useRef<number[]>([]);

  useHotkeys(
    ["ctrl+s"],
    () =>
      snapshotList &&
      //TO-DO: reimplement step by step simplification
      // ideally I could write something like this:
      // schematization.doEdgeMove();
      // handleSimplify(dcel, snapshotList, setActiveSnapshot),
      console.log("Simplifying..."),
  );
  useHotkeys(["ctrl+c"], () => removeSource());
  useHotkeys(["left"], (event) =>
    prevSnapshot && !isTypingInto(event.target)
      ? setActiveSnapshot(prevSnapshot.id)
      : undefined,
  );
  useHotkeys(["right"], (event) =>
    nextSnapshot && !isTypingInto(event.target)
      ? setActiveSnapshot(nextSnapshot.id)
      : undefined,
  );
  useHotkeys(["d"], (event) => {
    if (isTypingInto(event.target)) return;
    const now = performance.now();
    presses.current = [...presses.current, now].filter(
      (at) => now - at < REVEAL_WINDOW,
    );
    if (presses.current.length < REVEAL_PRESSES) return;
    presses.current = [];
    toggleDebug();
  });
  useHotkeys(["w"], (event) =>
    isTypingInto(event.target) ? undefined : toggleViewMode(),
  );
  return <></>;
};

export default Hotkeys;
