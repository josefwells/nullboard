var $overlay = $('.overlay');
var drag = new Drag();

$(window).live('blur', function(){
    $('body').removeClass('reveal');
});

$(document).live('keydown', function(ev){
    setRevealState(ev);
});

$(document).live('keyup', function(ev){
    var raw = ev.originalEvent;
    setRevealState(ev);
    if (ev.target.nodeName == 'TEXTAREA' ||
        ev.target.nodeName == 'INPUT'){
        return;
        }
});

$('.board .text').live('click', function(ev){
    if (this.was_dragged){
        this.was_dragged = false;
        return false;
    }
    drag.cancelPriming();
    startEditing($(this), ev);
    return false;
});

$('.board .note .text a').live('click', function(ev){
    if (! $('body').hasClass('reveal'))
        return true;
    ev.stopPropagation();
    return true;
});

function handleTab(ev){
    var $this = $(this);
    var $note = $this.closest('.note');
    var $sibl = ev.shiftKey ? $note.prev() : $note.next();
    if ($sibl.length){
        stopEditing($this, false);
        $sibl.find('.text').click();
    }
}

$('.board .edit').live('keydown', function(ev){
    // esc
    if (ev.keyCode == 27){
        stopEditing($(this), true);
        return false;
    }
    // tab
    if (ev.keyCode == 9){
        handleTab.call(this, ev);
        return false;
    }
    // enter
    if (ev.keyCode == 13 && ev.ctrlKey){
        var $this = $(this);
        var $note = $this.closest('.note');
        var $list = $note.closest('.list');
        stopEditing($this, false);
        if ($note && ev.shiftKey) // ctrl-shift-enter
            addNote($list, null, $note);
        else
        if ($note && !ev.shiftKey) // ctrl-enter
            addNote($list, $note);
        return false;
    }
    if (ev.keyCode == 13 && this.tagName == 'INPUT' ||
        ev.keyCode == 13 && ev.altKey ||
        ev.keyCode == 13 && ev.shiftKey){
        stopEditing($(this), false);
        return false;
    }
    //
    if (ev.key == '*' && ev.ctrlKey){
        var have = this.value;
        var pos  = this.selectionStart;
        var want = have.substr(0, pos) + '\u2022 ' + have.substr(this.selectionEnd);
        $(this).val(want);
        this.selectionStart = this.selectionEnd = pos + 2;
        return false;
    }
    return true;
});

$('.board .edit').live('keypress', function(ev){
    // tab
    if (ev.keyCode == 9){
        handleTab.call(this, ev);
        return false;
    }
});

$('.board .edit').live('blur', function(ev){
    if (document.activeElement != this)
        stopEditing($(this));
    else
        ; // switch away from the browser window
});

$('.board .note .edit').live('input propertychange', function(){
    var delta = $(this).outerHeight() - $(this).height();
    $(this).height(10);
    if (this.scrollHeight > this.clientHeight)
        $(this).height(this.scrollHeight-delta);
});

$('.config .add-board').live('click', function(){
    addBoard();
    return false;
});

$('.config .load-board').live('click', function(){
    var board_id = $(this)[0].board_id;
    if ((document.board && document.board.id) == board_id)
        closeBoard();
    else
        openBoard( $(this)[0].board_id );
    return false;
});

$('.board .del-board').live('click', function(){
    deleteBoard();
    return false;
});

$('.board .add-list').live('click', function(){
    addList();
    return false;
});

$('.board .del-list').live('click', function(){
    deleteList( $(this).closest('.list') );
    return false;
});

$('.board .mov-list-l').live('click', function(){
    moveList( $(this).closest('.list'), true );
    return false;
});

$('.board .mov-list-r').live('click', function(){
    moveList( $(this).closest('.list'), false );
    return false;
});

$('.board .add-note').live('click', function(){
    addNote( $(this).closest('.list') );
    return false;
});

$('.board .del-note').live('click', function(){
    deleteNote( $(this).closest('.note') );
    return false;
});

$('.board .raw-note').live('click', function(){
    $(this).closest('.note').toggleClass('raw');
    saveBoard();
    return false;
});

$('.board .collapse').live('click', function(){
    $(this).closest('.note').toggleClass('collapsed');
    saveBoard();
    return false;
});

$('.board .note .text').live('mousedown', function(ev){
    drag.prime(this, ev);
});

$(document).on('mouseup', function(ev){
    drag.end();
});

$(document).on('mousemove', function(ev){
    setRevealState(ev);
    drag.onMouseMove(ev);
});

$overlay.click(function(ev){
    if (ev.originalEvent.target != this)
        return true;
    hideOverlay($overlay);
    return false;
});

$(window).keydown(function(ev){
    if ($overlay.css('display') != 'none' && ev.keyCode == 27)
        hideOverlay($overlay);
});

$('.view-about').click(function(){
    var $div = $('tt .about').clone();
    $div.find('div').html('Version 21.09');
    showOverlay($overlay, $div);
    return false;
});

$('.view-license').click(async function(){
    var $div = $('tt .license').clone();
    const text = await formatLicense();
    $div.html(text);
    showOverlay($overlay, $div);
    return false;
});

function showOverlay($overlay, $div){
    $overlay
    .html('')
    .append($div)
    .css({ opacity: 0, display: 'block' })
    .animate({ opacity: 1 });
}

function hideOverlay($overlay){
    $overlay.animate({ opacity: 0 }, function(){
        $overlay.hide();
    });
}

function Drag(){
    this.item    = null;                // .text of .note
    this.priming = null;
    this.primexy = { x: 0, y: 0 };
    this.$drag   = null;
    this.mouse   = null;
    this.delta   = { x: 0, y: 0 };
    this.in_swap = false;
    this.prime = function(item, ev){
        var self = this;
        this.item = item;
        this.priming = setTimeout(function(){ self.onPrimed.call(self); }, ev.altKey ? 1 : 500);
        this.primexy.x = ev.clientX;
        this.primexy.y = ev.clientY;
        this.mouse = ev;
    }
    this.cancelPriming = function(){
        if (this.item && this.priming)
        {
            clearTimeout(this.priming);
            this.priming = null;
            this.item = null;
        }
    }
    this.end = function(){
        this.cancelPriming();
        this.stopDragging();
    }
    this.isActive = function(){
        return this.item && (this.priming == null);
    }
    this.onPrimed = function(){
        clearTimeout(this.priming);
        this.priming = null;
        this.item.was_dragged = true;
        var $text = $(this.item);
        var $note = $text.parent();
        $note.addClass('dragging');
        $('body').append('<div class=dragster></div>');
        var $drag = $('body .dragster').last();
        if ($note.hasClass('collapsed')){
            $drag.addClass('collapsed');
        }
        $drag.html( $text.html() );
        $drag.innerWidth ( $note.innerWidth()  );
        $drag.innerHeight( $note.innerHeight() );
        this.$drag = $drag;
        var $win = $(window);
        var scroll_x = $win.scrollLeft();
        var scroll_y = $win.scrollTop();
        var pos = $note.offset();
        this.delta.x = pos.left - this.mouse.clientX - scroll_x;
        this.delta.y = pos.top  - this.mouse.clientY - scroll_y;
        this.adjustDrag();
        $drag.css({ opacity: 1 });
        $('body').addClass('dragging');
    }
    this.adjustDrag = function(){
        if (! this.$drag){
            return;
        }
        var $win = $(window);
        var scroll_x = $win.scrollLeft();
        var scroll_y = $win.scrollTop();
        var drag_x = this.mouse.clientX + this.delta.x + scroll_x;
        var drag_y = this.mouse.clientY + this.delta.y + scroll_y;
        this.$drag.offset({ left: drag_x, top: drag_y });
        if (this.in_swap){
            return;
        }
        //	see if a swap is in order
        var pos = this.$drag.offset();
        var x = pos.left + this.$drag.width()/2 - $win.scrollLeft();
        var y = pos.top + this.$drag.height()/2 - $win.scrollTop();
        var drag = this;
        var prepend = null;   // if dropping on the list header
        var target = null;    // if over some item
        var before = false;   // if should go before that item
        $(".board .list").each(function(){
            var list = this;
            var rc = list.getBoundingClientRect();
            var y_min = rc.bottom;
            var n_min = null;
            if (x <= rc.left || rc.right <= x || y <= rc.top || rc.bottom <= y)
                return;
            var $list = $(list);
            $list.find('.note').each(function(){
                var note = this;
                var rc = note.getBoundingClientRect();
                if (rc.top < y_min){
                    y_min = rc.top;
                    n_min = note;
                }
                if (y <= rc.top || rc.bottom <= y){
                    return;
                }
                if (note == drag.item.parentNode){
                    return;
                }
                target = note;
                before = (y < (rc.top + rc.bottom)/2);
            });
            //	dropping on the list header
            if (! target && y < y_min){
                if (n_min){ // non-empty list
                    target = n_min;
                    before = true;
                }
                else{
                    prepend = list;
                }
            }
        });
        if (! target && ! prepend){
            return;
        }
        if (target){
            if (target == drag.item.parentNode){
                return;
            }
            if (! before && target.nextSibling == drag.item.parentNode ||
                    before && target.previousSibling == drag.item.parentNode){
                return;
            }
        }
        else{
            if (prepend.firstChild == drag.item.parentNode){
                return;
            }
        }
        //swap em
        var $have = $(this.item.parentNode);
        var $want = $have.clone();
        $want.css({ display: 'none' });
        if (target){
            var $target = $(target);
            if (before){
                $want.insertBefore($target);
                $want = $target.prev();
            }
            else{
                $want.insertAfter($target);
                $want = $target.next();
            }
            drag.item = $want.find('.text')[0];
        }
        else{
            var $notes = $(prepend).find('.notes');
            $notes.prepend($want);
            drag.item = $notes.find('.note .text')[0];
        }
        var h = $have.height();
        drag.in_swap = true;
        $have.animate({ height: 0 }, 'fast', function(){
            $have.remove();
            $want.css({ marginTop: 5 });
            saveBoard();
        });
        $want.css({ display: 'block', height: 0, marginTop: 0 });
        $want.animate({ height: h }, 'fast', function(){
            $want.css({ opacity: '', height: '' });
            drag.in_swap = false;
            drag.adjustDrag();
        });
    }
    this.onMouseMove = function(ev){
        this.mouse = ev;
        if (! this.item){
            return;
        }
        if (this.priming){
            var x = ev.clientX - this.primexy.x;
            var y = ev.clientY - this.primexy.y;
            if (x*x + y*y > 5*5)
                this.onPrimed();
        }
        else{
            this.adjustDrag();
        }
    }
    this.stopDragging = function(){
        $(this.item).parent().removeClass('dragging');
        $('body').removeClass('dragging');
        if (this.$drag){
            this.$drag.remove();
            this.$drag = null;
            if (window.getSelection) { window.getSelection().removeAllRanges(); }
            else if (document.selection) { document.selection.empty(); }
        }
        this.item = null;
    }
}

function startEditing($text, ev){
    var $note = $text.parent();
    var $edit = $note.find('.edit');
    $note[0]._collapsed = $note.hasClass('collapsed');
    $note.removeClass('collapsed');
    $edit.val( getText($text) );
    $edit.width( $text.width() );
    $edit.height( $text.height() );
    $note.addClass('editing');
    $edit.focus();
}

function stopEditing($edit, via_escape){
    var $item = $edit.parent();
    if (! $item.hasClass('editing')){
        return;
    }
    $item.removeClass('editing');
    if ($item[0]._collapsed){
        $item.addClass('collapsed');
    }
    var $text = $item.find('.text');
    var text_now = $edit.val().trimRight();
    var text_was = getText( $text );
    var brand_new = $item.hasClass('brand-new');
    $item.removeClass('brand-new');
    if (via_escape){
        if (brand_new){
            $item.closest('.note, .list, .board').remove();
            return;
        }
    }
    else if (text_now != text_was || brand_new){
        setText( $text, text_now );
        saveBoard();
        updatePageTitle();
    }
    if (brand_new && $item.hasClass('list')){
        addNote($item);
    }
}