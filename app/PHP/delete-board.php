<?php
    $board_id = $_POST['board_id'];
    $db = new SQLite3('DB/nullboard.db');
    $sql = "DELETE FROM Boards WHERE id=$board_id";
    if($db->exec($sql)){
        echo "Board Deleted\n";
    }else{
        echo "ERROR: Couldn't Delete Board\n";
    }
    $db->close();
?>
