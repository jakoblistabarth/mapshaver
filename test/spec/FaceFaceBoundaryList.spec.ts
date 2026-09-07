import FaceFaceBoundaryList from "@/src/c-oriented-schematization/FaceFaceBoundaryList";
import Face from "@/src/Dcel/Face";
import { describe, expect, test } from "vitest";

/** A face which is only ever asked for its id. */
const face = (id: number) => Object.assign(new Face(), { id });

describe("Ordering the two faces a boundary lies between", function () {
  test("goes by the id and not by the string it is written into.", function () {
    // "f10" reads as less than "f5", so ordering them as text put a face made later
    // first — and which face comes first decides whose half edges describe the
    // boundary between them.
    expect(
      FaceFaceBoundaryList.sortFaces(face(10), face(5)).map(({ id }) => id),
    ).toEqual([5, 10]);
    expect(
      FaceFaceBoundaryList.sortFaces(face(5), face(41)).map(({ id }) => id),
    ).toEqual([5, 41]);
  });

  test("leaves the unbounded face last, which is the one made last of all.", function () {
    // It is the only face bounded by more than one ring, so a boundary described by
    // it is one whose edges lie on more than one of them.
    const [first] = FaceFaceBoundaryList.sortFaces(face(41), face(5));

    expect(first.id).toBe(5);
  });
});
