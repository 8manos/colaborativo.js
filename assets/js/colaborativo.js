$( document ).ready(function() {
 
    topNavSpace = function () {
    	var header_height = $('#header').height();
    	$('.tablero').css('padding-top', header_height);
    }

    topNavSpace();

    var resizeTimeout;  // global for any pending resizeTimeout

	$(window).on('resize', function () {
		if (resizeTimeout) {
			// clear the timeout, if one is pending
			clearTimeout(resizeTimeout);
			resizeTimeout = null;
		}
		resizeTimeout = setTimeout(topNavSpace, 250);
	});
 
});