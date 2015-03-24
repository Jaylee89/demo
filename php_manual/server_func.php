<?php
    if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE) {
?>
<h1>Internet Explorer</h1>
<?php
    }else {
        // code...
?>
        <center>没有用Interner Explorer浏览器</center>
<?php

    }
?>
<?php
foreach ($_SERVER as $key=>$value) {
    echo $key."=".$value;
    echo "<br/> <br />";
}
?>
