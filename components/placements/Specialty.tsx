import { PANEL_KEYS } from "../../utilities/Constants";

type SpecialtyProps = {
  specialty: string;
  subSpecialty: string;
  postAllowsSubspecialty: boolean;
  index: number;
};

export function Specialty(specialtyProps: Readonly<SpecialtyProps>) {
  let specialtyText = specialtyProps.specialty
    ? specialtyProps.specialty
    : "None provided";
  if (
    specialtyProps.specialty &&
    (specialtyProps.subSpecialty || specialtyProps.postAllowsSubspecialty)
  ) {
    let subSpecialtyText = specialtyProps.subSpecialty
      ? specialtyProps.subSpecialty
      : "None provided";
    return (
      <div>
        <div>{specialtyText}</div>
        <div data-cy={`subSpecialty${specialtyProps.index}Val`}>
          {PANEL_KEYS.subSpecialty + ": " + subSpecialtyText}
        </div>
      </div>
    );
  } else {
    return <div>{specialtyText}</div>;
  }
}
