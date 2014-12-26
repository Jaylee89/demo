<?php
/*$value引用*/
/*$value的引用只在遍历的数组可以被引用时才可用(例如变量)*/
$arr = array(1, 2, 3, 4);
foreach ($arr as & $value) {
    $value = $value * 2;
}
unset($value);
var_dump($arr);
/*break 可以接受一个可选数字参数来决定跳出几重循环*/
echo "<hr />";
$i = 0;
while (++$i) {
    switch ($i) {
        case '5':
            echo "At 5<br />\n";
            break 1; //只跳出switch
        
        case "10":
            echo "At 10; quitting<br />\n";
            break 2; //退出switch和while循环
        default:
            // code...
            break;
    }
}
echo "continue接受一个可选的数字参数来决定跳出几重循环到循环结尾<hr />";
$i = 0;
while($i ++ < 5)
{
    echo "Outer<br />\n";
while (1) {
    echo "Middle<br />\n";
    while (1) {
        echo "Inner<br />\n";
        continue 3;
    }
    echo "This never gets output.<br />\n";
}
echo "Neither does this.<br />\n";
}
?>
