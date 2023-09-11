import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  of,
  switchMap,
  timer,
} from 'rxjs';

export type GridInfo = {
  rows: number;
  columns: number;
  grid: boolean[];
};

export type GridParameters = {
  rows: number;
  columns: number;
  populationDensity: number;
  refreshRate: number;
};

export enum ExecutionState {
  UNITIALIZED,
  RUNNING,
  PAUSED,
}

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private lastGrid?: GridInfo;
  private gridParameters$ = new Subject<GridParameters>();

  executing$ = new BehaviorSubject<ExecutionState>(ExecutionState.UNITIALIZED);

  changeExectionStatus(executionState: ExecutionState) {
    this.executing$.next(executionState);
  }

  setGridParameters(gridParameters: GridParameters) {
    this.lastGrid = undefined;
    this.gridParameters$.next(gridParameters);
    this.executing$.next(ExecutionState.RUNNING);
  }

  grid$: Observable<GridInfo | undefined> = combineLatest([
    this.executing$,
    this.gridParameters$,
  ]).pipe(
    switchMap(([executing, gridParameters]) => {

      if (executing !== ExecutionState.RUNNING) {
        return of(this.lastGrid);
      }
      return timer(0, gridParameters.refreshRate).pipe(
        map((_) => {
          this.lastGrid =
            !this.lastGrid
              ? this.newPopulation(gridParameters)
              : this.computePopulation(this.lastGrid);
          return this.lastGrid;
        })
      );
    })
  );

  private newPopulation(gridParameters: GridParameters): GridInfo {
    const grid = new Array<boolean>(
      gridParameters.rows * gridParameters.columns
    );
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() < gridParameters.populationDensity;
    }
    return {
      rows: gridParameters.rows,
      columns: gridParameters.columns,
      grid: grid,
    };
  }

  private computePopulation(gridInfo: GridInfo): GridInfo {
    const positionsToChange = [];
    for (let i = 0; i < gridInfo.rows; i++) {
      for (let j = 0; j < gridInfo.columns; j++) {
        const neighbours = this.countNeighbours(gridInfo, i, j);
        const position = i * gridInfo.columns + j;
        if (gridInfo.grid[position]) {
          if (neighbours !== 2 && neighbours !== 3) {
            positionsToChange.push(position);
          }
        } else {
          if (neighbours === 3) {
            positionsToChange.push(position);
          }
        }
      }
    }
    positionsToChange.forEach((position) => {
      gridInfo.grid[position] = !gridInfo.grid[position];
    });
    return gridInfo;
  }

  private countNeighbours(grid: GridInfo, row: number, column: number): number {
    let neighbours = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      if (i < 0 || i >= grid.rows) {
        continue;
      }
      for (let j = column - 1; j <= column + 1; j++) {
        if (j < 0 || j >= grid.columns || (i === row && j === column)) {
          continue;
        }
        neighbours += grid.grid[i * grid.columns + j] ? 1 : 0;
      }
    }
    return neighbours;
  }
}
