import { IProgSection } from "../../models/IProgressSection";
import "./ProgressBar.scss";

interface IProgressBar {
  sections: IProgSection[];
  section: number;
}

const ProgressBar = ({ sections, section }: IProgressBar) => {
  return (
    <div className="progressbar">
      {sections &&
        sections.map((_sect: IProgSection, index: number) => (
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
