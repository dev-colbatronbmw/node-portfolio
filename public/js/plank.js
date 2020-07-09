$(document).ready(function () {
    $('.brand-cart').hide();
    var myDiv = $('.brand-cart');
    $('.brand-cart').addClass('.border')
    $('.brand-cart').addClass('.border-danger')
    myDiv.hide();
    $(window).scroll(function () {

        if ($(document).scrollTop() > 5) {
            $('.brand-cart').show();

            $('.hide').hide().removeClass('hide');
            myDiv.show();
            myDiv.removeAttr('hidden')
        } else {
            $('.brand-cart').hide();
            myDiv.hide();


        }

    });
});