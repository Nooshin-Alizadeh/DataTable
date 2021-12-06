import { Component, Injector, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseComponent } from '../../../framework/Base.Component';
import { DataServiceConfigurationService } from '../../../framework/data-service-configuration.service';
import { GridColumnConfig, GridConfig, GridSortConfig } from '../../../shared/grid/grid.component';
import { UserDetailComponent } from '../user-detail/user-detail/user-detail.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseComponent implements OnInit {
  grid!: GridConfig;
  init = false;

  constructor(injector: Injector) {
    super(injector);

  }

  ngOnInit(): void {
    this.grid = new GridConfig();
    this.grid.url = this.dataService.getUrl('users');
    this.grid.onRowClick = (row) => {
      //this.quickViewService.open(this.entityType, row.id);
    };
    this.configureGrid();
  }
  configureGrid(): void {
    this.grid.setColumns(
      new GridColumnConfig('id', 'id', { width: '200px' }),
      new GridColumnConfig('first_name', 'first_name', { width: '200px' }),
      new GridColumnConfig('last_name', 'last_name', { width: '200px' }),
      new GridColumnConfig('email', 'email', { width: '200px' }),

    );
    this.grid.sortColumns = {
      'id': {
        field: 'id',
        sortDirection: GridSortConfig.Descending,
        sortListener: new BehaviorSubject<GridSortConfig>(GridSortConfig.Descending)
      }
    }
    this.init = true;
  }
  navigateToDetail(id: any) {
    this.modal(UserDetailComponent, { id })
  }

}
