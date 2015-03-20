<?php
header("Cache-control:no-cache,no-store,must-revalidate");
header("Pragma:no-cache");
header("Expires:0");
/*
session_start();
$_SESSION['payment'] = isset($_SESSION['payment']) ? 'ok' : 'fail';
var_dump($_SESSION);
if($_SESSION['payment'] != 'ok'){
	header("www.baidu.com");
}else{
	echo "<a href=\"step3.php\">GoTo Test3</a>";
}*/
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>step2</title>
</head>

<body> 
<?php if($_COOKIE['mark']=="hi") {  header("Refresh: 10; url=step3.php");?>
	
	this is step2 <a href="step3.php">Go to step3</a>
<?php }else {
	echo $_COOKIE['mark'];
	 }?>
</body>
</html>
