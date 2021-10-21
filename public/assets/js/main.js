(function ($) {
    "user strict";
    // Preloader Js
    $(window).on('load', function () {
      $('.preloader').fadeOut(500);
      var img = $('.bg_img');
      img.css('background-image', function () {
        var bg = ('url(' + $(this).data('background') + ')');
        return bg;
      });
      // filter functions
      var $grid = $(".project-area");
      var filterFns = {};
      $grid.isotope({
        itemSelector: '.project-item',
        masonry: {
          columnWidth: 0,
        }
      });
      // bind filter button click
      $('ul.filter').on('click', 'li', function () {
        var filterValue = $(this).attr('data-filter');
        // use filterFn if matches value
        filterValue = filterFns[filterValue] || filterValue;
        $grid.isotope({
          filter: filterValue
        });
      });
      // change is-checked class on buttons
      $('ul.filter').each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'li', function () {
          $buttonGroup.find('.active').removeClass('active');
          $(this).addClass('active');
        });
      });
    });
    $(document).ready(function () {
      // Nice Select
      $('.select-bar').niceSelect();
      // Lightcase 
      $('a[data-rel^=lightcase]').lightcase();
      // Wow js active
      new WOW().init();
      //Faq
      $('.faq-wrapper .faq-title, .desc-wrapper .faq-title').on('click', function (e) {
        var element = $(this).parent('.faq-item');
        if (element.hasClass('open')) {
          element.removeClass('open');
          element.find('.faq-content').removeClass('open');
          element.find('.faq-content').slideUp(300, "swing");
        } else {
          element.addClass('open');
          element.children('.faq-content').slideDown(300, "swing");
          element.siblings('.faq-item').children('.faq-content').slideUp(300, "swing");
          element.siblings('.faq-item').removeClass('open');
          element.siblings('.faq-item').find('.faq-title').removeClass('open');
          element.siblings('.taq-item').find('.faq-content').slideUp(300, "swing");
        }
      });
      
      //MenuBar
      $('.header-bar').on('click', function () {
          $(".menu").toggleClass("active");
          $(".header-bar").toggleClass("active");
      });
      //MenuBar
      $('.search-bar').on('click', function () {
          $(".search-form-area").addClass("active");
      });
      $('.hide-form').on('click', function () {
          $(".search-form-area").removeClass("active");
      });
      $('.select-bar-bar').on('click', function() {
        $('.select-career').toggleClass('active');
      })
      // counter 
      $('.counter').countUp({
        'time': 1000,
        'delay': 10
      });
      //Menu Dropdown Icon Adding
      $("ul>li>.submenu").parent("li").addClass("menu-item-has-children");
      // drop down menu width overflow problem fix
      $('ul').parent('li').hover(function () {
        var menu = $(this).find("ul");
        var menupos = $(menu).offset();
        if (menupos.left + menu.width() > $(window).width()) {
          var newpos = -$(menu).width();
          menu.css({
            left: newpos
          });
        }
      });
      $('.menu li a').on('click', function (e) {
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
          element.removeClass('open');
          element.find('li').removeClass('open');
          element.find('ul').slideUp(300, "swing");
        } else {
          element.addClass('open');
          element.children('ul').slideDown(300, "swing");
          element.siblings('li').children('ul').slideUp(300, "swing");
          element.siblings('li').removeClass('open');
          element.siblings('li').find('li').removeClass('open');
          element.siblings('li').find('ul').slideUp(300, "swing");
        }
      })
      // Scroll To Top 
      var scrollTop = $(".scrollToTop");
      $(window).on('scroll', function () {
        if ($(this).scrollTop() < 500) {
          scrollTop.removeClass("active");
        } else {
          scrollTop.addClass("active");
        }
      });
      //Click event to scroll to top
      $('.scrollToTop').on('click', function () {
        $('html, body').animate({
          scrollTop: 0
        }, 500);
        return false;
      });
      // Header Sticky Here
      var headerOne = $(".header-bottom");
      $(window).on('scroll', function () {
        if ($(this).scrollTop() < 1) {
          headerOne.removeClass("wow fadeInDown header-fixed");
          headerOne.addClass("wow fadeIn");
        } else {
          headerOne.addClass("wow fadeInDown header-fixed");
          headerOne.removeClass("wow fadeIn");
        }
      });
      // Sponsor Slider
      var swiper = new Swiper('.sponsor-slider', {
        slidesPerView: 6,
        loop: true,
        breakpoints: {
          1024: {
            slidesPerView: 5,
          },
          767: {
            slidesPerView: 3,
          },
          575: {
            slidesPerView: 2,
          },
          400: {
            slidesPerView: 1,
          },
        },
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        loop: true,
      });
      //Tab Section
      $('.tab ul.tab-menu').addClass('active').find('> li:eq(0)').addClass('active');
      $('.tab ul.tab-menu li').on('click', function (g) {
        var tab = $(this).closest('.tab'),
          index = $(this).closest('li').index();
        tab.find('li').siblings('li').removeClass('active');
        $(this).closest('li').addClass('active');
        tab.find('.tab-area').find('div.tab-item').not('div.tab-item:eq(' + index + ')').fadeOut();
        tab.find('.tab-area').find('div.tab-item:eq(' + index + ')').fadeIn();
        g.preventDefault();
      });
      var swiper = new Swiper('.client-say-slider', {
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: true,
        },
        pagination: {
          el: '.client-pagination',
          clickable: true,
        },
      })
      //Testimonial Slider
      var swiper = new Swiper('.testimonial-slider', {
        loop: true,
        speed: 500,
        autoplay: {
          delay: 2500,
        }
      })
      //Banner Slider
      var swiper = new Swiper('.banner-slider', {
        spaceBetween: 30,
        effect: 'fade',
        disableOnInteraction: false,
        navigation: {
          nextEl: '.banner-next',
          prevEl: '.banner-prev',
        },
        pagination: {
          el: '.banner-pagination'
        },
        loop: true,
        speed: 1000,
        autoplay: {
          delay: 3000,
        },
      });
      var swiper = new Swiper('.slider-post', {
        navigation: {
          nextEl: '.blog-next',
          prevEl: '.blog-prev',
        },
        loop: true,
      })
      $('#view-pass-01').on('click', function () {
        var x = document.getElementById("my-input-01");
        if (x.type === "password") {
          x.type = "text";
          $('#view-pass-01 .flaticon-eye').addClass('flaticon-hide');
          $('#view-pass-01 .flaticon-eye').removeClass('flaticon-eye');
        } else {
          x.type = "password";
          $('#view-pass-01 .flaticon-hide').addClass('flaticon-eye');
          $('#view-pass-01 .flaticon-hide').removeClass('flaticon-hide');
        }
      });
      $('#view-pass-02').on('click', function () {
        var x = document.getElementById("my-input-02");
        if (x.type === "password") {
          x.type = "text";
          $('#view-pass-02 .flaticon-eye').addClass('flaticon-hide');
          $('#view-pass-02 .flaticon-eye').removeClass('flaticon-eye');
        } else {
          x.type = "password";
          $('#view-pass-02 .flaticon-hide').addClass('flaticon-eye');
          $('#view-pass-02 .flaticon-hide').removeClass('flaticon-hide');
        }
      });
      $('#view-pass-03').on('click', function () {
        var x = document.getElementById("my-input-03");
        if (x.type === "password") {
          x.type = "text";
          $('#view-pass-03 .flaticon-eye').addClass('flaticon-hide');
          $('#view-pass-03 .flaticon-eye').removeClass('flaticon-eye');
        } else {
          x.type = "password";
          $('#view-pass-03 .flaticon-hide').addClass('flaticon-eye');
          $('#view-pass-03 .flaticon-hide').removeClass('flaticon-hide');
        }
      });
    });
  })(jQuery);