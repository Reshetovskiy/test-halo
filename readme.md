# gulp "Start project" web-west
Сборка gulp

## Установка

```
npm i gulp gulp-deploy-ftp gulp-useref gulp-htmlmin gulp-csso gulp-img-retina gulp-if gulp-inline-source gulp-autoprefixer gulp-bower gulp-connect gulp-cssmin gulp-filter gulp-imagemin gulp-sass gulp-livereload gulp-include gulp-uglify gulp.spritesmith gulp-svg-sprite gulp-svgmin gulp-cheerio gulp-replace gulp-plumber imagemin-pngquant opn rimraf -g

npm link gulp gulp-deploy-ftp gulp-useref gulp-htmlmin gulp-csso gulp-img-retina gulp-if gulp-inline-source gulp-autoprefixer gulp-bower gulp-connect gulp-cssmin gulp-filter gulp-imagemin gulp-sass gulp-livereload gulp-include gulp-uglify gulp.spritesmith gulp-svg-sprite gulp-svgmin gulp-cheerio gulp-replace gulp-plumber imagemin-pngquant opn rimraf
```

# или

```
npm i
```

## Команды генерации кода

```
gulp build 
gulp build:watch
gulp server - run build + livereload
```
### для включение режима Retina использовать параметр --retina

## Тестирование
### для включения режима сжатия html использовать параметр --htmlmin
### для включения режима Combined (объединение плагинов) использовать параметр --combined

## Bower
Установщик bower нужно запускать из корня, устанавливаться пакеты будут в `bower_components`, а компелироваться в `buildpath + "/vendor"`

## Структура проекта
```
src/fonts - шрифты
src/img/work - все картинки кроме иконок для спрайтов, будет скомпелировано в `buildpath + "/img"`
src/img/icons - все картинки иконок для спрайтов, будет скомпелировано в `src/work/icons.png` + `src/sass/partials/icons.scss`
src/img/icons - все картинки иконок SVG, будут скомпелированы в `src/work/sprite.svg` + `src/sass/partials/svg_sprite.scss`
src/sass - стили, скомпелируется в `buildpath + "/css"`
src/js - скрипты, скомпелируется в `buildpath + "/js"`
pages - html файлы, скомпелируются файлы из корня `src` в корень `buildpath`
```

## Деплой на FTP

### Тестовый хостинг
```
gulp deploy:test
```

### Клиентский хостинг

```
gulp deploy:build
```

## Создание архива приложения

### файл app.zip будет доступен в папке `appPath`

```
gulp zip
```