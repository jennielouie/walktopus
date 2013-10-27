class CommentsController < ApplicationController
    def search
      @comments = Comment.where(street_name: (params[:street_name]))
      @street_name =  (params[:street_name])
    end

    def index
      @comments = Comment.all
    end

    def new
      @comment = Comment.new
    end

    def create
      new_comment = Comment.create(params[:comment])
      redirect_to comments_path(new_comment)
    end

    def show
      @comment = Comment.find(params[:id])
    end

end
