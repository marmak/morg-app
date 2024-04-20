import { Component } from '@angular/core';
import { BlogsService } from '../blogs.service';
import { Subject, Observable, of, throwError, debounceTime, distinctUntilChanged, filter, switchMap, finalize, BehaviorSubject } from 'rxjs';
import { BlogItem, BlogResult, LastReadUpdate } from '../blog';
import {NgIf, UpperCasePipe} from '@angular/common';
import { AsyncPipe, CommonModule } from '@angular/common'; // Add this import
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [NgIf, UpperCasePipe,  CommonModule, AsyncPipe, RouterModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  result?: Observable<BlogResult>;
  constructor(private blogsService: BlogsService, private router: Router) { }

  ngOnInit(): void {
    this.result = this.blogsService.getBlogs()
  }

  markRead() {
    this.result?.subscribe((result) => {
      let updates = result.items.map((item) => {
        if (new Date(item.published) > new Date()) {
          console.log("item published in the future", item.published);
          return {blogId: item.blog_id, lastRead: new Date().toISOString()};
        } else {
          return {blogId: item.blog_id, lastRead: item.published};
        }
      });
      // unique updates by blogId
      updates = updates.filter((value, index, self) => self.map((x) => x.blogId).indexOf(value.blogId) === index);
      console.log("markRead", updates);
      this.blogsService.markRead(updates).subscribe((result) => {
        console.log("marked read", result);
        this.router.navigate(['/blogs']);
      });
    });

  }
  
  formatDate(date: Date) {
    // format as DD HH:MM
    date = new Date(date);
    const tzo = date.getTimezoneOffset() / 60; // timezone offset in hours
    // minutes with leading zero
    let minutes = date.getMinutes();
    let minutesString = minutes.toString();
    if (minutes < 10) {
      minutesString = "0" + minutesString;
    }
    let hours = date.getHours();
    let hoursString = hours.toString();
    if (hours < 10) {
      hoursString = "0" + hoursString;
    }
    let formatted = date.getDate() + " " + hoursString  + ":" + minutesString + " (" + tzo + ")";
    return formatted;
  }

}
