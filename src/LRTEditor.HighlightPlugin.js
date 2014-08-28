var LRTEditor_HighlightPlugin = {};

(function()
{
	"use strict"

	var editor = null;

	this.initialize = function(_editor)
	{
		editor = _editor;

		editor.addEventListener('input', function(e){ onInput.apply(this, [e]); });
		editor.highlight();
	};

	var onInput = function(e)
	{
		var selection = editor.getSelection();

		// Yes, this strips the html; keeping white-space intact
		editor.element['textContent'] = editor.element.textContent;
		editor.highlight();

		editor.setSelection(selection);
	};
}).apply(LRTEditor_HighlightPlugin);
