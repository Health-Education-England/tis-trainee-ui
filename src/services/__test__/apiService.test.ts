import { onFulfilled, onRejected } from "../apiService";
import { errorResponse } from "../../mock-data/service-api-err-res";
import * as Sentry from "@sentry/browser";

describe("ApiService", () => {

  it("Error should not be captured by Sentry on fulfilled", () => {
    const sentrySpy = jest.spyOn(Sentry, "captureException");

    onFulfilled({}).then(res => {
        expect(res).toEqual({});
    });

    expect(sentrySpy).not.toHaveBeenCalled();
  });

  it("Error should be captured by Sentry on rejection", () => {
    const sentrySpy = jest.spyOn(Sentry, "captureException");

    onRejected(errorResponse).catch(error => {
        expect(error).toEqual(errorResponse);
    });

    expect(sentrySpy).toHaveBeenCalledWith(errorResponse);
  });
});
