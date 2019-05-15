"use strict";

//import webpack from "webpack";
//import webpackStream from "webpack-stream";
import gulp from "gulp";
import gulpif from "gulp-if";
//import browsersync from "browser-sync";
import autoprefixer from "gulp-autoprefixer";
import sass from "gulp-sass";
import mqpacker from "css-mqpacker";
import sortCSSmq from "sort-css-media-queries";
import mincss from "gulp-clean-css";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
// import svg from "gulp-svg-sprite";
// import imagemin from "gulp-imagemin";
// import imageminPngquant from "imagemin-pngquant";
// import imageminZopfli from "imagemin-zopfli";
// import imageminMozjpeg from "imagemin-mozjpeg";
// import imageminGiflossy from "imagemin-giflossy";
// import imageminWebp from "imagemin-webp";
// import webp from "gulp-webp";
import favicons from "gulp-favicons";
import replace from "gulp-replace";
import rigger from "gulp-rigger";
import debug from "gulp-debug";
import plumber from "gulp-plumber";
import clean from "gulp-clean";
import yargs from "yargs";
var modifyCssUrls = require('gulp-modify-css-urls');

var argv = yargs.argv;
var production = !!argv.production;

const autoprefixierOpts = {browsers: ["last 12 versions", "> 1%", "ie 8", "ie 7"]};
const mincssOpts = {
	compatibility: "ie8", level: {
		1: {
			specialComments: 0,
			removeEmpty: true,
			removeWhitespace: true
		},
		2: {
			mergeMedia: true,
			removeEmpty: true,
			removeDuplicateFontRules: true,
			removeDuplicateMediaBlocks: true,
			removeDuplicateRules: true,
			removeUnusedAtRules: false
		}
	}
};

const paths = {
	styles: {
		src: "./src/styles/main.scss",
		dist: "./dist/styles/"
	},
	libscss: {
		src: "./src/styles/vendor.scss",
		dist: "./dist/styles/"
	},
	scripts: {
		src: "./src/js/index.js",
		dist: "./dist/js/"
	},
	fonts: {
		src: [
			"./src/assets/fonts/**/*.{eot,ttf,otf,woff,woff2}",
			"./src/vendor/**/**.{eot,ttf,otf,woff,woff2}"
		],
		dist: "./dist/fonts/"
	}
}

export const cleanFiles = () => gulp.src("./dist/*", {read: false})
	.pipe(clean())
	.pipe(debug({
		"title": "Cleaning..."
	}));

export const fonts = () => gulp.src(paths.fonts.src, {nodir: true})
	.pipe(gulp.dest(paths.fonts.dist))
	.pipe(debug({
		"title": "Fonts"
	}));

export const styles = () => gulp.src(paths.styles.src)
	.pipe(gulpif(!production, sourcemaps.init()))
	.pipe(plumber())
	.pipe(sass())
	.pipe(postcss([ mqpacker({ sort: sortCSSmq }) ]))
	.pipe(gulpif(production, autoprefixer(autoprefixierOpts)))
	.pipe(gulpif(production, mincss(mincssOpts)))
	.pipe(gulpif(production, rename({ suffix: ".min" })))
	.pipe(plumber.stop())
	.pipe(gulpif(!production, sourcemaps.write("./maps/")))
	.pipe(gulp.dest(paths.styles.dist))
	.pipe(debug({
		"title": "CSS files"
	}));

export const libscss = () => gulp.src(paths.libscss.src)
	.pipe(plumber())
	.pipe(sass())
	.pipe(postcss([ mqpacker({ sort: sortCSSmq }) ]))
	/*.pipe(modifyCssUrls({
		modify: function (url, filePath) {
		  var ar = url.split('/');
		  var len = ar.length;
		  var filename = ar[len-1];
		  //var maindir = ar
		  var ext = filename.split('.')[1];
		  
		  //if 
		}
		//prepend: 'https://fancycdn.com/',
		//append: '?cache-buster'
	  }))*/
	.pipe(gulpif(production, autoprefixer(autoprefixierOpts)))
	.pipe(gulpif(production, mincss(mincssOpts)))
	.pipe(gulpif(production, rename({ suffix: ".min" })))
	.pipe(plumber.stop())
	.pipe(gulp.dest(paths.libscss.dist))
	.pipe(debug({
		"title": "CSS LIBS"
	}));

export const development = gulp.series(
	cleanFiles,
	libscss,
	styles,
	fonts
);

export const prod = gulp.series(
	cleanFiles,
	libscss,
	styles,
	fonts
);

export default development;