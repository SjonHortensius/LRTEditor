var LRTEditor_MinimalPlugin = {};

(function()
{
	"use strict"

	var editor = null;

	this.initialize = function(_editor)
	{
		editor = _editor;

		editor.addEventListener('keydown', function(e){ onKeydown.apply(this, [e]); });
		editor.addEventListener('paste', function(e){ onPaste.apply(this, [e]); });

		// Firefox: fix https://bugzilla.mozilla.org/show_bug.cgi?id=116083
		if ('undefined' !== typeof InstallTrigger)
			editor.addEventListener('highlight', function(e){ onHighlight.apply(this, [e]); });
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

		editor.setSelection(selection);
		editor.reformat();

		e.preventDefault();
	};

	var onPaste = function(e)
	{
		// Manually insert plain-text contents so we keep newlines
		var range = window.getSelection().getRangeAt(0);
		range.deleteContents();

		var selection = editor.getSelection();
		var text = e.clipboardData.getData('text/plain');
		range.insertNode(document.createTextNode(text));

		selection.start = (selection.end += text.length);
		e.preventDefault();
		editor.setSelection(selection);
		editor.reformat();
	};

	var onHighlight = function(e)
	{
		var pre = document.createElement('pre');
		pre.className='firefox-bug116083';
		pre.appendChild(editor.element.firstChild);
		editor.element.appendChild(pre);
	};
}).apply(LRTEditor_MinimalPlugin);