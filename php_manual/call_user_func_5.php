<?php
call_user_func(function($arg) {
    print "[$arg]<br />";
}, 'test'); //把完整的函数作为回调传入call_user_func（）
?>
