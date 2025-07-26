# REQUISICOES

 - Rota: Endereco completo da requisicao 
     - Ex.: http://localhost:3334/users

 - Recurso: Qual entidade estamos acessando do sistema
     - Ex.: /users

## TIPOS DE REQUISICOES

 - GET: Buscar uma ou mais informacoes do back-end
     - GET http://localhost:3334/users/5 = Buscar dados do usuario com ID 5
     - GET http://localhost:3334/users = Listar usuario
 - POST: Criar uma nova informacao no back-end
     - Ex.: POST http://localhost:3334/users = Criar um usuario
 - PUT: Atualizar uma informacao existente no back-end
 - DELETE: Remover uma informacao do back-end

 ## TIPOS DE PARAMETROS

 - Request Param: Parametros que vem na propria rota que identificam um recurso.

  - Query Param: Parametros que vem na propria rota geralmente opcionais para filtros, paginacao
     - Ex.: name=search value=o
     http://localhost:3334/users?search=o

 - Request Body: Parametros para criacao/atualizacao de informacoes