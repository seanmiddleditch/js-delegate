// Copyright (c) 2013 Sean Middleditch <sean@seanmiddleditch.com>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Usage:
//
//   Pass in the object and method to the delegate function to get a bound
//   delegate.
//
//   ex. 1:
//     var delegate = require('delegate');
//
//     delegate(object, method)();
//     delegage(this, this.foo)();
//
//   ex. 2:
//     var obj = { a: 2, b: function(n){ return this.a * n; } };
//     var d = delegate(obj, obj.b);
//     d(3); // 6
//
//   Additional parameters can be passed to the delegate function to bind
//   them for all future calls.
//
//   ex. 3:
//     delegate(obj, obj.b, 7);
//     d(); // 14
//
//   Parameters can also be bind in non-default locations or with a mixture
//   of curried values.
//
//   ex. 4:
//     var delegate = require('delegate)
//       , bind = delegate.bind;
//
//     function concat(a,b) { return a+b; }
//     var swapped = delegate(this, concat, bind(1), bind(0));
//     concat("foo","bar");  // foobar
//     swapped("foo","bar"); // barfoo
//
//     var mixed = delegate(this, concat, "curried", bind());
//     mixed("late"); // curriedlate
//
// Future Improvements:
//   - allow passing a string for the method
//   - simplify code using a framework like Underscore or such
//   - support a way to bind ranges, e.h. bind_range(3, 7) or bind_rnage(2)
//   - real comments and better documentation
//
// See http://seanmiddleditch.com/journal/2013/08/javascript-del.g-placeholders/

(function(){
	function binder(n) { this.index = n; }
	function bind(n) { return new binder(n); }

	function delegate(obj, cb) {
		if (arguments.length > 2) {
			var curry = [].splice.call(arguments, 2);

			var bound = false;
			for (var i = 0; i < curry.length; ++i) {
				if (curry[i] instanceof binder) {
					bound = true;
					break;
				}
			}

			if (bound) {
				return function(){
					var params = [];
					var next = 0;
					for (var i = 0; i < curry.length; ++i) {
						if (curry[i] instanceof binder) {
							var index = curry[i].index;
							if (index === undefined) {
								params.push(arguments[next++]);
							} else {
								params.push(arguments[index]);
								next = index + 1;
							}
						} else {
							params.push(curry[i]);
						}
					}
					
					return cb.apply(obj, params);
				}
			} else {
				return function() { return cb.apply(obj, curry); }
			}
		} else {
			return function(){ return cb.apply(obj, arguments); }
		}
	}

	module.exports = delegate;
	module.exports.delegate = delegate;
	module.exports.bind = bind;
})();
