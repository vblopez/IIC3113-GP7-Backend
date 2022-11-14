const cheerio = require("cheerio");
const { find } = require("domutils");
const request = require("request-promise");
const { brotliDecompressSync } = require("zlib");
const fs = require("fs-extra");
var iconv = require("iconv-lite");

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
            const link = $(el).find('a.product.photo.product-item-photo').attr('href');
            const imagen = $(el).find('span.product-image-wrapper').find("img").attr('src');
            console.log(imagen)

            try {
                const medicamentoDB = new Medicamento({
                    "nombre": nombre,
                    "descripcion": descripcion,
                    "precio": price,
                    "farmacia": "Ahumada",
                    "link": link,
                    "imagen": imagen
                    });
                
                medicamentoDB.save();
        
                
            } catch (error) {
                console.log('error', error)
            }

            writestream.write(`${nombre}|${descripcion}|${price}|Ahumada\n|${link} `);
            
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
            encoding: null,
            uri: 'https://www.drsimi.cl/medicamento',
            transform: body => cheerio.load(body),
            jar: true,
            
        });

        writestream.write('Producto, Precio\n');

        const next2 = $('div.vtex-button__label');
        //console.log(next2.text())
        if (next2 == false){ //arreglar
            next = false;
            console.log("Falsete")
        };
        const hola = $('div.vtex-flex-layout-0-x-flexRow')
        console.log(hola.html())
        const titulo = $('div.vtex-product-summary-2-x-nameContainer flex items-start justify-center pv6').each((i,el)=> {
            console.log("dentro")
            const nombre = $(el).find('span').text().trim();
            const descripcion = $(el).find('div.display: contents;').text().trim();
            console.log(descripcion)
            const price = $(el).find('span.price').text().trim();

            try {
                const medicamentoDB = new Medicamento({
                    "nombre": nombre,
                    "precio": price,
                    "farmacia": "Drsimi",
                    //"link": //Rellenar,
                    
                    });
                
                medicamentoDB.save();
        
                
            } catch (error) {
                console.log('error', error)
            }
            
            //db.sales.insert({'nombre': `${nombre}`, 'Precio':`${price}`, 'Farmacia':`DrSimi`});

            writestream.write(`${nombre},${price}|DRsimi\n`)
        });
    page = page +1;
    //console.log(page);
    //console.log("segunda");
    }
    
    
};

async function cruz(){

    var page = 69;
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
            //const descripcion = $(el).find('a.product-item-link').text().trim();
            const price = $(el).find('span.woocommerce-Price-amount.amount').text().trim();
            const imagen = $(el).find('span.et_shop_image').find("img").attr('data-src');
            const link =  $(el).attr('href');

            //db.sales.insert({'nombre': `${nombre}`, 'Precio':`${price}`});

            try {
                const medicamentoDB = new Medicamento({
                    "nombre": nombre,
                    "precio": price,
                    "farmacia": "Ecofarmacias",
                    "link": link,
                    "imagen": imagen
                    });
                
                medicamentoDB.save();
        
                
            } catch (error) {
                console.log('error', error)
            }
            
            //db.sales.insert({'nombre': `${nombre}`, 'Precio':`${price}`});
            writestream.write(`${nombre},${price}, "Ecofarmacias\n`)
        });
    page = page + 1

    }
};

//init();
main();
//cruz();


