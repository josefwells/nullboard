$(window).resize(adjustLayout);
adjustLayout();
main();

async function main(){
    await createDatabase();
    var board_id = await getLastBoard();
    if (board_id != 0){
        document.board = await loadBoard(board_id);
    }
    await updateBoardIndex();
    if (document.board){
        showBoard(true);
    }
    setInterval(adjustListScroller, 100);
    setupListScrolling();
}