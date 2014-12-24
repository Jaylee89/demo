<?php
header("Content-type:text/html;charset=utf-8");
 function test()
{
    static $count = 0;
    $count ++;
    echo $count,"<br />";
    if ($count < 10) {
        test();
    }
    $count --;
}
test(9);

$a = 'hello';
$$a = 'world';
echo "$a, ${ $a }, <br />";
echo "$a $hello";
echo "<hr/>";
$mm  = array('aa'=>'23');
print_r(gettype($mm));
echo "<hr />";
echo "<pre>";
echo $xx = "常量和变量有如下不同, 1.  常量前面没有美元符号（）  2.  常量只能用 define()  函数定义，而不能通过赋值语句  3.  常量可以不用理会变量的作用域而在任何地方定义和访问  4.  常量一旦定义就不能被重新定义或者取消定义  5.  常量的值只能是标量。 ";
echo "</pre>";
