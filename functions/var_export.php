<?php
    $a = array(1, 2, array("a", "b", "c"));
    var_export($a);

    echo "<hr />";

    $v = var_export($a, TRUE);
    echo $v;
?>
