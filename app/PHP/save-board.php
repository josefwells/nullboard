<?php
    $board_id = $_POST['board_id'];
    $board_json = $_POST['board_json'];
    $db = new SQLite3('DB/nullboard.db');
    $test = "SELECT id FROM Boards WHERE id=$board_id";
    $test_result = $db->querySingle($test);
    $outcome = False;
    if(empty($test_result)){
        $sql = "INSERT INTO Boards VALUES ('$board_id', '$board_json')";
        $outcome = $db->exec($sql);
        
    }else{
        $sql = "UPDATE Boards SET json='$board_json' WHERE id='$board_id'";
        $outcome = $db->exec($sql);
    }
    $db->close();
    if($outcome){
        echo "Board Saved\n";
    }else{
        echo "ERROR: Board Not Saved\n";
    }
?>
