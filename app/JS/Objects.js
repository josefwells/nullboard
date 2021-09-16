function Note(text){
    this.text = text;
    this.raw  = false;
    this.min  = false;
}

function List(title){
    this.title = title;
    this.notes = [ ];
    this.addNote = function(text){
        var newNote = new Note(text);
        this.notes.push(newNote);
        return newNote;
    }
}

function Board(title){
    this.id       = +new Date();
    this.title    = title;
    this.lists    = [ ];
    this.addList = function(title){
        var newList = new List(title);
        this.lists.push(newList);
        return newList;
    }
}

async function createDatabase(){
    var dbExists = await fetch('/PHP/create-db.php',{
        method: 'POST' });
    console.log(await dbExists.text());
}