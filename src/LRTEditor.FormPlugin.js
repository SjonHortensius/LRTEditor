var LRTEditor_FormPlugin = {};

(function()
{
	"use strict"

	var editor, orgElement;

	this.initialize = function(_editor)
	{
		editor = _editor;

		orgElement = editor.element;
		var code = document.createElement('code');
		code.innerHTML = orgElement.innerHTML;
		code.className = orgElement.className;

		orgElement.parentNode.insertBefore(code, orgElement);
		orgElement.style.display = 'none';

		editor.element = code;

		editor.addEventListener('input',   function(e){ onInput.apply(this, [e]); });
	};

	var onInput = function(e)
	{
		orgElement.value = editor.element.textContent;
	};
}).apply(LRTEditor_FormPlugin);