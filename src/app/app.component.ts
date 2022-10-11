import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription} from "rxjs";
import AnimeJson from '../assets/AnimeJson.json';

class Anime {
  title: string;
  cover: string;
  date: Date;

  subscription: Subscription;

  private milliSecondsInASecond = 1000;
  private hoursInADay = 24;
  private minutesInAnHour = 60;
  private SecondsInAMinute = 60;

  private timeDifference = 0;
  remainingSeconds = 0;
  remainingMinutes = 0;
  remainingHours = 0;
  remainingDays = 0;

  constructor(data: any, now: Date) {
    this.title = data?.title;
    this.cover = 'assets/covers/' + data?.cover;

    // Sets the new airing date
    this.date = new Date();

    const days = data?.weekday < now.getDay() ? ((data?.weekday + 7) - now.getDay()) : (data?.weekday - now.getDay());

    this.date.setHours(days * this.hoursInADay + data?.hour);
    this.date.setMinutes(data?.minute - this.date.getTimezoneOffset());
    this.date.setSeconds(0);

    if (this.date < now) {
      this.date.setHours(7 * this.hoursInADay + this.date.getHours());
    }

    // Create the subscription to update the remaining time variables
    this.subscription = interval(1000).subscribe(() => {
      this.getTimeDifference();
    });
  }

  private getTimeDifference() {
    this.timeDifference = this.date.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: number) {
    this.remainingSeconds = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.remainingMinutes = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.remainingHours = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.remainingDays = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  now: Date = new Date();
  animeList: Anime[] = [];

  ngOnInit(): void {
    const now = new Date();
    this.animeList = AnimeJson
      .map(value => new Anime(value, now))
      .sort(function (a, b): any {
        return (a.date.getTime() - b.date.getTime());
      });
  }

  ngOnDestroy(): void {
    this.animeList.forEach(anime => anime.subscription.unsubscribe());
  }
}
