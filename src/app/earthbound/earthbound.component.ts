import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import ROM from './rom/rom';

// import * as data from '@data/truncated_backgrounds.dat';


@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit {
  backgroundData;
  ROM;

  constructor(private readonly http: HttpClient) {
    this.http.get('assets/data/truncated_backgrounds.dat', {
      responseType: 'arraybuffer'
    }).subscribe(data => {
      console.log(data);
      // let backgroundData = new Uint8Array(Array.from(data).map(x => x.charCodeAt(0)));
      // let fr = new FileReader();
      // let xx = fr.readAsArrayBuffer(data);
      // console.log(xx);
      this.backgroundData = new Uint8Array(data);
      this.ROM = new ROM(this.backgroundData);
    });
  }

  ngOnInit() {
  }

}
