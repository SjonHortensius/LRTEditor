var LRTEditor_MinimalPlugin = {};

(function()
{
	"use strict"

	var editor = null;

	this.initialize = function(_editor)
	{
		editor = _editor;

		editor.addEventListener('keydown', function(e){ onKeydown.apply(this, [e]); });
	};

	var onKeydown = function(e)
	{
		var range = window.getSelection().getRangeAt(0);

		if (9 == e.keyCode && !e.altKey) // tab
		{
			if (editor.selection.start != editor.selection.end || e.shiftKey)
			{
				e.preventDefault();
				return;
			}

			range.insertNode(document.createTextNode("\t"));
		}
		else if (13 == e.keyCode) // enter
		{
			range.deleteContents();
			range.insertNode(document.createTextNode("\n\u200B"));
		}
		else
			return;

		editor.selection.start++;
		editor.selection.end++;
		editor.reformat();
		e.preventDefault();

		// Trigger input event since we changed content. Add delay so _propagate can restoreSelection first
/*		var inputEvent = new Event('input', {
			bubbles: true,
			cancelable: false,
			target: editor.element,
		});

		window.setTimeout(function(){ editor.dispatchEvent('input', [inputEvent]); }, 10);
*/	}
}).apply(LRTEditor_MinimalPlugin);