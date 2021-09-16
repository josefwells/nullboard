<?php
    $board_id = $_POST['board_id'];
    $db = new SQLite3('DB/nullboard.db');
    $sql = "UPDATE LastBoard SET id='$board_id' WHERE position=0";
    if($db->exec($sql)){
        if($board_id == 0){
            echo "Last Board Reset\n";
        }else{
            echo "Last Board Set\n";
        }
    }else{
        echo "ERROR: Last Board Not Set\n";
    }
    $db->close();
?>
