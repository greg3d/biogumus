var cmpOnToCompareLinkMinimum = function () {
    siteLib.alert('В избранном пусто.', 'danger');
};

var cmpOnToCompareAdded = function () {
    siteLib.alert('Товар добавлен в избранное.');
};

var cmpOnToCompareRemoved = function () {
    siteLib.alert('Товар убран из избранного.');
};

/*
var SHKbeforeInitCallback = function () {
    SHK.options.buttons_class = 'btn btn-info btn-sm';
}; */


/**
 * Site library
 *
 */
var siteLib = (function ($) {

    sl = this;
    sl.city = {};


    this.init = function () {

        //console.log('init');

        /*jQuery('body')
            .tooltip({
                selector: '[data-toggle="tooltip"]',
                container: 'body',
                trigger: 'hover',
                placement: function () {
                    return this.$element.data('placement') ?
                        this.$element.data('placement') :
                        'bottom';
                }
            });*/
        jQuery('.slick-slider-one')
            .slick({
                dots: true,
                arrows: true,
                infinite: true,
                autoplay: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1
            });

        $('.slick-slider-three')
            .slick({
                slide: '.product-list-item-image',
                dots: true,
                infinite: true,
                autoplay: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                centerMode: false,
                responsive: [{
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

    this.cityRecalc = function () {

        var dataCity = siteLib.city.name;
        if ($('#cartAddress')) {
            $('#cartAddress').attr('value', dataCity);
        }

    };

    this.writeCity = function (city) {
        $cityName = $("a[data-target='city-select']");
        sl.city = city;
        $cityName.html(sl.city.name);
        var serialCity = JSON.stringify(city);
        localStorage.setItem("city", serialCity);
        sl.cityRecalc();
    };

    this.readCity = function () {
        $cityNameField = $("a[data-target='city-select']");

        var returnCity = JSON.parse(localStorage.getItem("city"));
        sl.city = returnCity;

        $cityNameField.html(sl.city.name);

        $.post(document.location.href, {
            action: 'setSessionCity',
            city: localStorage.getItem("city")
        }, function (data) {
            sl.cityRecalc();
        });
    };

    this.getCity = function () {

        var city = localStorage.getItem("city");
        if (city === null) {

            $.post(document.location.href, {
                action: 'detectCity'
            }, function (data) {
                city = JSON.parse(data);
                sl.writeCity(city);
            });

        } else {
            sl.readCity();
        }
    };

    this.chooseCity = function (name) {
        var action = 'chooseCity';

        $.post(document.location.href, {
            action: action,
            city_name: name
        }, function (data) {
            var obj = JSON.parse(data);
            siteLib.writeCity(obj);
            location.reload();
        });
    };

    this.getRates = function () {

        if (sl.city.name != "Самара") {

            var loader = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';

            $('#price_dellin').html(loader);
            $('#price_pek').html(loader);
            $('#price_energia').html(loader);
            //$('#price_cdek').html(loader);

            var action = 'getDeliveryRates';

            // Деловые линии
            $.post(document.location.href, {
                action: action,
                tk: "1"
            })
                .done(function (data) {
                    data = JSON.parse(data);
                    $('#price_dellin').html(data.dellin.price + "p.");
                })
                .fail(function () {
                    $('#price_dellin').html("");
                });

            // ПЭК
            $.post(document.location.href, {
                action: action,
                tk: "2"
            })
                .done(function (data) {
                    data = JSON.parse(data);
                    if (data !== null) {
                        $('#price_pek').html(data.pek.auto[2] + "p.");
                    }
                })
                .fail(function () {
                    $('#price_pek').html("");
                });

            // ЭНЕРГИЯ
            $.post(document.location.href, {
                action: action,
                tk: "3"
            })
                .done(function (data) {
                    data = JSON.parse(data);
                    //console.log(data.energia);
                    if (data.energia !== null) {
                        $('#price_energia').html(data.energia.transfer[0].price + "p.");
                    }
                })
                .fail(function () {
                    $('#price_energia').html("");
                });

            // СДЭК
            /*
            $.post(document.location.href, {
                action: action,
                tk: "4"
            })
                .done(function (data) {
                    data = JSON.parse(data);
                    $('#price_cdek').html(data.cdek.result.price + "p.");
                })
                .fail(function () {
                    $('#price_cdek').html("");
                });
            */

        }

        return false;
    }; // this.getRates

    this.getFreeDelivery = function () {
        //$('#freeDelivery').html('<div class="ajax-loader"></div>');

        var action = 'freedelivery';

        $.post(document.location.href, {
            action: action
        }, function (data) {

            //console.log(SHK.data);
            if (SHK.data.items_total > 0) {

                var v = JSON.parse(data);
                var htmldata = v[0];
                if (v[1] >= 100) {

                    if (SHK.data.ids.indexOf(163) == -1) {

                        //console.log('Подарок!');
                        // SHK.fillCart(163,1,true);
                    }
                }

                $('#freeDelivery').html(htmldata);
            }
        });

        return false;
    }; // 


    //////// shk count buttons + -
    this.bindPlusMinusButtons = function () {

        $('.content').on('click', '.button__minus', function () {
            var $input = $(this).parent().parent().find('.shk-count');
            var count = parseInt($input.val()) - 1;
            count = count < 1 ? 1 : count;
            $input.val(count);
            $input.change();
            //SHK.recountItemAll();
            SHK.changeCartItemsCount();
            return false;
        });

        $('.content').on('click', '.button__plus', function () {
            var $input = $(this).parent().parent().find('.shk-count');
            $input.val(parseInt($input.val()) + 1);
            $input.change();
            //SHK.recountItemAll();
            SHK.changeCartItemsCount();
            return false;
        });

        $('.button__plus-product').on('click', function (event) {
            $(this).prop('disabled', true);
            var $input = $(this).parent().parent().find('.shk-count-product');
            $input.val(parseInt($input.val()) + 1);
            $input.change();
            $(this).prop('disabled', false);
            return false;
        });

        $('.button__minus-product').on('click', function (event) {
            $(this).prop('disabled', true);
            var $input = $(this).parent().parent().find('.shk-count-product');
            var count = parseInt($input.val()) - 1;
            count = count < 1 ? 1 : count;
            $input.val(count);
            $input.change();
            $(this).prop('disabled', false);
            return false;
        });

    };



    this.alert = function (msg, type, time) {

        type = type || 'success';
        time = time || 3000;
        var alertClass = 'alert-' + type;
        $('.alert-fixed').remove();

        $('<div/>', {
            'class': 'alert alert-fixed ' + alertClass + ' alert-dismissable',
            'text': msg,
            on: {
                mouseover: function () {
                    clearTimeout(window.alertTimer);
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
                    click: function (e) {
                        e.preventDefault();
                        clearTimeout(window.alertTimer);
                        $(this).closest('.alert').remove();
                    }
                }
            }))
            .appendTo('body');

        clearTimeout(window.alertTimer);
        window.alertTimer = setTimeout(function () {
            $('.alert-fixed').remove();
        }, time);

    }; //this.alert


    return this;

}).call({}, jQuery);


function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

this.siteLib = siteLib;

///// MAIN
$(function () {

    siteLib.init();
    siteLib.getCity();

    $('.more_info__show').on('click', function () {
        $('.more_info__list').slideToggle(300);
        return false;
    });

    /*
    $('.login-toggle').on('click', function (event) {
        $('.loginForm').css('display', 'block');
        $('.loginForm').removeClass('hide-this');
        $('.login-menu').css('display', 'none');
        $('.login-menu').addClass('hide-this');
        event.preventDefault();
        event.stopPropagation();
        //return false;
    });

    $('.register-toggle').on('click', function (event) {
        $('.loginForm').css('display', 'none');
        $('.loginForm').addClass('hide-this');
        $('.login-menu').css('display', 'block');
        $('.login-menu').removeClass('hide-this');
        event.preventDefault();
        event.stopPropagation();

    }); 
    */


    // tabs 
    var rootEl = document.documentElement;
    var $tabLinks = $('.tabs li a');

    if ($tabLinks.length > 0) {
        $tabLinks.each(function (index, el) {
            $(el).on('click', function () {
                $('.tabs li').removeClass('is-active');
                $(el.parentNode).addClass('is-active');

                var target = el.dataset.target;
                showTab('#' + target);
            });
        });
    }

    function showTab(target) {
        $('.tab').removeClass('is-active');
        $(target).addClass('is-active');
    }

    /* MODALS */
    rootEl = $('body');
    var $modals = $('.modal');
    var $modalButtons = $('.modal-button');
    var $modalCloses = $('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

    if ($modalButtons.length > 0) {
        $modalButtons.each(function (index, el) {
            $(el).on('click', function (event) {
                event.preventDefault();
                var target = el.dataset.target;
                openModal('#' + target);
            });
        });
    }

    if ($modalCloses.length > 0) {
        $modalCloses.each(function (index, el) {
            $(el).on('click', function () {
                closeModals();
            });
        });
    }

    function openModal(target) {
        $(rootEl).addClass('is-clipped');
        $(target).addClass('is-active');

        if (target == '#city-select') {
            $('#myModalCitySelect').html('<div class="ajax-loader">Подождите...</div>');
            var action = 'showCitySelectForm';

            $.post(document.location.href, {
                action: action
            })
                .done(function (data) {

                    $('#myModalCitySelect').html(data);
                    $("#city-select-form").addClass('hide');

                    var $options = $("#city-select-form option");
                    var $box = $("#city-select-form2");

                    var objects = [];

                    $options.each(function (i, element) {

                        var obj = {};
                        var text = $(element).text();
                        var st = text.indexOf('(', 0);
                        var en = text.indexOf(')', 0);
                        if (st >= 0) {
                            obj.name = text.slice(0, st - 3);
                            obj.obl = text.slice(st + 1, en);
                        } else {
                            obj.name = text;
                            obj.obl = "#";
                        }
                        objects.push(obj);

                    });


                })
                .fail(function(data){
                    console.log('fail');
                });

            return false;
        }
    }

    function closeModals() {
        $(rootEl).removeClass('is-clipped');
        $modals.each(function (index, el) {
            $(el).removeClass('is-active');
        });
    }

    siteLib.closeModals = function () {
        closeModals();
    };

    document.addEventListener('keydown', function (event) {
        var e = event || window.event;
        if (e.keyCode === 27) {
            closeModals();
        }
    });

    /* END MODALS */


    $("#chooseCityButton").on('click', function () {
        var name = $("#city-select-form option:selected").text();
        siteLib.chooseCity(name);
        return false;
    });

    $(".main-carousel").owlCarousel({
        autoplay: 3000,
        smartSpeed: 1000,
        margin: 10,
        loop: true,
        nav: true,
        dots: true,
        items: 1
    });

    $("#owl-slider-production").owlCarousel({
        autoplay: 3000,
        loop: true,
        nav: false,
        dots: true,
        margin: 10,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    });

    // выбор транспортной компании

    $('.country_delivery__item').on('click', function () {
        $('.country_delivery__item').removeClass('active');
        $(this).addClass('active');
        var TransKomp = $(this).data('trans');
        $('.transcom').val(TransKomp);
    });

    $('.product__order .button').on('click', function () {
        $(this).parent().find('#success-check').prop('checked', true);
    });

    // SHKloadCartCallback - по факту загрузки корзины
    /*
    $('[id="consult-select"]').click(function () {
        //yaCounter44778274.reachGoal('consult-open');
    });
    $('.product__order button[type="submit"]').click(function () {
        //yaCounter44778274.reachGoal('product-add');
    });
    $('.shk-item form button[type="submit"]').click(function () {
        // yaCounter44778274.reachGoal('product-top-add');
    });
    $('.shk_prodHelper button#shk_confirmButton').click(function () {
        //yaCounter44778274.reachGoal('product-top-add-submit');
    });*/

    $(document).on('af_complete', function (event, response) {
        var form = response.form;
        // Если у формы определённый class
        if (form.hasClass('consult-form') && response.success) {
            //yaCounter44778274.reachGoal('consult-sent');
        }
    });

    ////////////////////////// menu top

    $(".navbar-burger")
        .on('click', function () {
            $(".navbar-burger").toggleClass("is-active");
            $(".side-column").toggleClass("is-hidden-mobile");
        });

    var $hoverableLink = $('.navbar-item.has-dropdown');

    if (!!('ontouchstart' in window)) { //check for touch device
        $hoverableLink
            .on('click', function () {
                $(this).toggleClass('is-active');
            });
    } else {
        $hoverableLink
            .on('mouseenter', function () {
                $(this).addClass('is-active');
            })
            .on('mouseleave', function () {
                $(this).removeClass('is-active');
            });
    }

    // Разворачивание и сворачивание
    var dropdownlink = document.querySelector(".navbar-item.has-dropdown");
    var square = document.querySelector(".shopcart-container");

    if (square) {
        var manager = new Hammer.Manager(square);

        var Tap = new Hammer.Tap({
            taps: 1
        });

        manager.add(Tap);

        manager.on('tap', function (e) {
            $(".shopcart-full").removeClass('collapsed');
        });

        $('.shopcart-container').on('click','#CollapseShopCartButton', function(){
            $(".shopcart-full").addClass('collapsed');
        });
        $('.shopcart-container').on('click','.product-list', function(){
            $(".shopcart-full").addClass('collapsed');
        });
    }

    $("#shopOrderForm")
        .on('submit', function (event) {
            //event.preventDefault();

            var phone = $("#orderFormPhone").val();

            var n = phone.length;
            var tt = phone.split('');

            var p = "";
            var i = 0;
            var skobki = true;

            if (tt[0] == "+" && tt[1] == "7") {

                i = i + 2;
            }

            if (tt[0] == "(") {

                skobki = false;
            }

            if (tt[0] == "8") {

            } else {
                p += "8";
            }


            while (i <= n) {

                switch (tt[i]) {
                    case " ":
                        i++;
                        break;
                    case "-":
                        i++;
                        break;
                    case "+":
                        i++;
                        break;
                    case "(":
                        if (skobki) {
                            i++;
                        } else {
                            p += tt[i];
                            i++;
                        }
                        break;
                    case ")":
                        if (skobki) {
                            i++;
                        } else {
                            p += tt[i];
                            i++;
                        }
                        break;
                    default:
                        p += tt[i];
                        i++;

                        break;
                }
            }
            $("#orderFormPhone").val(p);
            //$( "#shopOrderForm" ).submit();
        });

/*
    $('input.shk-count')
        .on('change', function () {
            SHK.changeCartItemsCount();
            return false;
        });
        */

}); // document.ready

