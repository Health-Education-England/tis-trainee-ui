import { CctSpecialty } from "../../../models/CctTypes";
import cctReferenceReducer, { fetchCctSpecialties } from "../cctReferenceSlice";

const specialties: CctSpecialty[] = [
  { name: "Paediatrics", lengthMonths: 84, entryGrade: "ST1" }
];

describe("cctReferenceSlice", () => {
  const initial = cctReferenceReducer(undefined, { type: "init" });
  const failed = cctReferenceReducer(
    initial,
    fetchCctSpecialties.rejected(
      new Error("no endpoint yet"),
      "request-1",
      undefined
    )
  );

  it("starts idle with no specialties and no error", () => {
    expect(initial).toEqual({ specialties: [], status: "idle", error: null });
  });

  it("is loading while the request runs", () => {
    const loading = cctReferenceReducer(
      initial,
      fetchCctSpecialties.pending("request-1", undefined)
    );

    expect(loading.status).toBe("loading");
  });

  it("holds the list once it arrives", () => {
    const loaded = cctReferenceReducer(
      initial,
      fetchCctSpecialties.fulfilled(specialties, "request-1", undefined)
    );

    expect(loaded).toEqual({ specialties, status: "succeeded", error: null });
  });

  it("records the failure and holds no list when the request rejects", () => {
    expect(failed).toEqual({
      specialties: [],
      status: "failed",
      error: "no endpoint yet"
    });
  });

  it("keeps the failure while a retry is in flight, and clears it when the retry succeeds", () => {
    const retrying = cctReferenceReducer(
      failed,
      fetchCctSpecialties.pending("request-2", undefined)
    );
    expect(retrying).toEqual({
      specialties: [],
      status: "loading",
      error: "no endpoint yet"
    });

    const recovered = cctReferenceReducer(
      retrying,
      fetchCctSpecialties.fulfilled(specialties, "request-2", undefined)
    );
    expect(recovered).toEqual({
      specialties,
      status: "succeeded",
      error: null
    });
  });
});
