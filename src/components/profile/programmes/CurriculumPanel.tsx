import React from "react";
import { Curriculum } from "../../../models/ProgrammeMembership";
import { DateUtilities } from "../../../utilities/DateUtilities";
import styles from "./CurriculumPanel.module.scss";

interface ICurriculumPanelProps {
  curriculum: Curriculum;
}

export const CurriculumPanel = ({ curriculum }: ICurriculumPanelProps) => {
  return (
    <div className={styles.cItems}>
      <div data-cy={curriculum.curriculumName}>{curriculum.curriculumName}</div>
      <div data-cy="currDates">
        {DateUtilities.ToLocalDate(curriculum.curriculumStartDate)} -{" "}
        {DateUtilities.ToLocalDate(curriculum.curriculumEndDate)}
      </div>
    </div>
  );
};
