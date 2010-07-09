QPFBUG.const.querytypes.lastchange = 0;
QPFBUG.const.querytypes.lastcondition = 1;

//--------------------------------- DebugModel --------------------------------
QPFBUG.DebugModelFactory = function(){
     this.tracePoints = [];
     tracePointId = 0;
}

QPFBUG.DebugModelFactory.prototype = {


     addTracePoint() : function(){},




}

//------------------------------- TracePointDef -------------------------------
// This object is the result of parsing the inserted query by the user
QPFBUG.TracePointDefFactory = function(name){
    //e.g., for "lastChange(A, foo), queryType is 0, refPoint is A, and refObj is foo.
    this.name = name;
    this.queryType = queryType;
    this.refPoint = refPoint;
    this.refObj = refObj;
}

QPFBUG.TracePointDefFactory.prototype = {
    // no functions
}


//------------------------------- TracePoint ----------------------------------
// This object is the live object is kept in debug model.
QPFBUG.TracePointFactory = function(id, name, queryType){
    this.id = id;
    this.queryType = queryType;
    this.refPoint = refPoint;
    this.refObj = refObj;
}

QPFBUG.TracePointFactory.prototype = {

}