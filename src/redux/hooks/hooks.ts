import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

// Use these typed hooks throughout your app instead of plain `useDispatch` and `useSelector` https://redux.js.org/tutorials/typescript-quick-start#use-typed-hooks-in-components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
