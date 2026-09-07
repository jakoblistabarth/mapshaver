"use client";

import * as Toast from "@radix-ui/react-toast";
import { useEffect, useRef, useState } from "react";
import { RiBugLine, RiCloseLine } from "react-icons/ri";
import useAppStore from "../helpers/store";

/** How long the message stays before it takes itself away. */
const DURATION = 3000;

const DebugToast = () => {
  const isDebug = useAppStore((state) => state.isDebug);
  /** What the interface was last saying, so that only a change is announced. */
  const announced = useRef(isDebug);
  const [open, setOpen] = useState(false);
  /** Counted so that toggling again restarts the message rather than joining it. */
  const [toggles, setToggles] = useState(0);

  useEffect(() => {
    if (announced.current === isDebug) return;
    announced.current = isDebug;
    setToggles((count) => count + 1);
    setOpen(true);
  }, [isDebug]);

  return (
    <Toast.Provider swipeDirection="right" duration={DURATION}>
      <Toast.Root
        key={toggles}
        open={open}
        onOpenChange={setOpen}
        className="data-[state=open]:animate-toastSlideIn data-[state=closed]:animate-fadeOut data-[swipe=end]:animate-toastSwipeOut flex items-center gap-3 rounded-md border border-blue-600 bg-white p-3 shadow data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)"
      >
        <RiBugLine className="shrink-0 text-blue-600" size={18} />
        <div className="min-w-0">
          <Toast.Title className="text-sm font-bold text-blue-600">
            Debug interface {isDebug ? "shown" : "hidden"}
          </Toast.Title>
          <Toast.Description className="text-xs text-gray-500">
            Press <kbd className="font-mono">d</kbd> three times to{" "}
            {isDebug ? "hide" : "show"} it.
          </Toast.Description>
        </div>
        <Toast.Close
          aria-label="Dismiss"
          className="ml-auto shrink-0 rounded-full p-1 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-900"
        >
          <RiCloseLine size={16} />
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed right-4 bottom-4 z-50 flex w-80 max-w-[92vw] flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
};

export default DebugToast;
