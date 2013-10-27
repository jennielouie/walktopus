class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.date :date
      t.string :time_of_day
      t.text :street_comment
      t.string :username
      t.references :street
      t.timestamps
    end
  end
end
