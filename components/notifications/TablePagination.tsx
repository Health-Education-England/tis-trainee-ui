import { Table } from "@tanstack/react-table";
import { NotificationType } from "../../redux/slices/notificationsSlice";
import { Col, Container, Row } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons";

type TablePaginationType = {
  table: Table<NotificationType>;
};

export function TablePagination({ table }: Readonly<TablePaginationType>) {
  return (
    <Container>
      <Row>
        <Col width="two-thirds">
          <button
            type="button"
            className="nhsuk-u-margin-right-2 pagination-btn"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            data-cy="NotificationsTableFirstPageBtn"
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button
            type="button"
            className="nhsuk-u-margin-right-1 pagination-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            data-cy="NotificationsTablePreviousPageBtn"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button
            type="button"
            className="nhsuk-u-margin-right-2 pagination-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            data-cy="NotificationsTableNextPageBtn"
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button
            type="button"
            className="nhsuk-u-margin-right-2 pagination-btn"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            data-cy="NotificationsTableLastPageBtn"
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
          <select
            className="nhsuk-select nhsuk-u-margin-left-1"
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            data-cy="NotificationsTablePageSizeSelect"
          >
            {[5, 10, 20, 30].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {`Show ${pageSize} rows`}
              </option>
            ))}
          </select>
        </Col>
        <Col width="one-third">
          {table.getPageCount() >= 2 && (
            <span className="nhsuk-u-font-size-19">
              {`Go to page: `}
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const target = e.target as HTMLInputElement;
                  const page = target.value ? Number(target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                onInput={e => {
                  const target = e.target as HTMLInputElement;
                  const enteredPage = Number(target.value);
                  if (enteredPage > table.getPageCount()) {
                    target.value = table.getPageCount().toString();
                  }
                }}
                onFocus={e => {
                  e.target.value = "";
                }}
                className="nhsuk-input nhsuk-input--width-2"
                data-cy="NotificationsTablePageInput"
              />
              {` of ${table.getPageCount()}`}
            </span>
          )}
        </Col>
      </Row>
    </Container>
  );
}
