import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatCardModule, MatRadioModule, MatSidenavModule, MatToolbarModule} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatRadioModule,
        MatCardModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatRadioModule,
        MatCardModule
    ],
    declarations: []
})
export class MaterialModule {
}
