<?php
/*
//(1)
namespace Foobar;
class foo {
    static public function test( $name ) {
        print "Hello {$name} !<br />";
    }
}

call_user_func_array( __NAMESPACE__ . '\Foo::test', array( 'Hannets' ));
call_user_func_array(array( __NAMESPACE__ . '\Foo', 'test'), array('Philip'));
 */
//(2)
/*
function foobar($arg, $arg2)
{
    echo __FUNCTION__, " got $arg and $arg2 ,<br />";
}
class foo{
    function bar($arg, $arg2)
    {
        echo __METHOD__, " got $arg and $arg2 <br />";
    }
}

call_user_func_array("foobar", array("one", "two"));
$foo = new foo;
call_user_func_array(array( $foo, "bar"), array('three', "four" ));
 */
//(3)把完整的函数作为回调传入call_user_func_array()
$func = function( $arg1, $arg2) {
    return $arg1 * $arg2;
}

var_dump( call_user_func_array( $func, array(2, 4) ));
?>
