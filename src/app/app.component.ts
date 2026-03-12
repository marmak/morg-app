import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterModule, RouterLinkActive],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'morg-app';
}
