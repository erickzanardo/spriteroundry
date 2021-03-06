(function($) {
	$.holyavenger.parseTemplate = function(template, context, callback) {
		template = $(template);
		var selector = template.attr('id') ? '#' + template.attr('id')
				: template.attr('selector');
		if (template.attr('target')) {
			selector = eval(template.attr('target'));
		}
		if (!selector) {
			throw "<template> requires id or selector attribute";
		}
		if (!template.attr('append')) {
			$(selector).html('');
		}
		var text = $.holyavenger.readText(template);
		template = TrimPath.parseTemplate(text);
		var result = template.process(context);
		if (result.exception) {
			throw result.exception;
		}
		$(selector).append(result);
		callback();
	}
	$.holyavenger.addParsers({
		'template' : $.holyavenger.parseTemplate
	});

	$.fn.trimpath = function(template, ctx) {
		var parsed = TrimPath.parseTemplate(template);
		var result = parsed.process(ctx);
		$(this).html(result);
		return this;
	}

	$.fn.appendTrimpath = function(template, ctx) {
		var parsed = TrimPath.parseTemplate(template);
		var result = parsed.process(ctx);
		$(this).append(result);
		return this;
	}
})(jQuery);