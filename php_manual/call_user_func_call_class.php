<?php
class myClass{
    static function say_goodbye()
    {
        echo "GoodBye!.<br />";
    }

}
    $classname = "myClass";
    call_user_func(array($classname, 'say_goodbye'));
    call_user_func($classname."::say_goodbye");

    $myobject = new myClass();
    call_user_func(array($myobject, 'say_goodbye'));
?>
