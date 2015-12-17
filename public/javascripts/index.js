$(document).ready(function() {
    $('body').scrollspy({ target: '.navbar' });
    smooth_scroll($);
    cover_hide();
    navbar_fade($);
});

//***** UX FUNCTIONS *****
function smooth_scroll(object) {
    $('.chart-link').on('click', function(e){
        console.log("Stopping Click");
        e.preventDefault();

        var hash = this.hash;

        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 800, function(){
            window.location.hash = hash;
        });
    });
};

function navbar_fade(object){
    $(document).ready(function(){
        $('.navbar').hide();
    });

    $(function() {
        $(window).scroll(function(){
            if ($(this).scrollTop() > 0) {
                $('.navbar').fadeIn();
            } else {
                $('.navbar').fadeOut();
            };
        });
    });
}//#navbar_fade END

function cover_hide(){
    $('.cover').on('click', function(e){
        e.preventDefault();
        $('.cover').hide();
    });
}

function discoverBtn(){
    $('#front_btn').on('click', function(e){
        e.preventDefault();
        $('body').scrollspy({ target: '.navbar' });
    })
}



