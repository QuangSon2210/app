import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TicketAddPage } from './../pages/ticket/ticket-add/ticket-add';
import { TicketDetailPage } from './../pages/ticket/ticket-detail/ticket-detail';
import { SettingPage } from './../pages/setting/setting';
import { NotificationsPage } from './../pages/notifications/notifications';
import { AccountPage } from './../pages/account/account';
import { ContactPage } from './../pages/contact/contact';
import { ContactAddPage } from './../pages/contact/contact-add/contact-add';
import { ContactProfilePage } from './../pages/contact/contact-profile/contact-profile';
import { ContactSearchPage } from './../pages/contact/contact-search/contact-search';

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

import { ModalAssign } from '../components/modal/modal-assign/modal-assign';
import { ModalRequester } from '../components/modal/modal-requester/modal-requester';
import { ModalProperties } from '../components/modal/modal-properties/modal-properties';
import { ModalMacro } from '../components/modal/modal-macro/modal-macro';
import { MacroDetail } from '../components/modal/modal-macro/macro-detail/macro-detail';
import { ModalSearchTicket } from '../components/modal/modal-search-ticket/modal-search.component';
import { PopoverSort } from '../components/popover/popover-sort/popover-sort';
import { PopoverChannel } from '../components/popover/popover-channel/popover-channel';
import { PopoverCategory } from '../components/popover/popover-category/popover-category';
import { PopoverStatus } from '../components/popover/popover-status/popover-status';
import { PopoverPriority } from '../components/popover/popover-priority/popover-priority';

import { GetFirstCharacter } from '../pipes/get-first-character.pipe';
import { GetFirstLastCharacter} from '../pipes/get-first-last-character.pipe';
import { ConvertLengthTitle } from '../pipes/convert-length-title.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { ConvertTime } from '../pipes/convert-time.pipe';
import { ConvertTimeListTicket } from '../pipes/convert-time-list-ticket.pipe';
import { SearchFilter } from '../pipes/search-filter.pipe';
import { GroupByPipe } from '../pipes/group-by.pipe';
import { HighlightPipe } from '../pipes/highlight-search.pipe';

// v1 const config: SocketIoConfig = { url: 'https://socketprod.midesk.vn', options: {} };
const config: SocketIoConfig = { url: 'https://socketdev-v2.midesk.vn', options: {} };
export function cookieServiceFactory() {
  return new CookieService();
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TicketAddPage,
    TicketDetailPage,
    SettingPage,
    NotificationsPage,
    AccountPage,
    ContactPage,
    ContactAddPage,
    ContactProfilePage,
    ContactSearchPage,

    ModalAssign,
    ModalRequester,
    ModalProperties,
    ModalSearchTicket,
    ModalMacro,
    MacroDetail,

    PopoverSort,
    PopoverChannel,
    PopoverCategory,
    PopoverStatus,
    PopoverPriority,

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
    TicketAddPage,
    TicketDetailPage,
    SettingPage,
    NotificationsPage,
    AccountPage,
    ContactPage,
    ContactAddPage,
    ContactProfilePage,
    ContactSearchPage,

    ModalAssign,
    ModalRequester,
    ModalProperties,
    ModalSearchTicket,
    ModalMacro,
    MacroDetail,

    PopoverSort,
    PopoverChannel,
    PopoverCategory,
    PopoverStatus,
    PopoverPriority,
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
