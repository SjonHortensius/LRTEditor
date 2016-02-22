var LRTEditor = {};

(function()
{
	"use strict"

	var self = this,
		events = {},
		plugins = {};

	this.element = null;
	this.stopPropagation = {};

	this.config = {
		addLineWrapper: true,
		highlightCallback: function(){}
	};

	this.initialize = function(el, plugins, c)
	{
		this.element = el;

		for (var k in c)
			this.config[k] = c[k];

		for (var p in plugins)
		{
			// fallback for strings instead of objects, fixes #10
			if ('object' != typeof plugins[p])
				plugins[p] = window['LRTEditor_' +plugins[p]];

			plugins[p].initialize(this);
		}

		this.element.setAttribute('contentEditable', 'true');
		this.element.setAttribute('autoComplete', 'off');
		this.element.setAttribute('spellCheck', 'false');
	};

	var _propagate = function(e)
	{
		try
		{
			this.dispatchEvent(e.type, [e]);
		}
		catch (ex)
		{
			if (ex != this.stopPropagation)
				throw ex;
		}
	};

	this.reformat = function()
	{
		// Manually trigger an InputEvent; for plugins that modify text
		var inputEvent = new Event('input', {
			bubbles: true,
			cancelable: false,
			target: this.element
		});

		this.dispatchEvent('input', [inputEvent]);
	};

	var traverseText = function(n, c)
	{
		if (n.nodeType == 3)
			c(n);
		else
			for (var i = 0, len = n.childNodes.length; i<len; ++i)
				traverseText(n.childNodes[i], c);
	};

	this.getSelection = function()
	{
		var offset = 0, start = -1, end = -1, found = false, stop = {};
		var processText = function(n)
		{
			if (!found && n == range.startContainer)
			{
				start = offset + range.startOffset;
				found = true;
			}

			if (found && n == range.endContainer)
			{
				end = offset + range.endOffset;
				throw stop;
			}

			offset += n.length;
		}

		var sel = window.getSelection(), range = sel.getRangeAt(0);

		if (sel.rangeCount)
		{
			try
			{
				traverseText(this.element, processText);
			}
			catch (ex)
			{
				if (ex != stop)
					throw ex;
			}
		}

		if (start === -1 || end === -1)
			return null;

		return {
			start: start,
			end: end
		};
	};

	this.setSelection = function(sel)
	{
		if (sel === null)
			return;

		var offset = 0, range = document.createRange(), found = false, stop = {};
		range.collapse(this.element);

		var processText = function(n)
		{
			var nextOffset = offset + n.length;

			if (!found && sel.start >= offset && sel.start <= nextOffset)
			{
				range.setStart(n, sel.start - offset);
				found = true;
			}

			if (found && sel.end >= offset && sel.end <= nextOffset)
			{
				range.setEnd(n, sel.end - offset);
				throw stop;
			}

			offset = nextOffset;
		}

		try
		{
			traverseText(this.element, processText);
		}
		catch (ex)
		{
			if (ex != stop)
				throw ex;

			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
		}
	};

	this.getPlugin = function(p)
	{
		return plugins[p];
	}

	this.addEventListener = function(type, cb)
	{
		if (!events.hasOwnProperty(type))
		{
			events[type] = [];

			// Register actual event which we'll propagate
			this.element.addEventListener(type, function(e){ _propagate.apply(self, [e]); });
		}

		events[type].push(cb);
	};

	this.removeEventListener = function(type, cb)
	{
		if (!events.hasOwnProperty(type))
			return false;

		var index = events[type].indexOf(cb);
		if (-1 != index)
			delete events[type][index];
	};

	this.dispatchEvent = function(type, args)
	{
		if (!events.hasOwnProperty(type))
			return false;

		args = args || [];
		for (var i=0, l=events[type].length; i<l; i++)
			events[type][i].apply(null, args);
	};
}).apply(LRTEditor);