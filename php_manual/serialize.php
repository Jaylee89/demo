<?php
$array = array();
$array['key'] = 'website';
$array['value'] = 'www.chnua.com';
$a = serialize($array);
echo $a;
unset($array);
$a = unserialize($a);
echo "<pre>";
print_r($a);
echo "</pre>";
?>
