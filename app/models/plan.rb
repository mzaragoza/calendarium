class Plan < ActiveRecord::Base
  include ActionView::Helpers::NumberHelper
  has_many :subscriptions
  has_many :accounts

  validates_uniqueness_of :slug, :case_sensitive => false

  scope :active, lambda { where(active: true) }

  def display_name
    (self.name + ' ' + number_to_currency(self.price) + ' per month ').titleize
  end
end

