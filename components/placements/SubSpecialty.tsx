import { PlacementSubSpecialty } from "../../models/PlacementSubSpecialty";

type SubSpecialtyProps = {
  subSpecialty: PlacementSubSpecialty;
};

export function SubSpecialty({ subSpecialty }: SubSpecialtyProps) {
  if (subSpecialty) {
    if (
      subSpecialty.postAllowsSubspecialty != null &&
      subSpecialty.postAllowsSubspecialty
    ) {
      if (subSpecialty.subSpecialty) {
        return <div>{subSpecialty.subSpecialty}</div>;
      } else {
        return <div>None provided</div>;
      }
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
}
