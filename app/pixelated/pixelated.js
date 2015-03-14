(function($) {
  pixelated = {
    modal: function(selector, show) {
      var modal = $(selector);
      modal.find('[data-pyxel-action=close]').unbind('click');
      
      var overlay = $('.pixel-modal-overlay');
      if (!overlay.length) {
        $('<div class="pixel-modal-overlay"></div>').appendTo('body');
        overlay = $('.pixel-modal-overlay');
      }

      if (show && !modal.is(':visible')) {
        modal.find('[data-pyxel-action=close]').click(function() {
          overlay.hide();
          modal.hide();
        });
        overlay.show();
        modal.show();
      } else if (!show) {
        overlay.hide();
        modal.hide();
      }
    }
  };
})(jQuery);