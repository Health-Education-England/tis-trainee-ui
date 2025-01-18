import { useAppSelector } from "../../../../redux/hooks/hooks";

export function LtftForm() {
  const ltftFormData = useAppSelector(state => state.ltft.ltft);
  return ltftFormData?.declarations.discussedWithTpd ? (
    <div>
      <h2>success - show form</h2>
    </div>
  ) : (
    <div>
      <h2>error - no declarations.discussedWithTpd</h2>
    </div>
  );
}
