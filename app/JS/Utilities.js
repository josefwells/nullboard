function htmlEncode(raw){
    return $('tt .encoder').text(raw).html();
}

function htmlDecode(enc){
    return $('tt .encoder').html(enc).text();
}

function setText($object, text){
    $object.attr('_text', text);
    text = htmlEncode(text);
    regex = /\b(https?:\/\/[^\s]+)/mg;
    text = text.replace(regex, function(url){
        return '<a href="' + url + '" target=_blank>' + url + '</a>';
    });
    $object.html(text);
}

function getText($note){
    return $note.attr('_text');
}

function setupListScrolling(){
    var $lists    = $('.board .lists');
    var $scroller = $('.board .lists-scroller');
    adjustListScroller();
    $lists[0]._busyScrolling = 0;
    $scroller[0]._busyScrolling = 0;
    $scroller.on('scroll', function(){ cloneScrollPos($scroller, $lists); });
    $lists   .on('scroll', function(){ cloneScrollPos($lists, $scroller); });
    adjustLayout();
}

function adjustListScroller(){
    var $board = $('.board');
    if (! $board.length){
        return;
    }
    var $lists    = $('.board .lists');
    var $scroller = $('.board .lists-scroller');
    var $inner    = $scroller.find('div');
    var max  = $board.width();
    var want = $lists[0].scrollWidth;
    var have = $inner.width();
    if (want <= max){
        $scroller.hide();
        return;
    }
    $scroller.show();
    if (want == have){
        return;
    }
    $inner.width(want);
    cloneScrollPos($lists, $scroller);
}

function cloneScrollPos($src, $dst){
    var src = $src[0];
    var dst = $dst[0];
    if (src._busyScrolling){
        src._busyScrolling--;
        return;
    }
    dst._busyScrolling++;
    dst.scrollLeft = src.scrollLeft;
}

function adjustLayout(){
    var $body = $('body');
    var $board = $('.board');
    if (! $board.length){
        return;
    }
    var lists = $board.find('.list').length;
    var lists_w = (lists < 2) ? 250 : 260 * lists - 10;
    var body_w = $body.width();
    if (lists_w + 190 <= body_w){
        $board.css('max-width', '');
        $body.removeClass('crowded');
    }
    else{
        var max = Math.floor( (body_w - 40) / 260 );
        max = (max < 2) ? 250 : 260 * max - 10;
        $board.css('max-width', max + 'px');
        $body.addClass('crowded');
    }
}

function showDing(){
    $('body')
    .addClass('ding')
    .delay(100)
    .queue(function(){ $(this).removeClass('ding').dequeue(); });
}

async function formatLicense(){
    const response = await fetch('LICENSE');
    const responseText = await response.text();
    var text = responseText;
    var pos = text.search('LICENSE');
    var qos = text.search('Software:');
    var bulk;
    bulk = text.substr(pos, qos-pos);
    bulk = bulk.replace(/([^\n])\n\t/g, '$1 ');
    bulk = bulk.replace(/\n\n\t/g, '\n\n');
    bulk = bulk.replace(/([A-Z ]{7,})/g, '<u>$1</u>');
    var c1 = [];
    var c2 = [];
    text.substr(qos).trim().split('\n').forEach(function(line){
        line = line.split(':');
        c1.push( line[0].trim() + ':' );
        c2.push( line[1].trim() );
    });
    bulk += '<span>' + c1.join('<br>') + '</span>';
    bulk += '<span>' + c2.join('<br>') + '</span>';
    var links =
    [
        { text: '2-clause BSD license', href: 'https://opensource.org/licenses/BSD-2-Clause/' },
        { text: 'Commons Clause',       href: 'https://commonsclause.com/' }
    ];
    links.forEach(function(l){
        bulk = bulk.replace(l.text, '<a href="' + l.href + '" target=_blank>' + l.text + '</a>');
    });
    return bulk.trim();
}

function setRevealState(ev){
    var raw = ev.originalEvent;
    var caps = raw.getModifierState && raw.getModifierState( 'CapsLock' );
    if (caps){
        $('body').addClass('reveal');
    }
    else{
        $('body').removeClass('reveal');
    }
}