import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScriptService } from '../script/script.service';

@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit, OnDestroy {
  canvasTransform;

  constructor(private readonly ss: ScriptService) {
    this.ss.loadScript('earthbound-script', true).then(data => {
      console.log('earthbound component loading script...', data);
    });
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true); // third parameter
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }


  scrollEvent = (event: any): void => {
    this.canvasTransform = {'transform': `translateY(${event.srcElement.scrollTop / 1.75}px)`};
  };
}
