import { useEffect, useState } from "react";

export default function useLocalStorage(
  key: string,
  initialVal: string | Function
) {
  const [localStorageValue, setLocalStorageValue] = useState(() => {
    return getSavedLocalStorageValue(key, initialVal);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(localStorageValue));
  }, [localStorageValue]);

  // as a hook we need to return the value and the function for setting the value
  return [localStorageValue, setLocalStorageValue];
}

function getSavedLocalStorageValue(k: string, iVal: string | Function) {
  const savedValue = localStorage.getItem(k);
  if (savedValue) {
    return JSON.parse(savedValue);
  }
  // because useState can take a func as its intitial val we need to check
  if (iVal instanceof Function) {
    return iVal();
  }

  return iVal;
}
