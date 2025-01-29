# Clean Architecture
Projeto Frontend utilizando camadas para separação de responsabilidades visando um crescimento ordenado da aplicação.
Baseado na abordagen do livro Clean Architecture, visando criar um arquitetura para projetos frontend.

## Diagrama

Acesse o diagrama [Diagrama](./DIAGRAM.md)

## Tecnologias

Projeto utiliza [Vue.js](https://vuejs.org/) + [Typescript](https://www.typescriptlang.org/), projeto iniciado utilizando [Vite](https://vite.dev/)

## Configuração, Instalação e Servindo o projeto localmente

### Pré requisitos
Você precisa ter o [NodeJs](https://nodejs.org) instalado em sua máquina, na versão minima `v20`. Utilize seu gerenciador de pacotes preferido. 
Eu utilizei o **npm**, e os comandos serão baseados no mesmo.

### Instalando o projeto

#### Clone o projeto
No terminal rode os comandos

```bash 
git clone https://github.com/94AOJ/clean-acrhitecture.git
```
E acesse o diretório do projeto

```bash
cd lean-acrhitecture
```

#### Instale as dependencias
No terminal rode o comando

```bash
npm install
```

#### Servindo o projeto localmente
No terminal rode o comando

```bash
npm run dev
```





Trabalho de Conclusão de Módulo

Vocês deverão desenvolver um projeto frontend a partir do repositório Clean Architecture 
(https://github.com/94AOJ/clean-acrhitecture), 
utilizando os padrões e conceitos de arquitetura apresentados no projeto. 
(https://github.com/ubirajarapelli/burgerlivery-api), A aplicação a ser criada terá como objetivo integrar-se à API Burgerlivery 

utilizando o endpoint publicado em burgerlivery-api.vercel.app. 

O projeto deve permitir que um usuário realize todo o fluxo de navegação e pedidos 
em uma hamburgueria virtual. 
Para isso, a aplicação deverá implementar funcionalidades como login do usuário, 
navegação pelas categorias de produtos disponíveis, adição de itens à sacola de compras, 
exibição de um resumo do pedido, 
seleção de uma forma de pagamento e finalização do pedido com integração à API.

Os endpoints a serem utilizados na API incluem: 
 • /categories
 • /hamburgers
 • /appetizers
 • /desserts
 • /beverages
 • /payment/options
 • /order/create-order 
 • /user/login

Cabe ao grupo escolher a biblioteca ou framework para a interface e estilização da aplicação, 
bem como a quantidade de páginas que o projeto terá. 
A avaliação será baseada essencialmente que a aplicação siga as camadas de arquitetura 
definidas no repositório Clean Architecture fornecido e 
na correta implementação das integrações com os endpoints fornecidos, 
no funcionamento geral da aplicação e na experiência de navegação oferecida ao usuário final.

A entrega do trabalho deverá incluir um repositório público no GitHub contendo todo o
 código-fonte do projeto na branch main. 
Esse repositório deve incluir um arquivo README.md com os nomes e RMs dos
 integrantes do grupo, instruções claras sobre como rodar o projeto localmente. 

Interessante mas não obrigatório a publicação do projeto em um ambiente, como a Vercel.

Ressalta-se que este trabalho deve ser desenvolvido em grupo, e recomenda-se a
 organização das tarefas para garantir que todos os integrantes contribuam e
 que os requisitos sejam cumpridos dentro do prazo. 