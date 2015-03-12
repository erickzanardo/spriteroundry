(function($) {
	// CENTRALIZE FUNCTION - Use this to center absolute box in the browser
	jQuery.fn.center = function(parent) {

		var ref = $(window);
		if (parent) {
			ref = $(this).offsetParent();
		}
		
		this.css("position", "absolute");
		this.css("top", (ref.height() - this.height() ) / 2.5 + ref.scrollTop() + "px");
		this.css("left", (ref.width() - this.width() ) / 2 + ref.scrollLeft() + "px");
		return this;
	}
})(jQuery);