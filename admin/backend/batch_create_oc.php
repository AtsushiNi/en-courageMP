<?php
  header("Content-type: text; charset=UTF-8");

  $oc_list = file_get_contents("../data/oc.json");
  $oc_list = json_decode($oc_list, true);

  $max_id = max(array_column($oc_list["data"], "id"));

  foreach ($_POST["data"] as $index => $item) {
    $oc = json_decode($item, true);
    $oc["id"] = $max_id + $index + 1;
    array_push($oc_list["data"], $oc);
    print_r($oc);
  }

  $oc_list["created_at"] = date(DATE_ATOM);

  $json = json_encode($oc_list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  file_put_contents("../data/oc.json", $json);
?>
