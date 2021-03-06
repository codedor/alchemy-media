var path      = alchemy.use('path'),
    Veronica  = alchemy.use('veronica');

// Define the default options
var options = {

	// The path to use in the url
	url: '/media/image',

	// Where to store the files
	path: path.resolve(PATH_ROOT, 'files'),

	// Which hash function to use
	hash: 'sha1',

	// The location of the exiv2 binary
	exiv2: '/usr/bin/exiv2',

	// The location of cwebp
	cwebp: '/usr/bin/cwebp',

	// Enable webp
	webp: true,

	// Temporary map for intermediate file changes
	scratch: path.resolve(PATH_TEMP, 'scratch'),

	// The cache map for resized images & thumbnails
	cache: path.resolve(PATH_TEMP, 'imagecache')
};

// Inject the user-overridden options
alchemy.plugins.media = alchemy.inject(options, alchemy.plugins.media);

// Make sure these folders exist
alchemy.createDir(options.scratch);
alchemy.createDir(options.cache);

// Create routes
alchemy.connect('media::image', options.url + '/:id', {controller: 'media_file', action: 'image'});
alchemy.connect('media::file', '/media/file/:id', {controller: 'media_file', action: 'file'});
alchemy.connect('media::file', '/media/thumbnail/:id', {controller: 'media_file', action: 'thumbnail'});
alchemy.connect('media::placeholder', '/media/placeholder', {controller: 'media_file', action: 'placeholder'});
alchemy.connect('media::upload', '/media/upload', {controller: 'media_file', action: 'upload'});

var profiles = alchemy.shared('Media.profiles');

// Create a new veronica instance
options.veronica = new Veronica({
	cwebp: options.cwebp,
	temp: options.scratch,
	cache: options.cache
});

/**
 * Register a profile under the given name
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  0.0.1
 *
 * @param    {String}   name
 * @param    {Object}   settings
 */
options.addProfile = function addProfile(name, settings) {
	profiles[name] = settings;
};

// Add the thumbnail profile
options.addProfile('thumbnail', {width: 100, height: 100});