<?php
    $db = new SQLite3('DB/nullboard.db');
    $sql = "SELECT id FROM LastBoard WHERE position=0";
    if($response = $db->query($sql)){
        while($row = $response->fetchArray()){
            echo $row['id'];
        }
    }
    $db->close();
?>
