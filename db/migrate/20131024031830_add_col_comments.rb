class AddColComments < ActiveRecord::Migration
  def change
    add_column :comments, :street_name, :string
  end

def up
end

  def down
  end
end
