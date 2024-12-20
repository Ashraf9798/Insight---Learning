(function($) {
    $.deparam = $.deparam || function(uri) {
        if(uri === undefined) {
            uri = window.location.pathname;
        }
        var val1 = window.location.pathname;
        var val2 = val1.split('/');
        var val3 = val2.pop();
        return val3;
    }
})(jQuery);