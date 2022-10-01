<?php
  header("Content-type: text; charset=UTF-8");

  $oc_list = file_get_contents("../data/oc.json");
  $oc_list = json_decode($oc_list, true);

  $delete_image_paths = [];
  foreach ($oc_list["data"] as $index => $oc) {
    if(in_array((string) $oc["id"], $_POST["data"])) {
      array_push($delete_image_paths, $oc_list["data"][$index]["image"]);
      unset($oc_list["data"][$index]);
    }
  }

  $delete_image_paths = array_unique($delete_image_paths);
  foreach ($delete_image_paths as $path) {
    if(!in_array($path, array_column($oc_list["data"], "image"))) {
      unlink("../../images/events/" . $path);
    }
  }

  $oc_list["data"] = array_values($oc_list["data"]);
  $oc_list["created_at"] = date(DATE_ATOM);

  $json = json_encode($oc_list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  file_put_contents("../data/oc.json", $json);
?>
