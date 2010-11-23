var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    //--------------------------------- ScriptAnalyzer --------------------------------
    QPFBUG.Classes.ScriptAnalyzer =
        function(){

            //The source is pretty-printed
            var constructor = function(source){
                this.jsParser = JSParser.getInstance();

                //the source of a script is usually starts with this "function()"
                // parser requires an identifier for this function
                if (source.match(/^(\s)*function(\s)*\(/)!=null)        //starts with function(
                {
                    this.isTopScript = false;
                    source = "___XXX___function = " + source;
                }else
                {
                    this.isTopScript = true;
                }

                this.root = this.jsParser.parse(source)
                log("ScriptAnalyzer : ROOT", this.root);
            };

            constructor.prototype = {

                // this returns all reference strings that somewhere in script that
                // a new created objected is assigned to them

                // if only outer script is true it only returns the results for
                // the outer script.
                getRefsToCreatedObjects: function(onlyOuterScript)
                {
                    var root = this.root;
                    var jsParser = this.jsParser;
                    var noMoreFunctions = false;
                    if (onlyOuterScript){
                        if (this.isTopScript){
                            noMoreFunctions = true;
                        }
                    }

                    var refs = [];
                    var ref;

                    var nodesToInvestigate = [];
                    nodesToInvestigate.push(root);

                    var scriptScopes = [];
                    var scriptScope = {parentsPath : [], parentRef : null}


                    while (nodesToInvestigate.length > 0)
                    {
                        var node = nodesToInvestigate[nodesToInvestigate.length-1];

                        if (onlyOuterScript && node.type == jsParser.FUNCTION)
                        {
                            if (noMoreFunctions)
                            {
                                nodesToInvestigate.pop();
                                continue;
                            }
                            noMoreFunctions = true;  // it can only see functions once  to pass ___XXX___function
                        }

                        if (!node.marked){ //we are entering to this node
                            node.marked = true;

                        }else{             //we are going out of this node
                            nodesToInvestigate.pop();    //remove the node

                            if (node.type == jsParser.FUNCTION)
                            {
                                scriptScope = scriptScopes.pop();
                            }

                            if (node.type == jsParser.ASSIGN ||
                                jsParser.PROPERTY_INIT ||
                                jsParser.VAR)
                            {
                                if (node === scriptScope.parentsPath[scriptScope.parentsPath.length-1])
                                {
                                    scriptScope.parentsPath.pop();
                                    if (scriptScope.parentRef && scriptScope.parentRef.lastIndexOf(".")>-1)
                                        scriptScope.parentRef = scriptScope.parentRef.substring(0, scriptScope.parentRef.lastIndexOf("."));
                                    else
                                        scriptScope.parentRef = null;
                                }
                            }
                            continue;
                        }

                        if (node.type == jsParser.FUNCTION)
                        {
                            scriptScopes.push(scriptScope); //keep the parent scriptScope
                            scriptScope = {parentsPath: [], parentRef: null}
                        }

                        if (node.type == jsParser.ASSIGN ||
                            node.type == jsParser.PROPERTY_INIT)
                        {
                            if (node[1].type == jsParser.OBJECT_INIT)
                            {
                                if (scriptScope.parentRef)
                                    ref = scriptScope.parentRef + "." + node[0].getSource();
                                else{
                                    ref = node[0].getSource();
                                }
                                refs.push(ref);
                                scriptScope.parentRef = ref;
                                scriptScope.parentsPath.push(node);
                            }
                        }

                        if (node.type == jsParser.VAR &&
                            node[0].initializer)
                        {
                            if (node[0].initializer.type == jsParser.OBJECT_INIT)
                            {
                                if (scriptScope.parentRef)
                                    ref = scriptScope.parentRef + "." + node[0].name;
                                else{
                                    ref = node[0].name;
                                }
                                refs.push(ref);
                                scriptScope.parentRef = ref;
                                scriptScope.parentsPath.push(node);
                            }
                        }

                        for (var i in node) {
                            if (node.hasOwnProperty(i) && i != 'type' && i != 'target' && i != 'marked' &&
                                node[i] && node[i].constructor && node[i].constructor.name == "Node") // just Node children
                            {
                                nodesToInvestigate.push(node[i]);
                            }

                        }

                    }

                    return refs;
                }

            }

            return constructor;
        }();

}}
};