import CRegular from "@/src/c-oriented-schematization/CRegular";
import CSchematization from "@/src/c-oriented-schematization/CSchematization";
import FaceFaceBoundaryListGenerator from "@/src/c-oriented-schematization/FaceFaceBoundaryListGenerator";
import { style } from "@/src/c-oriented-schematization/schematization.style";
import Dcel from "@/src/Dcel/Dcel";
import { DECIMAL_SCALE } from "@/src/geometry/constants";
import fs from "fs";
import path from "path";
import { describe, expect, test } from "vitest";

/**
 * Three regions meeting at a tripoint they miss by a little, which is what a
 * simplified boundary does to a shared corner. The triangle they leave uncovered
 * belongs to no region, so the unbounded face takes it, and that face is then
 * bounded by a ring around the outside and another around the sliver.
 */
const shape = () =>
  JSON.parse(
    fs.readFileSync(
      path.resolve("test/data/shapes/tripoint-sliver.json"),
      "utf8",
    ),
  );

describe("A region bordering the unbounded face along two of its rings", function () {
  test("is what a sliver left at a tripoint produces.", function () {
    const dcel = Dcel.fromGeoJSON(shape());
    const boundaries = new FaceFaceBoundaryListGenerator()
      .run(dcel)
      .getBoundaries();

    // Walking a ring never reaches an edge on another, so a boundary running along
    // two of them is one whose edges no single cycle holds.
    const spanningTwoRings = boundaries.filter((boundary) => {
      const cycles: (typeof boundary.edges)[] = [];
      boundary.edges.forEach((edge) => {
        if (!cycles.some((cycle) => cycle.includes(edge)))
          cycles.push(edge.getCycle());
      });
      return cycles.length > 1;
    });

    expect(spanningTwoRings.length).toBeGreaterThan(0);
  });

  test("is schematized rather than refused.", function () {
    const schematization = new CSchematization({
      ...style,
      c: new CRegular(4),
    });
    const originalArea = Dcel.fromGeoJSON(shape()).getArea();

    const result = schematization.run(Dcel.fromGeoJSON(shape()));

    expect(result.getArea()).toBeCloseTo(originalArea, DECIMAL_SCALE);
  });
});
