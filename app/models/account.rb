class Account < ActiveRecord::Base
  #store :stripe_customer
  serialize :stripe_customer, JSON

  #has_many :dues
  belongs_to :plan
  scope :active, -> { where(:active => true) }

  #mount_uploader :logo, PhotoUploader
  def full_address
    self.address + ' ' + self.address2 + ' ' + self.city + ' ' + self.state + ' ' + self.zip
  end

  def customer
    customer ||= Stripe::Customer.retrieve(self.stripe_customer_id)
  end

end


