import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScriptService } from '../script/script.service';

@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit, OnDestroy {
  canvasTransform;
  showControls = false;
  enableParallax = false;

  constructor(private readonly ss: ScriptService) {
    this.ss.loadScript('earthbound-script', true).then(data => {
      console.log('earthbound component loading script...', data);
    });
  }

  ngOnInit() {
    if (this.enableParallax) {
      window.addEventListener('scroll', this.scrollEvent, true); // third parameter
    }
  }

  ngOnDestroy() {
    if (this.enableParallax) {
      window.removeEventListener('scroll', this.scrollEvent, true);
    }
  }


  scrollEvent = (event: any): void => {
    this.canvasTransform = {'transform': `translateY(${event.srcElement.scrollTop / 1.75}px)`};
  };
}
