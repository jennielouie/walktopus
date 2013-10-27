class Comment < ActiveRecord::Base
  attr_accessible :date, :time_of_day, :street_comment, :username, :street_name
  belongs_to :walks

end
