import { Component } from '@angular/core';
import { BlogsService } from '../blogs.service';
import { Subject, Observable, of, throwError, debounceTime, distinctUntilChanged, filter, switchMap, finalize, BehaviorSubject } from 'rxjs';
import { BlogItem, BlogResult } from '../blog';
import {NgIf, UpperCasePipe} from '@angular/common';
import { AsyncPipe, CommonModule } from '@angular/common'; // Add this import
@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [NgIf, UpperCasePipe,  CommonModule, AsyncPipe],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  result?: Observable<BlogResult>;
  constructor(private blogsService: BlogsService) { }

  ngOnInit(): void {
    this.result = this.blogsService.getBlogs()
  }
}
