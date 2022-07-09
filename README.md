# en-courage 京大支部 HP

## 概要
なぜ1から作り始めたか
- エンカレで活動していく個々人としての側面
  - 0→1の経験を作りに行きたい
    - 設計の思考
    - デザイン
    - コーディング
    - マネジメントなどなど
- 機能的な側面
  - 外部公開を目指すに伴うログイン機能などWPではできない機能
    - 正直今期は作りきれない気はする
    - 逆にそういった事に毎期ならないよう地盤を作っておくという意味でもやる意味はあるか

方針
- 目指すところ
  - エンターの自走の一助となり、メンターの負担も減らすことのできるHP。
    - 自走（＝ニーズに合う情報を探す手間を省き、以下の項目毎にトピックをまとめる
      - 自己分析
      - 業界分析
      - 選考対策
    - 負担削減
      - 記事やカレンダーでOCEVイベントを掲載、紹介することで個別訴求の頻度を減らす

## ディレクトリ構成
~~~
.
├── README.md
├── column_source // 記事個別フォルダ。古いバージョン
├── components // ヘッダー・フッター・サイドバー
├── css
│   ├── default.css // 全ページ共通
│   ├── experience.css // 以下個別ページごと
│   ├── ...
│   └── use.css
├── events // 案件・イベントのアイキャッチ画像の格納フォルダ
├── experiences // 選考体験記の格納フォルダ
├── generator // 選考体験記のHTMLを自動生成するツール
│   └── README.md
├── images
│   ├── experience // 体験記の目次アイコン
│   ├── self-analysis // 自己分析ページ用画像
│   ├── sidebar // サイドバー用画像
│   ├── atsumori.png
│   ├── ...
│   └── top.PNG
├── js
│   ├── script.js // 共通するjavascript
│   ├── ev_script.js
│   ├── ...
│   └── view_more.js
├── lib // javascriptのライブラリ
│   └── fullcalendar // カレンダー
├── column.html
├── event.html
├── index.html
├── industry-research.html
├── interview.html
├── selection-preparation.html
├── self-analysis.html
└── use.html
~~~
## アクセス制限

## ローカル環境構築

## デプロイ

## HTMLジェネレータ
