export interface INotification {
  id: string;
  type: string;
  text: string;
  actionErrorMsg?: any;
  link?: string;
}

export enum NotificationType {
  Success = "Success",
  Error = "Error",
  Warning = "Warning"
}
