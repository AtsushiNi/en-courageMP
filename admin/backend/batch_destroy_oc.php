<?php
  header("Content-type: text; charset=UTF-8");

  $oc_list = file_get_contents("../data/oc.json");
  $oc_list = json_decode($oc_list, true);

  foreach ($oc_list["data"] as $index => $oc) {
    if(in_array((string) $oc["id"], $_POST["data"])) {
      /* print_r($oc); */
      unset($oc_list["data"][$index]);
    }
  }
  $oc_list["data"] = array_values($oc_list["data"]);

  $json = json_encode($oc_list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  file_put_contents("../data/oc.json", $json);
?>
