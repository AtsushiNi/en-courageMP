var moreNum = 3;
$('.item-list#prepare li:nth-child(n + ' + (moreNum + 1) + ')').addClass('is-hidden');
$('.view-more,#prepare').on('click', function() {
    $('.item-list#prepare li.is-hidden').slice(0, moreNum).removeClass('is-hidden');
    if ($('.item-list#prepare li.is-hidden').length == 0) {
        $('.view-more#prepare').fadeOut();
    }
});