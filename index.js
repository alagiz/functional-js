const log = require('./lib/log')
const r = require('ramda')

const band = {
    name: 'tha best band',
    members: {
        current: [
          { name: 'wet biscuit mcglee', plays: ['harmonica'], age: 63 },
          { name: 'johnny deep', plays: ['harmonica', 'guitar', 'hang drum'], age: 47 },
          { name: 'robocop', plays: ['instrument of murder', 'beeper'], age: 134 }
        ],
        past: [
          { name: 'pastor gains', plays: ['bench', 'dumbbells'] },
          { name: 'foxy brown', plays: ['piano', 'harp'] }
        ]
    }
}

// we'd very much like to separate behaviour and data
// defining behaviour:
const sumUp = (a, b) => a + b
const makeUpperCase = a => a.toUpperCase()
const omitProperty = (lens, propName) => r.over(lens, r.map(r.omit(propName)))
const applyFunctionToProperty = (lens, lensProp, func) => r.over(lens, r.map(r.over(lensProp, func)))
const concatLenses = (target, src) => data => r.over(target, r.concat(r.view(src, data)))(data)
const extractProperty = (lens, propName) => r.over(lens, r.map(r.prop(propName)))
const reducer = (reduceFunc, initValue) => r.reduce(reduceFunc, initValue)

const name = r.lensProp('name')
const currentMembers = r.lensPath(['members', 'current'])
const pastMembers = r.lensPath(['members', 'past'])
const allMembers = r.lensPath(['members', 'all'])
const ageSum = r.lensPath(['currentMembersAgeSum'])
const allNamedRobocop = r.lensPath(['areAllCurrentMembersNamedRobocop'])
const sumAll = reducer(sumUp, 0)
const areAllNamedRobocop = r.reduce((a, b) => r.and(a, b === 'robocop'), true)
const upperCaseCurrentMemberNames = applyFunctionToProperty(currentMembers, name, makeUpperCase)
const omitPastMemberPlays = omitProperty(pastMembers, 'plays')
const concatPastAndCurrentMembers = r.compose(concatLenses(allMembers, currentMembers), concatLenses(allMembers, pastMembers))
const addAllMembers = r.set(allMembers, [])
const addAgeSum = r.set(ageSum, [])
const addAreAllNamedRobocop = r.set(allNamedRobocop, [])
const setAgeSum = concatLenses(ageSum, currentMembers)
const setAreAllNamedRobocop = concatLenses(allNamedRobocop, currentMembers)
const getAllMembers = r.compose(concatPastAndCurrentMembers, addAllMembers)
const makeBandNameUpperCase = r.over(name, makeUpperCase)
const checkIfAllNamedRobocop = r.over(allNamedRobocop, r.compose(areAllNamedRobocop, r.map(r.prop('name'))))
const calculateAgeSum = r.over(ageSum, r.compose(sumAll, r.map(r.prop('age'))))
const setAllMemberNamesProp = r.compose(extractProperty(allMembers, 'name'), getAllMembers)
const setAreAllNamedRobocopProp = r.compose(checkIfAllNamedRobocop, r.compose(setAreAllNamedRobocop, addAreAllNamedRobocop))
const setAgeSumProp = r.compose(calculateAgeSum, r.compose(setAgeSum, addAgeSum))

const modifications = [
  upperCaseCurrentMemberNames,
  omitPastMemberPlays,
  makeBandNameUpperCase,
  setAllMemberNamesProp,
  setAreAllNamedRobocopProp,
  setAgeSumProp
]

// ooooh, shit! here comes the data:
log(r.compose(...modifications)(band))
log('*************original data was not modified*************')
