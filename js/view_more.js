var moreNum = 3;
$('.item-list li:nth-child(n + ' + (moreNum + 1) + ')').addClass('is-hidden');
$('.view-more-btn').on('click', function() {
    var id = $(this).attr('id')
    $('#' + id + '-item-list li.is-hidden').slice(0, moreNum).removeClass('is-hidden');
    if ($('.item-list li.is-hidden').length == 0) {
        $('.view-more-btn').fadeOut();
    }
});
