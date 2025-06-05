import { MongoClient, ObjectId } from "mongodb";


function conectar(){
   return MongoClient.connect(process.env.MONGO_URL);
}


export function leerColores(){
    return new Promise((ok,ko) => {

        let conexion = null;

        conectar() 
        .then(conexionPromesa => {
            conexion = conexionPromesa;

            let coleccion = conexion.db("colores").collection("colores");

           return coleccion.find({}).toArray() //return para que ejecute los 2 then() al mismo tiempo y de error.
                })
        .then( colores => {
            conexion.close();    
            ok(colores.map( ({_id,r,g,b}) => {
                let id = _id;

                return {id,r,g,b};
            }));
        })    
        .catch( error => {
            if(conexion){
                conexion.close()
            }
            ko({ error : "error en la base de datos"})
        });
    });
}




export function crearColor(color){
    return new Promise((ok,ko) => {
        let conexion = null;
        conectar()
        .then(conexionPromesa => {
            conexion = conexionPromesa
            let coleccion = conexion.db("colores").collection("colores");
            return coleccion.insertOne(color)  
        }) 
        .then(({insertedId}) => {
            conexion.close();
            ok(insertedId);
        })  
        .catch(error => {
            if(conexion){
                conexion.close()
            }
            ko({ error : "error en la base de datos"})
        });
    })
}





 
export function borrarColor(id){
    return new Promise((ok,ko) => {
        let conexion = null;
        conectar()
        .then( conexionPromesa => {
            conexion = conexionPromesa
           const coleccion = conexion.db("colores").collection("colores");

           return coleccion.deleteOne({ _id : new ObjectId(id) })
        })
        .then( ({deletedCount}) => {
            conexion.close()
            ok(deletedCount)
        })
        .catch(error => {
            if(conexion) {
                conexion.close()
            }
            ko({ error : "error en la base de datos"})
        });     
    })
}

