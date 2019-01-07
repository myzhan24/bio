import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class BackgroundLayerDataService {
  private _backgroundData$: BehaviorSubject<Uint8Array> = new BehaviorSubject(null);
  private _backgroundDataFiltered$: Observable<Uint8Array> = this._backgroundData$.pipe(filter(v => v != null), take(1));

  get backgroundData$(): Observable<Uint8Array> {
    return this._backgroundDataFiltered$;
  }

  constructor(private readonly http: HttpClient) {
    this.http.get('assets/data/truncated_backgrounds.dat', {
      responseType: 'arraybuffer'
    }).subscribe(data => {
      this._backgroundData$.next(new Uint8Array(data));
    });
  }
}
