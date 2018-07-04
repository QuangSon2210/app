import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { SettingService } from '../common/setting.service';
import { DataService } from '../common/data.service';
import { SocketService } from './../common/socket.service';
import { MessageService } from '../common/message.service';
import { UserService } from '../services/user.service';
import { ContactService } from '../services/contact.service';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../services/authentication/auth.service';
import { AuthRequestOptions } from '../services/authentication/auth-request.service';
import { NotificationsService } from '../services/notifications.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { CookieService } from 'angular2-cookie/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { GetFirstCharacter } from '../pipes/get-first-character.pipe';
import { GetFirstLastCharacter} from '../pipes/get-first-last-character.pipe';
import { ConvertLengthTitle } from '../pipes/convert-length-title.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { ConvertTime } from '../pipes/convert-time.pipe';
import { ConvertTimeListTicket } from '../pipes/convert-time-list-ticket.pipe';
import { SearchFilter } from '../pipes/search-filter.pipe';
import { GroupByPipe } from '../pipes/group-by.pipe';
import { HighlightPipe } from '../pipes/highlight-search.pipe';

const config: SocketIoConfig = { url: 'https://socketprod.midesk.vn', options: {} };
export function cookieServiceFactory() {
  return new CookieService();
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,

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
    SocketIoModule.forRoot(config),
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
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    FCM,
    SettingService,
    SocketService,
    DataService,
    MessageService,
    UserService,
    TicketService,
    ContactService,
    AuthService,
    NotificationsService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: CookieService, useFactory: cookieServiceFactory },
    { provide: RequestOptions, useClass: AuthRequestOptions },
  ]
})
export class AppModule {}
