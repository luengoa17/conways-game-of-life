import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GridInfo, GridService } from '../../services/grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent {
  grid$!: Observable<GridInfo | undefined>;

  constructor(gridService: GridService) {
    this.grid$ = gridService.grid$;
  }

  getGridColums(columns: number): string {
    return `repeat(${columns}, ${this.getCellWidth(columns)})`;
  }

  getGridRows(rows: number): string {
    return `repeat(${rows}, ${this.getCellHeight(rows)})`;
  }

  getCellHeight(rows: number): string {
    return 100 / rows + '%';
  }

  getCellWidth(cols: number): string {
    return 100 / cols + '%';
  }

}
