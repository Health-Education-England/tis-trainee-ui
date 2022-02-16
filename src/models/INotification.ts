export interface INotification {
  id: string;
  type: string;
  text: string;
  actionErrorMsg?: any;
}

export enum notificationColour {
  Success = "#006400",
  Error = "#A7171A",
  Info = "#55bede",
  Warning = "#f0a54b"
}
