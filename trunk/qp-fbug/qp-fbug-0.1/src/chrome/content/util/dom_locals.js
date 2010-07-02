//A copy of dom.js local functions
// ************************************************************************************************
// Local Helpers

function isClassFunction(fn)
{
    try
    {
        for (var name in fn.prototype)
            return true;
    } catch (exc) {}
    return false;
}

function isArguments(obj)
{
    try
    {
        return isFinite(obj.length) && obj.length > 0 && typeof obj.callee === "function";
    } catch (exc) {}
    return false;
}

function addMember(object, type, props, name, value, level, order, context)
{
    var rep = Firebug.getRep(value);    // do this first in case a call to instanceof reveals contents
    var tag = rep.shortTag ? rep.shortTag : rep.tag;

    var valueType = typeof(value);
    var hasChildren = hasProperties(value) && !(value instanceof ErrorCopy) &&
        (valueType == "function" || (valueType == "object" && value != null)
        || (valueType == "string" && value.length > Firebug.stringCropLength));

    // Special case for "arguments", which is not enumerable by for...in statement
    // and so, hasProperties always returns false.
    if (!hasChildren && value) // arguments will never be falsy if the arguments exist
        hasChildren = isArguments(value);

    var member = {
        object: object,
        name: name,
        value: value,
        type: type,
        rowClass: "memberRow-"+type,
        open: "",
        order: order,
        level: level,
        indent: level*16,
        hasChildren: hasChildren,
        tag: tag
    };

    // The context doesn't have to be specified (e.g. in case of Watch panel that is based
    // on the same template as the DOM panel, but doesn't show any breakpoints).
    if (context)
    {
        // xxxHonza: Support for object change not implemented yet.
        member.breakable = !hasChildren;

        // xxxHonza: Disable breaking on direct window properties, see #520572
        if (object instanceof Ci.nsIDOMWindow)
            member.breakable = false;

        var breakpoints = context.dom.breakpoints;
        var bp = breakpoints.findBreakpoint(object, name);
        if (bp)
        {
            member.breakpoint = true;
            member.disabledBreakpoint = !bp.checked;
        }
    }

    // If the property is implemented using a getter function (and there is no setter
    // implemented) use a "get" prefix that is displayed in the UI.
    var o = unwrapObject(object);
    member.prefix = (o.__lookupGetter__(name) && !o.__lookupSetter__(name)) ? "get " : "";

    props.push(member);
    return member;
}

function getWatchRowIndex(row)
{
    var index = -1;
    for (; row && hasClass(row, "watchRow"); row = row.previousSibling)
        ++index;
    return index;
}

function getRowName(row)
{
    var labelNode = row.getElementsByClassName("memberLabelCell").item(0);
    return labelNode.textContent;
}

function getRowValue(row)
{
    var valueNode = row.getElementsByClassName("memberValueCell").item(0);
    return valueNode.firstChild.repObject;
}

function getRowOwnerObject(row)
{
    var parentRow = getParentRow(row);
    if (parentRow)
        return getRowValue(parentRow);
}

function getParentRow(row)
{
    var level = parseInt(row.getAttribute("level"))-1;
    // If it's top level object the level is now set to -1, is that a problem?
    for (row = row.previousSibling; row; row = row.previousSibling)
    {
        if (parseInt(row.getAttribute("level")) == level)
            return row;
    }
}

function getPath(row)
{
    var name = getRowName(row);
    var path = [name];

    var level = parseInt(row.getAttribute("level"))-1;
    for (row = row.previousSibling; row; row = row.previousSibling)
    {
        if (parseInt(row.getAttribute("level")) == level)
        {
            var name = getRowName(row);
            path.splice(0, 0, name);

            --level;
        }
    }

    return path;
}

function findRow(parentNode, object)
{
    var rows = parentNode.getElementsByClassName("memberRow");
    for (var i=0; i<rows.length; i++)
    {
        var row = rows[i];
        if (object == row.domObject.object)
            return row;
    }

    return row;
}
