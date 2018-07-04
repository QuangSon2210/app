import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { CookieService } from 'angular2-cookie/core';

import { GetFirstCharacter } from '../pipes/get-first-character.pipe';
import { GetFirstLastCharacter} from '../pipes/get-first-last-character.pipe';
import { ConvertLengthTitle } from '../pipes/convert-length-title.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { ConvertTime } from '../pipes/convert-time.pipe';
import { ConvertTimeListTicket } from '../pipes/convert-time-list-ticket.pipe';
import { SearchFilter } from '../pipes/search-filter.pipe';
import { GroupByPipe } from '../pipes/group-by.pipe';
import { HighlightPipe } from '../pipes/highlight-search.pipe';

export function cookieServiceFactory() {
  return new CookieService();
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,

    GetFirstCharacter,
    GetFirstLastCharacter,
    ConvertLengthTitle,
    ConvertTime,
    ConvertTimeListTicket,
    SearchFilter,
    SafeHtmlPipe,
    GroupByPipe,
    HighlightPipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
  ],
  exports: [
    GetFirstCharacter,
    GetFirstLastCharacter,
    ConvertLengthTitle,
    ConvertTime,
    ConvertTimeListTicket,
    SearchFilter,
    SafeHtmlPipe,
    GroupByPipe,
    HighlightPipe,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    FCM,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: CookieService, useFactory: cookieServiceFactory },
  ]
})
export class AppModule {}
