import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogInfo, BlogSearchResult } from '../blog';
import { BlogsService } from '../blogs.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './blog.component.html',
    styleUrl: './blog.component.css'
})
export class BlogComponent implements  OnInit {
  blogId?: string;
  blogInfo?: BlogInfo;
  streamingData = 'empty';
  status?: number;
  summarizeLink: string = "";
  blogSearchQuery: string = "";
  blogSearchResults: BlogSearchResult[] = [];
  constructor(private blogsService: BlogsService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.blogId = params['id'];
      const intId = parseInt(params['id']);
      this.blogsService.getBlog(intId).subscribe((result) => {
        this.blogInfo = result;
        this.status = this.blogInfo!.blog.status;
      });
    });
  }

  summarize(url: string) {
    this.streamingData = 'Loading...';
    this.blogsService.kagiSummarize(url).subscribe(
      (result) => {
        // Extract all <ul>...</ul> blocks from the response
        const matches = result.match(/<ul>[\s\S]*?<\/ul>/g);
        if (matches) {
          this.streamingData = matches.join('').replace(/\\n/g, '');
        } else {
          // Fallback: show the raw response
          this.streamingData = result;
        }
      }
    );
  }

  blogSearch(url: string) {
    this.blogsService.searchBlogs(url).subscribe(
      (result) => {
        this.blogSearchResults = result;
      }
    );
  }

  updateStatus() {
    if (this.status === undefined || this.blogId === undefined) {
      return;
    }
    const intBlogId = parseInt(this.blogId);
    this.blogsService.updateStatus(intBlogId, this.status).subscribe(() => {
    });
  }

  markRead() {
    const firstItem = this.blogInfo?.items.find((item) => new Date(item.published) <= new Date());
    if (firstItem === undefined) {
      return;
    }
    const lastRead = firstItem.published;
    const intBlogId = parseInt(this.blogId || "0");
    const update = [{blogId: intBlogId, lastRead: lastRead}];
    this.blogsService.markRead(update).subscribe(() => {
      this.router.navigate(['/blogs']);
    });
  }

  formatDate(date: Date) {
    // format as DD HH:MM
    date = new Date(date);
    const tzo = date.getTimezoneOffset() / 60; // timezone offset in hours
    // minutes with leading zero
    const minutes = date.getMinutes();
    let minutesString = minutes.toString();

    if (minutes < 10) {
      minutesString = "0" + minutesString;
    }

    const hours = date.getHours();
    let hoursString = hours.toString();

    if (hours < 10) {
      hoursString = "0" + hoursString;
    }
    const formatted = date.getDate() + " " + hoursString  + ":" + minutesString + " (" + tzo + ")";
    return formatted;
  }

}
