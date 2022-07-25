<?php
  header("Content-type: application/json; charset=UTF-8");

  $oc_list = file_get_contents("../data/oc.json");
  $oc_list = json_decode($oc_list, true);

  $ids = array_column($oc_list["data"], "id");
  $index = array_search($_GET["id"], $ids);
  $oc = $oc_list["data"][$index];

  $json = json_encode($oc, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  echo $json;
?>
