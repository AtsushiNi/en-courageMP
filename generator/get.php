<?php
  header("Content-type: application/json; charset=UTF-8");

  // 体験記の最新番号を取得
  $dir = "../experiences/";
  $files = glob($dir . "*.html");
  $numbers = [];
  foreach ($files as $file){
    preg_match('/[0-9]+/', $file, $matches) . "<br>";
    $numbers[] = (int) $matches[0];
  }

  $new_file_number = max($numbers) + 1;

  // 編集中のデータがあるか
  $tmp_json_name = "tmp/" . $new_file_number . "_tmp.json";
  if (file_exists($tmp_json_name)) {
    $tmp_json = file_get_contents($tmp_json_name);
    $tmp_json = mb_convert_encoding($tmp_json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
    $tmp_json = json_decode($tmp_json, true);

    echo json_encode($tmp_json, JSON_PRETTY_PRINT);
  } else {
    echo "not exists";
  }
  exit;
?>

