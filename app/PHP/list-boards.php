<?php
    $db = new SQLite3('DB/nullboard.db');
    $sql = "SELECT id FROM Boards";
    if($response = $db->query($sql)){
        while($row = $response->fetchArray()){
            echo $row['id'] . '@';
        }
    }
    $db->close();
?>
