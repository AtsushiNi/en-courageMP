<?php
  header("Content-type: application/json; charset=UTF-8");

  $experience_list = file_get_contents("../admin/data/experience.json");
  $experience_list = json_decode($experience_list, true);

  $ids = array_column($experience_list["data"], "id");
  $index = array_search($_GET["id"], $ids);
  $experience = $experience_list["data"][$index];

  $industry = $experience["industries"][0];
  $industries = array_column($experience_list["data"], "industries");
  $similars = array_filter($experience_list["data"], function($data) use ($industry, $experience){
    if(in_array($industry, $data["industries"], true) && $experience["id"] != $data["id"]) {
      return true;
    } else {
      return false;
    }
  });
  $similars = array_slice($similars, 0, 5);

  $atsumori = $experience["atsumori"];
  $oc_list = file_get_contents("../admin/data/oc.json");
  $oc_list = json_decode($oc_list, true);
  $oc_ids = array_column($oc_list["data"], "id");
  $sidebar_event_ids = file_get_contents("../admin/data/pages/sidebar.json");
  $sidebar_event_ids = json_decode($sidebar_event_ids, true);
  $recommend_events = [];
  foreach ($sidebar_event_ids[$atsumori] as $id) {
    $event_index = array_search($id, $oc_ids);
    $event = $oc_list["data"][$event_index];
    array_push($recommend_events, $event);
  }

  $json = array("similars"=>array_values($similars), "recommend_events"=>array_values($recommend_events));
  $json = json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  echo $json;
?>
