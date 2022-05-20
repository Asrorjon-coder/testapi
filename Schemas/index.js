const graphql = require("graphql");
const {GraphQLSchema, GraphQLList} = require("graphql");
const {
    GraphQLObjectType, GraphQLString,
} = graphql;
const Users = require('../models/user');
const Regions = require('../models/regions');

const UserType = new GraphQLObjectType({
    name: 'User', fields: () => ({
        firstname: {type: GraphQLString},
        lastname: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        region: {type: GraphQLString},
    }),
});

const RegionType = new GraphQLObjectType({
    name: 'Region', fields: () => ({
        name: {
            type: GraphQLString,
            resolve(parent, args) {
                return parent.region
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return Users.find({region: parent.region})
            },
        },
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query', fields: {
        user: {
            type: UserType,
            args: {firstname: {type: GraphQLString}},
            resolve(parent, args) {
                return Users.findOne({firstname: args.firstname})
            },
        },
        region: {
            type: RegionType,
            args: {region: {type: GraphQLString}},
            resolve(parent, args) {
                return Regions.findOne({region: args.region})
            },
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return Users.find({});
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        adduser: {
            type: UserType,
            args: {
                firstname: {type: GraphQLString},
                lastname: {type: GraphQLString},
                email: {type: GraphQLString},
                phone: {type: GraphQLString},
                region: {type: GraphQLString},
            },
            async resolve(parents, args) {
                const user = new Users({
                    firstname: args.firstname,
                    lastname: args.lastname,
                    email: args.email,
                    phone: args.phone,
                    region: args.region,
                });
                return await user.save();
            }
        },
    },
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})