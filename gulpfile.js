let gulp = require('gulp'),
    sass = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    uglify = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    rename = require('gulp-rename'),
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require("gulp-imagemin"), // Подключаем библиотеку для работы с изображениями
    pngquant = require("imagemin-pngquant"), // Подключаем библиотеку для работы с png
    cache = require("gulp-cache"), // Подключаем библиотеку кеширования
    babel = require("gulp-babel");

gulp.task('clean', async function(){
  del.sync('dist') // Удаляем папку dist перед сборкой
});

gulp.task('css', function(){  // Создаем таск Sass libs.min.css
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css'
  ])
    .pipe(concat('libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scss', function(){   // Создаем таск Sass
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 8 versions']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function(){
  return gulp.src('app/*.html')
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function(){
  return gulp.src('app/js/*.js')
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function(){
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task("img", function() {
  return gulp
    .src("app/img/**/*") // Берем все изображения из app
    .pipe(
      cache(
        imagemin({
          // С кешированием
          // .pipe(imagemin({ // Сжимаем изображения без кеширования
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()]
        })
      )
    )
    .pipe(gulp.dest("dist/img")); // Выгружаем на продакшен
});

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "app/"
      }
  });
});

gulp.task('export', async function(){
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

  // let BuildJsBabel = gulp.src("src/app/main.js")
  //   .pipe(babel())
  //   .pipe(gulp.dest("dist/js"));

  let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
    
  let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/*.html', gulp.parallel('html'))
  gulp.watch('app/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'img', 'export'))

gulp.task('default', gulp.parallel('css', 'js', 'scss', 'browser-sync', 'watch'));