var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

owner.Reproducer = function(){

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

                this.reproducer = this.hardWiredReproducer;  // back wards compat for Salman
            },

            reproduce : function (context, debugSessionId, reproductionId)
            {
                if (context.querypoint.reproducer)
                   this.select(context.querypoint.reproducer);

                FBTrace.sysout("reproduce "+this.reproducer, {context: context, debugSessionId: debugSessionId, reproductionId: reproductionId});

                this.reproducer.reproduce(context, debugSessionId, reproductionId);
            },

            select: function(kind)
            {
                if (kind === "hardwire") this.reproducer = this.hardWiredReproducer;
                else if (kind === "fbtest") this.reproducer = fbTestReproducer;
                else if (kind === "local") this.reproducer = localReproducer;
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