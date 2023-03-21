import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <ReactLoading
      data-cy="loading"
      type={"bars"}
      color={"black"}
    ></ReactLoading>
  );
}
