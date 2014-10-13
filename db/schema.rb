# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141013190658) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: true do |t|
    t.integer  "plan_id"
    t.string   "name",               default: "",   null: false
    t.string   "logo",               default: "",   null: false
    t.string   "address",            default: "",   null: false
    t.string   "address2",           default: "",   null: false
    t.string   "city",               default: "",   null: false
    t.string   "state",              default: "",   null: false
    t.string   "zip",                default: "",   null: false
    t.string   "phone",              default: "",   null: false
    t.string   "website",            default: "",   null: false
    t.boolean  "active",             default: true, null: false
    t.string   "stripe_customer_id", default: "",   null: false
    t.text     "stripe_customer",    default: "",   null: false
    t.string   "email",              default: "",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "managers", force: true do |t|
    t.string   "email",                  default: "",   null: false
    t.string   "encrypted_password",     default: "",   null: false
    t.string   "first_name",             default: "",   null: false
    t.string   "last_name",              default: "",   null: false
    t.string   "address",                default: "",   null: false
    t.string   "city",                   default: "",   null: false
    t.string   "state",                  default: "",   null: false
    t.string   "zip",                    default: "",   null: false
    t.string   "phone",                  default: "",   null: false
    t.string   "photo",                  default: "",   null: false
    t.boolean  "active",                 default: true, null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,    null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        default: 0,    null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "managers", ["confirmation_token"], name: "index_managers_on_confirmation_token", unique: true, using: :btree
  add_index "managers", ["email"], name: "index_managers_on_email", unique: true, using: :btree
  add_index "managers", ["reset_password_token"], name: "index_managers_on_reset_password_token", unique: true, using: :btree
  add_index "managers", ["unlock_token"], name: "index_managers_on_unlock_token", unique: true, using: :btree

  create_table "plans", force: true do |t|
    t.boolean  "active",                             default: true
    t.boolean  "featured",                           default: false
    t.decimal  "price",      precision: 8, scale: 2
    t.string   "name",                               default: ""
    t.string   "slug",                               default: ""
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "subscriptions", force: true do |t|
    t.string  "account_id"
    t.integer "plan_id"
    t.string  "name",                                           default: ""
    t.decimal "price",                  precision: 8, scale: 2
    t.string  "stripe_subscription_id",                         default: ""
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.boolean  "active",                 default: true,  null: false
    t.boolean  "is_admin",               default: false, null: false
    t.boolean  "is_owner",               default: false, null: false
    t.string   "account_id",             default: "",    null: false
    t.string   "first_name",             default: "",    null: false
    t.string   "last_name",              default: "",    null: false
    t.string   "phone",                  default: "",    null: false
    t.string   "photo",                  default: "",    null: false
    t.boolean  "agree_newsletter",       default: true,  null: false
    t.string   "created_by_id",          default: ""
    t.string   "updated_by_id",          default: ""
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        default: 0,     null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree

end
