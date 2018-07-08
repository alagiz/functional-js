const log = require('./lib/log')
const r = require('ramda')

const band = {
  name: 'da best band',
  members: {
    current: [{
      name: 'wee biscuit mcglee',
      plays: ['harmonica']
    }, {
      name: 'johnny deep',
      plays: ['harmonica', 'guitar', 'hang drum']
    }, {
      name: 'robocop',
      plays: ['instrument of murder', 'beeper']
    }],
    past: [{
      name: 'pastor gains',
      plays: ['bench', 'dumbbels']
    }, {
      name: 'foxy brown',
      plays: ['piano', 'harp']
    }]
  }
}

// we'd very much like to separate behavior and data
// defining behavior:
const makeUpperCase = a => a.toUpperCase()
const omitProperty = (lens, propName) => r.over(lens, r.map(r.omit(propName)))
const applyFunctionToProperty = (lens, lensProp, func) => r.over(lens, r.map(r.over(lensProp, func)))
const concatLenses = (target, src) => data => r.over(target, r.concat(r.view(src, data)))(data)

const name = r.lensProp('name')
const currentMembers = r.lensPath(['members', 'current'])
const pastMembers = r.lensPath(['members', 'past'])
const allMembers = r.lensPath(['members', 'all'])
const upperCaseCurrentMemberNames = applyFunctionToProperty(currentMembers, name, makeUpperCase)
const omitPastMembersPlays = omitProperty(pastMembers, 'plays')
const addAllMembers = r.set(allMembers, [])
const concatPastAndCurrentMembers = r.compose(concatLenses(allMembers, currentMembers), concatLenses(allMembers, pastMembers))
const setAllMembers = r.compose(concatPastAndCurrentMembers, addAllMembers)
const makeBandNameUpperCase = r.over(name, makeUpperCase)

const modifications = [
  upperCaseCurrentMemberNames,
  omitPastMembersPlays,
  makeBandNameUpperCase,
  setAllMembers
]

// ooooh, shit! here comes the data:
log(r.compose(...modifications)(band))
log('*************original data was not modified*************')
