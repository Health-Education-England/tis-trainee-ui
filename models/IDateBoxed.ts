export interface IDateBoxed {
  tisId?: string;
  startDate: Date | string;
  endDate: Date | string;
}

export interface IDateBoxedGroup {
    future: IDateBoxed[];
    upcoming: IDateBoxed[];
    current: IDateBoxed[];
    past: IDateBoxed[];
  }
