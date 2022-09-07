gulp = require('gulp');
render = require('gulp-nunjucks-render');

gulp.task('build', function () {
    return gulp.src('src/pages/*.njk')
        .pipe(render({
            path: ['src/templates']
        }))
        .pipe(gulp.dest('.build'));
})