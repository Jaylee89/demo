<?php
$array = array(
    "key_one" => "test_1", 
    "key_two" => "test_2", 
);

$array = [
    "key_three" => "test_3",
    "key_four" => "test_4"
];
?>
<?php
    echo "<hr />";
$wait = array(
    "a",
    "b",
    6 => "c";
    "d",
    var_dump($wait);
);
?>

<?php
echo "<hr />";
 function getArray()
{
    return array(1,2,3);
}

$secondElement = getArray()[1];

$tmp = getArray();
$secondElement = $tmp[1];

list(, $secondElement) = getArray();
?>
