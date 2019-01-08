import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ResumeComponent } from './resume/resume.component';
import { EarthboundGridComponent } from './earthbound-grid/earthbound-grid.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Home'
    }
  },
  {
    path: 'earthbound-grid',
    component: EarthboundGridComponent,
    data: {
      title: 'Earthbound Grid'
    }
  },
  {
    path: 'resume',
    component: ResumeComponent,
    data: {
      title: 'Resume'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
