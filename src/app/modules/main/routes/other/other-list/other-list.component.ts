import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../framework/Base.Component';
import { GridColumnConfig, GridConfig } from '../../../shared/grid/grid.component';

@Component({
  selector: 'app-other-list',
  templateUrl: './other-list.component.html',
  styleUrls: ['./other-list.component.scss']
})
export class OtherListComponent extends BaseComponent implements OnInit {

  entity: any;
  constructor(injector: Injector, private route: ActivatedRoute, private router: Router) {
    super(injector);
  }

  ngOnInit(): void {
    this.entity = this.route.snapshot.paramMap.get('entity');
    this.grid = new GridConfig();
    this.grid.url = this.dataService.getUrl(this.entity);
    this.grid.onRowClick = (row) => {
      //this.quickViewService.open(this.entityType, row.id);
    };
    this.configureGrid();
  }

  configureGrid(): void {
    var columns;
    switch (this.entity) {
      case 'color':
        this.grid.setColumns(
          new GridColumnConfig('id', 'id', { width: '200px' }),
          new GridColumnConfig('name', 'name', { width: '200px' }),
          new GridColumnConfig('year', 'year', { width: '200px' }),
          //new GridColumnConfig('color', 'color', { width: '200px' }),
          new GridColumnConfig('pantone_value', 'pantone_value', { width: '200px' })
        );

        break;

      default:
        break;
    }

    this.init = true;
  }
  navigateToDetail(row: any) {
    this.router.navigateByUrl(`others/${this.entity}/${row}`);
  }
}
