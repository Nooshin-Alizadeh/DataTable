import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../framework/Base.Component';

@Component({
  selector: 'app-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.scss']
})
export class OtherDetailComponent extends BaseComponent implements OnInit {
  entity: any;
  id: any;
  constructor(injector: Injector, private route: ActivatedRoute, private router: Router) {
    super(injector);
  }

  ngOnInit(): void {
    this.entity = this.route.snapshot.paramMap.get('entity');
    this.id = this.route.snapshot.paramMap.get('id');
    this.dataService.get(this.dataService.getUrl(this.entity), { id: this.id }).subscribe((row) => {
      this.viewModel = row.data;
    })
  }

}
