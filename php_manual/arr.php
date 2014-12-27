<?php
    $transport = array('foot', 'bike', 'car', 'plane');
    $mode = current($transport);
    echo $mode,"<br />";
    $mode = next($transport);
    $mode = current($transport);
    echo $mode,"<br />";
    $mode = prev($transport);
    $mode = current($transport);
    echo $mode,"<br />";
    $mode = end($transport);
    $mode = current($transport);
    echo $mode,"<br />";

    $arr = array();
    var_dump(current($arr));
    $arr = array(array());
    var_dump(current($arr));
?>
