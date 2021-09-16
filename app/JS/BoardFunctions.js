async function openBoard(board_id){
    await closeBoard(true);
    document.board = await loadBoard(board_id);
    await setLastBoard(board_id);
    await showBoard(true);
}

async function loadBoard(board_id){
    var formData = new FormData();
    formData.append('board_id', board_id);
    const response = await fetch('/PHP/load-board.php',{
        method: 'POST', body: formData });
    const jsonData = await response.json();
    if (!jsonData){
        return null;
    }
    var newBoard = jsonData;
    newBoard.title = jsonData.title;
    newBoard.id = board_id;
    return newBoard;
}

async function showBoard(quick){
    var board = document.board;
    var $wrap = $('.wrap');
    var $bdiv = $('tt .board');
    var $ldiv = $('tt .list');
    var $ndiv = $('tt .note');
    var $b = $bdiv.clone();
    var $b_lists = $b.find('.lists');
    $b[0].board_id = board.id;
    setText( $b.find('.head .text'), board.title );
    board.lists.forEach(function(list){
        var $l = $ldiv.clone();
        var $l_notes = $l.find('.notes');
        setText( $l.find('.head .text'), list.title );
        list.notes.forEach(function(n){
            var $n = $ndiv.clone();
            setText( $n.find('.text'), n.text );
            if (n.raw) $n.addClass('raw');
            if (n.min) $n.addClass('collapsed');
            $l_notes.append($n);
        });
        $b_lists.append($l);
    });
    if (quick){
        $wrap.html('').append($b);
    }
    else{
        $wrap.html('')
            .css({ opacity: 0 })
            .append($b)
            .animate({ opacity: 1 });
    }
   updatePageTitle();
   await updateBoardIndex();
   setupListScrolling();
}

function updatePageTitle(){
    if (!document.board){
        document.title = 'Nullboard';
        return;
    }
    document.title = 'NB - ' + (document.board.title || '(unnamed board)');
}

async function addBoard(){
    document.board = new Board('');
    await setLastBoard(document.board.id);
    await showBoard(false);
    $('.wrap .board .head').addClass('brand-new');
    $('.wrap .board .head .text').click();
}

async function saveBoard(){
    var $board = $('.wrap .board');
    var board = new Board( getText($board.find('> .head .text')) );
    $board.find('.list').each(function(){
        var $list = $(this);
        var l = board.addList( getText($list.find('.head .text')) );
        $list.find('.note').each(function(){
            var $note = $(this)
            var n = l.addNote( getText($note.find('.text')) );
            n.raw = $note.hasClass('raw');
            n.min = $note.hasClass('collapsed');
        });
    });
    var board_id = document.board.id;
    var formData = new FormData();
    formData.append('board_id', board_id);
    formData.append('board_json', JSON.stringify(board));
    var response = await fetch('/PHP/save-board.php',{
        method: 'POST', body: formData });
    console.log(await response.text());
    await updateBoardIndex();
    await setLastBoard(board_id);
}

async function updateBoardIndex(){
    var $index  = $('.config .boards');
    var $entry  = $('tt .load-board');
    var id_now = document.board && document.board.id;
    var empty = true;
    $index.html('');
    $index.hide();
    const response = await (await fetch('/PHP/list-boards.php')).text();
    // split at @ and remove empty elements
    var array = response.split("@");
    array = array.filter(n => n);
    for (var i=0; i<array.length; i++){
        var board_id = array[i];
        var title = await getBoardTitle(board_id);
        var $e = $entry.clone();
        $e[0].board_id = board_id;
        $e.html( title || '(unnamed board)' );
        if (board_id == id_now){
            $e.addClass('active');
        }
        $index.append($e);
        empty = false;
    }
    if (! empty){
        $index.show();
    }
}

async function getBoardTitle(board_id){
    var formData = new FormData();
    formData.append('board_id', board_id);
    const response = await fetch('/PHP/load-board.php',{
        method: 'POST', body: formData });
    const jsonData = await response.json();
    if (!jsonData){
        return null;
    }
    return jsonData.title;
}

async function setLastBoard(board_id){
    var formData = new FormData();
    formData.append('board_id', board_id);
    var response = await fetch('/PHP/set-last-board.php',{
        method: 'POST', body: formData });
    console.log(await response.text());
}

async function getLastBoard(){
    var formData = new FormData();
    const response = await fetch('/PHP/get-last-board.php',{
        method: 'POST', body: formData });
    const lastBoardId = await response.text();
    return lastBoardId;
}

async function closeBoard(quick){
    var $board = $('.wrap .board');
    if (quick){
        $board.remove();
    }
    else{
        $board
            .animate({ opacity: 0 }, 'fast')
            .queue(function(){ $board.remove(); });
    }
    document.board = null;
    await setLastBoard(0);
}

async function deleteBoard(){
    var $list = $('.wrap .board .list');
    if ($list.length && ! confirm("PERMANENTLY delete this board, all its lists and their notes?")){
        return;
    }
    var board_id = document.board.id;
    var formData = new FormData();
    formData.append('board_id', board_id);
    var response = await fetch('/PHP/delete-board.php',{
        method: 'POST', body: formData });
    console.log(await response.text());
    await setLastBoard(0);
    await updateBoardIndex();
    await closeBoard();
}
