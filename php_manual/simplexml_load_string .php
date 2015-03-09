<?php 
$xml = simplexml_load_string('<foo>Text1 &amp; XML entities</foo>'); 
print_r($xml); 
/* 
SimpleXMLElement Object 
( 
    [0] => Text1 & XML entities 
) 
*/ 

$xml2 = simplexml_load_string('<foo><![CDATA[Text2 & raw data]]></foo>'); 
print_r($xml2); 
/* 
SimpleXMLElement Object 
( 
) 
*/ 
// Where's my CDATA? 

// Let's try explicit casts 
print_r( (string)$xml ); 
print_r( (string)$xml2 ); 
/* 
Text1 & XML entities 
Text2 & raw data 
*/ 
// Much better 
?>