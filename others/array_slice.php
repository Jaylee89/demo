<?php
//array_slice(array, offset, length, preserve) 
//preserve 可选 true, false   true保留键， false默认-重置键
$test_a = array(
    'nav_1' => 'dog',
    'nav_2' => 'cat',
    'nav_3' => 'lion',
    'nav_4' => 'fish'

);
print_r(array_slice($test_1, 1, 2));
echo "<hr />";

$test_b = array(
    'tab_1' => 'yellow',
    'tab_2' => 'green',
    'tab_3' => 'red',
    'tab_4' => 'balck',
    'tab_5' => 'white'
);
print_r(array_slice($test_b, -2, 2));
print_r(array_slice($test_b, 1, 2, true));
echo "<hr />";

?>
