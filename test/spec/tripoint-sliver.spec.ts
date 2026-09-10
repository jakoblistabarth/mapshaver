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
 * Three regions which miss the tripoint they share.
 * The triangle they leave over belongs to no region, so the unbounded face
 * takes it and is left bounded by two rings: one around the outside
 * and one around the sliver. Each region borders it along both.
 */
const shape = () =>
  JSON.parse(
    fs.readFileSync(
      path.resolve("test/data/synthetic/tripoint-sliver.json"),
      "utf8",
    ),
  );

describe("A map with a sliver left at a tripoint", function () {
  test("leaves the unbounded face bounded by more than one ring.", function () {
    const dcel = Dcel.fromGeoJSON(shape());
    const unbounded = dcel.faces.find((face) => face.isUnbounded);
    const edges = dcel.getHalfEdges().filter((edge) => edge.face === unbounded);

    const rings: (typeof edges)[] = [];
    edges.forEach((edge) => {
      if (!rings.some((ring) => ring.includes(edge)))
        rings.push(edge.getCycle());
    });

    expect(rings.length).toBeGreaterThan(1);
  });

  test("describes every boundary by the edges of a face which encloses something.", function () {
    const boundaries = new FaceFaceBoundaryListGenerator()
      .run(Dcel.fromGeoJSON(shape()))
      .getBoundaries();

    boundaries.forEach((boundary) =>
      boundary.edges.forEach((edge) =>
        expect(edge.face?.isUnbounded).toBe(false),
      ),
    );
  });

  test("keeps every boundary on a single ring.", function () {
    const boundaries = new FaceFaceBoundaryListGenerator()
      .run(Dcel.fromGeoJSON(shape()))
      .getBoundaries();

    // Only the unbounded face is bounded by more than one ring here, so describing a
    // boundary by the other face is what keeps its edges on one of them — and the
    // distance from one edge of a boundary to another is a distance along that ring.
    boundaries.forEach((boundary) => {
      const rings: (typeof boundary.edges)[] = [];
      boundary.edges.forEach((edge) => {
        if (!rings.some((ring) => ring.includes(edge)))
          rings.push(edge.getCycle());
      });
      expect(rings.length).toBe(1);
    });
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
