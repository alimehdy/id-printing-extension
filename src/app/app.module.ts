import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatProgressSpinnerModule, MatLabel, MatFormFieldModule, MatSelectModule, MatOptionModule, MatCardModule, MatIconModule, MatInputModule, MatButtonModule, MatIconRegistry, MatDialogModule, MatSnackBarModule, MatSlideToggleModule } from '@angular/material'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrintIdsComponent } from './print-ids/print-ids.component';
import { QRCodeModule } from 'angularx-qrcode';
// import { NgxQRCodeModule } from 'ngx-qrcode2';    

@NgModule({
  declarations: [
    AppComponent,
    PrintIdsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    QRCodeModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule
    // NgxQRCodeModule
  ],
  providers: [PrintIdsComponent],
  entryComponents: [PrintIdsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
