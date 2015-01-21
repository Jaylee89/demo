//金额检测
    function isMoney(forCheck){
        var regex = /^[0-9]*(\.[0-9]{1,2})?$/;
        return regex.test(forCheck);
    }

