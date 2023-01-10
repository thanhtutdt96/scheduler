export interface TimeItem {
  startTime: string;
  endTime: string;
  name?: string;
  order?: number;
}

export interface SelectedTimeItem {
  startTime: string;
  endTime: string;
  name?: string;
  startDate: string;
  endDate: string;
}

export enum TimeItemOverlappedType {
  NO_OVERLAPPED = 0,
  PARTIAL_OVERLAPPED = 1,
  FULL_OVERLAPPED = 2,
}

export enum CalendarItemType {
  SCHEDULED = 'scheduled',
  CONSECUTIVE_SCHEDULED = 'consecutive scheduled',
  AVAILABLE = 'available',
  CONSECUTIVE_AVAILABLE = 'consecutive available',
  OTHER = 'other',
}

export enum CalendarItemColorType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  NEGATIVE = 'negative',
  CONSECUTIVE_SECONDARY = 'consecutive-secondary',
  CONSECUTIVE_NEGATIVE = 'consecutive-negative',
  OTHER = 'other',
}
