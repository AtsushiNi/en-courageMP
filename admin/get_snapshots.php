<?php
  header("Content-type: application/json; charset=UTF-8");

  $snapshots = array();
  foreach (glob("snapshots/*.json") as $file) {
    $contents = json_decode(file_get_contents($file), true);
    array_push($snapshots, $contents);
  }

  $sort_arary = array();
  foreach ($snapshots as $key => $row) {
    $sort_arary[$key] = $row["created_at"];
  }
  array_multisort($sort_arary, SORT_ASC, $snapshots);
  echo json_encode($snapshots, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
