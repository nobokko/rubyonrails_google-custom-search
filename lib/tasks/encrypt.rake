# frozen_string_literal: true

require 'optparse'
require './app/helpers/custom_search_helper'
# include Rails.application.routes.custom_search_helper

desc '暗号化処理の実行'
task :encrypt do
  argv = ARGV.dup
  argv.delete '--' if argv.include? '--'

  options = {}

  OptionParser.new do |o|
    o.banner = "Usage: #{$PROGRAM_NAME} [options]"
    o.on('--password=OPT', 'secret key') { |v| options[:password] = v }
    o.on('--data=OPT', 'any string') { |v| options[:data] = v }
  end.parse!(argv)

  salt = '\xC61e\x14\xB9\xA9\xB0\x90'
  (base64_key, base64_iv, base64_encrypted_value) = CustomSearchHelper.encrypt_and_base64encode(
    salt,
    options[:password],
    options[:data]
  )
  p "key      : #{base64_key.chomp}"
  p "iv       : #{base64_iv.chomp}"
  p "encrypted: #{base64_encrypted_value.chomp}"
end
