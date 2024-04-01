import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnkiComponent } from './anki/anki.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnkiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'morg-app';
}
