class Managers::SessionsController < Devise::SessionsController
  layout 'managers/login'
  private
  def after_sign_in_path_for(resource)
    managers_dashboard_path
  end

  def after_sign_out_path_for(resource_or_scope)
    new_manager_session_path
  end
end

