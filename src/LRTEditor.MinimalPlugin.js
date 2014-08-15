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
		var selection = editor.getSelection();

		if (9 == e.keyCode && !e.altKey) // tab
		{
			if (selection.start != selection.end || e.shiftKey)
			{
				e.preventDefault();
				return;
			}

			range.insertNode(document.createTextNode("\t"));
		}
		else if (13 == e.keyCode) // enter
		{
			range.deleteContents();
			range.insertNode(document.createTextNode("\n"));

			selection.end = selection.start;
		}
		else
			return;

		selection.start++;
		selection.end++;

		editor.reformat();
		e.preventDefault();

		editor.setSelection(selection);

		// Trigger input event since we changed content. Add delay so _propagate can restoreSelection first
/*		var inputEvent = new Event('input', {
			bubbles: true,
			cancelable: false,
			target: editor.element,
		});

		window.setTimeout(function(){ editor.dispatchEvent('input', [inputEvent]); }, 10);
*/	}
}).apply(LRTEditor_MinimalPlugin);