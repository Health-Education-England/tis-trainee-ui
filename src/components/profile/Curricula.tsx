import { Curriculum } from "../../models/ProgrammeMembership";
import { DateUtilities } from "../../utilities/DateUtilities";
import style from "../Common.module.scss";

type CurriculaProps = {
  curricula: Curriculum[];
};

export function Curricula({ curricula }: CurriculaProps) {
  if (curricula?.length > 0) {
    return (
      <>
        {curricula.map(
          (
            {
              curriculumName,
              curriculumStartDate,
              curriculumEndDate
            }: Curriculum,
            index: number
          ): JSX.Element => (
            <div key={index} className={style.cItems}>
              <div data-cy={curriculumName}>{curriculumName}</div>
              <div data-cy="currDates">
                {DateUtilities.ToLocalDate(curriculumStartDate)} -{" "}
                {DateUtilities.ToLocalDate(curriculumEndDate)}
              </div>
            </div>
          )
        )}
      </>
    );
  } else return <div>N/A</div>;
}
