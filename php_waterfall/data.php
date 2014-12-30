<?php
 $link = mysql_connect("localhost","root","");
 $sql = "use mingshan";
 mysql_query($sql,$link);
 $sql = "set names utf8";
 mysql_query($sql,$link);
 $num = $_POST['num'] *10;
 if($_POST['num'] != 0) $num +1;
 $sql = "select image,title from mshan_calendar_notepad limit ".$num.",10";
 $result = mysql_query($sql,$link);
 $temp_arr = array();
 while($row = mysql_fetch_assoc($result)){
     $temp_arr[] = $row;
 }
 //var_dump($temp_arr);
 $json_arr = array();
 foreach($temp_arr as $k=>$v){
     $json_arr[]  = (object)$v;
 }
 //print_r($json_arr);
 echo json_encode( $json_arr );
