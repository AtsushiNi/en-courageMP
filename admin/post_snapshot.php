<?php
  header("Content-type: text/plain; charset=UTF-8");

  $_POST["created_at"] = date(DATE_ATOM);
  $json = json_encode($_POST, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

  // 一番古いスナップショットを探す
  $oldest_timestamp = strtotime("2030/1/1 12:00:00");
  foreach (glob("snapshots/*.json") as $file) {
    $contents = json_decode(file_get_contents($file), true);
    $created_at = strtotime($contents["created_at"]);

    if ($oldest_timestamp > $created_at) {
      $oldest_timestamp = $created_at;
      $new_file_path = $file;
    }
  }

  file_put_contents($new_file_path, $json);
  echo $json;
?>
