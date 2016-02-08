[![codecov.io](https://codecov.io/github/des-des/github-getter/coverage.svg?branch=master)](https://codecov.io/github/des-des/github-getter?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/des-des/github-getter/badges/score.svg)](https://www.bithound.io/github/des-des/github-getter) [![bitHound Dependencies](https://www.bithound.io/github/des-des/github-getter/badges/dependencies.svg)](https://www.bithound.io/github/des-des/github-getter/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/des-des/github-getter/badges/devDependencies.svg)](https://www.bithound.io/github/des-des/github-getter/master/dependencies/npm)

**webhooks coming soon (so you gh hosted content can tell you site when to update!)**

# github-getter

## What?

A quick and easy way to get files from github

## Why?

Hosting content on github is awesome! github-getter makes accessing those files easy (so you don't waste your precious time reading api docs!)

## How?

Break down interaction with github into users, repos and files.

### SETUP

 * `import { GHFile, GHRepo, GHUser } from 'github-getter'`

 * `GHFile` Input a filepath and repo name to get and `GHFile` object OR
 * `GHRepo`: Input a repo name to get a `GHFile` object for everything in the repo OR
 * `GHUser`: Input a user/org name and get a `GHRepo` object for each repository belonging to that user/org
 
### USAGE

 * call your `GHFile` object(s) with the following paramiter
 
 ```javascript
 {
  getData: fileDataString => /*Your code here!*/
 }
 ```
 see src/index.es6 for an example!
 
 
