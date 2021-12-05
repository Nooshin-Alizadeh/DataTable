import { Component, OnInit, Input, TemplateRef, ViewChild, ContentChild, ContentChildren, QueryList, Renderer2, AfterViewInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/collections';
import { CdkTable, CdkColumnDef, CdkFooterRowDef } from '@angular/cdk/table';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { DataServiceConfigurationService, IResponse } from '../../framework/data-service-configuration.service';


export class GridDataSourceConfig<T> extends DataSource<T> {

  public data: BehaviorSubject<T[]>;

  constructor(data: T[] = []) {
    super();
    this.data = new BehaviorSubject<T[]>(data);
  }

  public connect(): Observable<T[]> {
    return this.data;
  }

  public disconnect() { }

}

export enum GridSortConfig {
  None = '',
  Ascending = 'asc',
  Descending = 'desc'
}


export class GridColumnConfig {

  title?: string;
  field: string;
  style?: { [key: string]: string };
  conditionalStyle?: (row: any) => { [key: string]: string };
  conditionalClass?: (row: any) => string;
  sortDirection?: GridSortConfig;
  sortListener?: BehaviorSubject<GridSortConfig>;

  constructor(title?: string, field?: string, style?: { [key: string]: string }) {
    this.title = title;
    this.field = <any>field;
    this.style = style;
    this.sortListener = new BehaviorSubject<GridSortConfig>(<any>null);
    return this;
  }

  setStyle(style: { [key: string]: string }): GridColumnConfig {
    this.style = style;
    return this;
  }
  setConditionalStyle(condition: (row: any) => { [key: string]: string }): GridColumnConfig {
    this.conditionalStyle = condition;
    return this;
  }
  setConditionalClass(condition: (row: any) => string): GridColumnConfig {
    this.conditionalClass = condition;
    return this;
  }

}

export class GridSortColumnConfig {
  field: string;
  sortDirection!: GridSortConfig;
  sortListener?: BehaviorSubject<GridSortConfig>;
  constructor(field?: string) {
    this.field = <any>field;
    this.sortListener = new BehaviorSubject<GridSortConfig>(<any>null);
    this.sortDirection = <any>null;
  }
}

export class GridConfig {

  constructor(id: string = 'id') {
    this.search = '';
    this.id = id;
    this.columns = [];
    this.displayColumns = [];
    this.page = 1;
    this.pageSize = 10;
    this.maxPageSize = 3;
    this.dataSource = new GridDataSourceConfig();
    this.selectable = true;
    this.headerMenu = true;
    this.rowSelectable = false;
    this.manualGet = false;
    this.favorite = false;
    this.pager = true;
    this.favoriteField = 'isFavorite';
    this.sortColumns = {};
    this.excludeSort = [];
    this.footer = false;
    this.quickView = true;
  }
  public search: any;
  public requestType: 'get' | 'post' = 'get';
  public id: string;
  public url?: string;
  public columns: GridColumnConfig[];
  public displayColumns: string[];
  public footer: boolean;
  public dataSource: GridDataSourceConfig<any>;
  public data?: any[];
  public pageSize!: any;
  public page: number;
  public pages?: number;
  public total?: number;
  public maxPageSize: number;
  public style: { [key: string]: string }={};
  public selectable: boolean;
  public cssClass: string = '';
  public rowSelectable: boolean;
  public headerMenu: boolean;
  public favorite: boolean;
  public favoriteField: string;
  public selection = new SelectionModel<any>(true, []);
  public onRowClick?: (row?: any) => void;
  public manualGet: boolean;
  public pager: boolean;
  public excludeSort: string[];
  public sortColumns: { [key: string]: GridSortColumnConfig };
  public excludeInSmallScreens: string[] = [];
  public quickView: boolean;
  public refresh?(page?: number, data?: any[], search?: any): void;
  public fetch?(): void;
  public mapper?(response: any): any[];
  public requestExtender?(request: any): any;
  public sort?(column: GridColumnConfig, direction: GridSortConfig): any;
  public remove(rows: any[]): void { }
  public clearUndoStorage(): void { }
  public undo(): void { }

  setColumns(...columns: GridColumnConfig[]): GridConfig {
    this.columns = columns;
    this.displayColumns = <any>this.columns.map(c => c.field).filter(c => c);
    return this;
  }

  setStyle(style: { [key: string]: string }): GridConfig {
    this.style = style;
    return this;
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.value.length;
    return numSelected === numRows;
  }


  public masterToggle($event?: any) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.value.forEach(row => this.selection.select(row));
  }
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, AfterViewInit {
  columnsAdded = false;
  public pageSizes = [10, 20, 30];

  private loadingOption: Spinner = {
    type: 'ball-scale-multiple',
    size: 'medium',
    fullScreen: false,
    bdColor: 'rgba(255,255,255, .3)',
    color: '#aaa'
  };

  private _config!: GridConfig;
  @Input() set config(config: GridConfig) {
    this._config = config;
    if (this.config && this.config.displayColumns.length > 0) {
      this.init();
    }
  }
  get config(): GridConfig {
    return this._config;
  }
  _template!: TemplateRef<any>;
  @ContentChild(TemplateRef, /* TODO: add static flag */ { static: false }) set template(template: TemplateRef<any>) {
    this._template = template;
  }
  get template(): TemplateRef<any> {
    return this._template;
  }

  @ContentChildren(CdkColumnDef) columns!: QueryList<CdkColumnDef>;
  @ContentChildren(CdkFooterRowDef) footer!: QueryList<CdkFooterRowDef>;
  @ViewChild('table', { static: true }) table!: CdkTable<any>;

  dataSource!: any[];
  inited = false;

  private undoStorage: { index: number, data: any }[] = [];

  constructor(private httpService: DataServiceConfigurationService,
    private renderer: Renderer2,
    private readonly _spinnerService: NgxSpinnerService) {
  }

  private loading(show = true) {
    show && this._spinnerService.show('grid', this.loadingOption);
    !show && this._spinnerService.hide('grid');
  }

  public pageChange(page: number): void {
    this.config.page = page;
    this.get(this.config.page);

  }

  toggleMenu(popover: NgbPopover, row: any, event: Event) {
    event && event.preventDefault();
    event && event.stopPropagation();
  }

  rowClick(row: any, event: Event): void {
    this.config.selectable && this.config.rowSelectable && this.config.selection.toggle(row);
    this.config.onRowClick && this.config.onRowClick(row);
    event && event.preventDefault();
    event && event.stopPropagation();
  }

  rowSelection(row: any, event: Event): void {
    this.config.selectable && this.config.selection.toggle(row);
    event && event.preventDefault();
    event && event.stopPropagation();
  }

  public ngOnInit() {
    this.config.displayColumns = this.config.displayColumns.filter(i => this.config.excludeInSmallScreens.indexOf(i) === -1);
  }

  public ngAfterViewInit(): void {
    this.setSortLisener();
  }

  private setSortLisener(): void {
    for (const key in this.config.sortColumns) {
      if (this.config.sortColumns.hasOwnProperty(key)) {
        this.config?.sortColumns[key]?.sortListener?.subscribe(sort => {
          sort !== null && this.pageChange(this.config.page);
        });
      }
    }

  }

  changeSize(e: any) {
    this.get(e.value);
  }

  private createTable(): void {

    this.columnsAdded = true;
    this.columns && this.columns.filter(i => this.config.excludeInSmallScreens.indexOf(i.name) === -1).forEach(col => {
      this.table.addColumnDef(col);
    });
    this.footer && this.footer.forEach(footer => {
      footer.columns = this.config.displayColumns.filter(i => this.config.excludeInSmallScreens.indexOf(i) === -1);
      this.table.addFooterRowDef(footer);
    });
  }

  private init(): void {

    this.config.displayColumns = this.config.displayColumns.filter(i => this.config.excludeInSmallScreens.indexOf(i) === -1);
    try {
      this.setDefaults();
    } catch (error) {

    }

    !this.config.manualGet && this.get(this.config.page);
  }

  private filter(): void {
    this.inited = false;
    this.config.page = 1;
    this.get(this.config.page);
  }

  private setDefaults(): void {

    this.dataSource = [];
    this.config.refresh = (page?: number, data?: any[], search?: any): void => {
      this.config.search = search || this.config.search;
      this.config.page = page || this.config.page;
      this.get(this.config.page);
      this.config.selection.clear();
    };
    this.config.fetch = () => {
      this.get(this.config.page);
    };
    this.config.sort = this.sort.bind(this);
    if (this.config.displayColumns && this.config.favorite === true
      && this.config.displayColumns.indexOf(this.config.favoriteField) === -1) {
      this.config.displayColumns.unshift(this.config.favoriteField);
    }

    this.config.remove = this.remove.bind(this);
    this.config.undo = this.undo.bind(this);
    this.config.clearUndoStorage = () => {
      this.undoStorage = [];
    };


  }

  private sortComparer(field: string, direction: GridSortConfig, aField: any, bField: any): any {
    if (direction === GridSortConfig.Ascending) {
      if (typeof (+aField) === 'number' && !isNaN(+aField)) {
        return +aField[field] - +bField[field];
      } else {
        if (aField[field] < bField[field]) { return -1; }
        if (aField[field] > bField[field]) { return 1; }
        return 0;
      }
    } else if (direction === GridSortConfig.Descending) {
      if (typeof (+aField) === 'number' && !isNaN(+aField)) {
        return +bField[field] - +aField[field];
      } else {
        if (aField[field] > bField[field]) { return -1; }
        if (aField[field] < bField[field]) { return 1; }
        return 0;
      }
    } else {
      return 2;
    }
  }

  private remove(rows: any[]): void {
    this.undoStorage = [];
    rows.forEach(row => {
      const index = this.dataSource.findIndex(r => r[this.config.id] === row[this.config.id]);
      if (index > -1) {
        this.dataSource.splice(index, 1);
        this.config.dataSource.data.next(this.dataSource);
        this.config.selection.clear();
        this.undoStorage.unshift({
          index,
          data: row
        });
      }
    });
  }

  private undo(): void {
    this.undoStorage.forEach(r => {
      this.dataSource.splice(r.index, 0, r.data);
    });
    this.config.dataSource.data.next(this.dataSource);
    this.config.selection.clear();
  }

  private sort(column: GridColumnConfig, direction: GridSortConfig): void {
    if (!Array.isArray(this.config.dataSource.data.value)) {
      return;
    }


    if (direction && direction == GridSortConfig.Ascending) {
      this.config.dataSource.data.next(this.dataSource.sort((a, b) => this.sortComparer(column.field, direction, a, b)));
    }
    if (direction && direction == GridSortConfig.Descending) {
      this.config.dataSource.data.next(this.dataSource.sort((a, b) => this.sortComparer(column.field, direction, a, b)));
    } else {
      this.config.dataSource.data.next(this.dataSource.sort((a, b) => this.sortComparer(column.field, direction, a, b)));
    }
    setTimeout(() => {
      this.pageChange(this.config.page);

    }, 200);

  }

  private get(page: number): void {

    this.loading();
    if (this.config.requestType === 'get') {
      this.httpService.get(this.config.url || '', this.getParams()).subscribe((response: IResponse<any>) => {
        if (this.config.mapper && typeof (this.config.mapper) === 'function') {
          response.data = this.config.mapper(response.data);
        }
        this.dataSource = response.data;
        this.config.dataSource.data.next(response.data);
        this.config.total = response.total;
        this.config.pages = Math.ceil(this.config.total / this.config.pageSize);
        !this.inited && this.createTable();
        this.inited = true;
        this.loading(false);
      }, (error: any) => {
        console.error(`Error while getting data from [${this.config.url}]`, error);
        this.inited = true;
        this.config.selection.clear();
        this.loading(false);
      });

    } 

  }

  private getParams(): any {
    let counter = 0;
    debugger;
    const sort = Object.values(this.config.sortColumns)
      .filter(v => v.sortDirection !== null && v.sortDirection !== GridSortConfig.None)
      .map((v) => {
        return {
          field: v.field,
          Asc: v.sortDirection === GridSortConfig.Ascending,
          priority: counter++
        };
      });
    let params: any = {
      expSearch: this.config.search,
      pageNumber: this.config.page,
      take: this.config.pageSize,
      sort: JSON.stringify(sort),
      all: true
    };
    params.defaultSort = sort.length === 0;
    if (typeof (this.config.requestExtender) === 'function') {
      params = this.config.requestExtender(params);
    }
    return params;
  }

}
