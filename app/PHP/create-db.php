<?php
    if(file_exists('nullboard.db')){
        echo "Database Exists\n";
    }else{
        $db = new SQLite3('DB/nullboard.db');
        if(!$db){
            echo "Couldn't Create Database\n";
        }
        $sql =<<<EOF
            CREATE TABLE Boards (
                id TEXT PRIMARY KEY NOT NULL,
                json TEXT NOT NULL
            );
            CREATE TABLE LastBoard (
                position INT PRIMARY KEY NOT NULL,
                id TEXT NOT NULL
            );
            INSERT INTO LastBoard VALUES (0, 0);
            EOF;
        if($db->exec($sql)){
            echo "Tables Created\n";
        }else{
            echo "ERROR: Couldn't Create Tables\n";
        }
        $db->close();
    }
?>
