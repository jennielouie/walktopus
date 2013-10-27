class WalksController < ApplicationController
    def search
      @comments = Comment.where(street_name: (params[:street_name]))
    end

    def index
      @walks = Walk.all
    end

    def new
      @walk = Walk.new

    end

    def create
      new_walk = Walk.create(params[:walk])
      redirect_to walk_path(new_walk)
    end

    def show
      @walk = Walk.find(params[:id])
      @comments = Comment.where(street_name: (params[:street_name]))
    end

end

