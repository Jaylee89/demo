<?php
function foo(){
    echo "In foo()<br />\n";
}

function bar($arg=''){
    echo "In bar();argument was '$arg' <br />\n";
}

function echovim($git) {
    echo $git;
}

$func = 'foo';
$func(); //µ÷ÓÃfoo()º¯Êý

$func = 'bar';
$func('test'); //bar£¨£©

$func = 'echovim';
$func('test'); //this calls echovim
