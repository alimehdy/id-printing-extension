import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
// import { dhis2 } from '../dhis2-config';
import { isDevMode } from '@angular/core';


const user = 'Ali.Mehdy';
const password = 'LBN22v10+LBN22v10';

var httpOptions;
if (isDevMode()) {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': "Basic " + btoa(user + ":" + password),
      'Access-Control-Allow-Origin': '*'
    })
  };
} else {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'

    })
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  getOrganizations(){
    let url = 'https://medair.dhis2.bluesquare.org/api/30/organisationUnits.json?fields=[id,displayName,children]&paging=false';
    return this.http.get(url, httpOptions)
  }

  getSelectedOU(){
    let url = 'https://medair.dhis2.bluesquare.org/api/30/organisationUnits.json?fields=[id,%20displayName]&paging=false';
    return this.http.get(url, httpOptions)
  }

  getSelectedOUDistricts(ouid){
    let url ='https://medair.dhis2.bluesquare.org/api/30/organisationUnits.json?filter=id:eq:'+ouid+'&fields=[id,displayName,children]&paging=false';
    return this.http.get(url, httpOptions)
  }

  getProgramsApi(ouid){
    let url ='https://medair.dhis2.bluesquare.org/api/programs.json?ou'+ouid+'&ouMode=SELECTED&paging=false&fields=id,displayName';
    return this.http.get(url, httpOptions);
  }

  getCadastersApi(id){
    let url ='https://medair.dhis2.bluesquare.org/api/programs.json?paging=false&fields=id,displayName';
    return this.http.get(url, httpOptions);
  }
  getSelectedDistrictsOU(ouid){
    let url ='https://medair.dhis2.bluesquare.org/dhis-web-commons-ajax-json/getOrganisationUnitTree.action?parentId='+ouid;
    return this.http.get(url, httpOptions);
  }

  getHouseholdsApi(ouid, program_id, searchedName){
    let url = '';
    if(searchedName==undefined || searchedName==null || searchedName=='')
    {
      url ='https://medair.dhis2.bluesquare.org/api/30/trackedEntityInstances/query.json?ou='+ouid+'&order=created:desc&program='+program_id+'&paging=false&fields=*';
    }
    else{
      url ='https://medair.dhis2.bluesquare.org/api/30/trackedEntityInstances/query.json?ou='+ouid+'&order=created:desc&program='+program_id+'&paging=false&fields=*';
    }
    return this.http.get(url, httpOptions)
  }
  getIndividualsInHHApi(program_id, hh_id){
    let url ='https://medair.dhis2.bluesquare.org/api/30/trackedEntityInstances/'+hh_id+'.json?program='+program_id+'&fields=*'
    return this.http.get(url, httpOptions)
  }

  getRelatedInds(ind_id){
    let url ='https://medair.dhis2.bluesquare.org/api/30/trackedEntityInstances/'+ind_id+'.json?fields=[attributes]';
    return this.http.get(url, httpOptions);
  }
  
  postData(data){
    let url ='https://medair.dhis2.bluesquare.org/api/30/trackedEntityInstances';
    return this.http.post(url, data, httpOptions)
  }

  makeEnrollment(trackedEntityInstance, program, status, orgUnit, enrollmentDate, incidentDate){
    let data = { trackedEntityInstance: trackedEntityInstance, program:program, 
            status: status, orgUnit: orgUnit, enrollmentDate: enrollmentDate, incidentDate: incidentDate}
    let url ='https://medair.dhis2.bluesquare.org/api/30/enrollments';
    return this.http.post(url, data, httpOptions)
  }

}