# frozen_string_literal: true

require 'openssl'
require 'base64'

# custom_search
module CustomSearchHelper
  # https://docs.ruby-lang.org/ja/latest/class/OpenSSL=3a=3aCipher.html


  #
  # AES-256-CBC
  #
  # @return [Cipher] AES-256-CBC Cipher
  #
  def self.aes256cbc
    OpenSSL::Cipher.new('AES-256-CBC')
  end

  #
  # 暗号化の準備(AES-256-CBC)
  #
  # @param [String] salt OpenSSL::Random.random_bytes(8)
  # @param [String] pass 任意の文字列
  #
  # @return [Array] OpenSSL::Cipher,String,String
  #
  def self.aes256cbc_enc(salt, pass)
    # 暗号化器を作成する
    enc = aes256cbc
    enc.encrypt
    # 鍵とIV(Initialize Vector)を PKCS#5 に従ってパスワードと salt から生成する
    key_iv = OpenSSL::PKCS5.pbkdf2_hmac_sha1(pass, salt, 2000, enc.key_len + enc.iv_len)
    # 鍵とIVを設定する
    key = key_iv[0, enc.key_len]
    enc.key = key
    iv = key_iv[enc.key_len, enc.iv_len]
    enc.iv = iv
    [enc, key, iv]
  end

  #
  # 暗号化(AES-256-CBC)
  #
  # @param [String] salt
  #   OpenSSL::Random.random_bytes(8)
  # @param [String] pass
  #   任意の文字列
  # @param [String] data
  #   暗号化対象の文字列
  #
  # @return [Array]
  #   String 暗号化キー
  #   String 暗号化IV
  #   String 暗号化した暗号化対象の文字列
  #
  def self.encrypt(salt, pass, data)
    (enc, key, iv) = aes256cbc_enc(salt, pass)
    # 暗号化する
    # encrypted_data = ''
    encrypted_data = enc.update(data) + enc.final

    [key, iv, encrypted_data]
  end

  #
  # 暗号化(AES-256-CBC)とBase64エンコード
  #
  # @param [String] salt
  #   OpenSSL::Random.random_bytes(8)
  # @param [String] pass
  #   任意の文字列
  # @param [String] data
  #   暗号化対象の文字列
  #
  # @return [Array]
  #   String Base64エンコードした暗号化キー
  #   String Base64エンコードした暗号化IV
  #   String Base64エンコードした暗号化した暗号化対象の文字列
  #
  def self.encrypt_and_base64encode(salt, pass, data)
    (key, iv, encrypted_data) = encrypt(salt, pass, data)
    [Base64.encode64(key), Base64.encode64(iv), Base64.encode64(encrypted_data)]
  end

  #
  # 復号化
  #
  # @param [String] key
  #   暗号化キー
  # @param [String] iv
  #   暗号化IV
  # @param [String] encrypted_value
  #   暗号化された復号対象の文字列
  #
  # @return [String] 暗号化された文字列を復号した文字列
  #
  def self.decrypt(key, iv, encrypted_value)
    dec = aes256cbc
    dec.decrypt
    # 暗号化した際の鍵とIVを設定する
    dec.key = key
    dec.iv = iv
    # 復号化を行う
    dec.update(encrypted_value) + dec.final
  end

  #
  # Base64デコードと復号化
  #
  # @param [String] base64_key
  #   Base64エンコードされた暗号化キー
  # @param [String] base64_iv
  #   Base64エンコードされた暗号化IV
  # @param [String] base64_encrypted_data
  #   Base64エンコードされた暗号化された復号対象の文字列
  #
  # @return [String]
  #   Base64エンコードされた暗号化された文字列を復号した文字列
  #
  def self.base64decode_and_decrypt(base64_key, base64_iv, base64_encrypted_data)
    key = Base64.decode64(base64_key)
    iv = Base64.decode64(base64_iv)
    encrypted_data = Base64.decode64(base64_encrypted_data)
    data = decrypt(key, iv, encrypted_data)
  rescue ArgumentError => e
    data = ''
  ensure
    data
  end
end
