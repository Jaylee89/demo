<?php
 function  process ( $var1 ,  $var2 ,  $farr )
{
    foreach ( $farr  as  $f ) {
        echo  $f ( $var1 ,  $var2 ) .  "\n" ;
    }
}

 // create a bunch of math functions
 $f1  =  'if ($a >=0) {return "b*a^2 = ".$b*sqrt($a);} else {return false;}' ;
 $f2  =  "return \"min(b^2+a, a^2,b) = \".min(\$a*\$a+\$b,\$b*\$b+\$a);" ;
 $f3  =  'if ($a > 0 && $b != 0) {return "ln(a)/b = ".log($a)/$b; } else { return false; }' ;
 $farr  = array(
     create_function ( '$x,$y' ,  'return "some trig: ".(sin($x) + $x*cos($y));' ),
     create_function ( '$x,$y' ,  'return "a hypotenuse: ".sqrt($x*$x + $y*$y);' ),
     create_function ( '$a,$b' ,  $f1 ),
     create_function ( '$a,$b' ,  $f2 ),
     create_function ( '$a,$b' ,  $f3 )
    );

echo  "\nUsing the first array of anonymous functions\n" ;
echo  "parameters: 2.3445, M_PI\n" ;
 process ( 2.3445 ,  M_PI ,  $farr );

 // now make a bunch of string processing functions
 $garr  = array(
     create_function ( '$b,$a' ,  'if (strncmp($a, $b, 3) == 0) return "** \"$a\" ' .
     'and \"$b\"\n** Look the same to me! (looking at the first 3 chars)";' ),
     create_function ( '$a,$b' ,  '; return "CRCs: " . crc32($a) . ", ".crc32($b);' ),
     create_function ( '$a,$b' ,  '; return "similar(a,b) = " . similar_text($a, $b, &$p) . "($p%)";' )
    );
echo  "\nUsing the second array of anonymous functions\n" ;
 process ( "Twas brilling and the slithy toves" ,  "Twas the night" ,  $garr );
 ?> 
