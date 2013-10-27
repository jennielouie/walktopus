class AddWalkId < ActiveRecord::Migration
  def change
    add_column :comments, :walk_id, :integer
  end

def up
end

  def down
  end
end
