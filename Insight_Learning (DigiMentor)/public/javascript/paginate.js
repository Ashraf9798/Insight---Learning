
$(document).ready(function() {
    $('.paginate').slice(0, 3).show();
    loadMore('.paginate');
});

function loadMore(divClass) {
    $('#loadMore').on('click', function(e) {
        e.preventDefault();
        $(divClass+":hidden").slice(0, 2).slideDown();
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000);
    });
    $('#linkTop').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });
}