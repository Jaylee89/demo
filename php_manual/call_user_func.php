<?php
 function my_callback_function()
{
    echo "hello world!";
}

/**
 * 
 **/
class MyClass
{
    static function myCallbackMethod(){
        echo "Hello World!";
    }   
}

call_user_func("my_callback_function");
?>
