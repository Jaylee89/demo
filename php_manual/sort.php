<?php
    //fill an array with all items from a directory
    $handle  = opendir('.');
    $files = array();
    while (false !== ($file = readdir($handle))) {
        $files[] = $file;
    }
    sort($files);
    echo "<pre>";
    print_r($files);

    isset($files);
    //isset()语言结构可以用来检测一个变量是否已被初始化
?>
