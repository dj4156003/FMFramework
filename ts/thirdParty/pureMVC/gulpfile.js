var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var transform = require("gulp-transform");
const merge = require('merge2');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

function polyfillModule(content, file) {
    return "(function(context){\n" +
            content + "\n" +
            "context.module[context.moduleName] = puremvc;\n" +
            "})((function(){\n" +
                "var m;\n" +
                "var mName;\n" +
                "if (typeof window !== 'undefined' && window)\n" +
                "{\n" +
                    "m = window;\n" +
                    "mName = 'puremvc';\n" +
                "}\n" +
                "else if (typeof module !== 'undefined' && module)\n" +
                "{\n" +
                    "m = module;\n" +
                    "mName = 'exports';\n" +
                "}\n" +    
                "else\n" +
                "{\n" +
                    "m = {};\n" +
                    "mName = 'puremvc';\n" +                
                "}\n" +
                "return {\"module\":m, \"moduleName\":mName};\n" +
            "})());";
  }

gulp.task("default", function () {
    const tsResult = tsProject.src()
        .pipe(tsProject());
        return merge([
            tsResult.dts.pipe(gulp.dest('../dist/types')),
            tsResult.js.pipe(transform("utf8", polyfillModule))
                       .pipe(gulp.dest("../dist"))
                       .pipe(uglify())
                       .pipe(rename({ extname: '.min.js' }))
                       .pipe(gulp.dest('../dist'))
        ]);
});