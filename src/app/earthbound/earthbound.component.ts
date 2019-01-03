import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScriptService } from '../script/script.service';

@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit, OnDestroy {
  canvasTransform;

  maxCanvasHeight = 400;

  constructor(private readonly ss: ScriptService) {
    this.ss.loadScript('earthbound-script').then(data => {
      console.log('loaded script!');
    });
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true); // third parameter
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }


  scrollEvent = (event: any): void => {
    const number = event.srcElement.scrollTop;
    // console.log('scroll', number);
    this.canvasTransform = {'transform': `translateY(${number/1.75}px)`};
  };
}
