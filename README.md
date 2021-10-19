# Statemine asset creator

Web application for easier creation of assets on Statemine.

## Development
This monorepo project uses [Rush](https://rushjs.io/) for package management, including building, testing and linting. 

To start developing, execute following commands
```
pnpm install
rush update --purge
rush build
```
### Building project

Any time you pull changes to your branch or modify package.json, you need to run 
```
rush update
rush build
```

Apart from that, use 
```
rush build
```

### Testing
To run tests type 
```
rush test
```

### Linting
To run linter type 
```
rush lint
```








