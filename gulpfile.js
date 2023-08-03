const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Задача для сборки JavaScript файлов
gulp.task('scripts', function () {
  return gulp.src('src/js/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

// Задача для компиляции и сборки стилей
gulp.task('styles', function () {
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('build/css'));
});

// Задача для компиляции Pug файлов
gulp.task('pug', function () {
  return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build'));
});

// Задача для запуска сервера BrowserSync
gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
});

// // Задача по умолчанию, которая будет запущена при вводе команды 'gulp' в консоли
// gulp.task('default', gulp.series('serve'));

// Задача по умолчанию, которая будет запускать все задачи
gulp.task('build', gulp.parallel('scripts', 'styles', 'pug'));

// Задача для отслеживания изменений в файлах и автоматической сборки
gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('src/js/**/*.js', gulp.series('scripts'));
  // gulp.watch('src/images/**/*', gulp.series('images'));
  gulp.watch('src/pug/*.pug', gulp.series('pug'));
  gulp.watch('./**/*').on('change', browserSync.reload);
});

// Задача по умолчанию, которая запускает watch
gulp.task('default', gulp.series('build', 'watch', 'serve'));
