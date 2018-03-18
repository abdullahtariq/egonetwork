// app/routes.js
module.exports = function(app, passport, https,request) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'user_friends'] }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	app.get('/getUserFbId',function(req,res){
	 	console.log(req.query.id);
		//console.log(https);
		console.log('i need to hit the fb url');
		var url = 'https://www.facebook.com/photo.php?fbid='+req.query.id;
		request(url,
		  {
		    headers: {
		      'user-agent': 'curl/7.47.0',
		      'accept-language': 'en-US,en',
		      'accept': '*/*'
		    }
		  }, function (error, response, body) {
		    if (error) {
		      throw (error);
		    }
		    if (response.statusCode === 200) {
					var splitedA = response.body.split('set=a.');
					//var splittedB = splitedA[2].split('&amp;');
					console.log(splitedA[2]);
		      //var result = scraper(body);
		      //console.log(JSON.stringify(result, null, 2));
		    } else {
		      console.log('HTTP Error: ' + response.statusCode);
		    }
		});
		//var url = 'https://www.facebook.com/photo.php?fbid='+profileImg;
	})

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
