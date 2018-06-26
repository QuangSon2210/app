import { Injectable } from '@angular/core';

@Injectable()
export class SettingService {
	//public _baseAPIUrl = "http://localhost:8000/api/v1/";
    //public _baseUrl= "http://localhost:8000";
    public _baseAPIUrl = "https://webapp-api.midesk.vn/api/v1/";
    public _baseUrl= "https://webapp-api.midesk.vn/";
    //Authentication
    public _api_auth_login = this._baseAPIUrl + "login";
    public _api_auth_logout = this._baseAPIUrl + "logout";
    //user service
    public _api_requester_getList = this._baseAPIUrl + 'getListRequester';
    public _api_user_getListTeam = this._baseAPIUrl + 'getListTeam';
    public _api_user_getUserInTeam = this._baseAPIUrl + 'getUserInTeam/';
    public _api_requester_search = this._baseAPIUrl + 'searchRequester';
    public _api_assigner_search = this._baseAPIUrl + 'searchAssigner';
    public _api_user_getListUserTeam = this._baseAPIUrl + 'getListUserTeam';
    public _api_user_update_profile = this._baseAPIUrl + 'updateUserProfile';
    public _api_user_update_fcm_token = this._baseAPIUrl + 'updateFCMToken';
    public _api_user_get_name = this._baseAPIUrl + 'getUserName/';
    public _api_user_update_notify = this._baseAPIUrl + 'updateNotify';
    //--
    //ticket service
    public _api_ticket_getList = this._baseAPIUrl + 'getListTicket';
    public _api_ticket_getDetail = this._baseAPIUrl + 'getTicketDetail/';
    public _api_priority_getList = this._baseAPIUrl + 'getPriority';
    public _api_tags_getList = this._baseAPIUrl + 'getTagsByGroup';
    public _api_category_getList = this._baseAPIUrl + 'getTicketCategory/';
    public _api_search_ticket = this._baseAPIUrl + 'searchTicket';
    public _api_create_ticket = this._baseAPIUrl + 'createTicket';
    public _api_action_ticket = this._baseAPIUrl + 'actionTicket';
    public _api_ticket_contact = this._baseAPIUrl + 'getTicketByContact/';
    public _api_count_ticket = this._baseAPIUrl + 'countTicket';
    public _api_trash_or_resolve_ticket = this._baseAPIUrl + 'trashOrResolveTicket';
    public _api_delete_ticket = this._baseAPIUrl + ' deleteTicket/';
    public _api_get_macro = this._baseAPIUrl + 'getMacro';
    public _api_get_category_name = this._baseAPIUrl + 'getCategoryName/';
    //--
    //contact service
    public _api_contact_getList = this._baseAPIUrl + 'getListContact/';
    public _api_contact_profile = this._baseAPIUrl + 'getContactProfile/';
    public _api_contact_update = this._baseAPIUrl + 'updateContact';
    public _api_contact_add = this._baseAPIUrl + 'addContact';
    public _api_contact_search = this._baseAPIUrl + 'searchContact';
    //--
    //customer service
    public _api_customer_getList = this._baseAPIUrl + 'getCustomer/';
    //--
    //notifications service
    public _api_notifications_getList = this._baseAPIUrl + 'getListNotification/';
    public _api_notifications_updateView = this._baseAPIUrl + 'updateViewNotify/';
    public _api_notifications_deleteView = this._baseAPIUrl + 'deleteViewNotify/';
    public _api_notifications_countNewNotify = this._baseAPIUrl + 'countNewNotifications';
    //fcm notifications
    public _api_fcm_notification = 'https://fcm.googleapis.com/fcm/send';

}