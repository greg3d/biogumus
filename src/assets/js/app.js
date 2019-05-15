var cmpOnToCompareLinkMinimum = function(){
    siteLib.alert('В избранном пусто.', 'danger');
}

var cmpOnToCompareAdded = function(){
    siteLib.alert('Товар добавлен в избранное.');
};

var cmpOnToCompareRemoved = function(){
    siteLib.alert('Товар убран из избранного.');
};

var SHKbeforeInitCallback = function(){
    SHK.options.buttons_class = 'btn btn-info btn-sm';
};

/**
 * Site library
 *
 */
var siteLib = (function( $ ){

    this.init = function () {
        jQuery('body')
            .tooltip({
                selector: '[data-toggle="tooltip"]',
                container: 'body',
                trigger: 'hover',
                placement: function(){
                    return this.$element.data('placement')
                        ? this.$element.data('placement')
                        : 'bottom';
                }
            });
        jQuery('.slick-slider-one')
            .slick({
                dots: true,
                arrows: true,
                infinite: false,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1
            });

        $('.slick-slider-three')
            .slick({
                slide: '.product-list-item-image',
                dots: true,
                infinite: false,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                centerMode: false,
                responsive: [
                    {
                        breakpoint: 700,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

       //

    }; /// this.init

    this.getRates = function(){
        $('#getRatesResult').html('<div class="ajax-loader">Расчитываю...</div>');

        var action = 'getDeliveryRates';

        $.post(document.location.href, {actionz: action}, function(data) {
    		$('#getRatesResult').html(data);
    	});

    	return false;
    }; // this.getRates



    this.alert = function( msg, type, time ){

        type = type || 'success';
        time = time || 3000;
        var alertClass = 'alert-' + type;
        $('.alert-fixed').remove();

        $('<div/>',{
            'class': 'alert alert-fixed ' + alertClass + ' alert-dismissable',
            'text': msg,
            on: {
                mouseover: function(){
                    clearTimeout( window.alertTimer );
                }
            }
        })
            .css({
                position: 'fixed',
                zIndex: 999,
                bottom: 20,
                left: 20,
                opacity: 0.9
            })
            .append($('<button/>', {
                    'type': 'button',
                    'class': 'close',
                    'html': '&times;',
                    on: {
                        click: function(e){
                            e.preventDefault();
                            clearTimeout( window.alertTimer );
                            $(this).closest('.alert').remove();
                        }
                    }
                }
            ))
            .appendTo('body');

        clearTimeout( window.alertTimer );
        window.alertTimer = setTimeout(function(){
            $('.alert-fixed').remove();
        }, time);

    };//this.alert

    return this;

}).call( {}, jQuery );


function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

$( document ).ready(function() {

    siteLib.init();

    $('.more_info__show').on('click', function(){
        $('.more_info__list').slideToggle(300);
        return false;
    });

    $('.login-toggle').click(function(event){
        $('.loginForm').css('display','block');
        $('.loginForm').removeClass('hide-this');
        $('.login-menu').css('display','none');
        $('.login-menu').addClass('hide-this');
        event.preventDefault();
       event.stopPropagation();
        //return false;
    });

     $('.register-toggle').click(function(event){
        $('.loginForm').css('display','none');
        $('.loginForm').addClass('hide-this');
        $('.login-menu').css('display','block');
        $('.login-menu').removeClass('hide-this');
        event.preventDefault();
       event.stopPropagation();

        //return false;
    });

    // function citySelect() {
    //
    // }
    $("#city-select").click(function(){
        $('#myModal').modal('show');

        $('#myModalCitySelect').html('<div class="ajax-loader">Подождите...</div>');

        var action = 'showCitySelectForm';

        $.post(document.location.href, {action: action}, function(data) {
    		$('#myModalCitySelect').html(data);
    	});

    	return false;
    });

    /*
    var showed2 = readCookie('showed2');
    if (!showed2) {
       $("#city-select").trigger('click');
       createCookie('showed2',1,1);
    }
    */

    $("#consult-select").click(function(){
        $('#consultModal').modal('show');
    });

    $("#consult-select2").click(function(){
        $('#consultModal').modal('show');
    });


    $("#openOferta").click(function(){
        $('#oferta').modal('show');
    	return false;
    });


    $("#chooseCityButton").click(function(){
        $('#myModal').modal('hide');

        //$('#myModalCitySelect').html('.....Подождите....');

        var action = 'chooseCity';
        var id = $("#city-select-form").val();

        $.post(document.location.href, {action: action, city_id: id}, function(data) {
      		$('#city-select').html(data);
          cartCity();
            siteLib.getRates();
            location.reload();
        });
          
        

    	return false;
    });


    function cartCity() {
        var dataCity = $("#city-select").text();
        if (dataCity != 'Самара') {
          $('.order__payment .order__options .radio:nth-child(1)').hide();
          $('.order__delivery .order__options .radio:nth-child(1)').hide();
          $('.order__delivery .order__options .radio:nth-child(2)').hide();
        //   $('.contacts--samara').hide();
        //   $('.contacts--other').show();
        //   $('.address--samara').hide();
        //   $('.address--other').show();
        } else {
          if ($('.order__payment .order__options .radio:nth-child(1)')) {
            var hiddenStyle = $('.order__payment .order__options .radio:nth-child(1)').attr('style') || 'empty';
            if (hiddenStyle.indexOf('display: none;') > -1) {
                $('.order__payment .order__options .radio:nth-child(1)').attr('style', '');
                $('.order__delivery .order__options .radio:nth-child(1)').attr('style', '');
            }
          }
          $('.order__delivery .order__options .radio:nth-child(3)').hide();
        //   $('.contacts--samara').show();
        //   $('.contacts--other').hide();
        //   $('.address--samara').show();
        //   $('.address--other').hide();
        }
        if ($('#cartAddress')) {
          $('#cartAddress').attr('value', dataCity);
        }

    }
    cartCity();

    var isCash = $("input[value='cash']").attr('checked');
    $('input[type=radio][name=payment]').change(function(){
        if (this.value == 'cash') {
            $('input[type=radio][name=shk_delivery][value="Доставка ТК по России"]').attr('disabled','disabled');
            $('input[type=radio][name=shk_delivery][value="Доставка ТК по России"]').prop('checked', false);
        }
        if (this.value != 'cash') {
            $('input[type=radio][name=shk_delivery][value="Доставка ТК по России"]').removeAttr('disabled');
        }
        //alert(this.value);
    });

    $(".main-carousel").owlCarousel({
        //autoplay: 5000,
        smartSpeed: 1000,
        margin: 10,
        loop: true,
        nav: false,
        dots: true,
        items:1
    });
    $("#owl-slider-production").owlCarousel({
        autoplay: 5000,
        loop: true,
        nav: false,
        dots: true,
        margin: 10,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:4
            }
        }
    });


});


function SHKloadCartCallback(){
    siteLib.getRates();
}

var counter = document.getElementById('counter-val');
var counterPlus = document.getElementById('counter-plus');
var counterMinus = document.getElementById('counter-minus');
if (counter) {
  counterMinus.onclick = function() {
    var counterTemp = parseInt(counter.value);
    if (counterTemp > 1) {
      counterTemp -= 1;
      counter.value = counterTemp;
    }
  }
  counterPlus.onclick = function() {
    var counterTemp = parseInt(counter.value);
    counterTemp += 1;
    counter.value = counterTemp;
  }
}


$(document).bind('ready',SHKloadCartCallback);

// console.log($('.product__order .btn').parent().find('#success-check'));

$('.country_delivery__item').click(function() {
    $('.country_delivery__item').removeClass('active');
    $(this).addClass('active');

    var TransKomp = $(this).data('trans');
    $('.transcom').val(TransKomp);
});

$('.product__order .btn').click(function(){
  $(this).parent().find('#success-check').prop('checked',true);
});

$('input[name="phone"]').mask("+7 (999) 999 99 99");

$('[id="consult-select"]').click(function() {
	yaCounter44778274.reachGoal('consult-open');
});
$('.product__order button[type="submit"]').click(function() {
	yaCounter44778274.reachGoal('product-add');
});
$('.shk-item form button[type="submit"]').click(function() {
	yaCounter44778274.reachGoal('product-top-add');
});
$('.shk_prodHelper button#shk_confirmButton').click(function() {
	yaCounter44778274.reachGoal('product-top-add-submit');
});
$(document).on('af_complete', function(event, response) {
    var form = response.form;
    // Если у формы определённый class
    if (form.hasClass('consult-form') && response.success) {
        yaCounter44778274.reachGoal('consult-sent');
    }
});
