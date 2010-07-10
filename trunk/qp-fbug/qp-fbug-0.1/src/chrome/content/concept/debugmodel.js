QPFBUG.const.querytypes.reproduction = 0;
QPFBUG.const.querytypes.lastchange = 1;
QPFBUG.const.querytypes.lastcondition = 2;

//--------------------------------- DebugModel --------------------------------
QPFBUG.DebugModelFactory = function(){
     this.tracePoints = [];
     tracePointId = 0;
}

// The reason to use prototype for setting fuctions: http://www.jibbering.com/faq/notes/closures/
QPFBUG.DebugModelFactory.prototype = {

     addTracePoint() : function(){},

}


//------------------------------- TracePoint ----------------------------------
// trace point is kept in debug model.
QPFBUG.TracePointFactory = function(id, name, queryType){
    this.id = id;
    this.queryType = queryType;
    this.refPoint = refPoint;
    this.refObj = refObj;
}

QPFBUG.TracePointFactory.prototype = {

}

//------------------------------- TraceObject ----------------------------------
// This object is the global object reference.
QPFBUG.TracePointFactory = function(id, name, pointName, frame, ref ){
    this.id = id;
    this.name = name;
    this.pointName = pointName;
    this.frame = frame;
    this.ref = ref;
}

QPFBUG.TracePointFactory.prototype = {
    // no fuctions
}

//------------------------------- TracePointDef -------------------------------
// This object is the result of parsing the inserted query by the user
QPFBUG.TracePointDefFactory = function(name){
    //e.g., for "lastChange(A, foo), queryType is 1, refPoint is A, and refObj is foo.
    this.name = name;
    this.queryType = queryType;
    this.refPoint = refPoint;
    this.refObj = refObj;
}

QPFBUG.TracePointDefFactory.prototype = {
    // no functions
}

