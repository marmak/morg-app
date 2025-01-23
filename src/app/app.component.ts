import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { AnkiComponent } from './anki/anki.component';
import { MatMenuModule } from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, MatMenuModule, RouterModule, AnkiComponent, MatListModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'morg-app';
}
