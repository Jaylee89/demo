<?php
//PHP 提供很多“ 预定义变量”，例如超全局变量 $_POST  。可以遍历 $_POST  变量，因为它是一个和所有通过 POST 方法传递数据相联系的数组。例如，可以用 foreach简单地遍历它，检查 empty() 值，以及将它们输出。
$empty = $post = array();
foreach ($_POST as $varname => $varvalue) {
    if (empty($varname)) {
        $empty[$varname] = $varvalue;
    } else {
        $post[$varname] = $varvalue;
    }
}

print "<pre>";
if (empty($empty)) {
    print "None of the POSTed values are empty, posted:\n";
    var_dump($post);
} else {
    print "We have" .count($empty)." empty values\n<br />";
    print "Posted:<br />"; var_dump($post);
    print "Empty:<br />";var_dump($empty);
    exit();
}

?>
