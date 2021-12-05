import { Injector } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "./Base.Component";

export abstract class BaseModalComponent extends BaseComponent  {

    public activeModal: NgbActiveModal | undefined;
    constructor(protected override injector:Injector){
        super(injector);
        this.injectService();
    }
 injectService(){
     this.activeModal=this.injector.get(NgbActiveModal);
    }


}