<?php
  header("Content-type: application/json; charset=UTF-8");

  $industry_list = file_get_contents("../data/industries.json");
  echo $industry_list;
?>
