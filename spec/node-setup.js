// Setup for running Mocha via Node
require( "should/should" );

global._ = require( "lodash" );

global.postal = require( "postal" );
require( "../src/postal-survivable-event.js" )(global.postal);