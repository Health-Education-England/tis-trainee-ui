import { ISection } from "../../models/ProgressBarSections";
import "./ProgressBar.scss";

interface IProgressBar {
  sections: ISection[];
  section: number;
}

const ProgressBar = ({ sections, section }: IProgressBar) => {
  return (
    <div className="progressbar">
      {sections.map((_sect: ISection, index: number) => (
        <div
          key={index}
          className={
            section === index + 1
              ? "progress-step progress-step-active"
              : "progress-step"
          }
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
