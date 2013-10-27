class CreateWalks < ActiveRecord::Migration
  def change
    create_table :walks do |t|
      t.string :start
      t.string :end
      t.timestamps
    end
  end
end
