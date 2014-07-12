var LRTEditor_MinimalPlugin = {};

(function(){
	"use strict"

	var editor = null;

	this.initialize = function(_editor){
		editor = _editor;

		editor.addEventListener('keydown', function(e){ onKeydown.apply(this, [e]); });
	};

	var onKeydown = function(e)
	{
		var range = window.getSelection().getRangeAt(0);

		if (9 == e.keyCode && !e.shiftKey && !e.altKey) // tab
		{
			// Not supported (yet?)
			if (editor.selection.start != editor.selection.end)
				return e.preventDefault();

			range.insertNode(document.createTextNode("\t"));

			editor.selection.start++;
			editor.selection.end++;
		}
		else if (13 == e.keyCode)
		{
			range.deleteContents();
			range.insertNode(document.createTextNode("\n"));
			editor.selection.start += 2;
			editor.selection.end = editor.selection.start;
		}
		else
			return;

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