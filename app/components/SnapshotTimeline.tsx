"use client";

import Snapshot from "@/src/Snapshot/Snapshot";
import { formatDuration } from "@/src/utilities";
import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { ScaleLinear } from "d3";
import { FC } from "react";
import useAppStore from "../helpers/store";

type Props = {
  snapshots: Snapshot[];
  colorScale: ScaleLinear<string, string, string>;
};

const SnapshotTimeline: FC<Props> = ({ snapshots, colorScale }) => {
  const { setActiveSnapshot, activeSnapshot } = useAppStore();
  const width = 4;
  const height = 25;
  const baseStrokeWidth = 2;
  const grow = 5;
  const gap = 1;

  return !snapshots.length ? null : (
    <Tooltip.Provider>
      <svg
        width={snapshots.length * width + (snapshots.length - 1) * gap + 2}
        height={height + 2}
      >
        {snapshots.map((d, i) => {
          const isActive = activeSnapshot?.id === d.id;
          return (
            <Tooltip.Root key={d.id} open={isActive}>
              <Tooltip.Trigger asChild>
                <rect
                  x={width * i + gap * i + baseStrokeWidth / 2}
                  y={
                    isActive
                      ? baseStrokeWidth / 2
                      : (baseStrokeWidth + grow) / 2
                  }
                  rx={2}
                  width={width}
                  height={isActive ? height : height - grow}
                  fill={colorScale(d.duration)}
                  className={clsx(
                    "cursor-pointer stroke-transparent stroke-1 transition-all duration-100 hover:stroke-blue-600",
                    isActive && "stroke-blue-900 stroke-2!",
                  )}
                  onClick={() => setActiveSnapshot(d.id)}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="data-[state=closed]:animate-fadeOut data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=bottom]:animate-slideUpAndFade text-violet11 rounded-sm bg-white px-3.75 py-2.5 text-[15px] leading-none shadow-[hsl(206_22%_7%_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] select-none"
                  sideOffset={10}
                >
                  <strong>{d.label}</strong>
                  <p>
                    {i + 1}/{snapshots.length} {formatDuration(d.duration)}
                  </p>
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </svg>
    </Tooltip.Provider>
  );
};

export default SnapshotTimeline;
