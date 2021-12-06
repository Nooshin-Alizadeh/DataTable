
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injector, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment'



@Injectable({
  providedIn: 'root'
})
export class DataServiceConfigurationService {

  public http!: HttpClient;
  private _baseUrl: string
  get baseUrl(): string { return this._baseUrl; }
  set baseUrl(baseUrl: string) { this._baseUrl = baseUrl; }

  constructor(private injector: Injector) {
    this._baseUrl = environment.apUri;
    this.injectServices();
  }
  private injectServices(): void {
    try {
      this.http = this.injector.get(HttpClient);
    } catch (error) {

    }
  }

  getUrl(module: string) {
    return `${this.baseUrl}api/${module}`;
  }

  // public post(url: string, model: Object, options?: { [key: string]: any }): Observable<any> {
  //   var data = null;
  //   try {
  //     data = JSON.stringify(model);
  //   } catch (error) {

  //   }
  //   return this.http.post(url, data, this.getRequestOptions(options));
  // }
  public get(url: string,
    params?: { [param: string]: string | string[] },
    options?: { [key: string]: any }): Observable<any> {
    if (params)
      return this.http.get(url, this.getRequestOptions(options, params));

    return this.http.get(url);

  }

  get requestOptionsArgs(): { [key: string]: any } {
    return this._requestOptionsArgs;
  }
  set requestOptionsArgs(requestOptionsArgs: { [key: string]: any }) {
    this._requestOptionsArgs = requestOptionsArgs;
  }
  public getRequestOptions(requestOptionsArgs: { [key: string]: any } = {}, params?: { [param: string]: string | string[] }): any {
    try {
      if (!this.requestOptionsArgs) this.requestOptionsArgs = {};
      this.requestOptionsArgs['params'] = null;
      if (params) {
        this.requestOptionsArgs['params'] = new HttpParams({ fromObject: params });
      }
      return Object.assign(this.requestOptionsArgs, requestOptionsArgs);
    } catch (error) {
      return null;
    }
  }

  private _requestOptionsArgs!: { [key: string]: any; };

}
export interface IResponse<T> {
  pageCount: number;
  pageNo: number;
  exception: any;
  total: number;
  data: Array<T>;
}