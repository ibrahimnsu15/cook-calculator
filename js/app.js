/* Template Name: Landrick - Saas & Software Landing Page Template
   Author: Shreethemes
   E-mail: shreethemes@gmail.com
   Created: August 2019
   Version: 2.5
   Updated: July 2020
   File Description: Main JS file of the template
*/

!(function ($) {
  "use strict";

  // Menu
  $(".navbar-toggle").on("click", function (event) {
    $(this).toggleClass("open");
    $("#navigation").slideToggle(400);
  });

  $(".navigation-menu>li").slice(-1).addClass("last-elements");

  $(".menu-arrow,.submenu-arrow").on("click", function (e) {
    if ($(window).width() < 992) {
      e.preventDefault();
      $(this)
        .parent("li")
        .toggleClass("open")
        .find(".submenu:first")
        .toggleClass("open");
    }
  });

  $(".navigation-menu a").each(function () {
    if (this.href == window.location.href) {
      $(this).parent().addClass("active");
      $(this).parent().parent().parent().addClass("active");
      $(this).parent().parent().parent().parent().parent().addClass("active");
    }
  });

  // Clickable Menu
  $(".has-submenu a").click(function () {
    if (window.innerWidth < 992) {
      if ($(this).parent().hasClass("open")) {
        $(this).siblings(".submenu").removeClass("open");
        $(this).parent().removeClass("open");
      } else {
        $(this).siblings(".submenu").addClass("open");
        $(this).parent().addClass("open");
      }
    }
  });

  $(".dd-menu").on("click", function (e) {
    e.stopPropagation();
  });

  $(".mouse-down").on("click", function (event) {
    var $anchor = $(this);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $($anchor.attr("href")).offset().top - 72,
        },
        1500,
        "easeInOutExpo"
      );
    event.preventDefault();
  });

  //Sticky
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 50) {
      $(".sticky").addClass("nav-sticky");
    } else {
      $(".sticky").removeClass("nav-sticky");
    }
  });

  //Tooltip
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
  //Popover
  $(function () {
    $('[data-toggle="popover"]').popover();
  });
})(jQuery);

function goBack() {
  window.history.back();
}