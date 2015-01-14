/*
 *  Javascript文件：waterfall.js
 */
$(function(){
     jsonajax();
 });
 
 //这里就要进行计算滚动条当前所在的位置了。如果滚动条离最底部还有100px的时候就要进行调用ajax加载数据
 $(window).scroll(function(){    
     alert("mmm");
     //此方法是在滚动条滚动时发生的函数
     // 当滚动到最底部以上100像素时，加载新内容
     var $doc_height,$s_top,$now_height;
     $doc_height = $(document).height();        //这里是document的整个高度
     //alert($doc_height);
     $s_top = $(this).scrollTop();            //当前滚动条离最顶上多少高度
     $now_height = $(this).height();            //这里的this 也是就是window对象
     if(($doc_height - $s_top - $now_height) < 100) jsonajax();    
 });
 
 
 //做一个ajax方法来请求data.php不断的获取数据
 var $num = 0;
 function jsonajax(){
     
     $.ajax({
         url:'data.php',
         type:'POST',
         data:"num="+$num++,
         dataType:'json',
         success:function(json){
             console.log(json);
             if(typeof json == 'object'){
                 var neirou,$row,iheight,temp_h;
                 for(var i=0,l=json.length;i<l;i++){
                     neirou = json[i];    //当前层数据
                     //找了高度最少的列做添加新内容
                     iheight  =  -1;
                     $("#stage li").each(function(){
                         //得到当前li的高度
                         temp_h = Number($(this).height());
                         if(iheight == -1 || iheight >temp_h){
                             iheight = temp_h;
                             $row = $(this); //此时$row是li对象了
                         }
                     });
                     $item = $('<div><img src="'+'./photos/'+neirou.image+'" border="0" /><br/>'+neirou.title+'</div>').hide();
                     $row.append($item);
                     $item.fadeIn();
                 }
             }
         }
     });
 }
