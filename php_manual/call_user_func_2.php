<?php
namespace Foobar;
/**
 * 
 **/
class Foo {
    
    static public function test() 
    {
        print "Hello World!"."<br/>";
    }
}

call_user_func(__NAMESPACE__."\Foo::test");
call_user_func(array(__NAMESPACE__.'\Foo', 'test'));
?>
