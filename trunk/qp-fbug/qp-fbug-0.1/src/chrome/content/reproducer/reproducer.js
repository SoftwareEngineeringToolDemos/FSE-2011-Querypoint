var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

__owner.Reproducer = function(){

        var constructor = function(){
        };

        constructor.prototype =
        {
            initialize : function()
            {
                this.fbTestReproducer = new FBTestReproducer();

                this.fbTestReproducer.initialize();

                this.localReproducer = new LocalReproducer();

                this.hardWiredReproducer = new HardWiredReproducer();

                this.replayReproducer = new ReplayReproducer();
            },

            reproduce : function (reproducerKind, context, debugSessionId, reproductionId)
            {
            	var reproducer = this.getReproducer(reproducerKind);
            	
                trace("reproduce "+reproducerKind, {context: context, debugSessionId: debugSessionId, reproductionId: reproductionId});

                reproducer.reproduce(context, debugSessionId, reproductionId);
            },

            getReproducer: function(kind)
            {
                if (kind === "hardwired") return this.hardWiredReproducer;
                else if (kind === "replay") return this.replayReproducer;
                else if (kind === "fbtest") return this.fbTestReproducer;
                else if (kind === "local") return this.localReproducer;
                //default
                return this.hardWiredReproducer;
//                return this.localReproducer;
            },

        };

        constructor.getInstance = function(){
            if (!QPFBUG.reproducer)
            {
                QPFBUG.reproducer = new Reproducer();
                QPFBUG.reproducer.initialize();
            }
            return QPFBUG.reproducer;
        };

        return constructor;
    }();

}}

};