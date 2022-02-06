# README

# 事前準備

1. 「[Custom Search JSON API](https://developers.google.com/custom-search/v1/overview?hl=ja)」を利用します。APIのキーはサーバーを立てる人が用意する必要があります。
1. 「[Programmable Search Engine](https://programmablesearchengine.google.com/about/)」の「検索エンジン ID」を利用します。APIのキーと同様、サーバーを立てる人が用意する必要があります。
1. 環境設定（これらが動作している環境、もしくはDocker等を利用する必要があります）
    1. Ruby 3.0.3
    1. rails 6.1.4.1
    1. nodejs/stable,stable-security,now 12.22.5~dfsg-2~11u1 amd64
    1. npm/stable,now 7.5.2+ds-2 all
    1. yarn@1.22.17

# setup

## 設定ファイルの準備

config/google_apis.yml.sample
を
config/google_apis.ymlにリネームします。
その後、用意したAPIキーを下記暗号化ツールで変換し、出力された各々の値を設定します。

## 環境構築

```sh
bin/init
```
を実行します。shellの動作しない環境の場合はテキストエディタ等でbin/initの中のコマンドを適宜読み替えながら実行してください。

## Dockerfileとdocker-compose.ymlを用意してあります。

```sh
docker-compose -f "docker-compose.yml" up -d --build
```

このDockerfileは「[Google Cloud PlatformのCloud Run](https://console.cloud.google.com/run)」で動作させる前提で用意したものです。基本的にそのままの状態でCloud Runでサーバー立ち上げ可能です。

# tasks

## 暗号化ツール

APIキーを暗号化します。
config/google_apis.ymlの
api_encrypt_ivおよびencrypt_api_keyにそれぞれiv,encryptedを設定します。
また、keyは「API実行時の鍵」として利用者へ通知します。

### 実行例：passwordを「secret」、APIキーが「apikey」の場合

```sh
bin/rails encrypt -- --password=secret --data=apikey

"key      : xC5nDoWC4gd8NYff3FLqDl9UEp6H6WW3iUHc8I+aKpM="
"iv       : ZpHlZexVpB/cso1cFNmvEg=="
"encrypted: X7rEFTZlmq9AiDOdnDKYkw=="
```

# server

サーバーの起動は以下のコマンドで行えます。
```sh
bin/start
```

環境変数「PORT」を設定するとその値でサーバーのportが開きます。

# サーバー機能説明

## /custom_search/

### 初期状態

![初期状態](/readme_images/screenshot_4c094d2b-ffd4-4600-bc40-e3212430c3e3.png)

Search及びSettingはクリックする事に開閉します。
初期状態はSearchは開いた状態、Settingは閉じた状態です。

### 画面利用時の設定

![Settingの初期状態](/readme_images/screenshot_4b5f8f63-1874-42a3-8db3-8c3db8166af9.png)

Setttingを開くと「API実行時の鍵」「ダミーを使用する」の項目が表示されます。

* API実行時の鍵
    * 通知された（暗号化ツールで生成した）キーを入力します。
* ダミーを使用する
    * 無効（灰色）の場合、サーバーでは「Custom Search JSON API」が実行されます。API実行時の鍵が合わない場合はエラーします。
    * 有効（緑）の場合、サーバーではCustom Search JSON APIを「Ruby on Rails」で予め実行し、結果を保存した情報を常に返すようになります。
    * デフォルトは有効です。

### 検索方法

「GoogleAPIで検索」の欄に任意の文字列を入力し、エンターを入力するか虫眼鏡の画像をクリックすると検索が始まります。

- この際、BASIC認証の問い合わせが発生します。ソースに直に埋めている為ここにも記載してしまいますが、「admin / admin」です。

検索結果が取得できない場合はエラーとなります。（スクリーンショットをケチってしまいましたが、実際は画面の中央に表示されます。）一定時間経過するかクリックするとこの表示は消えます。
![error](/readme_images/screenshot_b870886b-e0d0-4c4f-be9c-2fd55be78eae.png)

検索結果が取得できた場合は最大10件がタイル状（左→右、上→下）に表示されます。
![success](/readme_images/screenshot_c3d7e861-8014-4795-94d5-d9ed86ce84ba.png)

検索結果が取得できた場合で取得した10件以降の情報がありそうな場合は「続きを読み込む」ボタンが表示されます。押すと引き続き検索が行われます。
この際Settingを編集していた場合も初回検索時の設定を引き継ぎます。

![続きを読み込むボタン](/readme_images/screenshot_57fffcb7-e72d-4623-9d4b-ee3899296424.png)

![続きを読み込むボタンを押した後](/readme_images/screenshot_da92a60c-bfe5-418f-b0e7-3b2c82944647.png)

## 開発環境

* Visual Studio Code
    * [Ruby](https://marketplace.visualstudio.com/items?itemName=rebornix.Ruby)
    * [Ruby Solargraph](https://marketplace.visualstudio.com/items?itemName=castwide.solargraph)
    * [Ruby Test Explorer](https://marketplace.visualstudio.com/items?itemName=connorshea.vscode-ruby-test-adapter)
    * [YARD Documenter](https://marketplace.visualstudio.com/items?itemName=pavlitsky.yard)
    * [Jest Test Explorer](https://marketplace.visualstudio.com/items?itemName=kavod-io.vscode-jest-test-adapter)
    * [Beautify css/sass/scss/less](https://marketplace.visualstudio.com/items?itemName=michelemelluso.code-beautifier)

余談ですがRuby Test ExplorerとJest Test Explorerが競合ではなく共存できたのが感動しました。単一のTestingでどちらと区別なく実行できました。

## サンプルサイト

期間限定公開

https://rubyonrailsgoogle-custom-search-dj3bvuqbva-an.a.run.app/custom_search/
