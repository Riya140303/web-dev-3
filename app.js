const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to my new todo list!"
});

const item2 = new Item({
    name: "Hit the + button if u want me to do something"
});

const item3 = new Item({
    name: "<---- Hit this if u dont want me to do that thing"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items : [itemsSchema]
};

const List = mongoose.model("List", listSchema);





app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){

        if (foundItems.length == 0) {
            Item.insertMany(defaultItems, function(err){
                if (err){
                    console.log("OOPPSS!!!");
                } else{
                    console.log("Success!!")
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});

        }

        

    });

});
app.get("/:customListName", function(req, res){
    const customListName= req.params.customListName;

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //create new list
                
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect("/" + customListName);
            }else{
                res.render("list", {listTitle: "foundList.name", newListItems: foundList.Items});
            }

        }
});

    
});


// var currentDay = today.getDay();
// var day = "";

// switch (currentDay){
//     case 0:
//         day = "Sunday";
//         break;
//     case 1:
//         day = "Monday";
//         break;
//     case 2:
//         day = "Tuesday";
//         break;
//     case 3:
//         day = "Wednesday";
//         break;
//     case 4:
//         day = "Thursday";
//         break;
//     case 5:
//         day = "Friday";
//         break;
//     case 6:
//         day = "Saturday";
//         break;
//     default:
//     console.log("Error");
//    }
   
  
app.post("/",function(req, res){
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/");

});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox ;

    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
            console.log("Successfully Deleted!!!");
            res.redirect("/");
        }
    })
});



app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workitems});
});

app.post("/work", function(req, res){
    let item = req.body.newItem;
    workitems.push(item);
    res.redirect("/work");

});

app.listen(4000, function(){
    console.log("Server started on port 4000");
});
