const fs = require('fs');


var data = fs.readFileSync("users.json")

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const { finished } = require('stream');

const users =  JSON.parse(data);
const UsersType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    points: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    users: {
      type: new GraphQLList(UsersType),
      desctiption: "all the chaters",
      resolve: () => users,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addUser: {
      type: UsersType,
      description: 'Add a user',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        points: { type: GraphQLNonNull(GraphQLInt) },

      },
      resolve: (parent, args) => {
        const user = { id: users.length + 1, name: args.name, points: args.points }
        users.push(user)
        var data = JSON.stringify(users)
        fs.writeFile("users.json" , data , finished)
        return user
      }
    },
   
  })
})


const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutationType
});

const app = express();
const port = 5000;

app.use(
  "/gql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
