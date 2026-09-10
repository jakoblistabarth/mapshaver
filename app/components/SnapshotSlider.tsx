"use client";

import { LABEL } from "@/src/c-oriented-schematization/CSchematization";
import { formatInteger } from "@/src/utilities";
import * as Slider from "@radix-ui/react-slider";
import * as Tooltip from "@radix-ui/react-tooltip";
import { FC, useState } from "react";
import useAppStore from "../helpers/store";

const SnapshotSlider: FC = () => {
  const {
    snapshotList,
    activeSnapshot,
    setActiveSnapshot,
    isDebug,
    isSchematizing,
  } = useAppStore();
  /** Kept open for as long as the thumb is being moved, not only pointed at. */
  const [isDragging, setIsDragging] = useState(false);
  const [isPointedAt, setIsPointedAt] = useState(false);

  if (isDebug || isSchematizing) return <></>;
  const snapshots =
    snapshotList?.snapshots.filter(({ label }) => label === LABEL.SIMPLIFY) ??
    [];
  if (snapshots.length < 2) return <></>;

  const active = snapshots.findIndex(({ id }) => id === activeSnapshot?.id);
  const position = active === -1 ? snapshots.length - 1 : active;
  const shown = snapshots[position];

  return (
    <Tooltip.Provider delayDuration={150}>
      <div className="mx-auto mb-5 flex w-[min(92vw,32rem)] items-center gap-3 rounded-md bg-white p-2 px-3 shadow">
        <span className="shrink-0 text-gray-500">More Detail</span>
        <Slider.Root
          className="relative flex h-5 w-full touch-none items-center select-none"
          value={[position]}
          min={0}
          max={snapshots.length - 1}
          step={1}
          aria-label="How far the simplification is followed"
          onValueChange={([index]) => {
            setIsDragging(true);
            setActiveSnapshot(snapshots[index].id);
          }}
          onValueCommit={() => setIsDragging(false)}
        >
          <Slider.Track className="relative h-0.5 grow rounded-full bg-blue-200">
            <Slider.Range className="absolute h-full rounded-full bg-blue-700" />
          </Slider.Track>
          {/* Controlled, since what it says is worth reading while the thumb is
            moving, which is the one time a tooltip of its own accord would not
            be showing. */}
          <Tooltip.Root open={isDragging || isPointedAt}>
            <Tooltip.Trigger asChild>
              <Slider.Thumb
                className="block size-3 cursor-pointer rounded-full border border-blue-500 bg-white shadow shadow-blue-500 hover:bg-blue-50 focus:shadow-[0_0_0_3px] focus:shadow-black/50 focus:outline-none"
                onPointerEnter={() => setIsPointedAt(true)}
                onPointerLeave={() => setIsPointedAt(false)}
                onFocus={() => setIsPointedAt(true)}
                onBlur={() => setIsPointedAt(false)}
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={8}
                className="data-[side=top]:animate-slideDownAndFade rounded-sm bg-white px-2 py-1 text-center shadow"
              >
                <div className="font-bold tabular-nums">
                  {formatInteger(shown.subdivision.edgeCount)} edges
                </div>
                <div className="text-xs text-gray-500 tabular-nums">
                  {formatInteger(position + 1)} of{" "}
                  {formatInteger(snapshots.length)}
                </div>
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Slider.Root>
        <span className="shrink-0 text-gray-500">Less Detail</span>
      </div>
    </Tooltip.Provider>
  );
};

export default SnapshotSlider;
