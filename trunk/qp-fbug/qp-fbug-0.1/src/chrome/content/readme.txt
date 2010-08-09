Querypoint debugging source notes for jjb

A common pattern in the source is

  object.AName =   // Capital because this will create new objects
    function() {   // This function will be called during compilation, see below!
       var constructor = function(){  // This function will become the value of AName
                 ... code..
            };

            constructor.prototype = {  // These properties will be properties of new AName objects
                  ...property definitions...
            };

            constructor.foo = {  // These will be properties of AName itself
            };

            return constructor;  // The variable constructor is local, not part of these objects.
        }();  // Here we run the function just defined.

Then we can create new objects by
     var aNewObject = new object.AName();
or commonly
    with (object)
    {
        var aNewObject = new AName();
    }


Manager contains
  Datastore contains  // why so generic?
    DebugSession contains
      DebugModel contains
        QueryPoints contains
          url
          lineNo
          traceObjects contains
            // three fields I don't understand
      Reproductions
    Reproductions  // why are reproductions in two places?