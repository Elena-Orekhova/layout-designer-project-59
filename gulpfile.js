const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const surge = require('gulp-surge');
const htmlPrettify = require('gulp-html-prettify');
const rimraf = require('rimraf');

// Задача для очистки HTML-файлов
gulp.task('clean-html', (done) => {
  rimraf('build/*.html', done);
});

// Задача для очистки HTML-файлов
gulp.task('clean-css', (done) => {
  rimraf('build/css/*.css', done);
});

// Динамический импорт 'del'
let delPromise = import('del');

// Задача для компиляции Pug файлов
gulp.task('pug', gulp.series(async () => {
  await delPromise;

  return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build'));
}));

// Задача для форматирования HTML-кода
gulp.task('prettify', () => {
  return gulp.src('build/*.html')
  .pipe(htmlPrettify({
    indent_char: ' ',
    indent_size: 2,
  }))
  .pipe(gulp.dest('build'));
});

// Задача для компиляции и сборки стилей
gulp.task('styles', function () {
  return gulp.src('src/scss/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('build/css'));
});

// Задача для Surge
gulp.task('deploy', () => {
  return surge({
    project: './build',
    domain: 'Project_Messenger_Hexlet-Chat.surge.sh'
  });
});

// Задача для запуска всех задач сборки
gulp.task('build', gulp.parallel('pug', 'prettify', 'styles', 'deploy'));

// Задача для отслеживания изменений в файлах и автоматической сборки + BrowserSync
  gulp.task('watch', () => {
    browserSync.init({
      server: {
        baseDir: './build'
      }
    });
    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
    gulp.watch('./**/*').on('change', browserSync.reload);
});

// Задача по умолчанию, которая запускает watch
gulp.task('start', gulp.series('build', 'watch'));