import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/services/api.service';
import { MatDialog } from '@angular/material';
import { PrintIdsComponent } from './print-ids/print-ids.component';
import { textShadow } from 'html2canvas/dist/types/css/property-descriptors/text-shadow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'id-printing-app';
  formGroup: FormGroup;
  searchArray: any[]=[];
  idsList:any[]=[];
  public individualsFilteredRecords: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public householdsFilteredRecords: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public districtFilteredRecords: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public cadasterFilteredRecords: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  isLoading: boolean = false;
  showMsg: string;
  programsArray: any[] = [];
  householdsArray: any[] = [];
  individualsArray: any[] = [];
  organisationsArray;
  lbnOrgsArray: any[] = [];
  selectedArray: any[] = [];
  ouLebanon: any[]=[];
  finalOUArray: any[]=[];
  selectedIndArray: any[]=[];
  individualsArrayIDs: any[] = [];
  displayedIndArray: any[]=[]
  finalInd: any[] =[];
  todisplayIndArray: any[]=[];
  fname: any;
  lname: string;
  gender: string = '';
  dob: string = '';
  typeOfSearch: boolean = false;
  districtsArray: any[]=[];
  subDistricts: any[]=[];
  cadasters: any;
  displayFinalCadaster: any[] = [];
  constructor(
    private dialog: MatDialog,
    private api: ApiService, 
    private fb: FormBuilder){

  }
  ngOnInit(): void {
    this.createFormGroup();
    this.postData();
    this.getPrograms()
    // this.formGroup.controls.searchFormControl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterIndividualsMulti();
    //   });

    this.formGroup.controls.householdSearchControl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterHouseholdsMulti();
    });

    this.formGroup.controls.districtSearch.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterDistrictsMulti();
    });

    this.formGroup.controls.cadasterSearch.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCadastersMulti();
    });

      // this.getOrganisations("LBN");
      this.getOrganisations("Lebanon")
  }

  postData(){
    let attributes = [
      
      {attribute: "lhMhyp9F1kg", value: "THE POST IS SUCCESSFULL"},
      {attribute: "v4nxGLRD3n8", value: "active"},
      {attribute: "rgBt6xSDLPp", value: ""}
    ]
    let data = {
      trackedEntityType: "w8K4RIh1TRU",
      orgUnit: "rDsA2t3fk8J",
      attributes: attributes
    }
    this.api.postData(data).subscribe(
      (response)=>{
        let registered_id = '';
        let program_id = "slz8BujNhMu";
        console.log(response)
        if(response['httpStatus']=="OK" 
        && response['httpStatusCode']==200 && response['message']=="Import was successful."){
          registered_id = response['response']['importSummaries'][0]['reference']
          //Make an enrollement
          this.api.makeEnrollment(registered_id, program_id, 
            "ACTIVE", data['orgUnit'], "2020-02-19", "2020-02-19").subscribe((response)=>{
              console.log(response)
            },
            (error)=>console.log(error))
        }
      },
      (error)=>{
        console.log(error)
      }
    );
  }

getOrganisations(country){
    this.individualsArray = [];
    this.showMsg = '';
    this.isLoading = true;
    this.api.getOrganizations().subscribe((response) => {
      this.isLoading = false;
      // console.log(response);
      this.organisationsArray = response['organisationUnits'];
      this.organisationsArray.find((res)=>{
        if(res['displayName']==country){
          this.ouLebanon = res['children'];
        }
      });
      this.api.getSelectedOU().subscribe((response)=>{
        let array = response['organisationUnits'];
        // console.log(array, this.ouLebanon)
        Object.keys(this.ouLebanon).forEach((key, index)=>{
          array.find((res)=>{
            // console.log(res['id'], this.ouLebanon[key]['id'])
            if(res['id']==this.ouLebanon[key]['id']){
              // console.log(this.ouLebanon[key]['id'])
              this.finalOUArray.push(res)
            }
          });
          // console.log(this.finalOUArray)
        });
        this.getPrograms();
      }, (error) => {
        this.isLoading = false;
        this.showMsg = "Could not get available Organisations. Please try again.";
      });
      Object.keys(this.ouLebanon).forEach((key, index)=>{
        
      })
      // this.lbnOrgsArray.push(this.organisationsArray.find(res=>{
      //   return res['code']==country
      // }));
    }, (error) => {
      this.isLoading = false;
      this.showMsg = "Could not get available Organisations. Please try again.";
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  createFormGroup(){
    this.formGroup = this.fb.group({
      'household': new FormControl('', [Validators.required]),
      // 'searchText': new FormControl(''),
      'ou': new FormControl(''),
      'program': new FormControl('', [Validators.required]),
      'indSearchControl': new FormControl(''),
      'householdSearchControl': new FormControl(''),
      'ind_id': new FormControl(''),
      'toggleType': new FormControl(false),
      'district': new FormControl(''),
      'districtSearch': new FormControl(''),
      'cadaster': new FormControl(''),
      'cadasterSearch': new FormControl(''),
      'generalSearch': new FormControl('')
    });
  }

  displayCadaster(cadasterId){
    this.cadasterFilteredRecords = new ReplaySubject<any[]>(1);
    this.displayFinalCadaster = [];
    let array = [];
    // console.log(cadasterId);
    // console.log(this.cadasters)
    console.log(this.cadasters.length)
    // Object.keys(this.cadasters).forEach((key)=>{
      this.cadasters.filter(res=>{
        if(res.pid == cadasterId)
        {
          array.push(res['cadasters']);
          Object.keys(array).forEach(key=>{
            Object.keys(array[key]).forEach(row=>{
              this.displayFinalCadaster.push(array[key][row])
            })
          })
          console.log(this.displayFinalCadaster)
        }
      // })
      // let data = this.cadasters[key].find(res => res.pid==cadasterId);
      
    })
    this.cadasterFilteredRecords.next(this.displayFinalCadaster.slice());
    // let data = this.cadasters.find(res => res['pid']==cadasterId);
    // console.log(data)
    
  }

  getDistricts(ouid){
    this.districtsArray = [];
    this.subDistricts = [];
    this.cadasters = [];
    ouid = this.formGroup.controls.ou.value;
    this.api.getSelectedDistrictsOU(ouid).subscribe(res=>{
      // console.log(res['organisationUnits'])
      Object.keys(res['organisationUnits']).forEach((key)=>{
        this.districtsArray.push({id: key, districtName: res['organisationUnits'][key].n})
        if(res['organisationUnits'][key].c.length>0){
          this.subDistricts.push({pid:key, cid:res['organisationUnits'][key].c})
        }
      });
      console.log(this.subDistricts);
      Object.keys(this.subDistricts).forEach((key)=>{
          this.api.getSelectedDistrictsOU(this.subDistricts[key].pid).subscribe((res)=>{
            // console.log(res['organisationUnits'])
            this.cadasters.push({pid: this.subDistricts[key].pid, cadasters: res['organisationUnits']})
        })
        console.log(this.cadasters)
      })
      
      this.districtFilteredRecords.next(this.districtsArray.slice());
      // console.log(this.districtsArray)
      
    })
    // this.api.getSelectedOUDistricts(ouid).subscribe((res)=>{
      // let alldata = res['organisationUnits'][0];
      // // console.log(res['organisationUnits'][0]['children']);
      // districts = res['organisationUnits'][0]['children'];
      // Object.keys(districts).forEach((key)=>{
        
      // })
      
    // })
  }

  switchTypeOfSearch(ev){
    this.typeOfSearch = this.formGroup.controls.toggleType.value;
  }

  getHouseholds(ouid){
    this.householdsArray = [];
    this.todisplayIndArray = [];
    this.individualsFilteredRecords = new ReplaySubject<any[]>(1); 
    ouid = this.formGroup.controls.ou.value;
    let id = this.formGroup.controls.program.value;
    let searchedName = this.formGroup.controls.generalSearch.value
    this.showMsg = '';
    this.isLoading = true;
    this.householdsFilteredRecords = new ReplaySubject<any[]>(1);
    this.api.getHouseholdsApi(ouid, id, searchedName).subscribe((response)=>{
      this.householdsArray = response['rows'];
      // console.log(this.householdsArray)
      this.isLoading = false;
      this.householdsFilteredRecords.next(this.householdsArray.slice());
    },
    (error)=>{
      this.isLoading = false;
      this.showMsg = "Could not get available households. Please try again."
    });
  }
  
filterIndividualsMulti() {
  if (!this.selectedIndArray) {
    return;
  }
  // get the search keyword
  let search = this.formGroup.controls.indSearchControl.value;
  if (!search) {
      this.individualsFilteredRecords.next(this.selectedIndArray.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  if (search.length >= 1) {
  // filter the banks
   this.individualsFilteredRecords.next(
    this.selectedIndArray.filter(item => item['sellername'].toString().toLowerCase().indexOf(search) > -1)
   );
  }
}

filterCadastersMulti() {
  if (!this.displayFinalCadaster) {
    return;
  }
  // get the search keyword
  let search = this.formGroup.controls.cadasterSearch.value;
  if (!search) {
      this.cadasterFilteredRecords.next(this.displayFinalCadaster.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  if (search.length >= 1) {
  // filter the banks
   this.cadasterFilteredRecords.next(
    this.displayFinalCadaster.filter(item => item['n'].toString().toLowerCase().indexOf(search) > -1)
   );
  }
}

filterHouseholdsMulti() {
  if (!this.householdsArray) {
    return;
  }
  // get the search keyword
  let search = this.formGroup.controls.householdSearchControl.value;
  if (!search) {
    this.householdsFilteredRecords.next(this.householdsArray.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  if (search.length >= 1) {
  // filter the banks
   this.householdsFilteredRecords.next(
    this.householdsArray.filter(item => item[8].toString().toLowerCase().indexOf(search) > -1)
   );
  }
  // console.log(this.householdsFilteredRecords)
}

filterDistrictsMulti() {
  if (!this.districtsArray) {
    return;
  }
  let search = this.formGroup.controls.districtSearch.value;
  if (!search) {
    this.districtFilteredRecords.next(this.districtsArray.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  if (search.length >= 1) {
   this.districtFilteredRecords.next(
    this.districtsArray.filter(item => item['districtName'].toString().toLowerCase().indexOf(search) > -1)
   );
  }
  // console.log(this.householdsFilteredRecords)
}

  // onchange(){
  //   console.log(this.formGroup.controls.printType.value)
  // }

  getPrograms(){
    // To work with the following URL on Monday
    // https://medair.dhis2.bluesquare.org/api/programs.json?ou=rDsA2t3fk8J&ouMode=SELECTED&paging=false&fields=id,displayName,access[data[read,write]],programStages[access[data[read,write]]]&_=1580456847912

    this.clearSelection();
    this.showMsg = '';
    this.isLoading = true;
    let ouid = this.formGroup.controls.ou.value;
    this.api.getProgramsApi(ouid).subscribe((response)=>{
      // console.log(response['programs']);
      this.programsArray = response['programs'];
      console.log(response)
      this.isLoading = false;
    },
    (error)=>{
      this.isLoading = false;
      this.showMsg = "Could not get available programs"
    });
  }

  getIndividuals(hh_id){
    this.individualsArray = [];
    this.individualsArrayIDs = [];
    this.displayedIndArray = [];
    let ouid = this.formGroup.controls.ou.value;
    let program_id = this.formGroup.controls.program.value;
    this.showMsg = '';
    let relationShipIDs:any[]=[];
    this.finalInd = [];
    this.isLoading = true;
    let fname = '';
    
    this.api.getIndividualsInHHApi(program_id, hh_id).subscribe((response)=>{
      // Get the relation ship IDs
      relationShipIDs = response['relationships']
      let awaitPush = new Promise((resolve, reject)=>{
        Object.keys(relationShipIDs).forEach(key => {
          // Get the related IDs
          this.individualsArrayIDs.push(relationShipIDs[key]['to'])
        });
        if(this.individualsArrayIDs.length == relationShipIDs.length){
          resolve();
        }
      });
      awaitPush.then(()=>{
        let finalIndArray = [];
        let awaitPush = new Promise((resolve, reject)=>{
          Object.keys(this.individualsArrayIDs).forEach(key => {
            // Get the related IDs
            finalIndArray.push(this.individualsArrayIDs[key])
          });
          if(finalIndArray.length==this.individualsArrayIDs.length){
            resolve();
          }
        })
        // console.log(finalIndArray[0].trackedEntityInstance['trackedEntityInstance'])
        awaitPush.then(()=>{
          let awaitPush3 = new Promise((resolve, reject)=>{
            Object.keys(finalIndArray).forEach((key)=>{
              this.api.getRelatedInds(finalIndArray[key].trackedEntityInstance['trackedEntityInstance']).subscribe((res)=>{
                // console.log(res)
                // this.displayedIndArray.push(res)
                let toPush = res['attributes'];
                Object.keys(toPush).forEach((key)=>{
                  // console.log(toPush[key])
                  if(toPush[key].attribute=="CtWcqFJCFXV" && toPush[key].value=="Head_of_Household"){
                    this.finalInd.push(toPush)
                    
                  }
                  if(this.finalInd['code']=="LBN_GEN_Beneficiary_First_Name"){
                    fname = toPush[key].value;
                    // console.log(fname)
                  }
                });
                
                // console.log(this.finalInd)
                this.dislayIndArray(this.finalInd, hh_id)
                Object.keys(this.finalInd).forEach((key)=>{
                  // console.log(this.finalInd[key])
                })
                // console.log(this.finalInd.length)
                
                
                // if(this.displayedIndArray[key]['attributes'][9]!==undefined && this.displayedIndArray[key]['attributes'][9].value=="Head_of_Household"){
                //   this.finalInd.push(toPush)
                //   this.individualsFilteredRecords.next(this.displayedIndArray.slice());
                // }
              });
              // console.log(this.finalInd)
              
              // console.log(this.individualsFilteredRecords)
              // console.log(this.displayedIndArray.length, finalIndArray.length)
              // if(this.displayedIndArray.length == finalIndArray.length)
              // {
              //   console.log("y")
              //   resolve();
              // }
            });
            // console.log(this.finalInd);
            resolve();
            
          });
          
        })
      })
      
      
      this.isLoading = false;
      this.individualsArray = response['rows'];
      //this.individualsFilteredRecords.next(this.individualsArray.slice());
    },
    (error)=>{
      this.isLoading = false;
      this.showMsg = "Could not get available individuals. Please try again."
    });
  }
  dislayIndArray(array, hh_id){
    this.fname = '';
    this.lname = '';
    this.gender = '';
    this.dob = '';
    this.displayedIndArray = [];
    let id = hh_id
    if(array.length==1){
      Object.keys(array).forEach((key)=>{
        Object.keys(array[key]).forEach((row)=>{
          if(array[key][row].code=="LBN_GEN_Beneficiary_First_Name"){
            this.fname = array[key][row].value
          }
          if(array[key][row].code=="LBN_GEN_Beneficiary_Last_Name"){
            this.lname = array[key][row].value
          }

          if(array[key][row].code=="LBN_GEN_Gender"){
            this.gender = array[key][row].value
          }
          if(array[key][row].code=="LBN_GEN_DOB"){
            this.dob = array[key][row].value
          }
          
        })
      })
      this.todisplayIndArray.push([id, this.fname, this.lname, this.gender, this.dob]  )
      this.individualsFilteredRecords.next(this.todisplayIndArray.slice());
    }
  }
  consoleValue(val){
    console.log(val)
  }
  
  clearSelection(){
    this.selectedIndArray = [];
    this.districtsArray = [];
    this.displayFinalCadaster = [];
    this.subDistricts = [];
    this.individualsArrayIDs = [];
    this.todisplayIndArray = [];
    this.displayedIndArray = [];
    this.householdsFilteredRecords= new ReplaySubject<any[]>(1);
    this.districtFilteredRecords= new ReplaySubject<any[]>(1);
    this.cadasterFilteredRecords= new ReplaySubject<any[]>(1);
    this.individualsFilteredRecords = new ReplaySubject<any[]>(1);
    this.formGroup.controls.indSearchControl.reset;
    this.lbnOrgsArray = [];
    this.programsArray = [];
    // this.householdsArray = [];
    this.formGroup.controls.program.reset();
    this.organisationsArray = [];
    this.searchArray = [];
    this.individualsArray = [];
    this.selectedArray = [];
    this.cadasters = [];
  }

  openDialog(array): void {

    const dialogRef = this.dialog.open(PrintIdsComponent, {
      width: '450px',
      data: { data: array }
    });
    dialogRef.afterClosed().subscribe((response)=>{
      console.log(response)
    });
  }
}
