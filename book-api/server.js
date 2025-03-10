//En el archivo server.js, implementa el servidor TCP utilizando el módulo NET.
//Configura el servidor para escuchar conexiones en el puerto 8080 y para recibir comandos de los clientes.
//Asegúrate de manejar correctamente múltiples conexiones y de devolver respuestas claras a los clientes.
//Implementa el manejo de errores para asegurar que el servidor responda de manera adecuada a diferentes situaciones.

const net = require ('net');

//Aca se importa el controlador

//Importamos la funcion v4 del paquete uuid 
const {v4:uuid4} = require ('uuid');

//validamos si una cadena es o no JSON
function isjson(str){
    return str.startsWith('{') && str.endsWith('}');
}

const server = net.createServer()

/*Manejo el evento connection que se emite cuando el cliente se conecta al server. 
Dentro del evento connection tenemos los tres
eventos basicos de un servidor*/

server.on('connection', (socket)=>{

    socket.on('data',(data)=>{
        const command = data.toString().trim();
        if (command === 'GET BOOKS'){
            const response = booksController.getbooks();
            socket.write(response);
        }else if(command.startsWith('ADD BOOK')){
            //tomamos los datos del nuevo libro
            const bookDataString = command.replace('ADD BOOK', '');
            //verificamos si los datos tienen un formato parecido a JSON
            if(isjson(bookDataString)){
                const bookData = JSON.parse(bookDataString);

                //verificamos que los datos sean un objeto
                if (bookData && typeof bookData === 'object'){
                    //creamos un id para el nuevo libro 
                    const newBook={id: uuid4, ...bookData};
                    const response = booksController.addBook(newBook);
                    socket.write(response);
                }else{
                    socket.write('Invalid book data');
                }
            }else{
                socket.write('Error: Invalid JSON format');
            }
        }else{
            socket.write('unrecognized command')
        }
        
    })

    socket.on('end',()=>{
        console.log('Communication has ended');
    })
})

//puerto a escuchar
server.listen(8080, ()=>{
    console.log('server listening on port ', server.address().port);
})