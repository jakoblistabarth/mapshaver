/// <reference lib="webworker" />

import { createC } from "@/src/c-oriented-schematization/CConfig";
import CSchematization, {
  LABEL,
} from "@/src/c-oriented-schematization/CSchematization";
import { style as defaultStyle } from "@/src/c-oriented-schematization/schematization.style";
import Subdivision from "@/src/geometry/Subdivision";
import Snapshot, { type SerializedSnapshot } from "@/src/Snapshot/Snapshot";
import type {
  SchematizationRequest,
  SchematizationResponse,
} from "./schematizationWorkerMessages";

/** Minimal time between two messages, in milliseconds. */
const flushInterval = 100;

const post = (message: SchematizationResponse) => self.postMessage(message);

self.onmessage = ({
  data: { subdivision, cConfig },
}: MessageEvent<SchematizationRequest>) => {
  let buffer: SerializedSnapshot[] = [];
  let lastFlush = performance.now();
  let label = LABEL.LOAD;
  let step = 0;

  const flush = (force = false) => {
    if (!force && performance.now() - lastFlush < flushInterval) return;
    lastFlush = performance.now();
    post({ type: "progress", label, step });
    if (!buffer.length) return;
    post({ type: "snapshots", snapshots: buffer });
    buffer = [];
  };

  try {
    const schematization = new CSchematization(
      { ...defaultStyle, c: createC(cConfig) },
      {
        visualize: ({ dcel, label: snapshotLabel, forSnapshots }) => {
          if (!forSnapshots) return;
          label = snapshotLabel;
          step++;
          const snapshot = Snapshot.fromDcel(dcel, {
            label: snapshotLabel,
            triggeredAt: forSnapshots.triggeredAt,
            additionalData: forSnapshots.additionalData,
          }).toSerialized();
          buffer.push(snapshot);
          flush();
        },
      },
    );

    schematization.run(Subdivision.fromSerialized(subdivision).toDcel());

    flush(true);
    post({ type: "done" });
  } catch (error) {
    post({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
