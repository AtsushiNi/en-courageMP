<?php
  header("Content-type: application/json; charset=UTF-8");

  $oc_list = file_get_contents("../../data/oc.json");
  $oc_list = json_decode($oc_list, true);
  $oc_ids = array_column($oc_list["data"], "id");

  $page_data = file_get_contents("../../data/pages/selection-preparation.json");
  $page_data = json_decode($page_data, true);

  $pick_up_index = array_search($page_data["pickup"], $oc_ids);
  $pick_up = $oc_list["data"][$pick_up_index];

  $es = [];
  foreach ($page_data["es"] as $id) {
    $event_index = array_search($id, $oc_ids);
    $event = $oc_list["data"][$event_index];
    array_push($es, $event);
  }

  $gd = [];
  foreach ($page_data["gd"] as $id) {
    $event_index = array_search($id, $oc_ids);
    $event = $oc_list["data"][$event_index];
    array_push($gd, $event);
  }

  $intern = [];
  foreach ($page_data["intern"] as $id) {
    $event_index = array_search($id, $oc_ids);
    $event = $oc_list["data"][$event_index];
    array_push($intern, $event);
  }

  $other = [];
  foreach ($page_data["other"] as $id) {
    $event_index = array_search($id, $oc_ids);
    $event = $oc_list["data"][$event_index];
    array_push($other, $event);
  }

  $json = array("pickup"=>$pick_up, "es"=>$es, "gd"=>$gd, "intern"=>$intern, "other"=>$other);
  $json = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  echo $json;
?>
