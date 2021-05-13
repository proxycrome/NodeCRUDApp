const express = require('express');
const app = express();

const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/DataApp';

app.use(express.json())

mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, (err) => {
    if(err){
        console.log(err);
    }else {
        console.log('Database Connection successful')
    }
})

const DataSchema = new mongoose.Schema({
    name: String,
    email: String,
    country: String
});

const Data = mongoose.model('Data', DataSchema);


// POST request to /data to create a new data
app.post('/data', function(req, res) {
    // retrieve new data from req body
    Data.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country 
    }, (err, newData) => {
        if(err){
            return res.status(500).json({message: err})
        } else {
            return res.status(200).json({ message: "new data created", newData })
        }
    })
})

// GET request to /data to fetch all Data
app.get('/data', (req, res) => {
    //fetch all Data
    Data.find({}, (err, data) => {
        if(err){
            return res.status(500).json({ message: err })
       }else{
           return res.status(200).json({ data })
       }
    });
})

// PUT request to /data/:id to update a single block of data
app.put('/data/:id', (req, res) => {
    Data.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, data) => {
        if (err) {
            return res.status(500).json({message: err})
        } else if(!data){
            return res.status(404).json({message: "data not found"})
        } else {
            data.save((err, savedData) => {
                if(err){
                    return res.status(400).json({nessage: err})
                }else{
                    return res.status(200).json({message: "Data updated successfully"})
                }
            })
        }
    })
})

// Delete request to /data/:id 
app.delete('/data/:id', (req, res) => {
    Data.findOneAndDelete({_id: req.params.id}, (err, data) => {
        if (err) {
            return res.status(500).json({message: err})
        } else if (!data) {
            return res.status(404).json({message: "Data not found"})
        } else {
            return res.status(200).json({message: "Data deleted Successfully"})
        }
    })
})

/* GET home page. */
app.get('/', function (req, res) {
  res.send('Hello Wolrd');
});

app.listen(process.env.PORT)
