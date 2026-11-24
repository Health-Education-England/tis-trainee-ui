import React, { useEffect, useState } from "react";
import ReactLoading, { LoadingType } from "react-loading";

type LoadingProps = Readonly<{
  color?: string;
  height?: any;
  width?: any;
  delay?: number;
  type?: LoadingType;
  className?: string;
  text?: string;
}>;

export default function Loading({
  color = "#005eb8",
  height = 100,
  width = 100,
  delay = 0,
  type = "bubbles",
  className = "",
  text
}: LoadingProps) {
  const loadingType: LoadingType = type;
  const [isShown, setIsShown] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => setIsShown(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isShown && !text) return null;

  return (
    <div className={`loading ${className}`}>
      {isShown && (
        <ReactLoading
          data-cy="loading"
          type={loadingType}
          color={color}
          height={height}
          width={width}
          aria-label="loading-icon"
        />
      )}
      {text && (
        <p className={isShown ? "nhsuk-body" : "nhsuk-u-visually-hidden"}>
          <output>{isShown ? text : ""}</output>
        </p>
      )}
    </div>
  );
}
