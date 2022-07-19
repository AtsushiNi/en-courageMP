<?php
  header("Content-type: application/json; charset=UTF-8");

  $oc_list = file_get_contents("data/oc.json");
  echo $oc_list;
?>
