var LRTEditor = {};

(function(){
	"use strict"

	var highlightCallback,
		self = this,
		events = {},
		plugins = {};

	this.element = null;
	this.selection = null;
	this.stopPropagation = {};

	this.initialize = function(el, _plugins, cb){
		this.element = el;
		highlightCallback = cb;

		_plugins.forEach(function(p){
			plugins[p] = window['LRTEditor_' +p].initialize(this);
		}.bind(this));

		this.element.addEventListener('keydown', function(e){ _propagate.apply(self, [e]); });
		this.element.addEventListener('keyup',   function(e){ _propagate.apply(self, [e]); });
		this.element.addEventListener('input',   function(e){ _propagate.apply(self, [e]); });

		this.highlight();
		this.element.setAttribute('contentEditable', 'true');
	};

	var _propagate = function(e)
	{
		this.selection = this.getSelection();

		try
		{
			this.dispatchEvent(e.type, [e]);
		}
		catch (ex)
		{
			if (ex != this.stopPropagation)
				throw ex;

			return;
		}

		if ('input' == e.type)
			this.reformat();

		this.setSelection(this.selection);
	};

	this.stripHtml = function(el)
	{
		if (!el)
			el = this.element;

		// Yes, this strips the html; keeping white-space intact
		el['textContent'] = el.textContent;
	};

	this.highlight = function()
	{
		highlightCallback(this.element);

		this.element.innerHTML = '<span class="line">'+ this.element.innerHTML.replace(/\n/g, '</span>\n<span class="line">') +'</span>';
	};

	this.reformat = function()
	{
		this.stripHtml();
		this.highlight();
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
		var offset = 0, start = 0, end = 0, found = false, stop = {};
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

		return {
			start: start,
			end: end
		};
	};

	this.setSelection = function(sel)
	{
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

	this.addEventListener = function(type, cb){
		if (!events.hasOwnProperty(type))
			events[type] = [];

		events[type].push(cb);
	};

	this.removeEventListener = function(type, cb){
		if (!events.hasOwnProperty(type))
			return false;

		var index = events[type].indexOf(cb);
		if (-1 != index)
			delete events[type][index];
	};

	this.dispatchEvent = function(type, args){
		if (!events.hasOwnProperty(type))
			return false;

		args = args || [];
		for (var i=0, l=events[type].length; i<l; i++)
			events[type][i].apply(null, args);
	};
}).apply(LRTEditor);