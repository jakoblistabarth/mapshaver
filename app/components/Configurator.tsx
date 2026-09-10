"use client";

import { formatCrs } from "@/src/Input/Crs";
import {
  formatDuration,
  formatFloat,
  formatInteger,
  MAX_VERTEX_COUNT,
} from "@/src/utilities";
import { FC, useEffect, useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";
import { GroupedTestFiles } from "../helpers/getGroupedTestFiles";
import useAppStore from "../helpers/store";
import Button from "./Button";
import CConfigurator from "./CConfigurator";
import ExportMenu from "./ExportMenu";
import FileSelect from "./FileSelect";
import FileUpload from "./FileUpload";

type Props = {
  files: GroupedTestFiles;
};

const Configurator: FC<Props> = ({ files }) => {
  const {
    source,
    sourceError,
    removeSource,
    activeSnapshot,
    isSchematizing,
    schematizationProgress,
    schematizationError,
    cancelSchematization,
    schematizationStartedAt,
    schematizationDuration,
    isDebug,
  } = useAppStore();
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [now, setNow] = useState(() => performance.now());

  useEffect(() => {
    if (!isSchematizing) return;
    const tick = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(tick);
  }, [isSchematizing]);

  // use elapsed time while schematizing
  // when finished, use the duration
  const elapsed = isSchematizing
    ? schematizationStartedAt === undefined
      ? undefined
      : now - schematizationStartedAt
    : schematizationDuration;

  // A new source starts over from the configurator, so the reopened one must not linger.
  useEffect(() => setIsConfiguring(false), [source]);

  const dcel = useMemo(() => {
    if (!activeSnapshot) return undefined;
    return activeSnapshot.subdivision.toDcel();
  }, [activeSnapshot]);

  const info = useMemo(() => {
    if (!dcel) return undefined;
    return {
      duration: formatDuration(activeSnapshot?.duration ?? 0),
      vertices: formatInteger(dcel.vertices.size),
      halfEdges: formatInteger(dcel.halfEdges.size),
      faces: formatInteger(dcel.getBoundedFaces().length),
      area: formatFloat(dcel.getArea()),
    };
  }, [dcel, activeSnapshot]);

  return (
    <>
      <div className="relative ml-3 w-72 space-y-2">
        {!source && (
          <>
            <FileSelect files={files} />
            <FileUpload />
          </>
        )}
        {sourceError && (
          <div className="rounded-md bg-red-50 p-2 text-sm text-red-900">
            {sourceError}
          </div>
        )}
        {source && (
          <div className="rounded-md bg-white p-2">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate">{source.name}</span>
              {activeSnapshot && !isConfiguring && (
                <button
                  className="shrink-0 rounded-full p-1 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-900"
                  onClick={() => setIsConfiguring(true)}
                  title="Configure the set of orientations"
                  aria-label="Configure the set of orientations"
                >
                  <RiSettings3Line />
                </button>
              )}
              <button
                className="shrink-0 rounded-full bg-blue-600 p-1 text-blue-50 transition-colors hover:bg-blue-950"
                onClick={() => removeSource()}
                title="Remove this input"
                aria-label="Remove this input"
              >
                <MdClose />
              </button>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {formatInteger(source.vertexCount)} vertices ·{" "}
              {formatCrs(source.crs)}
            </div>
            {source.skipped > 0 && (
              <div className="mt-1 text-xs text-gray-500">
                {source.skipped} non-polygonal feature
                {source.skipped === 1 ? "" : "s"} skipped
              </div>
            )}
            {source.vertexCount > MAX_VERTEX_COUNT && (
              <div className="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-900">
                Above {MAX_VERTEX_COUNT} vertices. Schematization runs in a
                worker, so the interface stays responsive, but the run can take
                a while.
              </div>
            )}
          </div>
        )}
        {source && !isSchematizing && (!activeSnapshot || isConfiguring) && (
          <CConfigurator
            onCancel={
              activeSnapshot ? () => setIsConfiguring(false) : undefined
            }
            onSubmit={() => setIsConfiguring(false)}
          />
        )}
        {isSchematizing && (
          // Use background with inset (padding) rather than a border
          // for the gradient animation
          <div className="border-sweep rounded-md p-px">
            <div className="flex items-center gap-2 rounded-md bg-white p-2 text-sm">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-shimmer">Schematizing</span>
                </div>
                {schematizationProgress && (
                  <div className="truncate font-mono text-xs text-gray-500">
                    {schematizationProgress.label} ·{" "}
                    {elapsed !== undefined && (
                      <>
                        <span className="ml-auto shrink-0 font-mono text-xs text-gray-500 tabular-nums">
                          {formatDuration(elapsed)}
                        </span>{" "}
                        ·{" "}
                      </>
                    )}
                    <span className="tabular-nums">
                      {formatInteger(schematizationProgress.step)}
                    </span>
                  </div>
                )}
              </div>
              <Button
                className="shrink-0"
                variant="destructive"
                onClick={cancelSchematization}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {schematizationError && (
          <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-900">
            {schematizationError}
          </div>
        )}
        {activeSnapshot && !isConfiguring && (
          <div className="mt-2 rounded-md bg-white p-2 text-sm">
            <div className="mb-2 flex items-baseline gap-2 text-gray-500">
              <span className="min-w-0 truncate">
                Snapshot{" "}
                <pre className="inline font-black">{activeSnapshot.label}</pre>
              </span>
              {elapsed !== undefined && (
                <span className="ml-auto shrink-0 font-mono text-xs tabular-nums">
                  {formatDuration(elapsed)}
                </span>
              )}
            </div>

            {/* What the snapshot is made of, which is of interest while working on
                the algorithm rather than while using it. */}
            {isDebug && (
              <table>
                <tbody>
                  {info &&
                    Object.entries(info).map(([key, value]) => (
                      <tr key={key}>
                        <td className="pr-4">{key}</td>
                        <td className="font-mono text-sm">{value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeSnapshot && !isConfiguring && <ExportMenu />}
      </div>
    </>
  );
};

export default Configurator;
