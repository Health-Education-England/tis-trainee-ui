import store from "../../redux/store/store";

const useIsBetaTester = (): boolean => {
  const cognitoGroups = store.getState().user.cognitoGroups;

  return cognitoGroups?.includes("beta-consultants") ?? false;
};

export default useIsBetaTester;
