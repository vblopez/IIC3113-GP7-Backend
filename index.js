const cheerio = require("cheerio");
const { find } = require("domutils");
const request = require("request-promise");
const { brotliDecompressSync } = require("zlib");
const fs = require("fs-extra");

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
        const nombre = $(el).find('p.product-brand-name.truncate').text();
        const descripcion = $(el).find('a.product-item-link').text();
        const price = $(el).find('span.price').text();
        writestream.write(`${nombre}|${descripcion}|${price}\n`)
    });

    
    
};
async function main(){

    const $ = await request({
        uri: 'https://www.drsimi.cl/medicamento.html',
        transform: body => cheerio.load(body),
        jar: true
    
    });
    writestream.write('Producto|Descripcion|Precio\n');
    const titulo = $('div.product-item-info.type1').each((i,el)=> {
        const nombre = $(el).find('a.product-item-link').text();
        const descripcion = $(el).find('a.product-item-link').text();
        const price = $(el).find('span.price').text();
        //writestream.write(`${nombre}|${descripcion}|${price}\n`)
    });

    
    
};
//init();
main();