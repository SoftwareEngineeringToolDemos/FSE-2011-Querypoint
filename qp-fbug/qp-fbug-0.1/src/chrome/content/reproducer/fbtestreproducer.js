var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

__owner.FBTestReproducer = function(){

        var constructor = function(){
        };

        constructor.prototype =
        {
            reproduce: function(context, debugSessionId, reproductionId)
            {
                fbTestReproducer.trackFBTest.replay();
            },

            initialize: function()
            {
                if (!this.obseverService)
                {
                    this.observerService = QPFBUG.loadScript("resource://firebug/observer-service.js", QPFBUG);
                    this.observerService = QPFBUG.observerService;
                }

                this.trackFBTest =
                {
                    observe: function(subject, topic, data)
                    {
                        if (topic === "fbtest-start-case")
                        {
                            this.lastTest = data;
                            this.fbTest = subject;
                        }
                    },

                    replay: function()
                    {
                        if (this.fbTest && this.lastTest)
                            fbTest.replay(this.lastTest);
                    },
                };

                this.observerService.addObserver(this.trackFBTest, "fbtest-start-case");
            },

            destroy: function()
            {
                if (this.observerService)
                    this.observerService.removeObserver(this.trackFBTest, "fbtest-start-case");
            },

            toString: function()
            {
                return "[FBTestReproducer]";
            },

        };

        return constructor;
    }();

}}

};