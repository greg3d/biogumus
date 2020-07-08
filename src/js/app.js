(function () {

    var cmpOnToCompareLinkMinimum = function () {
        siteLib.alert('В избранном пусто.', 'danger');
    };

    var cmpOnToCompareAdded = function () {
        siteLib.alert('Товар добавлен в избранное.');
    };

    var cmpOnToCompareRemoved = function () {
        siteLib.alert('Товар убран из избранного.');
    };

    var SHKbeforeInitCallback = function () {
        SHK.options.buttons_class = 'btn btn-info btn-sm';
    };

    /**
     * Site library
     *
     */
    var siteLib = (function ($) {

        sl = this;
        sl.city = {};

        this.init = function () {

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

            sl.getRates();
            var dataCity = siteLib.city.name;
            if (dataCity != 'Самара') {
                console.log("not samara+" + dataCity);
                $('.order__payment .order__options .radio:nth-child(1)').hide();
                $('.order__delivery .order__options .radio:nth-child(1)').hide();
                $('.order__delivery .order__options .radio:nth-child(2)').hide();
                //   $('.contacts--samara').hide();
                //   $('.contacts--other').show();
                //   $('.address--samara').hide();
                //   $('.address--other').show();
            } else {
                //console.log("samara" + dataCity);
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

            //location.reload();

        };



        this.writeCity = function (city) {
            $cityName = $("a[data-target='city-select']");

            sl.city = city;

            $cityName.html(sl.city.name);

            var serialCity = JSON.stringify(city);
            localStorage.setItem("city", serialCity);

            console.log("Wrighted: " + sl.city.name);
            sl.cityRecalc();
        };

        this.readCity = function () {
            $cityNameField = $("a[data-target='city-select']");

            var returnCity = JSON.parse(localStorage.getItem("city"));
            sl.city = returnCity;

            $cityNameField.html(sl.city.name);

            //console.log(sl.city.name);

            $.post(document.location.href, {
                action: 'setSessionCity',
                city: localStorage.getItem("city")
            }, function (data) {
                console.log("Local: " + data + ": " + sl.city.name);
                sl.cityRecalc();
            });
        };

        this.getCity = function () {

            var city = localStorage.getItem("city");

            if (city === null) {
                //console.log('null city');

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

                var strnum = obj.name.indexOf(" г");

                if (strnum > 0) {
                    obj.name = obj.name.substring(0, strnum);
                }

                siteLib.writeCity(obj);

                location.reload();

            });
        };


        this.getRates = function () {
            $('#getRatesResult').html('<div class="ajax-loader">Расчитываю...</div>');

            var action = 'getDeliveryRates';


            $.post(document.location.href, {
                actionz: action
            }, function (data) {
                $('#getRatesResult').html(data);
            });

            return false;
        }; // this.getRates

        //////// shk count buttons + -
        this.bindPlusMinusButtons = function () {
            $('[data-shopcart="2"]').on('click', '.button__minus', function () {
                var $input = $(this).parent().parent().find('.shk-count');
                var count = parseInt($input.val()) - 1;
                count = count < 1 ? 1 : count;
                $input.val(count);
                $input.change();
                //SHK.recountItemAll();
                SHK.changeCartItemsCount();
                return false;
            });

            $('[data-shopcart="2"]').on('click', '.button__plus', function () {
                var $input = $(this).parent().parent().find('.shk-count');
                $input.val(parseInt($input.val()) + 1);
                $input.change();
                //SHK.recountItemAll();
                SHK.changeCartItemsCount();
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
    $(document).ready(function () {

        siteLib.init();
        siteLib.getCity();

        //siteLib.bindPlusMinusButtons();

        $('.more_info__show').on('click', function () {
            $('.more_info__list').slideToggle(300);
            return false;
        });

        $('.login-toggle').click(function (event) {
            $('.loginForm').css('display', 'block');
            $('.loginForm').removeClass('hide-this');
            $('.login-menu').css('display', 'none');
            $('.login-menu').addClass('hide-this');
            event.preventDefault();
            event.stopPropagation();
            //return false;
        });

        $('.register-toggle').click(function (event) {
            $('.loginForm').css('display', 'none');
            $('.loginForm').addClass('hide-this');
            $('.login-menu').css('display', 'block');
            $('.login-menu').removeClass('hide-this');
            event.preventDefault();
            event.stopPropagation();

        });


        // tabs 
        var rootEl = document.documentElement;
        var $tabLinks = $('.tabs li a');

        if ($tabLinks.length > 0) {
            $tabLinks.each(function (index, el) {
                $(el).click(function () {
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


        ///////////////////////////////////////////////////////////////////
        // MODALS
        //var rootEl = document.documentElement;
        var $modals = $('.modal');
        var $modalButtons = $('.modal-button');
        var $modalCloses = $('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

        if ($modalButtons.length > 0) {
            $modalButtons.each(function (index, el) {
                $(el).click(function () {

                    var target = el.dataset.target;

                    openModal('#' + target);
                });
            });
        }

        if ($modalCloses.length > 0) {
            $modalCloses.each(function (index, el) {
                $(el).click(function () {
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
                }, function (data) {
                    $('#myModalCitySelect').html(data);

                    // Code goes here


                    $("#city-select-form").addClass('hide');

                    //var name = $("#city-select-form option:selected").text();
                    //    siteLib.chooseCity(name);
                    //  return false;

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

                        //$box.append('<a class="link">' + obj.name + '---' + obj.obl + '</a>');
                    });


                    function compareValues(key, order = 'asc') {
                        return function (a, b) {
                            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                                // свойства нет ни в одном из объектов
                                return 0;
                            }

                            const varA = (typeof a[key] === 'string') ?
                                a[key].toUpperCase() : a[key];
                            const varB = (typeof b[key] === 'string') ?
                                b[key].toUpperCase() : b[key];

                            let comparison = 0;
                            if (varA > varB) {
                                comparison = 1;
                            } else if (varA < varB) {
                                comparison = -1;
                            }
                            return (
                                (order == 'desc') ? (comparison * -1) : comparison
                            );
                        };
                    }

                    objects.sort(compareValues('obl'));

                    var pred = '';

                    var $item;
                    objects.forEach(function (obj, i) {

                        if (obj.obl != pred) {
                            $item = $box.append('<div class="item"></div>');

                            $item.append('<p class="heading">' + obj.obl + '</p>');

                        }
                        $item.append('<a class="link">' + obj.name + '</a>');

                        pred = obj.obl;
                    });

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


        document.addEventListener('keydown', function (event) {
            var e = event || window.event;
            if (e.keyCode === 27) {
                closeModals();
            }
        });

        //////////////////////////////////////////////////////
        $("#chooseCityButton").click(function () {

            var name = $("#city-select-form option:selected").text();
            siteLib.chooseCity(name);
            return false;
        });


        var isCash = $("input[value='cash']").attr('checked');
        $('input[type=radio][name=payment]').change(function () {
            if (this.value == 'cash') {
                $('input[type=radio][name=shk_delivery][value="Доставка ТК по России"]').attr('disabled', 'disabled');
                $('input[type=radio][name=shk_delivery][value="Доставка ТК по России"]').prop('checked', false);
            }
            if (this.value != 'cash') {
                $('input[type=radio][name=shk_delivery][value="Доставка ТК по России"]').removeAttr('disabled');
            }
            //alert(this.value);
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

    });

    var counter = document.getElementById('counter-val');
    var counterPlus = document.getElementById('counter-plus');
    var counterMinus = document.getElementById('counter-minus');
    if (counter) {
        counterMinus.onclick = function () {
            var counterTemp = parseInt(counter.value);
            if (counterTemp > 1) {
                counterTemp -= 1;
                counter.value = counterTemp;
            }
        };

        counterPlus.onclick = function () {
            var counterTemp = parseInt(counter.value);
            counterTemp += 1;
            counter.value = counterTemp;
        };
    }


    $('.country_delivery__item').click(function () {
        $('.country_delivery__item').removeClass('active');
        $(this).addClass('active');

        //console.log(this);

        var TransKomp = $(this).data('trans');
        $('.transcom').val(TransKomp);
    });

    $('.product__order .button').click(function () {
        $(this).parent().find('#success-check').prop('checked', true);
    });

    //$('input[name="phone"]').mask("+7 (999) 999 99 99");

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
    });
    $(document).on('af_complete', function (event, response) {
        var form = response.form;
        // Если у формы определённый class
        if (form.hasClass('consult-form') && response.success) {
            //yaCounter44778274.reachGoal('consult-sent');
        }
    });

    ////////////////////////// menu top

    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".side-column").toggleClass("is-hidden-mobile");

    });

    var $hoverableLink = $('.navbar-item.has-dropdown');

    $hoverableLink.hover(function () {
        $(this).addClass('is-active');
    }, function () {
        $(this).removeClass('is-active');
    });

    ////////////////////// end menu top


    /*
    var w = $(window).width();
    var ww = $(".pre_korzina").stick_in_parent({
        parent: 'body',
        scr
        //spacer: '.side__menu'
    });


    function stickUnstick() {
        if (w < 752) {
            ww.on("sticky_kit:unstick", function (e) {
                    $(e.target).addClass("unsticked");
                    $(e.target).addClass("ontop");
                })
                .on("sticky_kit:stick", function (e) {
                    $(e.target).removeClass("unsticked");
                    $(e.target).removeClass("ontop");
                });
        }
    }

    //stickUnstick();

    $(window).resize(function () {
        w = $(window).width();
        stickUnstick();
    });

    */

    // Разворачивание и сворачивание корзины

    var square = document.querySelector(".shopcart-container");

    if (square) {
        var manager = new Hammer.Manager(square);

        var Tap = new Hammer.Tap({
            taps: 1
        });

        manager.add(Tap);

        manager.on('tap', function (e) {
            $(".shopcart-full").toggleClass('collapsed');
        });

        $('#CollapseShopCartButton').click(function () {
            $(".shopcart-full").addClass('collapsed');
        });
    }

    
}());