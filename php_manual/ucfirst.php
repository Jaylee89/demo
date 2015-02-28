<?php
$test = 'hello world!';
$test = ucfirst($test);
echo $test;
$bar = 'HELLO WORLD!';
$bar = ucfirst($bar);
echo $bar;
$bar = ucfirst(strtolower($bar));
echo $bar;

$lc_test = lcfirst("HELLO WORLD");
echo $lc_test;

echo strtoupper("hello world");
echo ucwords("i am a good teacher!");
?>
