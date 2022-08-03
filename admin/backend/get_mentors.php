<?php
  header("Content-type: application/json; charset=UTF-8");

  $mentor_list = file_get_contents("../data/mentors.json");
  echo $mentor_list;
?>
