const fs = require('fs');

//Clase "Product" 
class Product {

    //Constructor
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
}

//Clase "ProductManager"
class ProductManager {

    //Constructor
    constructor(path) {
        this.path = path
        this.products = []
        this.idCount = 0

    }

    //Metodo "validateProduct" recibe un objeto y devuelve true si se reciben todas las propiedades necesarias para
    //crear un objeto de la clase "Producto"
    validateProduct(product) {
        let hasTitle = product.title != null
        let hasDescription = product.description != null
        let hasPrice = product.price != null
        let hasThumbnail = product.thumbnail != null
        let hasCode = product.code != null
        let hasStock = product.stock != null

        return hasTitle && hasDescription && hasPrice && hasThumbnail && hasCode && hasStock
    }

    //Metodo "addProduct" verifica que el producto cuente con todas las propiedades necesarias, verifica que no exista 
    // un producto con el mismo "code" que del que se quiere agregar y si estas condiciones se cumplen lo agrega
    // al array products
    addProduct(newProduct) {


        this.getProducts() //Actualiza el array de productos desde el contenido del archivo en la ruta "path"

        //Si tiene todas la propiedades intenta agregar el producto, sino envia un mensaje a consola
        if (this.validateProduct(newProduct)) {

            //Buscar en "products" un elemento con la propiedad "code" igual a la propiedad "code"
            // del elemento que se recibe
            let product = this.products.find((p) => p.code == newProduct.code)

            //Si se encuentra un producto que tenga el mismo código no se agrega al array y se envía un mensaje al usuario
            if (product != undefined) {
                console.log(`You can't add this product, this code ${newProduct.code} already exists`)

                //Si el no se encuentra un elemento con el mismo código se agrega al array y se avisa por consola
            } else {
                newProduct.id = ++this.idCount
                this.products.push(newProduct)
                this.saveProducts()
                console.log(`This product has been added: `, this.products)
            }

        } else {
            //Mensaje de error en caso de que lo que se recibió como "newProduct" no cumpla con todas las propiedades
            console.log(`Please check the data and try again`)
        }
    }

    //Metodo que devuelve el array "products" desde el archivo en la ruta "path"
    getProducts() {

        const data = fs.readFileSync(this.path, 'utf-8'); // Lectura del archivo en la ruta "path"
        this.products = JSON.parse(data) // Coversion de JSON a obejto
        return this.products
    }

    //Metodo que escribe en el archivo "products.json" el contenido del array "products"
    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products), (err) => {
            if (err) {
                console.error('The write has failed', err); //Mensaje de error en caso de falla de escritura
            } else {
                console.log(`The wite has been completed`); //Mensaje de confirmación de la escritura
            }
        });
    }

    //Metodo que busca en el array "products" un elemento que coincida con el "id" que se recibe por parametro
    getProductById(id) {
        this.getProducts()  //Actualiza el array de productos desde el contenido del archivo en la ruta "path"
        let product = this.products.find((p) => p.id == id) //Busca el objeto que coincida con el id recibido

        //Condicional para saber si se ha encontrado resultado o no
        if (product == undefined) {
            //Mensaje en caso de no haber encontrado coincidencia y se devuelve un "null"
            console.log(`Not found`)
            return null
        } else {
            //En caso de coincidencia se devuelve el objeto encontrado 
            return product
        }
    }

    //Metodo que actualiza un objeto que se deberia encontrar en el archivo de la ruta path
    updateProduct(productUpdated) {

        //Verificamos si el objeto que recibimos tiene todas las condiciones y además debe tener un id
        if (this.validateProduct(productUpdated) && productUpdated.id) {
            //Si cumple con las condiciones y tiene id, buscamos el objeto existente en el array con el mismo id
            let product = this.getProductById(productUpdated.id)
            //Buscamos el indice del objeto encontrado
            let productIndex = this.products.indexOf(product)
            //Verificamos si se encontró el producto en el array
            if (productIndex < 0) {
                //Mensaje en caso que no se haya encontrado coincidencia
                console.log(`Not found`)
            } else {
                //En caso de encontrar actualizamos la posicion del array correspondiente con el objeto recibido
                this.products[productIndex] = productUpdated
                //Guardamos el nuevo contenido en el archivo de la ruta path
                this.saveProducts()
                //Mensaje de confirmación de que se ha actualizado el producto
                console.log(`The product has been updated`, productUpdated)
            }
        } else {
            //Mensaje en caso que no se cumplan las condiciones o el objeto recibido no tenga id
            console.log('The product is not valid')
        }

    }

    deleteProduct(id) {
        //Buscamos el objeto que coincida con el id recibido
        let product = this.getProductById(id)
        //Buscamos el indice del objeto encontrado
        let productIndex = this.products.indexOf(product)
        //Verificamos si se encontró el producto en el array
        if (productIndex < 0) {
            //Mensaje en caso que no se haya encontrado coincidencia
            console.log(`Not found`)
        } else {
            //En caso de encontrar eliminamos la posicion del array correspondiente con el id recibido
            product = this.products.splice(productIndex)
            //Guardamos el nuevo contenido en el archivo de la ruta path
            this.saveProducts()
            //Mensaje de confirmación de que se ha eliminado el producto
            console.log(`The product has been deleted`, product)
        }
    }

}


//Test del codigo
//Creacion de un obejto de la clase "ProductManager"
let productManager1 = new ProductManager('products.json')

//Creacion de un objeto de la clase "Product"
let product1 = new Product("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)


//Se agrega el objeto creado anteriormente 
productManager1.addProduct(product1)

//Se vuelve a agregar el producto para verificar el error
productManager1.addProduct(product1)

//Se obtienen todos los productos
console.log(productManager1.getProducts())

//Se busca el elemento con id 1
console.log(productManager1.getProductById(1))

//Se busca un objeto con id inexistente
console.log(productManager1.getProductById(2))

//Se actualiza el campo title del producto agregado anteriromente y se le agrega el id 1 para poder buscarlo
product1.id = 1
product1.title = "producto de prueba actualizado"
productManager1.updateProduct(product1)

//Se obtienen todos los productos para verificar el cambio
console.log(productManager1.getProducts())

//Se elimina el producto con el id 1
productManager1.deleteProduct(1)

//Se obtienen todos los productos para verificar que eol objeto se haya borrado
console.log(productManager1.getProducts())