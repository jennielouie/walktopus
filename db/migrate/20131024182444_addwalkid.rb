class Addwalkid < ActiveRecord::Migration
  def change
    add_column :comments, :walk_id, :integer
  end

end
