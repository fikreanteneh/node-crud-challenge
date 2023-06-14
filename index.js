const express = require('express')
const app = express()

let personsDatabase = [{
    id: '1',
    name: 'Sam',
    age: '26',
    hobbies: []    
}] //This is your in memory database

app.set('db', personsDatabase)
//TODO: Implement crud of person

// Config
const cors = require('cors')
app.use(cors())
app.use(express.json())
const { v4: uuidv4 } = require('uuid');

// Get /person - returns all personsDatabase
 app.get('/person', async (req, res) =>{

    personsDatabase = await app.get("db")
    res.status(200).send(personsDatabase);
})


 // Get /person/:personId - returns a single person by id if it exists else returns 404
 app.get('/person/:personId', async (req, res) => {

    const personsDatabase = await app.get("db")
    const personId = req.params.personId;
    const person = personsDatabase.find(person => person.id === personId);
    
    if (!person) {
        res.status(404).send("Person not found");
        return;
    }
    res.status(200).send(person);
 })


// Post /person - creates a new person and returns it if it is valid else returns 404
 app.post('/person', async (req, res) => {
    const personsDatabase = await app.get("db")
    const {name, age, hobbies} = req.body;
    if ( !name || !age || isNaN(age) || ( !hobbies || !Array.isArray(hobbies)) ) {

        res.status(400).send("Name and Age are Both required, Age must be a number and hobbies is optional or an array")
        return
    }

    const newPerson = {
        id: uuidv4(),
        name: name,
        age: age,
        hobbies: hobbies || []
    };

    personsDatabase.push(newPerson);
    res.status(200).send(newPerson);
 })


// Put /person/:personId - updates a person by id and returns the updated person if it exists and is valid else returns 404
 app.put('/person/:personId', async (req, res) => {

    const personsDatabase = await app.get("db")
    const {name, age, hobbies} = req.body;
    const personId = req.params.personId;
    const personIndex = personsDatabase.findIndex(person => person.id === personId);

    if (personIndex === -1) {
        res.status(404).send("Person not found");
        return;
    } 
    else if  ( (name && typeof name !== "string" ) || (age && isNaN(req.body.age) || (hobbies && !Array.isArray(hobbies)))) {
        res.status(404).send("Name must be a sting, Age must be a number and hobbies is optional or an array");
        return;
    }

    const person = personsDatabase[personIndex];
    const updatedPerson = {
        ...person, 
        ...req.body
    }

    personsDatabase[personIndex] = updatedPerson;
    res.status(201).send(updatedPerson);
 })


 // Delete /person/:personId - deletes a person by id and returns the remaining personsDatabase if the person exists else returns 404
app.delete('/person/:personId', (req, res) => {
    
    const personId = req.params.personId;
    const index = personsDatabase.findIndex(person => person.id === personId);
    personsDatabase.splice(index, 1);

    if (!personsDatabase) {
        res.status(404).send("Person not found");
        return;
    }

    res.status(200).send("Person Deleted");
})


//Handles internal Server Error
app.use((err, req, res, next) =>{
    res.status(500).send("Internal Server Error")
})

// Handles all other route that doesnot exist404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
  });


if (require.main === module) {
    app.listen(3000)
}
module.exports = app;
