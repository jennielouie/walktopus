class FixColumnName < ActiveRecord::Migration
  def up
  end

def change
  rename_column :streets, :steet_city, :street_city
end


  def down
  end
end
