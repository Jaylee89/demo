<?php
$code = $_GET['code'];//ǰ�˴�����codeֵ
$appid = "wx2e4450fd11a621d0";
$appsecret = "264253e477dd7a004000f1ed75eec762";//��ȡopenid
$url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$appsecret&code=$code&grant_type=authorization_code";
$result = https_request($url);
$jsoninfo = json_decode($result, true);
$openid = $jsoninfo["openid"];//�ӷ���json����ж���openid
$access_token = $jsoninfo["access_token"];//�ӷ���json����ж���openid
$callback=$_GET['callback'];  // echo $callback."({result:'".$openid."'})";

$url1 = "https://api.weixin.qq.com/sns/userinfo?access_token=$access_token&openid=$openid&lang=zh_CN";
$result1 = https_request($url1);
$jsoninfo1 = json_decode($result1, true);
$nickname=$jsoninfo1["nickname"];
echo $openid.":".$access_token.":".$nickname; //��openid �ͻ�ǰ��

function https_request($url,$data = null){
    $curl = curl_init();   
    curl_setopt($curl, CURLOPT_URL, $url);   
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);   
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);    
    if (!empty($data)){    
        curl_setopt($curl, CURLOPT_POST, 1);  
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);   
    }    
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); 
    $output = curl_exec($curl);    
    curl_close($curl);    
    return $output;
}


?> 
