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
    //isset()���Խṹ�����������һ�������Ƿ��ѱ���ʼ��
?>
