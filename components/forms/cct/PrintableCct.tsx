import { forwardRef } from "react";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { CurrentProgInfo, DisclaimerTxt, NewWteAndDateTable } from "./Cct";
import dayjs from "dayjs";

export const PrintableCct = forwardRef<any>((_, ref) => {
  const currentProgEndDate = useAppSelector(
    state => state.cctCalc.currentProgEndDate
  );
  const currentWte = useAppSelector(state => state.cctCalc.currentWte);
  const proposeStartDate = useAppSelector(state => state.cctCalc.propStartDate);
  const propEndDate = useAppSelector(state => state.cctCalc.propEndDate);
  const progName = useAppSelector(state => state.cctCalc.progName);
  const newEndDates = useAppSelector(state => state.cctCalc.newEndDates);

  return (
    <div ref={ref} className="cct-printable" data-cy="cct-printable">
      <h1 data-cy="cct-print-header">TIS Self-Service CCT Calculator</h1>
      <DisclaimerTxt />
      <section>
        <h2 data-cy="cct-current-header">Current situation</h2>
        <CurrentProgInfo
          progName={progName}
          currentProgEndDate={currentProgEndDate}
          currentWte={currentWte}
        />
      </section>
      <section>
        <h2 data-cy="cct-changes-header">Proposed changes</h2>
        <p>
          <b data-cy="cct-new-start">{`Start Date of new WTE: `}</b>
          {dayjs(proposeStartDate).format("DD/MM/YYYY")}
        </p>
        <p>
          <b data-cy="cct-new-end">{`End Date of new WTE: `}</b>
          {dayjs(propEndDate).format("DD/MM/YYYY")}
        </p>
        <NewWteAndDateTable newEndDates={newEndDates} />
      </section>
      <p>{`Calculation created on: ${dayjs().format("DD/MM/YYYY HH:mm")}`}</p>
    </div>
  );
});
PrintableCct.displayName = "PrintableCct";
