var LRTEditor_FormPlugin = {};

// Expose as CommonJS module.
if(typeof module != "undefined" && typeof module.exports == "object") {
	module.exports = LRTEditor_FormPlugin;
}

(function()
{
	"use strict"

	var editor, orgElement;

	this.initialize = function(_editor)
	{
		editor = _editor;

		orgElement = editor.element;
		var code = document.createElement('code');
		code.textContent = orgElement.textContent;
		code.className = orgElement.className;

		orgElement.parentNode.insertBefore(code, orgElement);
		orgElement.style.display = 'none';

		editor.element = code;

		editor.addEventListener('input', function(e){ onInput.apply(this, [e]); });
	};

	var onInput = function(e)
	{
		orgElement.value = editor.element.textContent;
	};
}).apply(LRTEditor_FormPlugin);
