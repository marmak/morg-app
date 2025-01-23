import { Routes } from '@angular/router';
import { AnkiComponent } from './anki/anki.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blog/blog.component';
import { QuestionsComponent } from './questions/questions.component';
import { MyTableComponent } from './datasource-kok/datasource-kok.component';

export const routes: Routes = [
  {
    path: 'anki',
    component: AnkiComponent,
    title: 'Anki page'
  },
  {
    path: 'questions',
    component: QuestionsComponent,
    title: 'questions page'
  },
  {
    path: 'blog/:id',
    component: BlogComponent,
    title: 'Blog page'
  },
  {
    path: 'blogs',
    component: BlogsComponent,
    title: 'Blogs page'
  },
  {
    path: 'ds',
    component: MyTableComponent,
    title: 'ds'
  },

];
