function runTest()
{
    var QPFBUG = FBTest.FirebugWindow.QPFBUG;
    var Firebug = FBTest.FirebugWindow.Firebug;

    var assignees;

    var script1 = "function(){}";

    assignees = analyzeSource(script1);
    FBTest.compare(0, assignees.length, "Script 1"); //

    var script2 = "function(){ "
         + "\n" + "    var foo; "
         + "\n" + "    foo.x[2] = {  "
         + "\n" + "        bar : {"
         + "\n" + "            baz : 5"
         + "\n" + "            }"
         + "\n" + "    }; "
         + "\n" + "    return foo;"
         + "\n" + "}"

    assignees = analyzeSource(script2);
    FBTest.compare(2, assignees.length, "Script 2"); //foo.x[2] & foo.x[2].bar
    FBTest.compare("foo.x[2]", assignees[0], "Script 2");
    FBTest.compare("foo.x[2].bar", assignees[1], "Script 2");

    var script3 = "function(){ "
         + "\n" + "    var foo; "
         + "\n" + "    foo.x[2] = {  "
         + "\n" + "        bar : function(){"
         + "\n" + "            var baz = {"
         + "\n" + "                foo2 : 5"
         + "\n" + "            }"
         + "\n" + "        }"
         + "\n" + "    }; "
         + "\n" + "    return foo;"
         + "\n" + "}"

    assignees = analyzeSource(script3);
    FBTest.compare(2, assignees.length, "Script 3"); //foo.x[2] & baz
    FBTest.compare("foo.x[2]", assignees[0], "Script 3");
    FBTest.compare("baz", assignees[1], "Script 3");

    var script4 = "function(){ "
         + "\n" + "    var foo; "
         + "\n" + "    foo.x[2] = {  "
         + "\n" + "        bar : function(){"
         + "\n" + "            var baz = {"
         + "\n" + "                foo2 : {"
         + "\n" + "                    foo2 : 5,"
         + "\n" + "                    bar2 : function(){"
         + "\n" + "                         baz2 = {"
         + "\n" + "                             foo3: 5"
         + "\n" + "                         }"
         + "\n" + "                    }"
         + "\n" + "                }"
         + "\n" + "            }"
         + "\n" + "        }"
         + "\n" + "    }; "
         + "\n" + "    return foo;"
         + "\n" + "}"

    assignees = analyzeSource(script4);
    FBTest.compare(4, assignees.length, "Script 4");
    FBTest.compare("foo.x[2]", assignees[0], "Script 4");
    FBTest.compare("baz", assignees[1], "Script 4");
    FBTest.compare("baz.foo2", assignees[2], "Script 4");
    FBTest.compare("baz2", assignees[3], "Script 4");

    assignees = analyzeSource(script4, true);
    FBTest.compare(1, assignees.length, "Script 4 - Outer");
    FBTest.compare("foo.x[2]", assignees[0], "Script 4 - Outer");

    FBTest.testDone();

};

function analyzeSource(source, onlyOuterScript)
{
    var QPFBUG = FBTest.FirebugWindow.QPFBUG;
    var scriptAnalyzer = new QPFBUG.Classes.ScriptAnalyzer(source);
//    FBTrace.sysout("root", scriptAnalyzer.root);
    return scriptAnalyzer.getObjectRefsToCreatedObjects(onlyOuterScript);
}
