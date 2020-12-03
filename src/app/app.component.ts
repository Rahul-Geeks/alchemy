import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  folders: any;
  files: any;
  currentFolder;
  newFileOrFolder;
  breadcrumb: Array<string> = ["home"];

  constructor(private appSrv: AppService) { }

  ngOnInit() {
    this.appSrv.getHomeFilesAndFolder().subscribe((res: any) => {
      this.folders = res.folders;
      this.files = res.files;
    });
  }

  openFolder(folder) {
    this.appSrv.openFolder(folder._id).subscribe((res: any) => {
      this.folders = res.child_folders;
      this.files = res.child_files;
      this.currentFolder = folder._id;
      this.breadcrumb.push(folder.name);
    });
  }

  create(type) {
    if (type == "file") {
      let newFile = {
        'name': this.newFileOrFolder,
        'home': this.currentFolder ? false : true
      };

      this.appSrv.createFile(newFile, this.currentFolder).subscribe((res: any) => {
        console.log(res);
      });
    }

    else if (type == "folder") {
      let newFolder = {
        'name': this.newFileOrFolder,
        'home': this.currentFolder ? false : true
      };

      this.appSrv.createFolder(newFolder, this.currentFolder).subscribe((res: any) => {
        console.log("RES", res);
        this.folders.push(res);
      });
    }
  }

  search(value) {
    console.log("VAL", value);
    this.appSrv.search(value).subscribe((res: any) => {
      this.folders = res.folders;
      this.files = res.files;
    });
  }
}
