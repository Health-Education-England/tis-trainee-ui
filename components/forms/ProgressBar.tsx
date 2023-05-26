import { IProgSection } from "../../models/IProgressSection";
interface IProgressBar {
  sections: IProgSection[];
  section: number;
}

const ProgressBar = ({ sections, section }: IProgressBar) => {
  return (
    <div className="progressbar">
      {sections?.map((sect: IProgSection, index: number) => (
        <div
          key={sect.title}
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
