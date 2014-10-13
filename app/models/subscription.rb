class Subscription < ActiveRecord::Base
  include ActionView::Helpers::NumberHelper

  belongs_to :account
  belongs_to :plan
end


