import { Component } from '@angular/core';
import { ExecutionState, GridParameters, GridService } from '../../services/grid.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
})
export class ControlsComponent {

  ExecutionState = ExecutionState;

  controls = this.formBuider.nonNullable.group({
    rows: [100, [Validators.required, Validators.min(1)]],
    columns: [100, [Validators.required, Validators.min(1)]],
    populationDensity: [
      0.5,
      [Validators.required, Validators.min(0.01), Validators.max(1)],
    ],
    refreshRate: [1000, [Validators.required, Validators.min(100)]],
  });

  constructor(
    protected gridService: GridService,
    private formBuider: FormBuilder
  ) {}

  onStart() {
    if (this.controls.invalid) {
      return;
    }

    const gridParameters: GridParameters = {
      rows: this.controls.controls.rows.value,
      columns: this.controls.controls.columns.value,
      populationDensity: this.controls.controls.populationDensity.value,
      refreshRate: this.controls.controls.refreshRate.value,
    };

    this.gridService.setGridParameters(gridParameters);
  }

  changeExecutionStatus(isExecuting : ExecutionState) {
    if (isExecuting === ExecutionState.RUNNING) {
      isExecuting = ExecutionState.PAUSED;
    } else {
      isExecuting = ExecutionState.RUNNING;
    }
    console.log(isExecuting);
    this.gridService.changeExectionStatus(isExecuting);
  }
}
