"use strict";

//import webpack from "webpack";
//import webpackStream from "webpack-stream";
import gulp from "gulp";
import concat from "gulp-concat";
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
// import favicons from "gulp-favicons";
// import replace from "gulp-replace";
import rigger from "gulp-rigger";
import debug from "gulp-debug";
import plumber from "gulp-plumber";
import clean from "gulp-clean";
import yargs from "yargs";

var modifyCssUrls = require('gulp-modify-css-urls');

var argv = yargs.argv;
var production = !!argv.production;

const imageExt = 'jpg png gif svg jpeg';
const fontExt = 'eot ttf otf woff woff2 svg';

const autoprefixierOpts = {
	browsers: ["last 12 versions", "> 1%", "ie 8", "ie 7"]
};
const mincssOpts = {
	compatibility: "ie8",
	level: {
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

const cssLibsList = [
	"./node_modules/@fortawesome/fontawesome-free/css/all.css",
	"./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css",
	"./node_modules/owl.carousel/dist/assets/owl.carousel.css",
	"./node_modules/owl.carousel/dist/assets/owl.theme.default.css",
]

const jsLibsList = [
	"./node_modules/jquery/dist/jquery.min.js",
	"./src/vendor/jquery-ui/jquery-ui.min.js",
	"./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js",
	"./node_modules/slick-carousel/slick/slick.min.js",
	"./node_modules/owl.carousel/dist/owl.carousel.min.js",
	"./node_modules/sticky-kit/dist/sticky-kit.min.js",
]



const paths = {
	styles: {
		src: "./src/styles/main.scss",
		dist: "./dist/styles/"
	},
	libscss: {
		src: cssLibsList,
		dist: "./dist/styles/"
	},
	scripts: {
		src: "./src/js/index.js",
		dist: "./dist/js/"
	},
	fonts: {
		src: "./src/assets/fonts/**/*.{eot,ttf,otf,woff,woff2}",
		dist: "./dist/fonts/"
	},
	images: {
		src: "./src/assets/images/**/*.{jpg,gif,png,svg}",
		dist: "./dist/images/"
	}
}

export const cleanFiles = () => gulp.src("./dist/*", {
		read: false
	})
	.pipe(clean())
	.pipe(debug({
		"title": "Cleaning..."
	}));

var imageFiles = [paths.images.src];
var fontFiles = [paths.fonts.src];

export const libscss = () => gulp.src(paths.libscss.src)
	.pipe(gulpif(!production, sourcemaps.init()))
	.pipe(plumber())
	.pipe(modifyCssUrls({
		modify: function (url, filePath) {
			var ar = url.split('/');
			var len = ar.length;
			var filename = ar[len - 1];
			var ext = filename.split('.')[1];
			var pureExt = ext.split('?')[0];
			var pureExt = pureExt.split('#')[0];

			var p = 'images/';
			var f = false;
			if (~fontExt.indexOf(pureExt)) {
				p = 'fonts/';
				f = true;
			};
			var newUrl = p + filename;
			var ar = filePath.split('\\');
			ar.splice(-1, 1);
			var realFileName = url.split('?')[0];
			realFileName = realFileName.split('#')[0];
			var assetPath = ar.join('\\') + '\\' + realFileName;
			if (f) {
				fontFiles.push(assetPath);
			} else {
				imageFiles.push(assetPath);
			}
			return `${newUrl}`;
		}
	}))
	.pipe(concat('vendor.css'))
	.pipe(postcss([mqpacker({
		sort: sortCSSmq
	})]))
	.pipe(gulpif(production, autoprefixer(autoprefixierOpts)))
	.pipe(gulpif(production, mincss(mincssOpts)))
	.pipe(gulpif(production, rename({
		suffix: ".min"
	})))
	.pipe(plumber.stop())
	.pipe(gulpif(!production, sourcemaps.write("./maps/")))
	.pipe(gulp.dest(paths.libscss.dist))
	.pipe(debug({
		"title": "CSS LIBS"
	}));

export const styles = () => gulp.src(paths.styles.src)
	.pipe(gulpif(!production, sourcemaps.init()))
	.pipe(plumber())
	.pipe(sass())
	.pipe(postcss([mqpacker({
		sort: sortCSSmq
	})]))
	.pipe(gulpif(production, autoprefixer(autoprefixierOpts)))
	.pipe(gulpif(production, mincss(mincssOpts)))
	.pipe(gulpif(production, rename({
		suffix: ".min"
	})))
	.pipe(plumber.stop())
	.pipe(gulpif(!production, sourcemaps.write("./maps/")))
	.pipe(gulp.dest(paths.styles.dist))
	.pipe(debug({
		"title": "CSS files"
	}));

export const libsjs = () => gulp.src(jsLibsList)
	.pipe(concat('vendor.js'))
	.pipe(gulp.dest(paths.scripts.dist))
	.pipe(debug({
		"title": "JS LIBS"
	}))

export const fonts = () => gulp.src(fontFiles)
	.pipe(gulp.dest(paths.fonts.dist))
	.pipe(debug({
		"title": "Fonts"
	}));

export const images = () => gulp.src(imageFiles)
	.pipe(gulp.dest(paths.images.dist))
	.pipe(debug({
		"title": "Images"
	}));

export const development = gulp.series(
	cleanFiles,
	libscss,
	styles,
	fonts,
	images
);

export const prod = gulp.series(
	cleanFiles,
	libscss,
	styles,
	fonts,
	images
);

export default development;