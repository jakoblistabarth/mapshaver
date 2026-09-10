"use client";

import { FC, useState } from "react";
import { RiDownload2Line } from "react-icons/ri";
import {
  download,
  formatsOf,
  outputFormats,
  outputGroups,
  toExportFile,
  type OfferedFormat,
  type OutputGroup,
} from "../helpers/exportSnapshot";
import useAppStore from "../helpers/store";
import Button from "./Button";

/**
 * Offers the active snapshot for download, grouped by what the file is for:
 * geodata that carries the coordinate reference system, or graphics to take
 * into vector software.
 */
const ExportMenu: FC = () => {
  const { activeSnapshot, source } = useAppStore();
  const [pending, setPending] = useState<OfferedFormat>();
  const [error, setError] = useState<string>();

  if (!activeSnapshot || !source) return null;

  const handleExport = async (format: OfferedFormat) => {
    setPending(format);
    setError(undefined);
    try {
      const { blob, fileName } = await toExportFile(
        activeSnapshot.subdivision,
        format,
        source,
      );
      download(blob, fileName);
    } catch (error) {
      setError(
        `Could not export as ${outputFormats[format].label}: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    } finally {
      setPending(undefined);
    }
  };

  return (
    <div className="mt-2 rounded-md bg-white p-2 text-sm">
      <div className="mb-2 flex items-center gap-1 text-gray-500">
        <RiDownload2Line />
        Export
      </div>
      {(Object.keys(outputGroups) as OutputGroup[]).map((group) => (
        <div key={group} className="mb-2 last:mb-0">
          <div className="mb-1 text-xs text-gray-500">
            {outputGroups[group].label}
            <span className="text-gray-400"> · {outputGroups[group].hint}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {formatsOf(group).map((format) => (
              <Button
                key={format}
                disabled={!!pending}
                onClick={() => handleExport(format)}
              >
                {pending === format
                  ? "Exporting…"
                  : outputFormats[format].label}
              </Button>
            ))}
          </div>
        </div>
      ))}
      {error && (
        <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-900">
          {error}
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
