import React from "react";

export default function RenderSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const paramsObj = Object.fromEntries(searchParams.entries());
  return (
    <div id="search-params">
      {Object.keys(paramsObj).map((k, i) => (
        <React.Fragment key={i}>
          <span id={`${k}:${paramsObj[k]}`} />
        </React.Fragment>
      ))}
    </div>
  );
}
