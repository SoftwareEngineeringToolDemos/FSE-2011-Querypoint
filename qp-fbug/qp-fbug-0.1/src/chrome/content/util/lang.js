// This script should be loaded in QPFBUG object
//--------------------------------- Lang --------------------------------
//this class contains basic needed functions at language level
this.Lang = {
    assert : function(bool, object){
        if (!bool){
            throw ("Assertion Error : ");//( + object);
        }
    },

    currentTimeMillis : function(){
        return (new Date()).getTime();
    }
};
