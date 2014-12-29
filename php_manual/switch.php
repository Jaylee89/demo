<?php
function myTest() {
    static $x = 0;
    echo $x;
    $x++;
}
myTest();
myTest();
myTest();
myTest();
myTest();
myTest();
echo "<hr />";



$eat = "lunch";
switch ($eat) {
    case 'breakfast'; //可以用;代替case后面的冒号
    case 'lunch';
    case "supper"; //dinner
        echo "good eat!";
        break;
    
    default:
        echo "not bad!";
        break;
}
echo "<hr />";

declare(ticks=1)
{
    echo "entire script here";
}
declare(ticks=1);
//entire script here

echo "<br />";
declare(ticks=1);
register_tick_function( 'my_function', true)
    $object = new my_class();
register_tick_function(array(& $object, 'my_method'), true);
?>
