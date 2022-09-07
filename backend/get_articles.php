<?php
  header("Content-type: application/json; charset=UTF-8");

  $experiences = file_get_contents("../admin/data/experience.json");
  $experiences = json_decode($experiences, true);

  $columns = file_get_contents("../admin/data/column.json");
  $columns = json_decode($columns, true);

  $ondemand_events = file_get_contents("../admin/data/ondemand_events.json");
  $ondemand_events = json_decode($ondemand_events, true);

  $articles = array("data" => array_merge($experiences["data"]));
  $articles = array("data" => array_merge($experiences["data"], $columns["data"], $ondemand_events["data"]));

  // 著者情報を隠す
  foreach ($articles["data"] as &$data) {
    unset($data["author"]);
  }
  unset($data); /* https://pasela.hatenablog.com/entry/20080527/foreach */

  // ソート
  array_multisort(array_map("strtotime", array_column($articles["data"], "created_at")), SORT_DESC, $articles["data"]);

  $json = json_encode($articles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  echo $json;
?>
