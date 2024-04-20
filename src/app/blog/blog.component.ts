import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogInfo } from '../blog';
import { Subject, Observable, of, throwError, debounceTime, distinctUntilChanged, filter, switchMap, finalize, BehaviorSubject } from 'rxjs';
import { BlogsService } from '../blogs.service';
import { AsyncPipe, CommonModule } from '@angular/common'; // Add this import
import { Router } from '@angular/router';
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements  OnInit {
  blogId?: string;
  blogInfo?: BlogInfo;
  constructor(private blogsService: BlogsService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.blogId = params['id'];
      const intId = parseInt(params['id']);
      this.blogsService.getBlog(intId).subscribe((result) => {
        this.blogInfo = result;
      });
    });
  }

  markRead() {
    const firstItem = this.blogInfo?.items[0];
    const lastRead = firstItem.published;
    const intBlogId = parseInt(this.blogId || "0");
    console.log("markRead", this.blogId, lastRead);
    this.blogsService.markRead([intBlogId], lastRead).subscribe((result) => {
      console.log("marked read", result);
      // navigate back to index
      this.router.navigate(['/blogs']);
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
