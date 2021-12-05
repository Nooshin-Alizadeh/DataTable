import { Injector } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

export abstract class BaseComponent  {
    modalService!: NgbModal;
    constructor(protected injector:Injector){
        this.injectServices();
    }
    injectServices(){
        this.modalService=this.injector.get(NgbModal);
    }
    protected modal(component: any,
        callback?: (result: any) => void,
        size?: 'sm' | 'lg',
        error?: (error: any) => void,
        options: NgbModalOptions = {}): NgbModalRef {
        const ref = this.modalService.open(component, Object.assign({ size: size || 'lg', backdrop: 'static', centered: false }, options));
        ref.result.then((res: any) => {
        }).catch( (e: any) => e);
        return ref;
    }

}