<?php
/*
//不正确方法
if ($a > $b) :
    echo $a . "is greater than " . $b;
else if($a == $b):
    echo "The above line causes a parse error.";
endif;
 */
/*正确方法*/
$a = 20;
$b = 30;
if ($a > $b) :
    echo $a . "is greater than " . $b;
elseif( $a == $b ):
    echo $a . "quals" . $b;
else:
    echo $a . " is neither greater than or equal to " . $b;
endif;
?>
