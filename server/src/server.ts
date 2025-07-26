import express from 'express';

const app = express();

const users = [
    'Diego',   //0
    'Leticia', //1
    'Eron',    //2
    'Daniel'   //3
];

app.get('/users', (request, response) => {
    const search = String(request.query.search);

    const filteredUsers = users.filter(user => user.includes(search));

return response.json(filteredUsers);
});

app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);

    const user = users[id];

    return response.json(user);
});

app.post('/users', (request, response) => {
    const user = {
        name: 'Diego',
        email: 'diego@rocketseat.com.br'
    };

    return response.json(user);
});

app.listen(3334);