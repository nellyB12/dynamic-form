import { Injectable } from '@angular/core';
import { Width, Breakpoint } from '../dynamic-form-builder.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutFactoryService {
  private layoutMap: Map<number, (breakpoint?: number) => string>;
  private columnNumberMap: Map<number, () => number>;
  private breakpointShortNameMap: Map<number, () => string>;

  constructor() {
    this.layoutMap = new Map<number, (breakpoint?: number) => string>([
      [Width.OneQuarter, (breakpoint) => this.calcClassName(Width.OneQuarter, breakpoint)],
      [Width.OneTrack, (breakpoint) => this.calcClassName(Width.OneTrack, breakpoint)],
      [Width.OneHalf, (breakpoint) => this.calcClassName(Width.OneHalf, breakpoint)],
      [Width.TwoThirds, (breakpoint) => this.calcClassName(Width.TwoThirds, breakpoint)],
      [Width.ThreeQuarters, (breakpoint) => this.calcClassName(Width.ThreeQuarters, breakpoint)],
      [Width.FullWidth, (breakpoint) => this.calcClassName(Width.FullWidth, breakpoint)],
    ]);

    this.columnNumberMap = new Map<number, () => number>([
      [Width.OneQuarter, () => 3],
      [Width.OneTrack, () => 4],
      [Width.OneHalf, () => 6],
      [Width.TwoThirds, () => 8],
      [Width.ThreeQuarters, () => 9],
      [Width.FullWidth, () => 12]
    ]);

    this.breakpointShortNameMap = new Map<number, () => string>([
      [Breakpoint.Small, () => 'sm'],
      [Breakpoint.Medium, () => 'md'],
      [Breakpoint.Large, () => 'lg'],
      [Breakpoint.ExtraLarge, () => 'xl'],
      [Breakpoint.ExtraExtraLarge, () => 'xxl']
    ]);
  }

  private calcClassName(width: number, breakpoint?: number): string {
    const columnNumberCreator = this.columnNumberMap.get(width);
    if(!columnNumberCreator) {
      throw new Error(`Column width ${width} not found`);
    }
    const columnNumber = columnNumberCreator();
    if(!breakpoint) {
      return `col-${columnNumber}`;
    }
    const breakpointShortNameCreator = this.breakpointShortNameMap.get(breakpoint);
    if(!breakpointShortNameCreator) {
      throw new Error(`Breakpoint ${breakpoint} not found`);
    }
    const breakpointShortName = breakpointShortNameCreator();
    return `col-12 col-${breakpointShortName}-${columnNumber}`;
  }

  public getColumnClassName(key: number, params?: number) {
    const creator = this.layoutMap.get(key);
    if(!creator) {
      throw new Error(`Width ${key} not found`);
    }
    return creator(params);
  }
}
