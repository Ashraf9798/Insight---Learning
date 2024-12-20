$(document).ready(function() {

    $('#add-fav').on('submit', function(e) { 
        e.preventDefault();
        var id = $('#id').val();
        var clubName = $('#clubName').val();
        
        $.ajax({
            type: "POST",
            url: "/home",
            data: { id, clubName },
            success: function() {
                alert(`${clubName} added to favourites`);
                // console.log(`${clubName} added to favourites`);
            }
        });
    });

});