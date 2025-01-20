# Googleログインデモ

## 概要
このプロジェクトは、GoogleのOAuth認証を使用したログインデモアプリケーションです。ユーザーがGoogleアカウントでログインし、その情報を表示できます。

## 技術スタック
- HTML
- JavaScript（Google API Client Library）
- Tailwind CSS
- PHP

## 機能
- Googleアカウントでのログイン/ログアウト
- ユーザー情報の表示
- レスポンシブデザイン

## ファイル構成
- `index.html` - メインのHTMLファイル（ログインUI）
- `auth.js` - Google認証関連のJavaScript処理
- `config.php` - PHP設定ファイル
- `.htaccess` - Apacheサーバーの設定ファイル（Google OAuth Client IDを含む）

## セットアップ
1. ファイルをWebサーバーのドキュメントルートに配置
2. Google Cloud Platformで以下の設定を行う：
   - プロジェクトの作成
   - OAuth 2.0クライアントIDの設定
   - 承認済みのJavaScript生成元とリダイレクトURIの設定
3. `.htaccess`ファイルにGoogle OAuth Client IDを設定
   ```apache
   # 以下は例です。実際のClient IDに置き換えてください
   SetEnv GOOGLE_CLIENT_ID your-client-id-here
   ```

## セキュリティ注意事項
- `.htaccess`ファイルには認証用のClient IDが含まれているため、このファイルを公開リポジトリにコミットしないでください
- `.gitignore`に`.htaccess`を追加し、誤って公開されないようにしてください
- Client IDは機密情報として扱い、許可された人のみがアクセスできるようにしてください
- 本番環境では、環境変数やシークレット管理サービスの使用を検討してください

## 使用方法
1. Webブラウザでアプリケーションにアクセス
2. 「Googleでログイン」ボタンをクリック
3. Googleアカウントを選択してログイン
4. ログイン後、ユーザー情報が表示される

## ライセンス
［ライセンス情報を記載］

## お問い合わせ
［連絡先情報を記載］
