<?php
  header("Content-type: application/json; charset=UTF-8");

  $oc_list = file_get_contents("../../data/oc.json");
  $oc_list = json_decode($oc_list, true);
  $oc_ids = array_column($oc_list["data"], "id");

  $page_data = file_get_contents("../../data/pages/self-analytics.json");
  $page_data = json_decode($page_data, true);

  $pick_up_index = array_search($page_data["pickup"], $oc_ids);
  $pick_up = $oc_list["data"][$pick_up_index];

  $events = [];
  foreach ($page_data["events"] as $id) {
    $event_index = array_search($id, $oc_ids);
    $event = $oc_list["data"][$event_index];
    array_push($events, $event);
  }

  $json = array("pickup"=>$pick_up, "events"=>$events);
  $json = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  echo $json;
?>
