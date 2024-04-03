import { Routes } from '@angular/router';
import { AnkiComponent } from './anki/anki.component';
import { BlogsComponent } from './blogs/blogs.component';

export const routes: Routes = [
  {
    path: 'anki',
    component: AnkiComponent,
    title: 'Anki page'
  },
  {
    path: 'blogs',
    component: BlogsComponent,
    title: 'Blogs page'
  },

];
