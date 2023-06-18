const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())//adding body parser to express 

//imports from connection.js
const {connection, knex} = require('./connection') 

//checking database connection
connection.connect((err)=>{     
    if (err) {
        console.log(err);
    } else {
        console.log("connected to the database");
    }
})

/////////////////////////API/////////////////////////////
app.get("/api/getAllAirlineCompanies", async (req, res) => {
    //http://localhost:3000/api/getAllAirlineCompanies
    const result = await getAllAirlineCompanies()
    res.json(result[0])
})
  
//getAirlineById 
app.get("/api/getAirlineById/:id", async (req, res)=>{
    //http://localhost:3000/api/getAirlineById/:id:
    const id = req.params.id
try{
    const result = await getAirlineById(id)
    res.json(result[0])
}catch(err){
    res.status(500).send("Error: "+err)
}
})
app.post("/api/addAirline", async (req, res)=>{
    //http://localhost:3000/api/addAirline
    try{
    const newAirline = req.body
    const result = await addAirline(newAirline)
    res.json(result[0])
    } catch (err) {
        console.log("Error: "+err)
        res.status(500).send("Error: "+err)
    }
})
app.put("/api/updateAirline ", async (req, res) =>{
    //http://localhost:3000/api/updateAirline
    try{
    const IdAirline = req.params.id
    const updatedAirline = req.body
    const result = await updateAirline(updatedAirline, IdAirline)
    res.json(result[0])
    } catch (err) {
        console.log("Error: "+err)
        res.status(500).send("Error: "+err)
    }
})
app.delete("/api/removeAirline/:id ", async (req, res) =>{
    //http://localhost:3000/api/removeAirline/:id
    try{
    const AirlineIdRemove = req.body
    const result = await removeAirline(AirlineIdRemove)
    res.json(result[0])
    } catch (err) {
        console.log("Error: "+err)
        res.status(500).send("Error: "+err)
    }
})
/////////////////////////API/////////////////////////////
///////////////////////DB QUERY/////////////////////////
const getAllAirlineCompanies = async () =>{
    const result = await knex.raw(`select * from airline_companies`)
    return result
}  

const getAirlineById = async (id) =>{
    const result = await knex.select().from('airline_companies').where('id', id)
    return result
}

const addAirline = (object) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO airline_companies (airline_name) VALUES (?)`,
      [object.Name],
      (err, result) => {
        if (err) {
          console.error("Error: " + err);
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      }
    );
  });
};

const updateAirline = async (obj, condition) =>{
    return new Promise((resolve, reject) => {
    connection.query('UPDATE table_name SET airline_name = ? WHERE id = ?', [obj, condition], (err, res) => {
  if (err) {
    console.error(err);
    reject(err);
    // Handle the error
  } else {
    console.log(res);
    resolve(res)
    // Process the results
  }
});
  });
}

const removeAirline= async (id) =>{
    
}
///////////////////////DB QUERY/////////////////////////
//////////////////////STAYS FINAL///////////////////////
app.listen(3000, (err) =>{ //http/localhost3000/api/,...
    if(err) console.log(err)
    else console.log("Server is running on port 3000")
})
//////////////////////STAYS FINAL///////////////////////
