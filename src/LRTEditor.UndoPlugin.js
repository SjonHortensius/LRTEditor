var LRTEditor_UndoPlugin = {};

(function(){
	"use strict"

	var editor,
		undoIndex = null,
		ignoreInput,
		revisions = [],
		maxRevisions = 30;

	this.initialize = function(_editor){
		editor = _editor;

		editor.addEventListener('keyup',   function(e){ onKeyup.apply(this, [e]); });
		editor.addEventListener('keydown', function(e){ onKeydown.apply(this, [e]); });
		editor.addEventListener('input',   function(e){ onInput.apply(this, [e]); });
	}

	var onKeydown = function(e)
	{
		if (0 == revisions.length)
		{
			editor.stripHtml();
			revisions.push({html: editor.element.innerHTML, selection: editor.selection});
			editor.highlight();
		}

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
			while (undoIndex < revisions.length-1)
				revisions.pop()

			undoIndex = null;
		}

		editor.stripHtml();

		revisions.push({html: editor.element.innerHTML, selection: editor.selection});

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

		editor.element.innerHTML = revisions[ undoIndex ].html;
		editor.selection = revisions[ undoIndex ].selection;

		editor.highlight();
	};
}).apply(LRTEditor_UndoPlugin);