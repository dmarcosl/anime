# Anime

Extremely simple Angular app to keep track of new episodes of the animes I'm currently watching that are on the air.

Libraries used:

- [Angular Components](https://github.com/angular/components)
- [Angular Flex Layout](http://github.com/angular/flex-layout)

The repository consists of 3 branches:

- **master**: skeleton of the app without data
- **data**: master with data
- **gh-pages**: compiled app

## How to build



```shell
ng build --prod --base-href "https://dmarcosl.github.io/anime/"
```

Then push

```shell
npx angular-cli-ghpages --dir=dist/anime
```
