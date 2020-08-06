'use strict';

/* подключаем gulp и плагины */
const gulp = require('gulp'),  // подключаем Gulp
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов,
    babel = require('gulp-babel'), //перевод с новых стандартов js в старые для кроссбраузерности
    htmlmin = require('gulp-htmlmin'), //минификация html
    args = require('yargs').argv, //работа с аргументами
    rename = require('gulp-rename'), //переименование
    gulpif = require('gulp-if'), //проверка условий
    // imagemin = require('gulp-imagemin'), //сжатие изображений
    // imageminJpegRecompress = require('imagemin-jpeg-recompress'), //сжатие изображений
    // imageminPngquant = require('imagemin-pngquant'), //сжатие изображений
    browserSync = require('browser-sync').create() //обновление браузера

require('dotenv').config();

/* параметры скрипта */
const mode = process.env.MODE || 'development';
const config = process.env.CONFIG || 'main',
    isDev = mode === 'development',
    isProd = !isDev;

console.log(`Режим: ${mode}`);
console.log(`Конфигурация: ${config}`);

const srcFolders = {
    main: 'src/',
    back: 'www_src/'
};

const buildFolders = {
    main: 'dist/',
    back: 'www/'
}

const jsFilesSrc = [
    srcFolders[config] + '**/test.js',
];

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
const path = {
    src: {
        html: srcFolders[config] + '**/[^_]*.+(html|tpl)',
        js: jsFilesSrc,
        sass: srcFolders[config] + '**/[^_]*.+(sass|scss)',
        img: srcFolders[config] + '**/[^_]*.+(jpg|jpeg|png|svg|gif)',
        other: srcFolders[config] + '**/[^_]*.!(html|js|sass|scss|css|jpg|jpeg|png|svg|gif|tpl)',
        dots: srcFolders[config] + '**/.*' //не получилось в watch запихать dots файлы и через |, гребаный node-glob
    },
    watch: {
        html: srcFolders[config] + '**/*.+(html|tpl)',
        js: jsFilesSrc,
        sass: srcFolders[config] + '**/*.+(sass|scss)',
        img: srcFolders[config] + '**/*.(jpg|jpeg|png|svg|gif)',
        other: srcFolders[config] + '**/*.!(html|js|sass|scss|css|jpg|jpeg|png|svg|gif|tpl)',
        dots: srcFolders[config] + '**/.*' //не получилось в watch запихать dots файлы и через |, гребаный node-glob
    },
    build: {
        html: buildFolders[config] + '**/*.+(html|tpl)',
        js: buildFolders[config] + '**/*.js',
        sass: buildFolders[config] + '**/*.+(sass|scss)',
        img: buildFolders[config] + '**/*.+(jpg|jpeg|png|svg|gif)',
        other: buildFolders[config] + '**/*.!(html|js|sass|scss|css|jpg|jpeg|png|svg|gif|tpl)',
        dots: buildFolders[config] + '**/.*' //не получилось в watch запихать dots файлы и через |, гребаный node-glob
    }
};

//является ли файл минифицированым
const isNotMinifiedFile = (file) => {
    return !/.*\.min\.js/.test(file.history[0]);
};

// сбор html
const htmlBuild = () => {
    return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(gulpif(isProd, htmlmin({
            collapseWhitespace: true, // удаляем все переносы
            removeComments: true // удаляем все комментарии
        })))
        .pipe(gulp.dest(buildFolders[config])) // выгружаем
};

// sass сборка
const sassBuild = () => {
    return gulp.src(path.src.sass) // получим все стили scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rename({suffix: ".min"}))
        .pipe(gulpif(isDev, sourcemaps.init())) // инициализируем sourcemap
        .pipe(sass({outputStyle: 'expanded', includePaths: ['node_modules']})) // scss -> css
        .pipe(autoprefixer({ //префиксы
            overrideBrowserslist: ['last 25 versions'],
            cascade: false
        }))
        .pipe(gulpif(isProd, cleanCSS())) // минимизируем CSS
        .pipe(gulpif(isDev, sourcemaps.write('./'))) // записываем sourcemap
        .pipe(gulp.dest(buildFolders[config])) // выгружаем в dist
};

// сбор js
const jsBuild = () => {
    return gulp.src(path.src.js) // получим файлы js
        .pipe(gulpif(isNotMinifiedFile, rename({suffix: ".min"})))
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы js
        .pipe(gulpif(isDev, sourcemaps.init())) //инициализируем sourcemap
        .pipe(gulpif(isNotMinifiedFile, babel({
            "presets": [
                [
                    "@babel/preset-env",
                    {
                        "modules": false
                    }
                ]
            ]
        })))
        .pipe(gulpif(isProd, uglify())) // минимизируем js
        .pipe(gulpif(isDev, sourcemaps.write('./'))) //  записываем sourcemap
        .pipe(gulp.dest(buildFolders[config])) // готовый файл
};

// сбор img
const imgBuild = () => {
    return gulp.src(path.src.img) // получим файлы img
        // .pipe(gulpif(isProd, cache(imagemin([
        //     imagemin.gifsicle({interlaced: true}),
        //     imageminJpegRecompress({
        //         progressive: true,
        //         max: 80,
        //         min: 60
        //     }),
        //     imageminPngquant({quality: [0.6, 0.8]}),
        //     imagemin.svgo({plugins: [{removeViewBox: true}]})
        // ]))))
        .pipe(gulp.dest(buildFolders[config])) // положим файлы
};

// сбор остального
const otherBuild = () => {
    return gulp.src(path.src.other) 
        .pipe(gulp.dest(buildFolders[config])) 
};

// сбор файлов, начинающихся с точки
const dotsBuild = () => {
    return gulp.src(path.src.dots) 
        .pipe(gulp.dest(buildFolders[config]))
};

// удаление каталога dist 
const clean = () => {
    return gulp.src(buildFolders[config] + '*', {read: false, dot: true})
        .pipe(rimraf());
};

// сборка всего
const build = gulp.parallel(
        sassBuild,
        jsBuild,
        htmlBuild,
        imgBuild,
        otherBuild,
        dotsBuild
);

// авто обновление браузера
const serve = async () => {
    browserSync.init({
        // proxy: "http://twsrussia",
        // host: "twsrussia",
        // port: 90,
        // open: 'external',
        server: {
            baseDir: buildFolders[config]
        },
        notify: false
    })

    browserSync.watch(buildFolders[config] + '**/*.*').on('change', browserSync.reload);
};

// слежение за изменениями
const watch = () => {
    gulp.watch(path.watch.sass, sassBuild);
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.html, htmlBuild);
    gulp.watch(path.watch.img, imgBuild);
    gulp.watch(path.watch.other, otherBuild);
    gulp.watch(path.watch.dots, dotsBuild);
};

// очистка кэша
const cleanCache = async () => {
    await cache.clearAll();
};

//генератор задач удаления определенных расширений
const cleanTaskGenerator = (key) => () => 
    gulp.src(path.build[key], {read: false})
            .pipe(rimraf());

exports['html:build'] = htmlBuild;
exports['sass:build'] = sassBuild;
exports['js:build'] = jsBuild;
exports['img:build'] = imgBuild;
exports['other:build'] = otherBuild;
exports['dots:build'] = dotsBuild;
exports['clean'] = clean;
Object.keys(path.src).forEach(key => {
    exports[`${key}:clean`] =  cleanTaskGenerator(key);
});
exports['cache:clean'] = cleanCache;
exports['build'] = build;
exports['serve'] = serve;
exports['watch'] = watch;
exports['build-watch'] =  gulp.series(build, watch);
exports.default = gulp.series(build, gulp.parallel(serve, watch));