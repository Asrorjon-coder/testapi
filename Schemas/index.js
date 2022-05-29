const graphql = require("graphql");
const {GraphQLSchema, GraphQLList, GraphQLInputObjectType} = require("graphql");
const {
    GraphQLObjectType, GraphQLString, GraphQLBoolean
} = graphql;
const jwt = require('jsonwebtoken');
const bcrypt = require('../bcrypt/bcrypt');
const {login} = require('../bcrypt/login');
require('dotenv').config({path: './secret.env'});
const Users = require('../models/user');
const Regions = require('../models/regions');
const Admins = require('../models/admin');
const Boss = require('../models/boss');



const UserType = new GraphQLObjectType({
    name: 'User', fields: () => ({
        firstname: {type: GraphQLString},
        lastname: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        region: {type: GraphQLString},
        role: {type: GraphQLString},
    }),
});

const AdminType = new GraphQLObjectType({
    name: 'Admin', fields: () => ({
        firstname: {type: GraphQLString},
        lastname: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
    }),
});

const BossType = new GraphQLObjectType({
    name: 'Boss', fields: () => ({
        firstname: {type: GraphQLString},
        lastname: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
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

const ResultType = new GraphQLObjectType({
    name: 'Result', fields: () => ({
        result: {type: GraphQLString},
        status: {type: GraphQLString},
        token: {type: GraphQLString},
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
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return Users.find({});
            },
        },
        region: {
            type: RegionType,
            args: {region: {type: GraphQLString}},
            resolve(parents, args) {
                return Regions.findOne({region: args.region})
            },
        },
        login: {
            type: ResultType,
            args: {
                email: {type: GraphQLString},
                password: {type: GraphQLString},
            },
            async resolve(parents, args) {
                const person = await Users.findOne({email: args.email, password: args.password});
                return await login(person, args);
            },
        },
        adminlogin: {
            type: ResultType,
            args: {
                email: {type: GraphQLString},
                password: {type: GraphQLString},
            },
            async resolve(parents, args) {
                const person = await Admins.findOne({email: args.email});
                return await login(person, args);
            },
        },
        bosslogin: {
            type: ResultType,
            args: {
                email: {type: GraphQLString},
                password: {type: GraphQLString},
            },
            async resolve(parents, args) {
                const person = await Boss.findOne({email: args.email, password: args.password});
                return await login(person, args);
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addboss: {
            type: BossType,
            args: {
                firstname: {type: GraphQLString},
                lastname: {type: GraphQLString},
                email: {type: GraphQLString},
                password: {type: GraphQLString},
            },
            resolve(parents, args) {
                const boss = new Admins({
                    firstname: args.firstname,
                    lastname: args.lastname,
                    email: args.email,
                    password: bcrypt.hasher(args.password),
                });
                return boss.save();
            },
        },
        addadmin: {
            type: AdminType,
            args: {
                firstname: {type: GraphQLString},
                lastname: {type: GraphQLString},
                email: {type: GraphQLString},
                password: {type: GraphQLString},
            },
            async resolve(parents, args) {
                const admin = new Admins({
                    firstname: args.firstname,
                    lastname: args.lastname,
                    email: args.email,
                    password: await bcrypt.hasher(args.password),
                });
                return admin.save();
            },
        },
        adduser: {
            type: UserType,
            args: {
                firstname: {type: GraphQLString},
                lastname: {type: GraphQLString},
                email: {type: GraphQLString},
                phone: {type: GraphQLString},
                region: {type: GraphQLString},
            },
            resolve(parents, args) {
                const user = new Users({
                    firstname: args.firstname,
                    lastname: args.lastname,
                    email: args.email,
                    phone: args.phone,
                    region: args.region,
                });
                return user.save();
            }
        },
    },
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})