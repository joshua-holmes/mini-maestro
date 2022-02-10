class Api::TunesController < ApplicationController

  def create
    tune = @current_user.tunes.create!(tune_params)
    render json: tune, status: :created
  end

  def destroy
    tune = @current_user.tunes.find(params[:id])
    tune.destroy
    render head: :no_content
  end

  def update
    tune = @current_user.tunes.find(params[:id])
    tune.update!(tune_params)
    render json: tune
  end

  private

  def tune_params
    params.permit :abc
  end

end
