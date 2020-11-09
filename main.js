const { notEqual } = require('assert')
const { json } = require('express')
const express = require('express')
const { allowedNodeEnvironmentFlags } = require('process')
const { notepad } = require('./public/dbconnect')
const app =express()

const http = require('http').createServer(app)
const db = require('./public/dbconnect')
const randomAlphanumeric = require('./generateurl')
const io = require('socket.io')(http)

const PORT = process.env.PORT || 3000 


app.use(express.static(__dirname + '/public'))

var checkpsw;
var notallowed = ["localhost","Localhost"];


app.get('/',(req,res) => {
    var id= randomAlphanumeric(); 
    
    notepad.find({url: "/"+ id}, function(err, user) 
    {   
        console.log(user)
    if (err)
    {
        console.log("here in error")
            res.send(err);
    }
    else{
            if(user[0] != null){
                console.log("matched")
                id=randomAlphanumeric();
            }
    }
    })
    var link = req.path +id;
    console.log(link);

   var datalink = new notepad({ url : link , body:"" ,psw:"NULL" , shareurl: "/s"+link });
    
   datalink.save((err, notepad) => {

     if (err) return console.error(err);

     else  res.redirect(link)

     console.log(notepad);

   });
    console.log("finished processing")
})

app.get(('/*' ) , (req,res) => {

    console.log("already exiting page")
    console.log(req.path)
    var readonly = req.path.split("/") ;
    console.log(readonly.length)
    if(req.path == "/favicon.ico"){
        return ;
    }
    else if( readonly.length >  2){
        if( readonly[1] =="s"){
                notepad.find({shareurl: req.path}, function(err, user) 
                {  
                    if (err)
                {
                    console.log("here in error")
                        res.send(err);
                }
                else{
                    if(user[0] == null){
                    res.send("Error ... !  Note Not Found..")
                    }
                    else{
                        console.log("s");
                        res.sendFile(__dirname + '/index.html')
                        io.on('connection',(socket)=>{
                            socket.emit("shared_"+ req.path , user[0].body); 
                        })
                    
                    }
                }
                })
            }
        else{
            return err;
        }
    }
    else {
      
        var checkvalid = valid(readonly[1]);
        console.log(checkvalid)
        if(readonly[1].length <3  || checkvalid == false ){
           return err;
        }
        else{
                notepad.find({url: req.path}, function(err, user) 
                {   
                    console.log(user)
                if (err)
                {
                    console.log("here in error")
                        res.send(err);
                }
                else{
                        if(user[0] == null){
                            
                            
                            var datalink = new notepad({ url : req.path , body:"" ,psw:"NULL" ,shareurl: "/s"+req.path});
                                
                            datalink.save((err, notepad) => {
                            
                                if (err) return console.error(err);
                            
                                else  res.redirect(req.path)
                            
                                console.log(notepad);
                            // res.send("This url is not found");
                            
                            });
                        }
                    
                        else  if(user[0].psw == "NULL"){

                            console.log("callled without socket")
                            res.sendFile(__dirname + '/index.html')
                        }
                    
                        else {    
                            checkpsw = user[0].psw ; 
                            console.log("callled with socket")
                            res.sendFile(__dirname + '/index.html')
                            io.on('connection',(socket)=>{
                                socket.emit("login_"+ req.path)
                            })
                        }
                }
                });

        }
        io.on('connection',(socket) =>{

    console.log("connected")
    console.log(req.path)

    notepad.find({url: req.path}, function(err, user) 
    {   
        console.log(user)
       if (err)
       {
            res.send(err);
       }
       else if(user[0] == null){
        return ;
        }   
       else{
            socket.emit('onload_'+req.path ,user[0].body);
       }
    });

    socket.on('login_psw_'+req.path, (login_psw) => {
        console.log(checkpsw)
        if(checkpsw === login_psw){   
            console.log("matched")
            socket.emit("success");
        }
        else{
            console.log("Not matched");
            socket.emit("failed");
        }
    })

    socket.on('data_' + req.path, (data) => {
             
        console.log(req.path)
           
            notepad.findOneAndUpdate({url: req.path}, {body: data}, {new: true}, (err, updatedDoc) => {

              if(err) return console.log(err);
              else socket.broadcast.emit('data_'+ req.path , updatedDoc.body )
                console.log(updatedDoc);
            })
        })
    
    socket.on('update_url_'+ req.path, (new_url) =>{
        notepad.find({url: new_url},(err, user)=>{
            console.log(user)
            if(user[0] == null){
                console.log("new url")
                notepad.findOneAndUpdate({url: req.path}, { shareurl: "/s"+ new_url } , {new: true}, (err, updatedurl) =>{
                    if(err) return console.log(err);
                    else console.log(updatedurl);
                })
                notepad.findOneAndUpdate({url: req.path}, { url: new_url } , {new: true}, (err, updatedurl) =>{
                    if(err) return console.log(err);
                    else console.log(updatedurl);
                })
                socket.emit("save_success");
            }
            else{
                socket.emit("Not_saved");
                console.log("already saved url");
                
            }
        })
    })

    socket.on('psw_' + req.path, (psw) => {

            
            notepad.findOneAndUpdate({url: req.path}, {psw: psw}, {new: true}, (err, updatedpsw) => {

            if(err) return console.log(err);
            else console.log(updatedpsw);
            })
        
        })
    
    })

    }
}) 

app.use((err, req, res, next) => {
    if (!err) return next();
    return res.sendFile(__dirname + "/error.html");
})

http.listen(PORT , () => {
    console.log(`listening on port ${PORT} `)
})
