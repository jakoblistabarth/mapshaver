"use client";

import clsx from "clsx";
import { DragEvent, FC, useRef, useState } from "react";
import { RiUploadLine } from "react-icons/ri";
import useAppStore from "../helpers/store";

/**
 * A drop target and file picker for user-supplied geodata.
 */
const FileUpload: FC = () => {
  const { setSourceFromFile } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) setSourceFromFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggedOver(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(event) => {
        // Without this the browser navigates to the dropped file.
        event.preventDefault();
        setIsDraggedOver(true);
      }}
      onDragLeave={() => setIsDraggedOver(false)}
      onClick={() => inputRef.current?.click()}
      className={clsx(
        "flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-6 text-center transition-colors",
        isDraggedOver
          ? "border-blue-600 bg-blue-50 text-blue-900"
          : "border-blue-300 bg-white text-blue-900 hover:bg-blue-50",
      )}
    >
      <RiUploadLine size={28} />
      <p>
        <span className="font-display block font-bold text-blue-600">
          Drop a file
        </span>
        <span className="text-xs text-blue-600/80">
          <span className="font-mono">.gpkg</span> or{" "}
          <span className="font-mono">.fgb</span>
          <br /> — or click to choose one
        </span>
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".fgb,.gpkg"
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          // Allow re-selecting the same file after removing it.
          event.target.value = "";
        }}
      />
    </div>
  );
};

export default FileUpload;
