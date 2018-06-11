const crypto = require("crypto");

module.exports = {
    md5:function(str){
        //后缀
        var fuxx="dkasdbqwbqwekqn12i712o3123.123812312";
        const hash = crypto.createHash('md5'); 
        // 可任意多次调用update():
        hash.update(str+fuxx);

        return hash.digest('hex'); 
    }
};