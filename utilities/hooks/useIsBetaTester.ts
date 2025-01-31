import store from "../../redux/store/store";

const useIsBetaTester = (): boolean => {
  const cognitoGroups = store.getState().user.cognitoGroups;

  return cognitoGroups?.includes("beta-participant") ?? false;
};

export default useIsBetaTester;
