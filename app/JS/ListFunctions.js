function addList(){
    var $board = $('.wrap .board');
    var $lists = $board.find('.lists');
    var $list = $('tt .list').clone();
    $list.find('.text').html('');
    $list.find('.head').addClass('brand-new');
    $lists.append($list);
    $board.find('.lists .list .head .text').last().click();
    var lists = $lists[0];
    lists.scrollLeft = Math.max(0, lists.scrollWidth - lists.clientWidth);
    setupListScrolling();
}

function deleteList($list){
    var empty = true;
    $list.find('.note .text').each(function(){
        empty &= ($(this).html().length == 0);
    });
    if (! empty && ! confirm("Delete this list and all its notes?")){
        return;
    }
    $list
    .animate({ opacity: 0 })
    .queue(function(){
        $list.remove();
        saveBoard();
    });
    setupListScrolling();
}

function moveList($list, left){
    var $a = $list;
    var $b = left ? $a.prev() : $a.next();
    var $menu_a = $a.find('> .head .menu .bulk');
    var $menu_b = $b.find('> .head .menu .bulk');
    var pos_a = $a.offset().left;
    var pos_b = $b.offset().left;
    $a.css({ position: 'relative' });
    $b.css({ position: 'relative' });
    $menu_a.hide();
    $menu_b.hide();
    $a.animate({ left: (pos_b - pos_a) + 'px' }, 'fast');
    $b.animate({ left: (pos_a - pos_b) + 'px' }, 'fast', function(){
        if (left) $list.prev().before($list);
        else      $list.before($list.next());
        $a.css({ position: '', left: '' });
        $b.css({ position: '', left: '' });
        $menu_a.css({ display: '' });
        $menu_b.css({ display: '' });
        saveBoard();
    });
}