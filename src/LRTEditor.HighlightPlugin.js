var LRTEditor_HighlightPlugin = {};

(function()
{
	"use strict"

	var editor = null;

	this.initialize = function(_editor)
	{
		editor = _editor;

		editor.addEventListener('input', function(e){ onInput.apply(this, [e]); });
		highlight();
	};

	var onInput = function(e)
	{
		var selection = editor.getSelection();

		// Strip html; keeping white-space intact
		editor.element['textContent'] = editor.element.textContent;

		highlight();
		editor.setSelection(selection);
	};

	var highlight = function()
	{
		editor.config.highlightCallback(editor.element);

		// Please don't change this
		if (editor.config.addLineWrapper)
			editor.element.innerHTML = '<div><span class="line">'+ editor.element.innerHTML.replace(/\n\n$/, '\n').replace(/\n/g, '\n</span><span class="line">') +'</span>\n</div>';

		var highlightEvent = new Event('highlight', {
			bubbles: false,
			cancelable: false,
			target: editor
		});

		editor.dispatchEvent('highlight', [highlightEvent]);
	};
}).apply(LRTEditor_HighlightPlugin);