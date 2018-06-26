import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
    //user
    public _msg_user_logout = 'Bạn có chắc là muốn đăng xuất?';
    //account 
    public _msg_account_change_password = 'Bạn sẽ cần đăng nhập lại nếu như thay đổi mật khẩu';
    public _msg_account_incorrect_password = 'Mật khẩu mới không chính xác';
    public _msg_account_empty_password = 'Bạn chưa nhập mật khẩu mới';
    public _msg_account_confirm_update = 'Bạn có chắc là muốn thay đổi thông tin trên';
    public _msg_account_auto_logout = 'Bạn cần đăng nhập lại';
    //login
    public _msg_login_failed = 'Đăng nhập không thành công, vui lòng kiểm tra lại!';
    public _msg_loading = 'Vui lòng chờ ...';
    //ticket
    public _msg_ticket_confirm = 'Bạn có chắc là muốn thực hiện hành động này';
    public _msg_ticket_go_view = 'Bạn có muốn đến phiếu vừa tạo không?';
    public _msg_ticket_not_found = 'Không tìm thấy phiếu';
    //settings
    public _msg_setting_disable_notification = 'Lưu ý: Bạn sẽ không nhận được thông báo';
    
    //common
    public _msg_update_success = 'Cập nhật thành công';
    
}