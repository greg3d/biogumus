/**
 * SITELIB
 *
 */
var siteLib = (function ($) {

    sl = this;
    sl.city = {};

    this.product_count = 1;
    this.updateCount = function(){
        $("#product-count").val(this.product_count);
    }

    this.init = function () {

        sl.updateCount();
        
        $("#product-count").off("change")
        $("#product-count").on("change", function(){
            sl.product_count = parseInt($("#product-count").val());
        })

        $("#counter-minus").on("click", function(){
            sl.product_count -= 1;
            if (sl.product_count <= 0) sl.product_count = 1;
            sl.updateCount();
        })

        $("#counter-plus").on("click", function(){
            sl.product_count += 1;
            sl.updateCount();
        })

       // !!!!!!!!!!!!!!!!!!!!!!!!!!! ПЕРЕДЕЛАТЬ ПОД FANCY UI !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
       /*
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

        */

    }

    this.CheckCity = function () {

        return $.post(document.location.href, {
            action: 'CheckCity'
        });
    }

    this.getRates = function () {

        if (sl.city.name != "Самара") {

            var loader = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';

            $('#price_dellin').show();
            $('#price_pek').show();
            $('#price_energia').show();

            $('#price_dellin').html(loader);
            $('#price_pek').html(loader);
            $('#price_energia').html(loader);

            var action = 'getDeliveryRates';

            // Деловые линии
            $.post(document.location.href, {
                    action: action,
                    tk: "1"
                })
                .done(function (data) {
                    data = JSON.parse(data);

                    $('#price_dellin').html(data.price);
                    //$('#price_dellin').html(data.dellin.price + "p.");
                })
                .fail(function () {
                    $('#price_dellin').hide();
                });

            // ПЭК
            $.post(document.location.href, {
                    action: action,
                    tk: "2"
                })
                .done(function (data) {
                    data = JSON.parse(data);
                    $('#price_pek').html(data.price);
                    //$('#price_pek').html(data.pek.auto[2] + "p.");

                })
                .fail(function () {
                    $('#price_pek').hide();
                });

            // ЭНЕРГИЯ
            $.post(document.location.href, {
                    action: action,
                    tk: "3"
                })
                .done(function (data) {
                    data = JSON.parse(data);
                    $('#price_energia').html(data.price);
                    //$('#price_energia').html(data.energia.transfer[0].price + "p.");

                })
                .fail(function () {
                    $('#price_energia').hide();
                });

            // СДЭК


        }

        return false;
    }

    this.getPromoCode = function(){
        var action = 'applyPromoCode';
        var code = $('#promoCode').val();

        $('#promoCode').addClass("is-loading");
        $('.errorpromocode').addClass('is-hidden');

        $.post(document.location.href, {
                action: action,
                promocode: code
            })
            .done(function (data) {
                data = JSON.parse(data);
                //console.log(data);
                $('#promoCode').removeClass("is-loading");

                if (data=="success") {
                    document.location.reload();
                } else {
                    $('.errorpromocode').removeClass('is-hidden');
                }
            })
            .fail(function () {
                $('#promoCode').removeClass("is-loading");
                $('.errorpromocode').removeClass('is-hidden');
            });

    }

    this.deletePromoCode = function(){
        var action = 'deletePromoCode';
        

        $.post(document.location.href, {
                action: action
            })
            .done(function (data) {
                data = JSON.parse(data);
                //console.log(data);

                if (data=="success") {
                    document.location.reload();
                }

                document.location.reload();
            })
            .fail(function () {
                
            });

    }
    //////// shk count buttons /////////////////////////////////////////
    this.bindPlusMinusCart = function () {

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
    }
    ///
    this.bindPlusMinusProduct = function(){
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
    }
    //////////////////////////////////////////////////////////////////

    this.bindCartTap = function(){
        // Разворачивание и сворачивание корзины
        var square = document.querySelector("#openfullcart");

        if (square) {
            var manager = new Hammer.Manager(square);

            var Tap = new Hammer.Tap({
                taps: 1
            });

            manager.add(Tap);

            manager.on('tap', function (e) {
                $(".shopcart-full").toggleClass('collapsed');
            });

            $('.shopcart-container').on('click', '#CollapseShopCartButton', function () {
                $(".shopcart-full").addClass('collapsed');
            });
            $('.shopcart-container').on('click', '.product-list', function () {
                $(".shopcart-full").addClass('collapsed');
            });
        }
    }

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

    } //this.alert

    return this;

}).call({}, jQuery);


this.siteLib = siteLib;

///// MAIN
$(function () {

    siteLib.init();


    var ch = false;
    siteLib.CheckCity().done(function (data) {
        ch = JSON.parse(data);
        if (ch == "0") {
            $('.yourcity').css("display", "block");
        } else {
            $('.yourcity').css("display", "none");
        }
    });


    $('.more_info__show').on('click', function () {
        $('.more_info__list').slideToggle(300);
        return false;
    });

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

        if (target == '#city-select-form') {
            $('#city-select-form p.modal-card-title').html('Выберите область/город проживания:');
            $('#CitySelectList').html('<div class="ajax-loader">Подождите...</div>');

            var action = 'ShowRegionsList';

            $.post(document.location.href, {
                    action: action
                })
                .done(function (response) {

                    var regions = JSON.parse(response);
                    //console.log(data);

                    $('#CitySelectList').html('');

                    regions.forEach(function (element) {
                        $('#CitySelectList').append("<div class='pickcitycontainer'><a class='pickcity region' data-target='" + element.id + "'>" + element.name_ru + "</a></div>");
                    });

                    var $regions = $('.pickcity.region');

                    if ($regions.length > 0) {
                        $regions.each(function (index, el) {
                            $(el).on('click', function (event) {
                                event.preventDefault();
                                var target = el.dataset.target;

                                $('#CitySelectList').html('Подождите...');

                                $.post(document.location.href, {
                                        action: 'ShowCitiesByRegion',
                                        data: target
                                    })
                                    .done(function (response) {
                                        $('#CitySelectList').html('');
                                        cities = JSON.parse(response);
                                        cities.forEach(function (element) {
                                            $('#CitySelectList').append("<div class='pickcitycontainer'><a class='pickcity city' data-target='" + element.id + "'>" + element.name_ru + "</a></div>");
                                        });
                                        var $cities = $('.pickcity.city');
                                        if ($cities.length > 0) {
                                            $cities.each(function (index2, el) {
                                                $(el).on('click', function (event) {
                                                    event.preventDefault();

                                                    $.post(document.location.href, {
                                                        action: 'PickCity',
                                                        city: cities[index2],
                                                        region: regions[index]
                                                    }, function (resp) {

                                                        //console.log(JSON.parse(resp))
                                                        closeModals();
                                                        location.reload();
                                                    });
                                                })
                                            })
                                        }

                                    })

                            });
                        });
                    }

                })
                .fail(function (data) {
                    //console.log('fail');
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
    // подтверждение выбора города
    $("#CityConfirmYes").on('click', function () {
        $.post(document.location.href, {
                action: 'ConfirmCity'
            },
            function (resp) {
                //console.log(resp);
                $('.yourcity').css('display', 'none');

            })
    });

    //Carousel.Plugins.Autoplay = Autoplay;

    // КАРУСЕЛИ

    try {
        mainpageCarousel = new Carousel(document.querySelector(".main-carousel"), {
            Dots: true,
            Navigation: true,
            center: false,
            slidesPerPage: 1,
            infinite: true,
            hideScrollbar: true,
            Autoplay: {
                timeout: 2500,
                },
        })    
    } catch (err) {
    
    }
    
    try {
        mainCarousel = new Carousel(document.querySelector("#productImages"), {
            Dots: false,
        })
    } catch {

    }
    

    var thumbselector  = "#productThumbs > .carousel__slide";

    $(thumbselector).first().addClass("is-nav-selected");

    $(thumbselector).each(function (i){
        $(this).on('click', function(){
            //console.log(e);
            $(thumbselector).removeClass('is-nav-selected');
            mainCarousel.slideTo(i);
            $(this).addClass("is-nav-selected");
        })
    })

    Fancybox.bind('[data-fancybox="gallery"]', {
        Carousel: {
            on: {
                change: function(that) {
                    mainCarousel.slideTo(mainCarousel.findPageForSlide(that.page), {
                        friction: 0,
                    })
                },
            },
        },
        hideScrollbar: true
    })

    $(".miniProductImages").each(function(i){
        var id = "#" + $(this).attr('id');
        console.log(id);
        var miniCarousel = new Carousel(document.querySelector(id), {
            Dots: false,
            Navigation: true,
            center: false,
            slidesPerPage: 1,
            infinite: true,
            hideScrollbar: true
        })
    })
   
    



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

    // стик и анстик
    function stickUnstick(){
        $node = $('.pre_korzina');
        $offset = $node.offset().top;
        $height = $node.height();
        $width = $node.width();
        var PanelSpacer = null;
        var nodeCssfloat = $node.css("float");
        var nodeCssdisplay = $node.css("display");
        PanelSpacer = $("<div id='PanelSpacer' style='width:" + $width + "px;height:" + $height + "px;float:" + nodeCssfloat + ";display:" + nodeCssdisplay + ";'> </div>");
        var fixed = false;
        var $spacer = null;            

        $(window).off('scroll');
        
        $(window).on('scroll', function () {
            //console.log($(window).scrollTop());
            if ($(window).scrollTop() > $offset - 5) {
                
                if (!fixed) {
                    $height = $node.height();
                    $width = $node.width();
                    $node.before(PanelSpacer);
                    $spacer = $('#PanelSpacer')
                    $node.css("width",$width);
                    $node.css("position","fixed");
                    $node.css("top","5px");
                    fixed = true;
                    
                } 

            } else {

                if (fixed) {
                    fixed = false;
                    $spacer.remove();
                    $('.pre_korzina').removeAttr("style");
                }
            }
        });
    }

    window.addEventListener('resize', stickUnstick(), true);
    window.addEventListener('load', stickUnstick(), true);
    window.addEventListener('reload', stickUnstick(), true);

    // телефонный номер

    $("#shopOrderForm")
        .on('submit', function (event) {
            //event.preventDefault();

            var phone = $('#orderFormPhone').val();

            phone = phone.replace(/\s+/g, '');

            var n = phone.length;
            var tt = phone.split('');

            var p = "";
            var i = 0;
            var skobki = true;

            var add8 = true;

            if (tt[0] == "+" && tt[1] == "7") {
                i = i + 2;
            }

            if (tt[0] == "8") {

            } else {
                p += "8";
            }

            //console.log(n);

            while (i < n) {

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
                        i++;
                        break;
                    case ")":
                        i++;
                        break;

                    default:
                        p += tt[i];
                        i++;
                        break;
                }
            }
            i = 0;
            n = p.length;
            var pp = p.split('');
            var res = '';

            while (i < n) {

                if (i == 1) {
                    res += "(";
                }

                if (i == 4) {
                    res += ")";
                }

                if (i == 7) {
                    res += "-";
                }

                if (i == 9) {
                    res += "-";
                }


                res += pp[i];

                i++;
            }

            $("#orderFormPhone").val(res);
        });

}); // IFFE