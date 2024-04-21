import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogInfo } from '../blog';
import { Subject, Observable, of, throwError, debounceTime, distinctUntilChanged, filter, switchMap, finalize, BehaviorSubject } from 'rxjs';
import { BlogsService } from '../blogs.service';
import { AsyncPipe, CommonModule } from '@angular/common'; // Add this import
import { Router } from '@angular/router';
import { HttpHeaders, HttpEventType} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements  OnInit {
  blogId?: string;
  blogInfo?: BlogInfo;
  streamingData = 'empty';
  summarizeLink: string = "";
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
  markRead() {
    const firstItem = this.blogInfo?.items.find((item) => new Date(item.published) <= new Date());
    const lastRead = firstItem.published;
    const intBlogId = parseInt(this.blogId || "0");
    const update = [{blogId: intBlogId, lastRead: lastRead}];
    console.log("markRead", update);
    this.blogsService.markRead(update).subscribe((result) => {
      console.log("marked read", result);
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
