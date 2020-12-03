import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AppService {

  private url = "http://localhost:8000/api";
  constructor(private http: HttpClient) { }

  getHomeFilesAndFolder() {
    return this.http.get(this.url + "/home");
  }

  openFolder(folderId: string) {
    let opts = { params: new HttpParams().set('folderId', folderId) };

    return this.http.get(this.url + "/folder", opts);
  }

  createFile(fileObj, folderId) {
    let opts = { params: new HttpParams().set('folderId', folderId) };

    return this.http.post(this.url + "/file", fileObj, opts);
  }

  createFolder(fileObj, folderId) {
    let opts = { params: new HttpParams().set('folderId', folderId) };

    return this.http.post(this.url + "/folder", fileObj, opts);
  }

  search(value: string) {
    let opts = { params: new HttpParams().set("value", value) };

    return this.http.get(this.url + "/search", opts);
  }

}
