import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "nhsuk-react-components";
import history from "../../navigation/history";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  fetchCctCalculations,
  resetCctCalculations
} from "../../../redux/slices/cctSlice";
import { CctCalculation } from "../../../models/CctTypes";
import { formatCctDate } from "../../../utilities/CctUtilities";
import Loading from "../../common/Loading";
import { CctRequestError } from "./CctRequestError";

export function CctHome() {
  const dispatch = useAppDispatch();
  const { calculations, listStatus } = useAppSelector(state => state.cct);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    void dispatch(fetchCctCalculations());
    return () => {
      dispatch(resetCctCalculations());
    };
  }, [dispatch]);

  const retry = async () => {
    setIsRetrying(true);
    await dispatch(fetchCctCalculations());
    setIsRetrying(false);
  };

  let content: JSX.Element;
  if (listStatus === "failed" || isRetrying) {
    content = (
      <CctRequestError
        isRetrying={isRetrying}
        onRetry={retry}
        message="We could not load your saved calculations."
      />
    );
  } else if (listStatus !== "succeeded") {
    content = <Loading />;
  } else if (calculations.length === 0) {
    content = (
      <p data-cy="cct-no-calculations">You have no saved calculations.</p>
    );
  } else {
    content = <CctCalculationsTable calculations={calculations} />;
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => history.push("/cct/create")}
        data-cy="cct-new-calculation"
      >
        Start a new calculation
      </Button>
      <h2 data-cy="cct-calculations-heading">Your saved calculations</h2>
      {content}
    </>
  );
}

type CctCalculationsTableProps = {
  calculations: CctCalculation[];
};

function CctCalculationsTable({
  calculations
}: Readonly<CctCalculationsTableProps>) {
  const newestFirst = [...calculations].sort(
    (a, b) => Date.parse(b.lastModified) - Date.parse(a.lastModified)
  );

  return (
    <Table responsive data-cy="cct-calculations-table">
      <Table.Head>
        <Table.Row>
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>Specialty</Table.Cell>
          <Table.Cell>Completion date</Table.Cell>
          <Table.Cell>Last saved</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {newestFirst.map(calculation => (
          <Table.Row key={calculation.id} data-cy="cct-calculation-row">
            <Table.Cell>
              <Link
                to={`/cct/${calculation.id}`}
                data-cy="cct-calculation-link"
              >
                {calculation.name}
              </Link>
            </Table.Cell>
            <Table.Cell>{calculation.programmeDetails.specialty}</Table.Cell>
            <Table.Cell>{formatCctDate(calculation.result.cctDate)}</Table.Cell>
            <Table.Cell>{formatCctDate(calculation.lastModified)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
