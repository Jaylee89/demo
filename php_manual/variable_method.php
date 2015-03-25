<?php
    /**
     * 
     **/
    class Test
    {
         function change()
        {
            $name = 'Bar';
            $this->$name(); //calls Bar() method
        }

          function Bar()
         {
             echo "Hello world, I'm Bar";
         }
    }

    $Test = New Test();
    $func_name = "change";
    $Test->$func_name(); //here calls $Test->change(); variable method
