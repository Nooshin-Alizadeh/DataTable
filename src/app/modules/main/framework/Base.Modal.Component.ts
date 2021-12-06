import { Injectable, Injector, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "./Base.Component";

@Injectable()
export abstract class BaseModalComponent extends BaseComponent {

    public activeModal: NgbActiveModal | undefined;
    @Input() configData: any;
    constructor(protected override injector: Injector) {
        super(injector);
        this.injectService();
    }
    injectService() {
        this.activeModal = this.injector.get(NgbActiveModal);
    }


}