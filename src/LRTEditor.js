var LRTEditor = new Class({
	Implements: Events,
	element: null,
	plugins: {},
	_stopPropagation: {},
	selection: null,
	_highlightCallback: null,

	initialize: function(el, plugins, highlightCallback)
	{
		this.element = el;
		this._highlightCallback = highlightCallback;

		plugins.each(function(p){
			this.plugins[p] = new LRTEditor[p](this);
		}.bind(this));

		this.element.addEvent('keydown', this._propagate.bind(this));
		this.element.addEvent('keyup', this._propagate.bind(this));
		this.element.addEvent('input', this._propagate.bind(this));

		this.highlight();
		this.element.setProperty('contentEditable', 'true');
	},

	_propagate: function(e)
	{
		this.selection = this.saveSelection();

		try
		{
			this.fireEvent(e.type, e);
		}
		catch (ex)
		{
			if (ex != this._stopPropagation)
				throw ex;

			return;
		}

		if ('input' == e.type)
			this.reformat();

		this.restoreSelection(this.selection);
	},

	stripHtml: function(el)
	{
		if (!el)
			el = this.element;

		el.set('text', el.textContent);
	},

	highlight: function()
	{
		this._highlightCallback(this.element);

		this.element.innerHTML = '<span class="line">'+ this.element.innerHTML.replace(/\n/g, '</span>\n<span class="line">') +'</span>';
	},

	reformat: function()
	{
		this.stripHtml();
		this.highlight();
	},

	traverseText: function(n, c)
	{
		if (n.nodeType == 3)
			c(n);
		else
			for (var i = 0, len = n.childNodes.length; i<len; ++i)
				this.traverseText(n.childNodes[i], c);
	},

	saveSelection: function()
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
				this.traverseText(this.element, processText);
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
	},

	restoreSelection: function(sel)
	{
		var offset = 0, range = document.createRange(), found = false, stop = {};
		range.collapse(this.element, 0);

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
			this.traverseText(this.element, processText);
		}
		catch (ex)
		{
			if (ex != stop)
				throw ex;

			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
		}
	},
});