const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const e = require('express');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('Hello Wold!');
});

app.post('/draw_rhombus',(req,res)=>{
    let array_list = [1,2,3,4,3,2,1];
    let str = '';
    for(var num of array_list){
        let char_length = num + num;
        let max_value =  Math.max(...array_list);
        let white_space = max_value - num;
        for(var x = 1; x <= white_space;x++){
            str+='\xa0';
        }
        str+='\xa0';
        for(var x = 1; x <= char_length;x++){
            if(x == 1){
                str+=`${num}`;
            }else if (x == char_length){
                str+=`${num}`;
            }else{
                str+=`*`;
            } 
        }
        str+=`\n`;
    }
    console.log(str);
    res.send(str);
    //console.log(`\xa0\xa0\xa011\n\xa0\xa02**2\n\xa03****3\n4******4\n3****3\n2**2\n11`)
    //res.send(`\xa0\xa0\xa011\n\xa0\xa02**2\n\xa03****3\n4******4\n3****3\n2**2\n11`)
})

app.post('/triangle_area',multer().none(),(req,res)=>{
    console.log(JSON.stringify(req.body))
    if(!req.body.base || !req.body.height) throw 'Please fill out form-data.'

    let result = (1/2)*req.body.base*req.body.height;
    res.send({area: result});
})

app.post('/validate_citizen_id',multer().none(),(req,res)=>{
    console.log(JSON.stringify(req.body))
    let response = {
        success: true,
        error_code: "200",
        error_msg: "" 
    };
    if(!req.body.citizen_id) {
        response.success = false,
        response.error_code = "001",
        response.error_msg = "citizen_id require";
        return res.send(response);
    }else{
        let item_citizen_id = req.body.citizen_id;
        if(item_citizen_id.length != 13){
            response.success = false,
            response.error_code = "001",
            response.error_msg = "citizen_id invalid";
            return res.send(response);
        }
        let list_char_citizen_id = item_citizen_id.split("").map(m => parseInt(m));
        if(list_char_citizen_id.some(s => isNaN(s))){
            response.success = false,
            response.error_code = "001",
            response.error_msg = "citizen_id invalid";
            return res.send(response);
        }
        let list_char_citizen_id_multiply = list_char_citizen_id.map((m,i) => {
            return (list_char_citizen_id.length-i) * m 
        })
        let last_char_citizen_id = list_char_citizen_id_multiply.pop();
        let total_sum = list_char_citizen_id_multiply.reduce((a,b) => a+b);
        let mod_total_sum = total_sum % 11;
        let check_digit = 11 - mod_total_sum;
        if(check_digit != last_char_citizen_id){
            response.success = false,
            response.error_code = "001",
            response.error_msg = "citizen_id invalid";
            return res.send(response);
        }
    }
    return res.send(response);
})

app.listen(port,()=>{
    console.log('ResfulApi service');
})

module.exports = app;