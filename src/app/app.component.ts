import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TodoDataService } from './services/data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditDialogComponent } from './dialogs/edit/edit.dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.dialog.component';
import { fromEvent } from 'rxjs';
import { ExampleDataSource } from './todo-example-data-source';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  displayedColumns = ['id', 'title', 'state', 'created_at', 'actions'];
  exampleDatabase: TodoDataService | null;
  dataSource: ExampleDataSource | null;
  id: number;
  index: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: TodoDataService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  refresh(): void {
    this.loadData();
  }

  startEdit(i: number, id: number, title: string, state: string, created_at: string): void {
    this.id = id;
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '33.125rem',
      panelClass: ['edit-dialog'],
      disableClose: true,
      autoFocus: false,
      data: { id: id, title: title, state: state, created_at: created_at }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, title: string, state: string): void {
    this.id = id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '33.125rem',
      disableClose: true,
      autoFocus: false,
      data: { id: id, title: title, state: state }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable(): void {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData(): void {
    this.exampleDatabase = new TodoDataService(this.httpClient);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}
