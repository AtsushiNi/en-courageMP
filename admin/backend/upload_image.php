<?php
  header("Content-type: application/json; charset=UTF-8");

  $img_name = $_FILES['image']['name'];
  $month = date("n");
  $file_name = "10/" . $month . "/" . $img_name;

  move_uploaded_file($_FILES['image']['tmp_name'], "../../images/events/" . $file_name);

  echo json_encode($file_name, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
