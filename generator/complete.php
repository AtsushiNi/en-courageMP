<?php
  header("Content-type: text/plain; charset=UTF-8");

  // 体験記の最新番号を取得
  $dir = "../experiences/";
  $files = glob($dir . "*.html");
  $numbers = [];
  foreach ($files as $file){
    preg_match('/[0-9]+/', $file, $matches) . "<br>";
    $numbers[] = (int) $matches[0];
  }

  $new_file_number = max($numbers) + 1;

  // 編集中のデータ
  $tmp_json_name = "tmp/" . $new_file_number . "_tmp.html";
  $html = file_get_contents($tmp_json_name);

  // リンク張り替え
  $html = str_replace('../../', '../', $html);

  // GTMタグ挿入(プレビュー画面を計測に入れないためこのタイミング)
  $part = explode("<body>", $html);
  $tag = <<< EOM
    <body>
      <!-- Google Tag Manager (noscript) -->
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WLHCR88"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      <!-- End Google Tag Manager (noscript) -->
  EOM;
  $html = $part[0] . $tag . $part[1];

  // HTML生成
  $html_name = "../experiences/" . $new_file_number . ".html";
  file_put_contents($html_name, $html);

  // tmpファイルを削除
  array_map('unlink', glob('tmp/*.*'));

  echo $html_name;

  exit;
?>
