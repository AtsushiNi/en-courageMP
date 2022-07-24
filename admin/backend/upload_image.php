<?php
  header("Content-type: application/json; charset=UTF-8");

  $img_name = $_FILES['image']['name'];
  $month = date("n");

  $i = 2;
  $tmp_name = $img_name;
  while (file_exists("../../images/events/10/" . $month . "/" . $tmp_name)) {
    $tmp_name = pathinfo($img_name, PATHINFO_FILENAME) . "(". (string)$i . ").". pathinfo($img_name, PATHINFO_EXTENSION);
    $i++;
  }
  $file_name = "../../images/events/10/" . $month . "/" . $tmp_name;

  move_uploaded_file($_FILES['image']['tmp_name'], "../../images/events/" . $file_name);

  echo json_encode($file_name, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
