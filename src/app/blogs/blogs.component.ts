import { Component } from '@angular/core';
import { BlogsService } from '../blogs.service';
import { Subject, Observable, of, throwError, debounceTime, distinctUntilChanged, filter, switchMap, finalize, BehaviorSubject } from 'rxjs';
import { BlogItem, Blog, BlogResult, LastReadUpdate } from '../blog';
import {NgIf, UpperCasePipe} from '@angular/common';
import { AsyncPipe, CommonModule } from '@angular/common'; // Add this import
import { RouterModule, Router } from '@angular/router';
@Component({
    selector: 'app-blogs',
    imports: [NgIf, UpperCasePipe, CommonModule, AsyncPipe, RouterModule],
    templateUrl: './blogs.component.html',
    styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  result?: Observable<BlogResult>;
  hoveredBlog?: Blog = undefined;
  hoveredItems? : any[];
  streamingData = '';
  lastVisit? = new Date();
  visitCount = 0;
  
  constructor(private blogsService: BlogsService, private router: Router) { }

  ngOnInit(): void {
    this.result = this.blogsService.getBlogs();
    this.lastVisit = new Date();
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('lastVisitDate');

    if (storedDate !== today) {
      this.visitCount = 1;
      localStorage.setItem('lastVisitDate', today);
    } else {
      let intVisitCount = localStorage.getItem('visitCount');
      this.visitCount = intVisitCount ? parseInt(intVisitCount) + 1 : 1;
    }

    localStorage.setItem('visitCount', String(this.visitCount));
    localStorage.setItem('lastVisit', this.lastVisit.toISOString());
  }
  
  checkHover(event: MouseEvent, blog: any): void {
    // if (event.ctrlKey) {
      this.showInfo(blog);
      // this.executeFunction(blog);
    // }
  }

  showInfo(blog: Blog): void {
    this.hoveredBlog = blog;
    const blogId = blog.blog_id;
    this.blogsService.getBlog(blogId).subscribe((result) => {
      // get only item unreads (unread: true)
      this.hoveredItems = result.items.filter((item) => item.unread);
    });
  }

  summarize(url: string) {
    this.blogsService.kagiSummarize(url).subscribe(
      (result) => {
        console.log("summarize", result);

        const start = result.indexOf('<ul>');
        const end = result.indexOf('</ul>');
        if (start !== -1 && end !== -1) {
          let resultString = "<ul>" + result.substring(start + 4, end) + "</ul>";
          // remove all \n
          resultString = resultString.replace(/\\n/g, '');
          console.log("summarize", resultString);
          this.streamingData = resultString;
        }
      }
    );
  }  
  hideInfo(): void {
    // this.hoveredBlog = undefined;
  }

  markReadBlog(): void {
    const firstItem = this.hoveredItems?.find((item) => new Date(item.published) <= new Date());
    const lastRead = firstItem.published;
    const intBlogId = this.hoveredBlog?.blog_id || 0;
    const update = [{blogId: intBlogId, lastRead: lastRead}];
    console.log("markRead", update);
    this.blogsService.markRead(update).subscribe((result) => {
      console.log("marked read", result);
      this.hoveredBlog = undefined;
      this.result = this.blogsService.getBlogs();
    });
    
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
        // this.router.navigate(['/blogs']);
        this.result = this.blogsService.getBlogs()
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
