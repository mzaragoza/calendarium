class Managers::ManagersController < ManagerController
  before_filter :check_password_submitted, :only => :update
  expose(:managers){ Manager.order("id DESC").scoped{} }
  expose(:manager)

  def create
    if Manager.new(params[:manager]).save
      flash[:notice] = t(:manager_was_successfully_created)
      redirect_to(managers_managers_path)
    else
      render :new
    end
  end

  def update
    if manager.update_attributes(params[:manager])
      flash[:notice] = t(:manager_was_successfully_updated)
      redirect_to(managers_managers_path)
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
