"use strict";
const http = require('http');
const  url = require('url');
const fs = require('fs');
const  querystring = require('querystring');
let todos = [];

const http_server = http.createServer(function(req, res) {
    const method = req.method;
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);

    if (req.url.indexOf('/add') === 0){
        res.setHeader('Content-Type', 'application/json');
        if(method === 'POST') {
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);
                jsonObj.id = Math.random()+'';
                todos.push(jsonObj);
                return res.end(JSON.stringify(todos));
            });
        }
    }else if (req.url.indexOf('/search') === 0) {
        res.setHeader('Content-Type', 'application/json');
        if(method === 'GET') {
            let ourTodos = todos;
            if(parsedQuery.searchtext) {
                ourTodos = ourTodos.filter(function(obj) {
                    return obj.message.indexOf(parsedQuery.searchtext) >= 0;
                });
            }
            return res.end(JSON.stringify({items : ourTodos}));
        }
    }
    else if(req.url.indexOf('/delete/')=== 0){
        let id = req.url.substr(8);
        for(let i = 0; i < todos.length; i++) {
            if(id === todos[i].id) {
                todos.splice(i, 1);
                res.statusCode = 200;
                return res.end('Congrats, you just removed!');
            }
        }
        res.statusCode = 404;
        return res.end('404, Data was not found');
    }
    else if(method === 'PUT') {
        if (req.url.indexOf('/update/') === 0) {
            let up_id = req.url.substr(8);
            for (let i = 0; i < todos.length; i++) {
                if (todos[i].id === up_id) {
                    todos[i].checked = !(todos[i].checked);
                    res.statusCode = 200;
                    return res.end('Congrats, you just updated!');
                }
            }
            res.statusCode = 404;
            return res.end('404, Data was not found');
        }
    }

    else {
        fs.readFile('public' + req.url, function(err, data){
            if(err){
                res.writeHead(404);
                return res.end('Adios! 404 not found');
            }
            else {
                res.statusCode=200;
                res.end(data);


            }
        });
    }
});
http_server.listen(3001, console.log('Server is running!'));






