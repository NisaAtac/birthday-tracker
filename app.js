const express = require("express");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

app.set("views", path.join(__dirname, "/views")); // set the path of view location
app.set("view engine", "ejs"); // set the view engine to ejs

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true })); //to get data from form
// override with POST having ?_method=PUT
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/birthdayDb", {
  useNewUrlParser: true,
}); // connect to the database in MongoDB, if not exist creates the db
const PersonModel = require(__dirname + "/models/Person"); //  to access the model
// create locally new PersonModel instance in js
async function createPersonModel(obj) {
  try {
    var newPerson = new PersonModel(
      // database attribute: form attribute (input name attributes)
      {
        name: obj.firstName,
        surname: obj.lastName,
        birthday: obj.birthday,
      }
    );
    await newPerson.save(); // to save in database
    console.log("Saved to database..");
  } catch (e) {
    console.log(e);
  }
}

const formatDate = (date) => {
  let dateObj = new Date(date);
  let formattedDate =
    dateObj.getDate() +
    "-" +
    (dateObj.getMonth() + 1) +
    "-" +
    dateObj.getFullYear();
  return formattedDate;
};

app.get("/", async (req, res) => {
  // find all Person model
  const people = await PersonModel.find({});
  const peopleFormatted = people.map((person) => {
    return {
      name: person.name,
      surname: person.surname,
      birthday: formatDate(person.birthday),
      id: person._id,
    };
  });
  res.render("index", { people: peopleFormatted });
});
app.post("/", (req, res) => {
  createPersonModel(req.body);
  res.redirect("/");
});

app.post("/filter", async (req, res) => {
  console.log("Filtering now..");
  const filterByMonth = req.body.months;
  let filteredPeople;
  // console.log(req.body.months);
  try {
    // const foundPeople = PersonModel.where("name").equals("hello");
    const people = await PersonModel.find({});
    // write a function that takes people and returns the filtered date
    filteredPeople = filterByDate(people, filterByMonth);
  } catch (err) {
    console.log(err);
  }
  res.render("index", { people: filteredPeople });
  // if req.body.months is in months (db) filter those to show
  // get months (db) and convert .getMonth() to String or vice versa
});

const filterByDate = (people, filterByMonth) => {
  let filteredPeople = [];
  // loop over the people object
  for (person of people) {
    // formatDate() return the date in the format 26-3-2001. Only month will be filtered.
    let formattedDate = formatDate(person.birthday).split("-")[1]; //gives the month
    if (formattedDate === filterByMonth) {
      filteredPeople.push(person);
    }
  }
  return filteredPeople;
};

app.get("/new", (req, res) => {
  res.render("createForm");
});

app.get("/edit/:id", async (req, res) => {
  console.log("Get route...");
  const friendId = req.params.id;
  const friend = await PersonModel.findById(friendId);
  res.render("edit", { friend: friend, id: friendId });
});

app.patch("/edit/:id", async (req, res) => {
  console.log("Patch route...");
  // try & catch to update model, req.body to access user input
  try {
    await PersonModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.firstName,
        surname: req.body.lastName,
        birthday: req.body.birthday,
      }
    );
  } catch (e) {
    console.log(e);
  }
  res.redirect("/");
});

app.delete("/delete", async (req, res) => {
  try {
    await PersonModel.findByIdAndDelete({ _id: req.body.id });
  } catch (e) {
    console.log(e);
  }
  res.redirect("/");
});

app.listen(3000);
console.log("Server is listening on port 3000.");
