<?php
  header("Content-type: application/json; charset=UTF-8");

  $experiences = file_get_contents("../admin/data/experience.json");
  $experiences = json_decode($experiences, true);
  $json = json_encode($experiences, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
  echo $json;
?>
