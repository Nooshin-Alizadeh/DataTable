import { Injector } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { GridConfig } from "../shared/grid/grid.component";
import { DataServiceConfigurationService } from "./data-service-configuration.service";

export abstract class BaseComponent {
    modalService!: NgbModal;
    dataService!: DataServiceConfigurationService;
    viewModel: any;
    grid!: GridConfig;
    init = false;
    constructor(protected injector: Injector) {
        this.injectServices();
    }
    injectServices() {
        this.modalService = this.injector.get(NgbModal);
        this.dataService = this.injector.get(DataServiceConfigurationService);
    }
    protected modal(component: any, configData?: any,
        callback?: (result2: any) => void,
        size?: 'sm' | 'lg',
        error?: (error: any) => void,
        options: NgbModalOptions = {}): NgbModalRef {
        const ref = this.modalService.open(component, Object.assign({ size: size || 'lg', backdrop: 'static', centered: false }, options));
        ref.componentInstance.configData = configData;
        ref.result.then((res: any) => {
        }).catch((e: any) => e);
        return ref;
    }

}