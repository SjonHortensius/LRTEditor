var LRTEditor_HighlightPlugin = {};

(function()
{
	"use strict"

	var editor = null;

	var onInput = function(e)
	{
		var selection = editor.getSelection();

		editor.reformat();

		editor.setSelection(selection);
	};

	this.initialize = function(_editor)
	{
		editor = _editor;

		editor.addEventListener('input', function(e){ onInput.apply(this, [e]); });
	};

}).apply(LRTEditor_HighlightPlugin);
