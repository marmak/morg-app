import { Component } from '@angular/core';
import { CustomDataSource } from '../custom-data-source';
import { MatTableModule } from '@angular/material/table';
@Component({
    selector: 'app-my-table',
    imports: [MatTableModule],
    templateUrl: './datasource-kok.component.html'
})
export class MyTableComponent {
  dataSource = new CustomDataSource();
}

