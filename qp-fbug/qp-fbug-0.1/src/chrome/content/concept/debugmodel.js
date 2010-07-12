// This script should be loaded in QPFBUG.Classes object

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

owner.const = {};
owner.const.querytypes =
{
    reproduction : 0,
    lastchange : 1,
    lastcondition : 2
}

//--------------------------------- DebugModel --------------------------------
owner.DebugModel =
        function(){
            var constructor = function(){
                 this.tracePoints = [];
                 tracePointId = 0;
            };

            // The reason to use prototype for setting fuctions: http://www.jibbering.com/faq/notes/closures/
            constructor.prototype = {

            //     addTracePoint() : function(){}

            }
            return constructor;
        }();


//------------------------------- TracePoint ----------------------------------
// trace point is kept in debug model.
owner.TracePoint =
        function(){
            var constructor = function(id, name, queryType){
                this.id = id;
                this.queryType = queryType;
                this.refPoint = refPoint;
                this.refObj = refObj;
            };

            constructor.prototype = {

            };
            return constructor;
        }();


//------------------------------- TraceObject ----------------------------------
// This object is the global object reference.
owner.TracePoint =
        function(){
            var constructor = function(id, name, pointName, frame, ref ){
                this.id = id;
                this.name = name;
                this.pointName = pointName;
                this.frame = frame;
                this.ref = ref;
            };

            constructor.prototype = {
                // no fuctions
            };
            return constructor;
        }();

//------------------------------- TracePointDef -------------------------------
// This object is the result of parsing the inserted query by the user
owner.TracePointDef =
        function(){
            var constructor = function(name){
                //e.g., for "lastChange(A, foo), queryType is 1, refPoint is A, and refObj is foo.
                this.name = name;
                this.queryType = queryType;
                this.refPoint = refPoint;
                this.refObj = refObj;
            }

            constructor.prototype = {
                // no functions
            }
            return constructor;
        }();
}}