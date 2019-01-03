import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../script/script.service';

@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit {

  constructor(private readonly ss: ScriptService) {
    this.ss.loadScript('earthbound-script').then(data => {
      console.log('loaded script!');
    });
  }

  ngOnInit() {
  }

}
