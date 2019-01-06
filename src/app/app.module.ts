import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormModule } from './form/form.module';
import { EarthboundModule } from './earthbound/earthbound.module';
import { HttpClientModule } from '@angular/common/http';
import { ScriptService } from './script/script.service';
import { ResumeComponent } from './resume/resume.component';
import { EarthboundCardComponent } from './earthbound-card/earthbound-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResumeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormModule,
    EarthboundModule
  ],
  providers: [ScriptService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
