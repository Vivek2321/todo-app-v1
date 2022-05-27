import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, Observable, merge } from "rxjs";
import { map } from "rxjs/operators";
import { Todo } from "./models/todo";
import { TodoDataService } from "./services/data.service";

export class ExampleDataSource extends DataSource<Todo> {
    _filterChange = new BehaviorSubject('');
  
    get filter(): string {
      return this._filterChange.value;
    }
  
    set filter(filter: string) {
      this._filterChange.next(filter);
    }
  
    filteredData: Todo[] = [];
    renderedData: Todo[] = [];
    constructor(public _exampleDatabase: TodoDataService,
      public _paginator: MatPaginator,
      public _sort: MatSort) {
      super();
      // Reset to the first page when the user changes the filter.
      this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }
  
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Todo[]> {
      const displayDataChanges = [
        this._exampleDatabase.dataChange,
        this._sort.sortChange,
        this._filterChange,
        this._paginator.page
      ];
      this._exampleDatabase.getAllTodosList();
      return merge(...displayDataChanges).pipe(map(() => {
        this.filteredData = this._exampleDatabase.data.slice().filter((issue: Todo) => {
          const searchStr = (issue.id + issue.title + issue.created_at).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
      ));
    }
  
    disconnect() { }
  
    /** Returns a sorted copy of the database data. */
    sortData(data: Todo[]): Todo[] {
      if (!this._sort.active || this._sort.direction === '') {
        return data;
      }
      return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';
        switch (this._sort.active) {
          case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
          case 'title': [propertyA, propertyB] = [a.title, b.title]; break;
          case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
          case 'created_at': [propertyA, propertyB] = [a.created_at, b.created_at]; break;
        }
        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
        return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
      });
    }
  }