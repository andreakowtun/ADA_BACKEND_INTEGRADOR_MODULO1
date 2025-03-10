const net = require('net');
const readline =require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const options = {
    port:8080,
    host : '127.0.0.1'
}

const client = net.createConnection(options);
//manejo de eventos
client.on('connect', ()=>{
    console.log('satisfactory connection ');
    rl.question('write a command (for example: "GET BOOK" or "ADD BOOK {"id": 1 ,"title": "El Quijote","author_id": 1, "publisher_id": 1, "year": 1605,"genre": "Novela" } ")', (command)=>{
        client.write(command); //enviamos el comando al server
    });    
});

client.on('data', (data)=>{
    console.log('Server says '+data);
    console.log(data.toString()); 

    rl.close();

    client.destroy();
        
})

client.on('close',()=>{
    console.log('Communication has ended');
})