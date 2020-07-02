import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { License } from '../../models/license/license';
import { LicenseService } from 'src/app/services/licenses/license.service';
import { User } from 'src/app/models/user/user';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { LicenseManyPrinted } from 'src/app/ngrx/actions/license.actions';

@Injectable({
    providedIn: 'root'
})
export class PrintService {

    constructor( 
        private licenseService: LicenseService,
        private store: Store<AppState>,
    ) {  }

    public printLicenses(licenseList: License[], currentUser: User): boolean {
        for(let i = 0; i < licenseList.length; i++ ) {
            if (!licenseList[i].isAuthenticated) {
                return false;
            }
        }
        const userSigData = currentUser.signatureData;
        this.licenseService.licensePrinted(licenseList.map(l => l.id)).subscribe(
            () => {
                this.store.dispatch(new LicenseManyPrinted({licenses: licenseList, user: currentUser, time: new Date()}));
            }, (error) => console.log(error)
        );

        let i = -1;
        var popupWin = window.open('', '_blank', 'top=0,left=0');
        popupWin.document.open();
        popupWin.document.write('<!DOCTYPE html> \
    <html>\
    <script>\
    setTimeout(function () { window.print(); }, 500);\
    window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }\
    </script>\
    <head>\
        <style>\
            @media print{@page {size: landscape}}\
            @page {\
                margin: 0;\
            }\
      .container {\
        margin-right: 5px;\
        margin-top: 5px;\
        margin-left: 4px;\
        margin-bottom: 5px;\
        width: 400px;\
        height: auto;\
      }\
            table,\
            td {\
              border-collapse: collapse;\
              border: 2px solid black;\
              vertical-align: top;\
              table-layout: fixed;\
              white-space: nowrap;\
          }\
          input[type=checkbox] {\
            transform: scale(.75);\
          }\
          .labelheader {\
              font-weight: bold;\
              font-size: 55%;\
          }\
          .labelrow {\
              border-bottom-style: hidden;\
          }\
          .watermark{\
            opacity: 0.75;\
                height: 200px;\
                width: 200px;\
                position: absolute;\
                z-index: -1;\
            margin-left: 100px;\
            margin-top: 15px;\
        }\
      </style>\
  </head>\
  <body>');

  licenseList.forEach(license => {
      i++;
                popupWin.document.write(
                    '<div style="padding-top: 4px; page-break-after: always; padding-left: 2px" class="container">\
<img src="../../../assets/SecFoStamp.png" class="watermark"/>\
<table width="98%" height="99%" style="font-size:73%">\
<tr>\
    <td rowspan="8" style="text-align: center; font-weight: bold">Taxi Service <br>645-8888 <br>098-970-8888 option 8 for <br>Kadena Air Base <br>Daiko Service 098-932-4035</td>\
    <td class="labelheader labelrow">LOCAL POLICE</td>\
</tr>\
<tr>\
    <td style="bottom-border-stye: solid">LOCAL 110</td>\
</tr>\
<tr class="labelrow">\
    <td class="labelheader">MILITARY POLICE</td>\
</tr>\
<tr>\
    <td>634-2475/098-938-2475</td>\
</tr>\
<tr class="labelrow">\
    <td class="labelheader">FIRE/AMBULANCE</td>\
</tr>\
<tr>\
    <td>LOCAL 119</td>\
</tr>\
<tr class="labelrow">\
    <td class="labelheader">OTHER</td>\
</tr>\
<tr>\
    <td>ON KAB 911/ 098-911-1911</td>\
</tr>\
<tr>\
    <td class="labelheader labelrow" colspan="2">PHYSICAL RESTRICTIONS<br><br></td>\
</tr>\
    <tr>');
        
if (license.glasses)
{
    popupWin.document.write('<td class="labelheader" colspan="2">GLASSES<br></td>');
} else {
    popupWin.document.write('<td class="labelheader" colspan="2"> <br></td>');
}
popupWin.document.write('</tr>\
    <tr>\
        <td class="labelheader labelrow" colspan="2">REQUEST FOR ASSISTANCE</td>\
    </tr>\
    <tr>\
        <td colspan="2" class="labelrow">1. PLEASE WHERE IS A TELEPHONE? <img src="../../../assets/telephone.png" height="25%" /></td>\
    </tr>\
    <tr>\
        <td colspan="2" class="labelrow">2. PLEASE CALL AN AMBULANCE <img src="../../../assets/ambulance.png" height="25%" /></td>\
    </tr>\
    <tr>\
        <td colspan="2">3. PLEASE CALL THIS NUMBER _____________ <img src="../../../assets/number.png" height="25%" />\</td>\
    </tr>\
    <tr><td class="labelheader labelrow" colspan="2">REMARKS</td></tr>');
    if (license.tdy || license.onBaseOnly || license.remarks) {
        popupWin.document.write('<tr><td colspan="2" class="labelrow" style="margin-top: 2px">');
        if (license.tdy) {
            popupWin.document.write('TDY');
        }
    
        if (license.onBaseOnly) {
            if (license.tdy) { popupWin.document.write(' / '); }
            popupWin.document.write('On Base Only ');
        }
    
        if (license.remarks) {
            if (license.tdy || license.onBaseOnly) { popupWin.document.write(' / '); }
            popupWin.document.write(license.remarks);
        }
    } else {
        popupWin.document.write('<tr><td colspan="2" class="labelrow" style="margin-top: 2px">');
    }
    popupWin.document.write('<br><br></td></tr>');
    popupWin.document.write('<tr><td class="labelheader" colspan="2">IMPLIED CONSENT APPLIES ON AND OFF BASE (USFJI 31-205, para 2.1.6)</td>\
    </tr>\
    <tr style="font-size: 50%; font-weight:bold; border-right-style: hidden; border-left-style: hidden; border-bottom-style: hidden">\
        <td style="border-right-style: hidden">USFJ FORM 4EJ 19821210 (EF)</td>\
        <td style="text-align: right"> NON-TRANSFERABLE</td>\
    </tr>\
</table>\
</div>');
if ((licenseList.length - 1) == i )
{
    popupWin.document.write('<div style="padding-top: 1px; padding-left: 0px" class="container">');
} else {
    popupWin.document.write('<div style="padding-top: 1px; page-break-after: always; padding-left: 0px" class="container">');
}
popupWin.document.write('<table width="98%" height="99%" style="font-size:77%;">\
<tr>\
  <td colspan="24" rowspan="4" style="text-align: center; font-weight: bold; font-size: 75%;">U.S. FORCES, JAPAN\
      <br>OPERATOR&#39;s PERMIT FOR CIVILIAN VEHICLE\
      <br>(See Privacy Act Statement on Application for USFJ FORM 4 EJ)\
      <br><img src="../../../assets/header.png" height="25%" /></td>\
  <td colspan="6" class="labelheader labelrow">PERMIT NO.</td>\
</tr>\
<tr>\
  <td colspan="6" style="bottom-border-style: solid">' + license.permitNumber + '</td>\
</tr>\
<tr class="labelrow">\
  <td colspan="6" class="labelheader">DATE ISSUED</td>\
</tr>\
<tr>\
  <td colspan="6">' + new Date().toISOString().split('T')[0] + '</td>\
</tr>\
<tr class="labelheader labelrow">\
  <td colspan="16" class="labelrow">OPERATORS NAME (Last, First, MI)</td>\
  <td colspan="14">FOR OPERATION OF (Check applicable box)</td>\
</tr>\
<tr>\
  <td colspan="16">'+ license.lastName + ', ' + license.firstName + ' ' + license.middleInitial + '</td>');

  if (license.autoJeep)
  {
    popupWin.document.write('<td colspan="7" class="labelheader labelrow" style="border-right: 0"><input type="checkbox" checked> AUTO/JEEP</td>');
  } else {
    popupWin.document.write('<td colspan="7" class="labelheader labelrow" style="border-right: 0"><input type="checkbox"> AUTO/JEEP</td>');
  }

  if (license.motorCycle)
  {
    popupWin.document.write('<td colspan="7" class="labelheader labelrow" style="border-left: 0"><input type="checkbox" checked> MOTORCYCLE</td>');
  } else {
    popupWin.document.write('<td colspan="7" class="labelheader labelrow" style="border-left: 0"><input type="checkbox"> MOTORCYCLE</td>');
  }

popupWin.document.write('</tr>\
<tr class="labelrow labelheader">\
  <td colspan="16">DOD ID NO.</td>');

  if (license.motor)
  {
    popupWin.document.write('<td colspan="7" rowspan="2" style="border-right: 0"><input type="checkbox" checked> MOTOR</td>');
  } else {
    popupWin.document.write('<td colspan="7" rowspan="2" style="border-right: 0"><input type="checkbox"> MOTOR</td>');
  }

  if (license.other)
  {
    popupWin.document.write('<td colspan="7" rowspan="2" style="border-left: 0"><input type="checkbox" checked> OTHER (Specify)</td>');
  } else {
    popupWin.document.write('<td colspan="7" rowspan="2" style="border-left: 0"><input type="checkbox"> OTHER (Specify)</td>');
  }

popupWin.document.write('</tr>\
<tr>\
  <td colspan="16">' + license.dodId + '</td>\
</tr>\
<tr class="labelrow labelheader">\
  <td colspan="2">SEX</td>\
  <td colspan="6">DOB</td>\
  <td colspan="3">HEIGHT</td>\
  <td colspan="5">WEIGHT</td>\
  <td colspan="14">EXPIRATION DATE</td>\
</tr>\
<tr>\
<td colspan="2">' + license.gender.substring(0, 1) + '</td>\
<td colspan="6">' + license.dob.toString().substring(0, 10) + '</td>\
<td colspan="3">' + license.height + '"</td>\
<td colspan="5">' + license.weight + ' lbs</td>\
<td colspan="14">' + license.dateExpired.toString().substring(0, 10) + '</td>\
</tr>\
<tr class="labelrow labelheader">\
  <td colspan="7">COLOR OF HAIR</td>\
  <td colspan="9">COLOR OF EYES</td>\
  <td colspan="14">NAME AND LOCATION OF ISSUING UNIT</td>\
</tr>\
<tr>\
  <td colspan="7">' + license.hairColor + '</td>\
  <td colspan="9">' + license.eyeColor + '</td>\
  <td colspan="14" style="text-align:center">18 SFS/S5B KADENA AB</td>\
</tr>\
<tr class="labelrow labelheader">\
  <td colspan="16">UNIT</td>\
  <td colspan="14">GRADE AND TITLE OF ISSUING OFFICIAL</td>\
</tr>\
<tr>');
if (license.unit) {
    popupWin.document.write('<td colspan="16">' + license.unit.name + '</td>');
} else {
    popupWin.document.write('<td colspan="16"> </td>');
}
popupWin.document.write('<td colspan="14" style="text-align:center">Pass and Registration</td>\
</tr>\
<tr class="labelrow labelheader">\
  <td colspan="16">OPERATORS SIGNATURE</td>\
  <td colspan="14">SIGNATURE OF ISSUING OFFICIAL</td>\
</tr>\
<tr style="font-size: 125%">\
  <td colspan="16">\
    <img src='+ license.signatureData + ' height="25%" width="100%">\
  </td>\
  <td colspan="14">\
  <img src='+ userSigData + ' height="25%" width="100%">\
  </td>\
</tr>\
<tr style="font-size: 50%; font-weight:bold; border-right-style: hidden; border-left-style: hidden; border-bottom-style: hidden">\
  <td colspan="16" style="border-right-style: hidden">USFJ FORM 4EJ 19821210 (EF)</td>\
  <td colspan="14" style="text-align: right"> NON-TRANSFERABLE</td>\
</tr>\
</table>\
</div>');
});

popupWin.document.write('</body></html>');      
        popupWin.document.close();
    
        return true;
    }
}
