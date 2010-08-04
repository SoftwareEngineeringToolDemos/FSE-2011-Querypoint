/* See license.txt for terms of usage */

FBL.ns(function() { with (FBL) {
	

// ************************************************************************************************

/*
 * 
 * @panel A Firebug panel that displays and controls Querypoint functionality. It looks like the script panel but act
 * differently
 */
 
 
FBTrace.sysout("Querypoint top level", Firebug);
	
Firebug.QPPanel = function QPPanel() {};

// Class definition
Firebug.QPPanel.getDefaultPreferences = function()
{
	FBTrace.sysout("getDefaultPreferences ");
	return [{name: "querypoints.enableSites", value: false}];
}

// Instance definition
Firebug.QPPanel.prototype = extend(Firebug.ScriptPanel.prototype,
{
	name: "querypoints",
	title: "QP",
	parentPanel: null,
	enableA11y: true,
	deriveA11yFrom: "script",    
});

try
{
	Firebug.registerStylesheet("chrome://qpfbug/content/ui/querypoints.css");
}
catch(exc)
{
	FBTrace.sysout("Firebug.QPPanel registerStylesheet FAILS "+exc, exc);
}

Firebug.registerPanel(Firebug.QPPanel);

}});