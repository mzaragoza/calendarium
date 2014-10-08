class ManagerController < ApplicationController
  before_filter :authenticate_manager!
  layout 'managers/default'
  before_filter :check_manager_active
  private
  def check_manager_active
    unless current_manager.active
      flash[:notice]= t(:admin_not_active)
      sign_out current_manager
      redirect_to new_manager_session_path
    end
  end
end
