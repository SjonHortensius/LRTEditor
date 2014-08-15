var LRTEditor_UndoPlugin = {};

(function()
{
	"use strict"

	var editor,
		undoIndex = null,
		ignoreInput,
		revisions = [],
		maxRevisions = 30;

	this.initialize = function(_editor)
	{
		editor = _editor;

		revisions.push({text: editor.element.textContent, selection: {start:0, end:0}});

		editor.addEventListener('keyup',   function(e){ onKeyup.apply(this, [e]); });
		editor.addEventListener('keydown', function(e){ onKeydown.apply(this, [e]); });
		editor.addEventListener('input',   function(e){ onInput.apply(this, [e]); });
	}

	var onKeydown = function(e)
	{
		// input event doesn't contain actual keys; store them here
		ignoreInput = (e.ctrlKey && (90 == e.keyCode || 89 == e.keyCode))
	};

	var onInput = function(e)
	{
		if (ignoreInput)
		{
			// This change was triggered by us
			ignoreInput = false;
			return;
		}

		if (undoIndex)
		{
			// suppose we have 4 revisions in our buffer and ctr+z'ed to undoIndex=2
			// if anything is now typed we truncate buffers 3 & 4
			while (undoIndex < revisions.length-1)
				revisions.pop()

			undoIndex = null;
		}

		editor.stripHtml();

		revisions.push({text: editor.element.textContent, selection: editor.selection});

		if (revisions.length > maxRevisions)
			revisions.shift();
	};

	var onKeyup = function(e)
	{
		if (e.ctrlKey && 90 == e.keyCode) // ctrl+z
		{
			if (undoIndex == null)
				undoIndex = revisions.length-1;

			undoIndex--;

			if (undoIndex < 0)
				return;
		}
		else if (e.ctrlKey && 89 == e.keyCode && undoIndex != null) // ctrl+y
		{
			undoIndex++;

			if (undoIndex > revisions.length-1)
			{
				undoIndex--;
				return;
			}
		}
		else
			return;

		editor.element['textContent'] = revisions[ undoIndex ].text;
		editor.selection = revisions[ undoIndex ].selection;


		editor.highlight();
	};
}).apply(LRTEditor_UndoPlugin);
