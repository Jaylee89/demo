<?php
/*$value����*/
/*$value������ֻ�ڱ�����������Ա�����ʱ�ſ���(�������)*/
$arr = array(1, 2, 3, 4);
foreach ($arr as & $value) {
    $value = $value * 2;
}
unset($value);
var_dump($arr);
/*break ���Խ���һ����ѡ���ֲ�����������������ѭ��*/
echo "<hr />";
$i = 0;
while (++$i) {
    switch ($i) {
        case '5':
            echo "At 5<br />\n";
            break 1; //ֻ����switch
        
        case "10":
            echo "At 10; quitting<br />\n";
            break 2; //�˳�switch��whileѭ��
        default:
            // code...
            break;
    }
}
echo "continue����һ����ѡ�����ֲ�����������������ѭ����ѭ����β<hr />";
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
