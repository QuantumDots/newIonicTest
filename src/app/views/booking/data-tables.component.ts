import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation,QueryList } from '@angular/core';
import { ITableData, DataTablesService } from './data-tables.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { SpinkitComponent } from '@coreui/angular/lib/spinkit/spinkit.component';
import { AppToastComponent as ToastComp } from '../../services/shared-service/toast-simple/toast.component'
import { HttpService } from '../../services/http-service/http.service'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalInterfaceService } from '../../services/local-inteface-service/local-interface.service';
import { ValidationService } from '../../services/validation-service/validation.service';
import { StorageService } from '../../services/storege-service/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-tables',
  templateUrl: './data-tables.component.html',
  styleUrls: ['./data-tables.component.scss'],
  providers: [ DataTablesService ],
  encapsulation: ViewEncapsulation.None,
})
export class DataTablesComponent {
  error: any;
  public dbData?;
  public isLoading: boolean = true;
  public currentIndex = 0;
  public filterQuery = '';
  public btnLang: string;
  public langDir: string = "ltr";
  public facilityId = '';
  // public toasterService: ToasterService;
  // // public toasterconfig: ToasterConfig =
  // // new ToasterConfig({
  // //   tapToDismiss: true,
  // //   timeout: 5000
  // // });

 

  title = 'ng';
  langs = ['en', 'ar'];

  public ngOnInit(): void {
    let browserlang = this.translateService.getBrowserLang();
    if (this.langs.indexOf(browserlang) > -1) {
      this.translateService.setDefaultLang(browserlang);
      this.btnLang = 'English';
      this.langDir = 'rtl';
    } else {
      this.translateService.setDefaultLang('en');
      this.btnLang = "العربية";
      this.langDir = 'ltr';
    }
  }
  @ViewChild('dangerModal', {static: false}) public dangerModal: ModalDirective;

  constructor(
    private dataTableService: DataTablesService, 
    public translateService: TranslateService, 
    public titleService: Title, 
    public router: Router, 
    public route: ActivatedRoute, 
    private http: HttpClient, 
    private httpService: HttpService, 
    private storageSrv: StorageService,
    private localInterfaceSrv: LocalInterfaceService,
    private toastr: ToastrService,
    private validationSrv : ValidationService,
    ) 
    {
    
    this.validationSrv.validateAcess()
    .then(async () => {
      this.isLoading = true;
      this.route.queryParams.subscribe(async params => {
        this.facilityId = this.storageSrv.getFacilityId();
          await this.loadBookings(this.facilityId);
      });
    });
  }

  loadBookings = (facilityId) => {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = true;
      this.localInterfaceSrv.getBookings(facilityId)
      .then(res => {
        this.dbData = res;
        this.isLoading = false;
        resolve(res);
      })
      .catch(err => { 
        reject(err); 
        console.log(err)
        //this.toastr.error(err.description, "Error");
      })
      .finally(() => this.isLoading = false);
    });
  }


  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.name.length;
  }

  public getDate(regDate: string) {
    const date = new Date(regDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }
  
  deleteBooking = (bookingId) => {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = true;
      const fields = {
        bookingId: bookingId
      };
      this.localInterfaceSrv.deleteBooking(bookingId)
      .then(async res => {
        resolve(res);
        this.toastr.success("Booking Removed", "Success");
        this.dangerModal.hide();
        this.route.queryParams.subscribe(async params => {
          await this.loadBookings(this.facilityId);
      });
        //window.location.reload()
      })
      .catch(err => { 
        reject(err); 
        this.toastr.error(err.description, "Error");
        this.dangerModal.hide();
      })
      .finally(() => this.isLoading = false);
    });
  }

  public showEdit(data: object) {
    this.router.navigate(['details'], {state: {data: data}, relativeTo: this.route});
  }
  public add() {
    this.router.navigate(['details'], {state: {createData: ''}, relativeTo: this.route});
  }
  public async delete(content: object) {
    return await this.httpService.post('deleteUser', '', '')
    .then(
      data => {window.location.reload()},
      error => {
        this.dangerModal.hide();
        // this.toastComp.doShow("Error", 'An error has occured, please try again later');
      }
    ).catch();
  }
}
