var gulp  = require("gulp"),
    autoprefixer = require("gulp-autoprefixer");

gulp.task("styles", function(){
	return gulp.src("./styles/css/app.css")
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: true
            }))
            .on("error", function(errorInfo){
                console.log(errorInfo.toString());
                this.emit("end");
            })
			.pipe(gulp.dest("./styles/app"));
});