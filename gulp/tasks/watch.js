var gulp	= require( 'gulp' );
var path	= require( 'path' );

var options	= require( '../utils/options' );
var paths	= require( '../utils/paths' );
var bs		= require( 'browser-sync' ).create( 'browsersync' );
var config	= require( '../../dev/configs/config.json' );

bs.init( {
	notify:	false,
	port:	8080,
	open:	false,
	proxy:	config.ENV.base_url
} );


gulp.task( 'watch', function () {
	
	/* Tasks management */
	gulp.watch( [
		
		/* htaccess */
		paths.env.base + paths.htaccess,
		
		/* Assets */
		paths.env.dev + paths.assets.allFiles,
		'!' + paths.env.dev + paths.assets.css.minAllFiles,
		'!' + paths.env.dev + paths.assets.css.fonts.allFiles,
		'!' + paths.env.dev + paths.assets.svg.sprite.allFiles,
		
		/* Config */
		paths.env.dev + paths.configs.allFiles
		
	], function ( e ) {
		
		var ext, desktop, mobile, shared, /*favicons,*/ configs;
		var taskname = null;
		
		options.filePath	= e.path;
		ext					= path.extname( options.filePath );
		options.fileName	= path.basename( options.filePath );
		
		desktop	= options.filePath.indexOf( 'desktop' ) > -1 ? true : false;
		mobile	= options.filePath.indexOf( 'mobile' ) > -1 ? true : false;
		shared	= options.filePath.indexOf( 'shared' ) > -1 ? true : false;
		configs	= options.filePath.indexOf( 'configs/' ) > -1 ? true : false;
		
		// options.devicePath: used for SASS error notification
		if ( desktop )
			options.devicePath = 'desktop';
		else if ( mobile )
			options.devicePath = 'mobile';
		else if ( shared )
			options.devicePath = 'shared';
		
		
		/* htaccess */
		if ( options.fileName == '.htaccess' ) {
			taskname = 'htaccess';
		}
		
		/* SASS */
		else if ( ext == '.scss' ) {
			taskname = 'sass';
			
			if ( desktop )
				options.cssSrcPath = [ paths.env.dev + paths.assets.css.app.desktopFile ];
			else if ( mobile )
				options.cssSrcPath = [ paths.env.dev + paths.assets.css.app.mobileFile ];
			else if ( shared )
				options.cssSrcPath = [
					paths.env.dev + paths.assets.css.app.desktopFile,
					paths.env.dev + paths.assets.css.app.mobileFile
				];
		}
		
		/* JS */
		/*else*/
		if ( ext == '.js' ) {
			taskname = 'js';
			
			if ( desktop )
				options.jsSrcPath = paths.env.dev + paths.assets.js.app.desktopAllFiles;
			else if ( mobile )
				options.jsSrcPath = paths.env.dev + paths.assets.js.app.mobileAllFiles;
			else if ( shared )
				options.jsSrcPath = paths.env.dev + paths.assets.js.app.sharedAllFiles;
		}
		
		/* JSON */
		else if ( ext == '.json' ) {
			taskname = 'json';
			
			if ( configs )
				options.jsonSrcPath = paths.env.dev + paths.configs.allRootJsonFiles;
			else
				options.jsonSrcPath = paths.env.dev + paths.assets.json.allFiles;
		}
		
		/* SVG */
		else if ( ext == '.svg' ) {
			taskname = 'svg';
			
			options.svgSrcPath = [paths.env.dev + paths.assets.svg.allFiles];
		}
		
		
		if ( taskname ) {
			gulp.start( taskname );
		}
		
	});
	
	
	/* Reload */
	gulp.watch( [
		
		/* htaccess */
		paths.env.dev + paths.htaccess,
		
		/* JS */
		paths.env.dev + paths.assets.js.allFiles,
		
		/* JSON */
		paths.env.dev + paths.assets.json.allFiles,
		
		/* SVG */
		paths.env.dev + paths.assets.svg.sprite.allFiles,
		
		/* Config */
		paths.env.dev + paths.configs.allFiles,
		
		/* Server */
		paths.env.dev + paths.server.indexFile,
		paths.env.dev + paths.server.allFiles,
		'!' + paths.env.dev + paths.server.vendor.allFiles
		
	] ).on( 'change', bs.reload );


} );