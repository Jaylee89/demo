<?php
//PHP �ṩ�ܶࡰ Ԥ��������������糬ȫ�ֱ��� $_POST  �����Ա��� $_POST  ��������Ϊ����һ��������ͨ�� POST ����������������ϵ�����顣���磬������ foreach�򵥵ر���������� empty() ֵ���Լ������������
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
