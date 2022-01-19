import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storege-service/storage.service';

const BASE_URL = environment.BASE_URL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    private storageSrv: StorageService,
    ) {
  }

  async post(fun, param, loading) {
    return new Promise<any>(async (resolve, reject) => {
        if (!environment.production) { console.log('[ %cHTTP POST', 'font-weight: bold', '] Call to', fun); }
        // if (loading) { await this.sharedSrv.loadingPresent(); }
        const headerData = await this.generateHeader();
        const bodyData = param;
        this.httpClient.post(BASE_URL + fun + '/', bodyData, headerData)
        .subscribe(async res => {
          const data: any = res;
          console.log(data);
          // if (loading) { await this.sharedSrv.loadingDismiss(); }
          if (!environment.production) { console.log('HttpClient response:', res); }
          // await this.responseHeaderHandler(res.headers);
          this.responseBodyHandler(data)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
        },
        async err => {
          // if (loading) { await this.sharedSrv.loadingDismiss(); }
          if (!environment.production) {
            console.log('HttpClient Data: ' , param);
            console.log('HttpClient Error: ' , err);
            console.log('HttpClient Error: ' , err.error);
          }
          reject(err);
        });
    });
  }

  generateHeader() {
    return new Promise<any>(async (resolve) => {
      const token = this.storageSrv.getToken();
      const httpOptions = {
        headers: new HttpHeaders({ 
          'x-token': token
        })
      };
      resolve(httpOptions);
    });
  }

  responseBodyHandler(res) {
    return new Promise<any>(async (resolve, reject) => {
      if (res.result && res.result.isSuccess) {
        // if (res.result.showAlert) { this.sharedSrv.alert(res.result.title, null, res.result.desc); }
        if (!environment.production) { console.log('responseBodyHandler: ', res.data); }
        resolve(res.data);
      } else {
        // if (res.result.showAlert) { this.sharedSrv.alert(res.result.title, null, res.result.desc); }
        if (!environment.production) { console.log('responseBodyHandlerError: ', res.result); }
        reject(res.result);
      }
    });
  }
}