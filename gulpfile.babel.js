
//import webpack from "webpack";
//import webpackStream from "webpack-stream";
import gulp from "gulp";

import concat from "gulp-concat";
import gulpif from "gulp-if";
import browsersync from "browser-sync";
import autoprefixer from "gulp-autoprefixer";
import sass from "gulp-sass";
import mqpacker from "css-mqpacker";
import sortCSSmq from "sort-css-media-queries";
import mincss from "gulp-clean-css";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import fileinclude from 'gulp-file-include';
import sftp from "gulp-sftp-up4";
const ftp = require('gulp-deploy-ftp');
import imagemin from "gulp-imagemin";

// import svg from "gulp-svg-sprite";
// import imageminPngquant from "imagemin-pngquant";
// import imageminZopfli from "imagemin-zopfli";
// import imageminMozjpeg from "imagemin-mozjpeg";
// import imageminGiflossy from "imagemin-giflossy";
// import imageminWebp from "imagemin-webp";
// import webp from "gulp-webp";
// import favicons from "gulp-favicons";
import replace from "gulp-replace";
import rigger from "gulp-rigger";
import debug from "gulp-debug";
import plumber from "gulp-plumber";
import clean from "gulp-clean";
import yargs from "yargs";

var uglify = require('gulp-uglify');

var modifyCssUrls = require('gulp-modify-css-urls');

var argv = yargs.argv;
var production = !!argv.production;

const webpackConfig = require("./webpack.config.js");
webpackConfig.mode = production ? "production" : "development";
webpackConfig.devtool = production ? false : "cheap-eval-source-map";

const imageExt = 'jpg png gif svg jpeg';
const fontExt = 'eot ttf otf woff woff2 svg';



export const server = () => {
	browsersync.init({
		server: "./dist/",
		tunnel: false,
		notify: true
	});

	gulp.watch(paths.styles.watch, gulp.parallel(styles));
	gulp.watch(paths.scripts.watch, gulp.parallel(scripts));
	gulp.watch(paths.views.watch, gulp.parallel(views));
	gulp.watch(paths.images.watch, gulp.parallel(images));
	
};

const autoprefixierOpts = {
	overrsideBrowserslist: ["last 12 versions", "> 1%", "ie 8", "ie 7"]
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
];

const jsLibsList = [
	"./node_modules/jquery/dist/jquery.min.js",
	"./src/vendor/jquery-ui/jquery-ui.min.js",
	"./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js",
	"./node_modules/slick-carousel/slick/slick.min.js",
	"./node_modules/owl.carousel/dist/owl.carousel.min.js",
	"./node_modules/sticky-kit/dist/sticky-kit.min.js",
	"./node_modules/hammerjs/hammer.min.js"
];

const paths = {
	styles: {
		src: "./src/styles/main.scss",
		dist: "./dist/assets/styles/",
		watch: "./src/styles/**/*.scss"
	},
	libscss: {
		src: cssLibsList,
		dist: "./dist/assets/styles/"
	},
	scripts: {
		src: "./src/js/main.js",
		dist: "./dist/assets/js/",
		watch: "./src/js/**/*.js"
	},
	fonts: {
		src: "./src/assets/fonts/**/*.{eot,ttf,otf,woff,woff2}",
		dist: "./dist/assets/fonts/"
	},
	images: {
		src: "./src/assets/images/**/*.{jpg,gif,png,svg}",
		dist: "./dist/assets/images/",
		watch: "./src/assets/images/**/*.{jpg,gif,png,svg}"
	},
	views: {
		src: ["./src/html/index.html","./src/html/ppp.html"],
		dist: "./dist/",
		watch: "./src/html/**/*.html"
	}
};

export const cleanFiles = () => gulp.src("./dist/*", {
		read: false
	})
	.pipe(clean())
	.pipe(debug({
		"title": "Cleaning..."
	}));

var imageFiles = [paths.images.src];
var fontFiles = [paths.fonts.src];

var v = "_v55";

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
			pureExt = pureExt.split('#')[0];

			var p = '/assets/images/';
			var f = false;
			if (~fontExt.indexOf(pureExt)) {
				p = '/assets/fonts/';
				f = true;
			}
			var newUrl = p + filename;
			ar = filePath.split('\\');
			ar.splice(-1, 1);
			var realFileName = url.split('?')[0];
			realFileName = realFileName.split('#')[0];
			var assetPath = ar.join('\\') + '\\' + realFileName;
			if (f) {
				fontFiles.push(assetPath);
			} else {
				//imageFiles.push(assetPath);
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
		suffix: v+".min"
	})))
	.pipe(plumber.stop())
	.pipe(gulpif(!production, sourcemaps.write("./maps/")))
	.pipe(gulp.dest(paths.styles.dist))
	.pipe(debug({
		"title": "CSS files"
	}))
	.pipe(browsersync.stream());

export const libsjs = () => gulp.src(jsLibsList)
	.pipe(concat('vendor.min.js'))
	.pipe(gulp.dest(paths.scripts.dist))
	.pipe(debug({
		"title": "JS LIBS"
	}));

export const fonts = () => gulp.src(fontFiles)
	.pipe(gulp.dest(paths.fonts.dist))
	.pipe(debug({
		"title": "Fonts"
	}));

export const images = () => gulp.src(imageFiles)
	//.pipe(imagemin())
	.pipe(gulp.dest(paths.images.dist))
	.pipe(debug({
		"title": "Images"
	}))
	.pipe(browsersync.stream());

export const views = () => gulp.src(paths.views.src)
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(gulpif(production, replace("main.css", "main.min.css")))
	.pipe(gulpif(production, replace("vendor.css", "vendor.min.css")))
	//.pipe(gulpif(production, replace("vendor.js", "vendor.min.js")))
	.pipe(gulpif(production, replace("main.js", "main.min.js")))
	.pipe(gulp.dest(paths.views.dist))
	.pipe(debug({
		"title": "HTML files"
	}))
	.pipe(browsersync.stream());
//.on("end", browsersync.reload);

export const scripts = () => gulp.src(paths.scripts.src)
	.pipe(rigger())
	.pipe(plumber())
	.pipe(gulpif(production, uglify()))
	//.pipe(webpackStream(webpackConfig), webpack)
	.pipe(gulpif(production, rename({
		suffix: v+".min"
	})))
	.pipe(gulp.dest(paths.scripts.dist))
	.pipe(debug({
		"title": "JS files"
	}))
	.pipe(browsersync.stream());
//.on("end", browsersync.reload);

export const upload = (cb) => {
	gulp.src([
		'./dist/assets/styles**/*.*',
		'./dist/assets/js**/*.*'
	]).pipe(sftp({
		host: '178.79.159.181',
		port: 22,
		user: 'biogumus',
		pass: 'DzJSh0mcZMPe',
		remotePath: 'www/assets/'
	}));
	cb();
};

export const development = gulp.series(
	cleanFiles,
	libscss,
	styles,
	fonts,
	images,
	libsjs,
	scripts,
	views,
	server
);

export const prod = gulp.series(
	cleanFiles,
	libscss,
	styles,
	fonts,
	images,
	libsjs,
	scripts,
	views
	//upload
);

export const prd = gulp.series(
	cleanFiles,
	styles,
	//images,
	scripts,
	upload
);

export const uploadonly = gulp.series(
	upload
);

export default development;