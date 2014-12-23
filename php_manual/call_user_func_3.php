<?php
 function barber($type)
{
    echo "You wanted a $type can swimming! No Problem!"."<br/>";
}

call_user_func('barber', 'mushroom');
call_user_func('barber', 'shave');
?>
