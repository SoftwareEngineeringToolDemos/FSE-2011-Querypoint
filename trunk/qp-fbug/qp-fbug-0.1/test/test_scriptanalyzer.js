function runTest()
{
    var QPFBUG = FBTest.FirebugWindow.QPFBUG;
    var Firebug = FBTest.FirebugWindow.Firebug;

    var script1 = "function(){}";

    var script2 = "function(){ "
         + "\n" + "    var foo; "
         + "\n" + "    foo.x[2] = {  "
         + "\n" + "        bar : 1"
         + "\n" + "    }; "
         + "\n" + "    return foo;"
         + "\n" + "}"

    analyzeSource(script1);
    analyzeSource(script2);

    FBTest.testDone();

};

function analyzeSource(source)
{
    var QPFBUG = FBTest.FirebugWindow.QPFBUG;
    var scriptAnalyzer = new QPFBUG.Classes.ScriptAnalyzer(source);
    Node node = scriptAnalyzer.root;

    var assignees = [];

    var a = [];
    a.push(node);
    var
    while (a.length > 0)
    {
        for (var i in this) {
            if (this.hasOwnProperty(i) && i != 'type' && i != 'target')
                a.push({id: i, value: this[i]});
        }

        if (node.type == scriptAnalyzer.jsParser.ASSIGN)
        {
             if (node[1] == scriptAnalyzer.jsParser.OBJECT_INIT)
             {
                node[0].getSource();
             }
        }



        a.sort(function (a,b) { return (a.id < b.id) ? -1 : 1; });
        const INDENTATION = "    ";
        var n = ++Node.indentLevel;
        var s = "{\n" + INDENTATION.repeat(n) + "type: " + tokenstr(this.type);
        for (i = 0; i < a.length; i++)
            s += ",\n" + INDENTATION.repeat(n) + a[i].id + ": " + a[i].value;
        n = --Node.indentLevel;
        s += "\n" + INDENTATION.repeat(n) + "}";
        return s;
    }


    FBTrace.sysout("root", scriptAnalyzer.root);
}
