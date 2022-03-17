const axios = require('axios');
const http = require('http');
const fs = require('fs');

const pokemonName = [];
const pokemones =[];

async function getName() {
    const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=150/");
    return data.results;
}

async function pokeData(pokeName){
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}/`);
    return data;
}

getName().then((res) => {
    res.forEach((p) => {        
        pokemonName.push(pokeData(p.name));
    })

    Promise.all(pokemonName)
    .then((res) => {
        res.forEach((p) => {
            pkmData = {
                img: p.sprites.front_default,
                nombre: p.name
            }
            pokemones.push(pkmData);
        })
    })
})

http.createServer((req, res) => {
    if(req.url == '/'){
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile('index.html', 'UTF8', (err, html) => {
            res.end(html)
        });
    }
    if(req.url == '/pokemones'){
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.writeFile('pokemones.json', JSON.stringify(pokemones),(err, pokemon) =>{
            console.log('Archivo creado con exito');
        });
        res.write(JSON.stringify(pokemones));  
        res.end();
    } 
}).listen(3000, () => console.log('Servidor levantado'));