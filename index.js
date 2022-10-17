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
require('events').EventEmitter.prototype._maxListeners = 0;



async function init(){

    var page = 1;
    var next = true;
    while (next == true) {
        console.log("dentro del while");
        const $ = await request({
            uri: `https://www.farmaciasahumada.cl/medicamentos.html?p=${page}`,
            transform: body => cheerio.load(body),
            jar: true
        
        });
        writestream.write('Producto|Descripcion|Precio\n');
        const next2 = $('li.item.pages-item-next');
        if (next2.text() == false){
            next = false;
        }
        const titulo = $('div.product-item-info').each((i,el)=> {
            const nombre = $(el).find('p.product-brand-name.truncate').text().trim();
            const descripcion = $(el).find('a.product-item-link').text().trim();
            const price = $(el).find('span.price').text().trim();
            console.log(nombre);
            

            try {
                const medicamentoDB = new Medicamento({
                    "nombre": nombre,
                    "descripcion": descripcion,
                    "precio": price,
                    "farmacia": "Ahumada"

                    });
                
                //medicamentoDB.save();
        
                
            } catch (error) {
                console.log('error', error)
            }

            writestream.write(`${nombre}|${descripcion}|${price}|Ahumada\n`);
            
        });

        page = page +1;
        console.log(page);
        console.log("primera");
    }

    
    
};
async function main(){

    var page = 1;
    var next = true;
    while (next){
        const $ = await request({
            uri: `https://www.drsimi.cl/medicamento.html?p=${page}`,
            transform: body => cheerio.load(body),
            jar: true
        
        });
        writestream.write('Producto, Precio\n');

        const next2 = $('li.item.pages-item-next');
        if (next2.text() == false){
            next = false;
        }
        const titulo = $('div.product-item-info.type1').each((i,el)=> {
            const nombre = $(el).find('a.product-item-link').text().trim();
            //const descripcion = $(el).find('a.product-item-link').text().trim();
            const price = $(el).find('span.price').text().trim();

            try {
                const medicamentoDB = new Medicamento({
                    "nombre": nombre,
                    "precio": price,
                    "farmacia": "Drsimi"
                    });
                
                medicamentoDB.save();
        
                
            } catch (error) {
                console.log('error', error)
            }
            
            //db.sales.insert({'nombre': `${nombre}`, 'Precio':`${price}`});

            writestream.write(`${nombre},${price}|DRsimi\n`)
        });
    page = page +1;
    console.log(page);
    console.log("segunda");
    }
    
    
};

async function cruz(){

    var page = 70;
    var next = true;
    while (next){

        const $ = await request({
            uri: `https://www.ecofarmacias.cl/categoria-producto/medicamentos/page/${page}/`,
            transform: body => cheerio.load(body),
            jar: true
        
        });
        writestream.write('Producto, Precio\n');

        const next2 = $('a.next.page-numbers');
        if (next2.text() == false){
            next = false;
        }
        
        const titulo = $('a.woocommerce-LoopProduct-link.woocommerce-loop-product__link').each((i,el)=> {
            
            const nombre = $(el).find('h2').html();
            console.log(nombre);
            //const descripcion = $(el).find('a.product-item-link').text().trim();
            const price = $(el).find('span.woocommerce-Price-amount.amount').text().trim();
            
            //db.sales.insert({'nombre': `${nombre}`, 'Precio':`${price}`});

            try {
                const medicamentoDB = new Medicamento({
                    "nombre": nombre,
                    "precio": price,
                    "farmacia": "Ecofarmacias"
                    });
                
                medicamentoDB.save();
        
                
            } catch (error) {
                console.log('error', error)
            }
            
            //db.sales.insert({'nombre': `${nombre}`, 'Precio':`${price}`});
            writestream.write(`${nombre},${price}, "Ecofarmacias\n`)
        });
    page = page + 1
    console.log(page);
    console.log("tercera");
    }
};

init();
main();
cruz();