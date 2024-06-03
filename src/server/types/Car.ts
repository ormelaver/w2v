export interface CarType {
  model: string;
  size: Size;
  price_per_day: number;
}

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}
