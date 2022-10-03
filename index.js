const cheerio = require("cheerio");
const { find } = require("domutils");
const request = require("request-promise");
const { brotliDecompressSync } = require("zlib");
const fs = require("fs-extra");

const Medicamento = require("./models/medicamento")

// Conexion a base de datos
const mongoose = require("mongoose");

const user = 'nkarlezib';
const password = 'GPTI1234';
const url = `mongodb+srv://nkarlezib:${password}@cluster0.lbq3xfr.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url,
     {useNewUrlParser: true, useUnifiedTopology: true })
     .then(()=> console.log('Base de datos conectada'))
     .catch(e => console.log(e))


const writestream = fs.createWriteStream("productos.csv")
//require('events').EventEmitter.prototype._maxListeners = 0;



async function init(){

    const $ = await request({
        uri: 'https://www.farmaciasahumada.cl/medicamentos.html/',
        transform: body => cheerio.load(body),
        jar: true
    
    });
    writestream.write('Producto|Descripcion|Precio\n');
    const titulo = $('div.product-item-info').each((i,el)=> {
        const nombre = $(el).find('p.product-brand-name.truncate').text().trim();
        const descripcion = $(el).find('a.product-item-link').text().trim();
        const price = $(el).find('span.price').text().trim();
        writestream.write(`${nombre}|${descripcion}|${price}\n`)
    });

    
    
};
async function main(){

    const $ = await request({
        uri: 'https://www.drsimi.cl/medicamento.html',
        transform: body => cheerio.load(body),
        jar: true
    
    });
    writestream.write('Producto, Precio\n');
    const titulo = $('div.product-item-info.type1').each((i,el)=> {
        const nombre = $(el).find('a.product-item-link').text().trim();
        //const descripcion = $(el).find('a.product-item-link').text().trim();
        const price = $(el).find('span.price').text().trim();

        try {
            const medicamentoDB = new Medicamento({
                "nombre": nombre,
                "precio": price
                });
            
            medicamentoDB.save();
    
            
        } catch (error) {
            console.log('error', error)
        }
        
        //db.sales.insert({'nombre': `${nombre}`, 'Precio':`${price}`});

        //writestream.write(`${nombre},${price}\n`)
    });

    
    
};
//init();
main();