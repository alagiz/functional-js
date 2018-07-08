const log = require('./lib/log')
const r = require('ramda')

const band = {
  name: 'da best band',
  members: {
    current: [{
      name: 'wee biscuit mcgee',
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

const makeUpper = a => a.toUpperCase();
const name = r.lensProp('name');
const currentMembers = r.lensPath(['members', 'current'])
const previousMembers = r.lensPath(['members', 'past'])
const upperCurrentMemberNames = r.over(currentMembers, r.map(r.over(name, makeUpper)))
const omitPreviousMembersPlays = r.over(previousMembers, r.map(r.omit('plays')))

const mods = [
	upperCurrentMemberNames,
	omitPreviousMembersPlays
]

log('--------------------------------------------------------')
log(r.compose(...mods)(band))
