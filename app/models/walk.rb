class Walk < ActiveRecord::Base
  attr_accessible :start, :end, :id
  has_many :comments
end
