<?php
  header("Content-type: application/json; charset=UTF-8");

  $oc_list = file_get_contents("../data/oc.json");
  $oc_list = json_decode($oc_list, true);

  $ids = array_column($oc_list["data"], "id");
  foreach ($_POST["data"] as $item) {
    $params = json_decode($item, true);

    $id = array_search($params["id"], $ids);
    $oc_list["data"][$id][$params["key"]] = $params["after"];

    print_r($params);
  }

  $json = json_encode($oc_list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  file_put_contents("../data/oc.json", $json);
?>
