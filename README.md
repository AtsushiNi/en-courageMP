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
‘‘‘
.
├── README.md
├── column.html
├── column_source
│   ├── column1.html
│   └── column_source_style.css
├── components
│   ├── footer.html
│   ├── header.html
│   └── sidebar.html
├── css
│   ├── column.css
│   ├── default.css
│   ├── event.css
│   ├── experience.css
│   ├── footer.css
│   ├── header.css
│   ├── index.css
│   ├── industry-research.css
│   ├── interview.css
│   ├── selection-preparation.css
│   ├── self-analysis.css
│   ├── sidebar.css
│   └── use.css
├── default_page.png
├── event.html
├── events
│   ├── 47-internship.jpeg
│   ├── GD-nozokimi.jpeg
│   ├── ikkatsu-build-entry.png
│   ├── ikkatsu-eng-entry.png
│   ├── ikkatsu-entry.png
│   ├── ikkatsu-it-entry.png
│   ├── ikkatsu-kiden-entry.png
│   ├── interview-nozokimi.jpeg
│   ├── it-seminer.jpeg
│   ├── kinyu-seminer.jpeg
│   ├── outstanding-01.png
│   ├── outstanding-05.png
│   ├── outstanding-06.png
│   ├── outstanding-07.jpeg
│   ├── outstanding-08.jpeg
│   ├── outstanding-09.jpeg
│   ├── outstanding-15.jpeg
│   ├── outstanding-16.jpeg
│   ├── outstanding-17.jpeg
│   ├── shibuya-next.jpeg
│   ├── summer-circuit.png
│   └── syudan-seminer.jpeg
├── experiences
│   └── 1.html
├── generator
│   ├── atsumori.png
│   ├── complete.php
│   ├── credentials.js
│   ├── destroy.php
│   ├── get.php
│   ├── index.css
│   ├── index.html
│   ├── index.js
│   ├── lib
│   │   ├── dropdown
│   │   │   └── dist
│   │   │       ├── jquery.gorilla-dropdown.min.css
│   │   │       └── jquery.gorilla-dropdown.min.js
│   │   └── remodal
│   │       └── dist
│   │           ├── remodal-default-theme.css
│   │           ├── remodal.css
│   │           └── remodal.min.js
│   ├── post.php
│   ├── table.png
│   └── tmp
│       ├── 2_tmp.html
│       └── 2_tmp.json
├── images
│   ├── atsumori.png
│   ├── border.png
│   ├── comingsoon.png
│   ├── company.PNG
│   ├── ev.png
│   ├── exam.PNG
│   ├── experience
│   │   ├── ES.png
│   │   ├── GD.png
│   │   ├── good.png
│   │   ├── impressions.png
│   │   ├── intern.png
│   │   ├── interview.png
│   │   └── web-test.png
│   ├── img.png
│   ├── sample.png
│   ├── self-analysis
│   │   ├── IMG_0789.PNG
│   │   ├── IMG_5934.PNG
│   │   ├── IMG_5935.JPG
│   │   ├── IMG_5942.PNG
│   │   ├── how-to-use.jpg
│   │   └── outstanding.png
│   ├── self.PNG
│   ├── sidebar
│   │   └── search.png
│   └── top.PNG
├── index.html
├── industry-research.html
├── interview.html
├── js
│   ├── column_script.js
│   ├── ev_script.js
│   ├── footer_script.js
│   ├── script.js
│   └── view_more.js
├── lib
│   └── fullcalendar
│       ├── main.css
│       └── main.js
├── node_modules
│   ├── @popperjs
│   │   └── core
│   │       ├── dist
│   │       │   ├── cjs
│   │       │   ├── esm
│   │       │   │   ├── dom-utils
│   │       │   │   ├── modifiers
│   │       │   │   └── utils
│   │       │   └── umd
│   │       └── lib
│   │           ├── dom-utils
│   │           ├── modifiers
│   │           └── utils
│   └── tippy.js
│       ├── animations
│       ├── dist
│       ├── headless
│       │   └── dist
│       └── themes
├── readme.pdf
├── selection-preparation.html
├── self-analysis.html
└── use.html
‘‘‘
## アクセス制限

## ローカル環境構築

## デプロイ

## HTMLジェネレータ