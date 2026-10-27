import { act, renderHook, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { CctSpecialty } from "../../../models/CctTypes";
import cctReferenceReducer from "../../../redux/slices/cctReferenceSlice";
import { CctService } from "../../../services/CctService";
import { useCctSpecialties } from "../useCctSpecialties";

const specialties: CctSpecialty[] = [
  { name: "Paediatrics", lengthMonths: 84, entryGrade: "ST1" }
];

const createStore = () =>
  configureStore({ reducer: { cctReference: cctReferenceReducer } });

const createWrapper = (store: ReturnType<typeof createStore>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return Wrapper;
};

describe("useCctSpecialties", () => {
  let getSpecialtiesSpy: jest.SpyInstance;
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    getSpecialtiesSpy = jest.spyOn(CctService.prototype, "getSpecialties");
    store = createStore();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("is loading with no specialties until the list arrives", async () => {
    getSpecialtiesSpy.mockResolvedValue(specialties);

    const { result } = renderHook(() => useCctSpecialties(), {
      wrapper: createWrapper(store)
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.specialties).toEqual([]);
    await waitFor(() => expect(result.current.status).toBe("succeeded"));
    expect(result.current.specialties).toEqual(specialties);
  });

  it("reports a failure and holds no specialties when the call rejects", async () => {
    getSpecialtiesSpy.mockRejectedValue(new Error("no endpoint yet"));

    const { result } = renderHook(() => useCctSpecialties(), {
      wrapper: createWrapper(store)
    });

    await waitFor(() => expect(result.current.status).toBe("failed"));
    expect(result.current.specialties).toEqual([]);
    expect(result.current.isRetrying).toBe(false);
  });

  it("keeps the failure on show while a retry runs, and recovers when the second call succeeds", async () => {
    getSpecialtiesSpy
      .mockRejectedValueOnce(new Error("no endpoint yet"))
      .mockResolvedValueOnce(specialties);

    const { result } = renderHook(() => useCctSpecialties(), {
      wrapper: createWrapper(store)
    });
    await waitFor(() => expect(result.current.status).toBe("failed"));

    act(() => result.current.retry());
    expect(result.current.isRetrying).toBe(true);
    expect(result.current.status).toBe("failed");

    await waitFor(() => expect(result.current.status).toBe("succeeded"));
    expect(result.current.isRetrying).toBe(false);
    expect(result.current.specialties).toEqual(specialties);
    expect(getSpecialtiesSpy).toHaveBeenCalledTimes(2);
  });

  it("does not ask again once the list has loaded, however often the form is opened", async () => {
    getSpecialtiesSpy.mockResolvedValue(specialties);

    const first = renderHook(() => useCctSpecialties(), {
      wrapper: createWrapper(store)
    });
    await waitFor(() => expect(first.result.current.status).toBe("succeeded"));
    first.unmount();

    const second = renderHook(() => useCctSpecialties(), {
      wrapper: createWrapper(store)
    });

    expect(second.result.current.status).toBe("succeeded");
    expect(second.result.current.specialties).toEqual(specialties);
    expect(getSpecialtiesSpy).toHaveBeenCalledTimes(1);
  });
});
