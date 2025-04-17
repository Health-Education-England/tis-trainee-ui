import React from "react";
import ReactLoading, { LoadingType } from "react-loading";

type LoadingProps = Readonly<{
  color?: string;
  height?: any;
  width?: any;
  delay?: number;
  type?: LoadingType;
  className?: string;
}>;

export default function Loading({
  color = "#005eb8",
  height = 100,
  width = 100,
  delay = 0,
  type = "bubbles",
  className = ""
}: LoadingProps) {
  const loadingType: LoadingType = type;

  return (
    <div className={`loading ${className}`}>
      <ReactLoading
        data-cy="loading"
        type={loadingType}
        color={color}
        height={height}
        width={width}
        delay={delay}
        aria-label="loading-icon"
      />
    </div>
  );
}
