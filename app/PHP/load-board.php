<?php
    $board_id = $_POST['board_id'];
    $db = new SQLite3('DB/nullboard.db');
    $sql = "SELECT json FROM Boards WHERE id = $board_id";
    if($response = $db->query($sql)){
        while($row = $response->fetchArray()){
            echo $row['json'];
        }
    }
    $db->close();
?>
