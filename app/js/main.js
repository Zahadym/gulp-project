$(function () {

    $('.header__slider').slick({
        infinite: true,
        fade: true,
        nextArrow: '<img class="slider-arrows" src="img/icon/arrow-right.svg" alt="arrow">',
        prevArrow: '<img class="slider-arrows slider-arrows__left" src="img/icon/arrow-left.svg" alt="arrow">',
        asNavFor: '.slider-dots'
    });

    $('.slider-dots').slick({
        asNavFor: '.header__slider',
        slidesToShow: 4,
        slidesToScroll: 4
    });

});