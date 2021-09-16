function addNote($list, $after, $before){
    var $note  = $('tt .note').clone();
    var $notes = $list.find('.notes');
    $note.find('.text').html('');
    $note.addClass('brand-new');
    if ($before){
        $before.before($note);
        $note = $before.prev();
    }
    else{}
    if ($after){
        $after.after($note);
        $note = $after.next();
    }
    else{
        $notes.append($note);
        $note = $notes.find('.note').last();
    }
    $note.find('.text').click();
}

function deleteNote($note){
    $note
    .animate({ opacity: 0 }, 'fast')
    .slideUp('fast')
    .queue(function(){
        $note.remove();
        saveBoard();
    });
}