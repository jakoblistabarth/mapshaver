import {
  readGeoData,
  type ReadResult as ParseResult,
} from "@/src/Input/readGeoData";
import sqlJsConfig from "./sqlJsConfig";

export type { ParseResult };

const options = { config: sqlJsConfig };

// Exclude geojson for the time being.
// TODO: enable it once the tool can project to any CRS
const readable = /\.(fgb|gpkg)$/i;

/**
 * Parse an uploaded geodata file into an {@link Input}.
 *
 * Supported: FlatGeobuf (`.fgb`) and GeoPackage (`.gpkg`).
 * @param file the uploaded file
 * @returns the parsed input, or a message describing why it was rejected
 */
export const parseGeoFile = async (file: File): Promise<ParseResult> => {
  // The file picker is told the same, but a file can be dropped on the page without
  // ever passing it.
  if (!readable.test(file.name))
    return {
      ok: false,
      error: `Cannot read "${file.name}". Drop a .fgb or .gpkg file, which carry the coordinate reference system.`,
    };
  return readGeoData(
    file.name,
    new Uint8Array(await file.arrayBuffer()),
    options,
  );
};

/**
 * Fetch and parse a bundled sample.
 * @param name the sample's file name, whose extension selects the reader
 * @param url the URL to fetch it from, base path already applied
 * @returns the parsed input, or a message describing why it was rejected
 */
export const parseGeoUrl = async (
  name: string,
  url: string,
): Promise<ParseResult> => {
  try {
    const response = await fetch(url);
    if (!response.ok)
      return {
        ok: false,
        error: `Could not load "${name}" (${response.status}).`,
      };
    return readGeoData(
      name,
      new Uint8Array(await response.arrayBuffer()),
      options,
    );
  } catch (error) {
    return {
      ok: false,
      error: `Could not load "${name}": ${error instanceof Error ? error.message : "unknown error"}`,
    };
  }
};
