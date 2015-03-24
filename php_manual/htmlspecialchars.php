<?php
    echo htmlspecialchars($_POST['name']);
    echo (int)$_POST['age'];
?>
<?
echo 'this is gitvim';
?>
<script language="php">
    echo "hello<br />";
</script>
<%
    echo '4 ways ';
%>
<?php
//32bit system overflow
$large_number = 2147483647;
var_dump($large_number);

$large_number = 2147483648;
var_dump($large_number);

$million = 1000000;
$large_number = 50000 * $million;
var_dump($large_number);
?>
<?php
echo "<hr />";
$large_number = 9223382036854775807;
var_dump($large_number);

$large_number = 9223382036854775808;
var_dump($large_number);

$million = 1000000;
$large_number = 50000000000000 * $million;
var_dump($large_number);

//round(); 四舍五入


$str = 'This is a test for gitvim';
$first = $str[0];

$third = $str[2];
$last = $str[strlen($str)-1];
$str[$strlen($str) - 1] = 'e'; //修改最后一个字符

?>
<?php
echo "<hr />";
//自PHP5.4起，字符串下标必须为整数或可转换成整数的字符串， 否则会发出警告。
$str = 'abc';

var_dump($str['1']);
var_dump(isset($str['1']));

var_dump($str['1.0']);
var_dump(isset($str['1.0']));

var_dump($str['x']);
var_dump(isset($str['x']));

var_dump($str['1x']);
var_dump(isset($str['1x']));
?>
