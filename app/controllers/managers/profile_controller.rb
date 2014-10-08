class Managers::ProfileController < ManagerController
  before_filter :check_password_submitted, :only => :update
  expose(:manager){ current_manager }
  def update
    if manager.update_attributes(params[:manager])
      sign_in(current_manager, :bypass => true)
      flash[:notice] = t(:profile_was_successfully_updated)
      redirect_to manager_dashboard_path
    else
      render :edit
    end
  end

  private
  def check_password_submitted
    if params[:manager][:password].blank?
      params[:manager].delete("password")
      params[:manager].delete("password_confirmation")
      manager.updating_password = false
    else
      manager.updating_password = true
    end
  end
end

