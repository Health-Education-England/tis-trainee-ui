export const getUserAgentInfo = (): string => {
  const { userAgent } = window.navigator;
  return `User Agent: ${userAgent}`;
};
