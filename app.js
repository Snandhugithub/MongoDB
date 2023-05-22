const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./database');
const ObjectID = dbo.ObjectID;

app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}))
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyparser.urlencoded({extended:true}));

app.get('/',async (req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('StudDet');
    const cursor = collection.find({})
    let StudDet = await cursor.toArray();

    let message = '';
    let edit_id, edit_StudDet;

    if(req.query.edit_id){
        edit_id = req.query.edit_id;
        edit_StudDet = await collection.findOne({_id:new ObjectID(edit_id)})
    }

    if (req.query.delete_id) {
        await collection.deleteOne({_id: new ObjectID(req.query.delete_id)})
        return res.redirect('/?status=3');
    }
    
    switch (req.query.status) {
        case '1':
            message = 'Inserted Succesfully!';
            break;

        case '2':
            message = 'Updated Succesfully!';
            break;

        case '3':
            message = 'Deleted Succesfully!';
            break;
    
        default:
            break;
    }


    res.render('main',{message,StudDet,edit_id,edit_StudDet})
})

app.post('/store_StudDet',async (req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('StudDet');
    let StudDet = { name: req.body.name, age: req.body.age , dept:req.body.dept,ph_no: req.body.ph_no, dob:req.body.dob};
    await collection.insertOne(StudDet);
    return res.redirect('/?status=1');
})

app.post('/update_StudDet/:edit_id',async (req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('StudDet');
    let StudDet = { name: req.body.name, age: req.body.age,dept:req.body.dept, ph_no: req.body.ph_no, dob:req.body.dob };
    let edit_id = req.params.edit_id;

    await collection.updateOne({_id: new ObjectID(edit_id)},{$set:StudDet});
    return res.redirect('/?status=2');
})

app.listen(2682,()=>{console.log('Listening to 2682 port');})