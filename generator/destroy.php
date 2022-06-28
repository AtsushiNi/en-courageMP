<?php
  header("Content-type: application/json; charset=UTF-8");

  array_map('unlink', glob('tmp/*.*'));

  echo json_encode(array());
  exit;
?>
