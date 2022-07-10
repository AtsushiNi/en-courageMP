# 選考体験記HTMLジェネレータ

# URL
localhost/{ディレクトリ名}/generator

# 目的
選考体験記を書くのには数百行のHTMLを書く必要がある<br>
100以上のHTMLを書くのは大変なので、クリックだけでHTMLを生成するツールを作った

## 機能
- GoogleドキュメントのIDを指定して記事内容を自動入力できる
- 記事内容を編集できる
  - 内容の編集
  - 内容の追加・削除
  - 文章→表
  - 難関マークの付与
- 目次の作成・編集
- 一時保存・一時保存データの読み込み・一時保存データの破棄
- プレビューの表示
- HTML書き出し

# ディレクトリ構成
~~~
.
├── index.html // 基本ページ。後半にgoogleドキュメント読み込みjs。
├── index.js // 基本js
├── index.css // 基本css
├── get.php // 一時保存データの取得
├── post.php // 一時保存
├── destroy.php // 一時保存データの破棄
├── complete.php // HTML書き出し
├── credentials.js // Googleドキュメント読み込みに必要な認証情報
├── atsumori.png
├── table.png
├── lib // jsライブラリ
│   ├── dropdown // 目次編集モーダル内のアイコン選択用
│   └── remodal // 目次編集モーダル
└── tmp // 一時保存データ
    ├── n_tmp.html // プレビューで使用。
    └── n_tmp.json
~~~

# アクセス制限
.htaccessで本番ではアクセス禁止<br>
.htaccessはgit管理しない<br>

# 使い方
準備：credentials.jsをこのディレクトリにコピー
1. Googleドキュメント or 一時保存データ読み込み
2. 内容を編集
3. 目次を作成
4. 目次を編集
5. プレビューを確認しつつ内容を編集
6. HTML書き出し(一時保存データは自動で削除される)
