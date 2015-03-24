<?php
  $array_1 = ["a"=>"green", "red", "blue", "red"];
  $array_2 = ["b"=>"green", "yellow",  "red"];
  $result = array_diff($array_1, $array_2);
  var_dump($result);
?>
