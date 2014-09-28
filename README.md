ABOUT
=====

Looking for a modern Rich Text Editor? LRTEditor is the way to go! We don't support older browsers; meaning this is the smallest text editor with syntax highlighting you'll find.
LRTEditor doesn't depend on a specific highlighter; I like [shjs](https://github.com/SjonHortensius/shjs). so I have included that; but any highlighter should work just fine.

When served minified and compressed; [LRTEditor](https://github.com/SjonHortensius/LRTEditor/blob/master/LRTEditor.min.js) is currently ~ 1.5KiB; [shjs](https://github.com/SjonHortensius/shjs/blob/master/sh_main.min.js) is ~ 1KiB.

FEATURES
========

LRTEditor comes with a simple plugin architecture allowing you to add functionality quickly.

LRTEditor provides:
* get/setSelection; to restore selection and cursor
* add/remove/dispatchEvent; to forward events to plugins

LRTEditor_HighlightPlugin provides:
* handler for any input; reformatting code whenever a change is made

LRTEditor_MinimalPlugin provides:
* handler for tab-key; to insert a tab instead of changing focus
* handler for enter-key; to prevent the browser from inserting a `<DIV>` element
* handler for paste-event; forces plain-text to be pasted, preventing whitespace issues

LRTEditor_UndoPlugin provides:
* handler for ctrl+z/y; for undo/redo functionality

LRTEditor_FormPlugin provides:
* form-functionality; pass a textarea as element and we'll replace it and keep it updated

USAGE
=====

Using LRTEditor is easy; include the files and configure the highlighter:

```html
<script src="LRTEditor/shjs/lang/sh_php.js"></script>
<script src="LRTEditor/shjs/sh_main.min.js"></script>
<script src="LRTEditor.js"></script>
<script src="LRTEditor.HighlightPlugin.js"></script>
<script src="LRTEditor.MinimalPlugin.js"></script>
<script src="LRTEditor.UndoPlugin.js"></script>
<script>
	window.addEventListener('load', function(){
		LRTEditor.initialize(
			document.getElementsByTagName('code')[0],
			['MinimalPlugin', 'UndoPlugin', 'HighlightPlugin'],
			{
				highlightCallback: function(el){ sh_highlightElement(el, sh_languages['php']); },
			}
		);
	});
</script>
```
