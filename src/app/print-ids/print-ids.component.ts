import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatCard, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ApiService } from 'src/services/api.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-print-ids',
  templateUrl: './print-ids.component.html',
  styleUrls: ['./print-ids.component.scss']
})
export class PrintIdsComponent implements OnInit {
  arrayOfData:any[] = [];
  @ViewChild('matCard', {static: false}) matCard: MatCard;
  noData: boolean = false;
  array: any[] = [];
  hh_id: any;
  color: string = '#fff000';
  qrtest = 1;
  // elementType: 'url' | 'canvas' | 'img' = 'url';
  constructor(private api: ApiService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<PrintIdsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.array = this.data.data
    console.log(this.array.length)
    // this.array = [
    //   {indId: 123, ind_first_name_ar: 'علي', ind_last_name_ar: 'علي', ind_gender: 'Male', dob:'2000-10-10', ind_first_name_en: 'Ali', ind_last_name_en: 'Ali'}
    // ]
    //this.array = this.data.data;
    //this.hh_id = this.data.hh_id;
    this.hh_id = this.array[0];
    console.log(this.array);
    if (this.array.length == 0 || this.array == undefined) {
      this.noData = true;
    }
    else {
      this.noData = false;
    }
  }
  public startDownload() {
    //console.log("Downloading image one by one, without a loop");
    this._download(0, this.array);
  }
  private _download(index, array) {
    if (index >= array.length) {
      this.snackBar.open('ID Cards Downloaded.', 'Close', {
        duration: 5000,
      });
      this.dialogRef.close();
    } else {
      let docElem = document.getElementById(index.toString());
      

      html2canvas(docElem).then((canvas) => {
        let generatedImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let a = document.createElement('a');
        a.href = generatedImage;
        a.download = `${array[(index+1)]} ${array[(index+2)]}.png`;
        a.click();
        // at this point, image has been downloaded, then call the next download.
        this._download(index + 1, array)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  // Method using RxJS library
  // toCanvas(index, array) {
  //   from(Object.keys(this.array)).pipe(

  //     concatMap((i) => {
  //       //console.log(this.array + ' ' + i);
  //       let docElem = document.getElementById(i.toString());
  //       return from(html2canvas(docElem).then(function (canvas) {
  //         let generatedImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  //         let a = document.createElement('a');
  //         a.href = generatedImage;
  //         a.download = `${i}.png`;
  //         a.click();
  //         return `${i}.png`;
  //       }));
  //     })
  //   ).subscribe((imageName) => {
  //     this.snackBar.open('ID Cards Downloaded.', 'Close', {
  //       duration: 5000,
  //     });
  //   });

  // }

  public save2PDF() {
    let i = this.array.length;
    
    var data;
    for(let j = (i); j>=0; --j)
    {
      data = document.getElementById(j.toString());
      console.log(data)
    }
    
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 200;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF 
    });
  }

  async generateAllPdf() {
    const doc = new jspdf('p', 'mm', 'a4');
    const options = {
      pagesplit: true
    };
    const ids = document.querySelectorAll('[id]');
    console.log(ids)
    const length = ids.length;
    for (let i = 0; i < this.data.sizeOfArray; i++) {
      const chart = document.getElementById(i.toString());
      // excute this function then exit loop
      await html2canvas(chart, { scale: 1 }).then(function (canvas) { 
        //doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 50, 85, 55);
        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 87, 57);
        if (i < (length - 1)) {
          doc.addPage();
        }
      });
    }
    // download the pdf with all charts
    doc.save('MEDAIR_ID_CARDS_OF_HH_ID_' +  + '.pdf');
  }

  
  // public toCanvas() {
  //   var elem = document.getElementById('contentToConvert');
  //   let array = this.arrayOfData;

  //   html2canvas(elem).then(function(canvas) {
  //     var generatedImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  //     //window.location.href=generatedImage;
  //     let a = document.createElement('a');
  //         a.href = generatedImage;
  //         a.download = `${array['ind_last_name_ar']} ${array['ind_first_name_ar']}.png`;
  //         a.click();
  //   });

  // }

  public save2PDFv2(){
    var data = document.getElementById('contentToConvert');
    let array = this.arrayOfData;
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 87; 
      var pageHeight = 57;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save(`${array['ind_last_name_ar']} ${array['ind_first_name_ar']}.pdf`); // Generated PDF 
    });
  }

}
