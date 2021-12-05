import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './modules/main/routes/user/user-list/user-list.component';
import { GridComponent } from './modules/main/shared/grid/grid.component';
import { ToolbarConfigComponent } from './modules/main/routes/toolbar-config/toolbar-config.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserDetailComponent } from './modules/main/routes/user/user-detail/user-detail/user-detail.component';
@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    GridComponent,
    ToolbarConfigComponent,
    UserDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgbModule,
    CdkTableModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule
  ],
  exports:[
    CdkTableModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
