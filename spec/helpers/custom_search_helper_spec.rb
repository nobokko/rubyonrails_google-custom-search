require 'rails_helper'

# Specs in this file have access to a helper object that includes
# the CustomSearchHelper. For example:
#
# describe CustomSearchHelper do
#   describe "string concat" do
#     it "concats two strings with spaces" do
#       expect(helper.concat_strings("this","that")).to eq("this that")
#     end
#   end
# end
RSpec.describe CustomSearchHelper, type: :helper do
  context 'when anything' do
    it 'is valid encrypt values' do
      # salt = OpenSSL::Random.random_bytes(8)
      salt = '\x90\xC61e\x14\xB9\xA9\xB0'
      (base64_key, base64_iv, base64_encrypted_value) = CustomSearchHelper.encrypt_and_base64encode(
        salt,
        'pass',
        'api key'
      )
      expect(base64_key.chomp).to eq('6eQF3+5ONTo0Oiy4BOvUa1sIHLqSkD/b+ctESshx6yo=')
      expect(base64_iv.chomp).to eq('BAUj3vvrUvr6t9eX2FkNPA==')
      expect(base64_encrypted_value.chomp).to eq('7P1D878nRpzN22R4NswcNQ==')
    end

    it 'is valid decrypt values' do
      api_key = CustomSearchHelper.base64decode_and_decrypt(
        '6eQF3+5ONTo0Oiy4BOvUa1sIHLqSkD/b+ctESshx6yo=',
        'BAUj3vvrUvr6t9eX2FkNPA==',
        '7P1D878nRpzN22R4NswcNQ=='
      )
      expect(api_key).to eq('api key')
    end
  end
end
