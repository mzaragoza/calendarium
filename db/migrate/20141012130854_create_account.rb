class CreateAccount < ActiveRecord::Migration
  def change
    create_table :plans  do |t|
      t.boolean  :active,    default: true
      t.boolean  :featured,  default: false
      t.decimal  :price,     precision: 8, scale: 2
      t.string   :name,      default: ""
      t.string   :slug,      default: ""
      t.timestamps
    end
    create_table :accounts do |t|
      t.integer  :plan_id
      t.string   :name,               default: "",   null: false
      t.string   :logo,               default: "",   null: false
      t.string   :address,            default: "",   null: false
      t.string   :address2,           default: "",   null: false
      t.string   :city,               default: "",   null: false
      t.string   :state,              default: "",   null: false
      t.string   :zip,                default: "",   null: false
      t.string   :phone,              default: "",   null: false
      t.string   :website,            default: "",   null: false
      t.boolean  :active,             default: true, null: false
      t.string   :stripe_customer_id, default: "",   null: false
      t.text     :stripe_customer,    default: "",   null: false
      t.string   :email,              default: "",   null: false
      t.timestamps
    end

  create_table :subscriptions do |t|
    t.string   :account_id
    t.integer  :plan_id
    t.string   :name,                        default: ""
    t.decimal  :price,                       precision: 8, scale: 2
    t.string   :stripe_subscription_id,      default: ""
  end
  end
end
