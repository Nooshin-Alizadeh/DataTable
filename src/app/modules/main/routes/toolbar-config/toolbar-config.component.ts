import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar-config',
  templateUrl: './toolbar-config.component.html',
  styleUrls: ['./toolbar-config.component.scss']
})
export class ToolbarConfigComponent implements OnInit {
  active:any=0;
  constructor() { }

  ngOnInit(): void {
  }

}
