class Users::SessionsController < Devise::SessionsController
  layout 'users/login'
  private
  def after_sign_in_path_for(resource)
    users_dashboard_path
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end
end

