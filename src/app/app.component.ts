import { Component, OnInit } from '@angular/core';
import { routes } from './app-routing.module';
import { Route, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bio';
  routes: Routes = routes;

  ngOnInit(): void {
    console.log('routes', this.routes);
  }

  goToRoute(route: Route): void {

  }
}
