import express from 'express';

const app = express();

app.get('/users', (resquest, response) => {
    console.log('Listagem de usuarios');

    response.send('Leticia');
});

app.listen(3333);