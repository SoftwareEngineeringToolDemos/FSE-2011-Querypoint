function runTest()
{
        var QPFBUG = FBTest.FirebugWindow.QPFBUG;
        var Firebug = FBTest.FirebugWindow.Firebug;

        var source = "function (arg) { }";
//        var source = "function (arg) { console.log(\"eeeeeeeeeee\"); console.log(arguments.caller); var insideFunction = {myInside: function () {var foo;foo++;return foo;}(), infun: x + 4}; var insideFunction2 = {myInside: function () {var foo = {bar: 5};foo.bar++;return foo;}(), infun: x + 4}; var myObject3 = "zzzzzzzzzzzzzzzzzzz"; myObject = "zzzzzzzzzzzzzzzzzzz"; myObject2 = \"oooooooooooooooooo\"; var myProp = \"999999\"; insideFunction.infun++; return insideFunction; }";
        var scriptAnalyzer = new QPFBUG.Classes.ScriptAnalyzer(source);
        FBTrace.sysout("root", scriptAnalyzer.root);

        FBTest.testDone();

};
