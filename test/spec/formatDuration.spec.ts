import { formatDuration } from "@/src/utilities";
import { describe, expect, test } from "vitest";

describe("Writing a duration", function () {
  test("uses milliseconds for what a snapshot takes.", function () {
    expect(formatDuration(0)).toBe("0ms");
    expect(formatDuration(0.0999999)).toBe("0.1ms");
    expect(formatDuration(42)).toBe("42ms");
    expect(formatDuration(999)).toBe("999ms");
  });

  test("uses seconds for what a run takes.", function () {
    expect(formatDuration(1000)).toBe("1.0s");
    expect(formatDuration(3300)).toBe("3.3s");
    expect(formatDuration(49_600)).toBe("49.6s");
  });

  test("uses minutes once seconds stop being easy to read.", function () {
    expect(formatDuration(60_000)).toBe("1m 0s");
    expect(formatDuration(90_000)).toBe("1m 30s");
    expect(formatDuration(3_723_000)).toBe("62m 3s");
  });

  test("leaves a unit behind before rounding carries out of it.", function () {
    expect(formatDuration(999.6)).toBe("1.0s");
    expect(formatDuration(59_999)).toBe("1m 0s");
    expect(formatDuration(179_600)).toBe("3m 0s");
  });
});
