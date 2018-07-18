var gulp  = require("gulp"),
    watch = require("gulp-watch"),
    browserSync = require("browser-sync").create();

gulp.task("watch", function(){

	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	watch("./index.html", function(){
		browserSync.reload();
	});

	watch("./styles/css/**/*.css", function(){
		gulp.start("cssInject");
	});

	watch("./js/**/*.js", function() {
		gulp.start("scriptsRefresh");
	});
});

gulp.task("cssInject", ["styles"] , function(){
	return gulp.src("./styles/css/app.css")
			.pipe(browserSync.stream());
});

gulp.task("scriptsRefresh", ["scripts"], function() {
	browserSync.reload();
});
