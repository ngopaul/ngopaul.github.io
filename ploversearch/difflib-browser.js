/**
 * @fileoverview Text diff library ported from Python's difflib module.
 *     https://github.com/qiao/difflib.js
 */
var difflib = function () {
  var a = function (b, c) {
    var d = a.resolve(b, c || "/"), e = a.modules[d];
    if (!e) throw new Error("Failed to resolve module " + b + ", tried " + d);
    var f = e._cached ? e._cached : e();
    return f
  };
  return a.paths = [], a.modules = {}, a.extensions = [".js", ".coffee"], a._core = {
    assert: !0,
    events: !0,
    fs: !0,
    path: !0,
    vm: !0
  }, a.resolve = function () {
    return function (b, c) {
      function h(b) {
        if (a.modules[b]) return b;
        for (var c = 0; c < a.extensions.length; c++) {
          var d = a.extensions[c];
          if (a.modules[b + d]) return b + d
        }
      }

      function i(b) {
        b = b.replace(/\/+$/, "");
        var c = b + "/package.json";
        if (a.modules[c]) {
          var e = a.modules[c](), f = e.browserify;
          if (typeof f == "object" && f.main) {
            var g = h(d.resolve(b, f.main));
            if (g) return g
          } else if (typeof f == "string") {
            var g = h(d.resolve(b, f));
            if (g) return g
          } else if (e.main) {
            var g = h(d.resolve(b, e.main));
            if (g) return g
          }
        }
        return h(b + "/index")
      }

      function j(a, b) {
        var c = k(b);
        for (var d = 0; d < c.length; d++) {
          var e = c[d], f = h(e + "/" + a);
          if (f) return f;
          var g = i(e + "/" + a);
          if (g) return g
        }
        var f = h(a);
        if (f) return f
      }

      function k(a) {
        var b;
        a === "/" ? b = [""] : b = d.normalize(a).split("/");
        var c = [];
        for (var e = b.length - 1; e >= 0; e--) {
          if (b[e] === "node_modules") continue;
          var f = b.slice(0, e + 1).join("/") + "/node_modules";
          c.push(f)
        }
        return c
      }

      c || (c = "/");
      if (a._core[b]) return b;
      var d = a.modules.path();
      c = d.resolve("/", c);
      var e = c || "/";
      if (b.match(/^(?:\.\.?\/|\/)/)) {
        var f = h(d.resolve(e, b)) || i(d.resolve(e, b));
        if (f) return f
      }
      var g = j(b, e);
      if (g) return g;
      throw new Error("Cannot find module '" + b + "'")
    }
  }(), a.alias = function (b, c) {
    var d = a.modules.path(), e = null;
    try {
      e = a.resolve(b + "/package.json", "/")
    } catch (f) {
      e = a.resolve(b, "/")
    }
    var g = d.dirname(e), h = (Object.keys || function (a) {
      var b = [];
      for (var c in a) b.push(c);
      return b
    })(a.modules);
    for (var i = 0; i < h.length; i++) {
      var j = h[i];
      if (j.slice(0, g.length + 1) === g + "/") {
        var k = j.slice(g.length);
        a.modules[c + k] = a.modules[g + k]
      } else j === g && (a.modules[c] = a.modules[g])
    }
  }, a.define = function (b, c) {
    var d = a._core[b] ? "" : a.modules.path().dirname(b), e = function (b) {
      return a(b, d)
    };
    e.resolve = function (b) {
      return a.resolve(b, d)
    }, e.modules = a.modules, e.define = a.define;
    var f = {exports: {}};
    a.modules[b] = function () {
      return a.modules[b]._cached = f.exports, c.call(f.exports, e, f, f.exports, d, b), a.modules[b]._cached = f.exports, f.exports
    }
  }, typeof process == "undefined" && (process = {}), process.nextTick || (process.nextTick = function () {
    var a = [], b = typeof window != "undefined" && window.postMessage && window.addEventListener;
    return b && window.addEventListener("message", function (b) {
      if (b.source === window && b.data === "browserify-tick") {
        b.stopPropagation();
        if (a.length > 0) {
          var c = a.shift();
          c()
        }
      }
    }, !0), function (c) {
      b ? (a.push(c), window.postMessage("browserify-tick", "*")) : setTimeout(c, 0)
    }
  }()), process.title || (process.title = "browser"), process.binding || (process.binding = function (b) {
    if (b === "evals") return a("vm");
    throw new Error("No such module")
  }), process.cwd || (process.cwd = function () {
    return "."
  }), process.env || (process.env = {}), process.argv || (process.argv = []), a.define("path", function (a, b, c, d, e) {
    function f(a, b) {
      var c = [];
      for (var d = 0; d < a.length; d++) b(a[d], d, a) && c.push(a[d]);
      return c
    }

    function g(a, b) {
      var c = 0;
      for (var d = a.length; d >= 0; d--) {
        var e = a[d];
        e == "." ? a.splice(d, 1) : e === ".." ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--)
      }
      if (b) for (; c--; c) a.unshift("..");
      return a
    }

    var h = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;
    c.resolve = function () {
      var a = "", b = !1;
      for (var c = arguments.length; c >= -1 && !b; c--) {
        var d = c >= 0 ? arguments[c] : process.cwd();
        if (typeof d != "string" || !d) continue;
        a = d + "/" + a, b = d.charAt(0) === "/"
      }
      return a = g(f(a.split("/"), function (a) {
        return !!a
      }), !b).join("/"), (b ? "/" : "") + a || "."
    }, c.normalize = function (a) {
      var b = a.charAt(0) === "/", c = a.slice(-1) === "/";
      return a = g(f(a.split("/"), function (a) {
        return !!a
      }), !b).join("/"), !a && !b && (a = "."), a && c && (a += "/"), (b ? "/" : "") + a
    }, c.join = function () {
      var a = Array.prototype.slice.call(arguments, 0);
      return c.normalize(f(a, function (a, b) {
        return a && typeof a == "string"
      }).join("/"))
    }, c.dirname = function (a) {
      var b = h.exec(a)[1] || "", c = !1;
      return b ? b.length === 1 || c && b.length <= 3 && b.charAt(1) === ":" ? b : b.substring(0, b.length - 1) : "."
    }, c.basename = function (a, b) {
      var c = h.exec(a)[2] || "";
      return b && c.substr(-1 * b.length) === b && (c = c.substr(0, c.length - b.length)), c
    }, c.extname = function (a) {
      return h.exec(a)[3] || ""
    }
  }), a.define("/node_modules/heap/package.json", function (a, b, c, d, e) {
    b.exports = {main: "./index.js"}
  }), a.define("/node_modules/heap/index.js", function (a, b, c, d, e) {
    b.exports = a("./lib/heap")
  }), a.define("/node_modules/heap/lib/heap.js", function (a, b, c, d, e) {
    (function () {
      var a, c, d, e, f, g, h, i, j, k, l, m, n, o;
      d = Math.floor, k = Math.min, c = function (a, b) {
        return a < b ? -1 : a > b ? 1 : 0
      }, j = function (a, b, e, f, g) {
        var h;
        e == null && (e = 0), g == null && (g = c);
        if (e < 0) throw new Error("lo must be non-negative");
        f == null && (f = a.length);
        while (g(e, f) < 0) h = d((e + f) / 2), g(b, a[h]) < 0 ? f = h : e = h + 1;
        return [].splice.apply(a, [e, e - e].concat(b)), b
      }, g = function (a, b, d) {
        return d == null && (d = c), a.push(b), n(a, 0, a.length - 1, d)
      }, f = function (a, b) {
        var d, e;
        return b == null && (b = c), d = a.pop(), a.length ? (e = a[0], a[0] = d, o(a, 0, b)) : e = d, e
      }, i = function (a, b, d) {
        var e;
        return d == null && (d = c), e = a[0], a[0] = b, o(a, 0, d), e
      }, h = function (a, b, d) {
        var e;
        return d == null && (d = c), a.length && d(a[0], b) < 0 && (e = [a[0], b], b = e[0], a[0] = e[1], o(a, 0, d)), b
      }, e = function (a, b) {
        var e, f, g, h, i, j, k, l;
        b == null && (b = c), j = function () {
          l = [];
          for (var b = 0, c = d(a.length / 2); 0 <= c ? b < c : b > c; 0 <= c ? b++ : b--) l.push(b);
          return l
        }.apply(this).reverse(), k = [];
        for (f = 0, h = j.length; f < h; f++) e = j[f], k.push(o(a, e, b));
        return k
      }, l = function (a, b, d) {
        var f, g, i, j, k;
        d == null && (d = c), g = a.slice(0, b);
        if (!g.length) return g;
        e(g, d), k = a.slice(b);
        for (i = 0, j = k.length; i < j; i++) f = k[i], h(g, f, d);
        return g.sort(d).reverse()
      }, m = function (a, b, d) {
        var g, h, i, l, m, n, o, p, q, r;
        d == null && (d = c);
        if (b * 10 <= a.length) {
          l = a.slice(0, b).sort(d);
          if (!l.length) return l;
          i = l[l.length - 1], p = a.slice(b);
          for (m = 0, o = p.length; m < o; m++) g = p[m], d(g, i) < 0 && (j(l, g, 0, null, d), l.pop(), i = l[l.length - 1]);
          return l
        }
        e(a, d), r = [];
        for (h = n = 0, q = k(b, a.length); 0 <= q ? n < q : n > q; h = 0 <= q ? ++n : --n) r.push(f(a, d));
        return r
      }, n = function (a, b, d, e) {
        var f, g, h;
        e == null && (e = c), f = a[d];
        while (d > b) {
          h = d - 1 >> 1, g = a[h];
          if (e(f, g) < 0) {
            a[d] = g, d = h;
            continue
          }
          break
        }
        return a[d] = f
      }, o = function (a, b, d) {
        var e, f, g, h, i;
        d == null && (d = c), f = a.length, i = b, g = a[b], e = 2 * b + 1;
        while (e < f) h = e + 1, h < f && !(d(a[e], a[h]) < 0) && (e = h), a[b] = a[e], b = e, e = 2 * b + 1;
        return a[b] = g, n(a, i, b, d)
      }, a = function () {
        function a(a) {
          this.cmp = a != null ? a : c, this.nodes = []
        }

        return a.name = "Heap", a.push = g, a.pop = f, a.replace = i, a.pushpop = h, a.heapify = e, a.nlargest = l, a.nsmallest = m, a.prototype.push = function (a) {
          return g(this.nodes, a, this.cmp)
        }, a.prototype.pop = function () {
          return f(this.nodes, this.cmp)
        }, a.prototype.peek = function () {
          return this.nodes[0]
        }, a.prototype.contains = function (a) {
          return this.nodes.indexOf(a) !== -1
        }, a.prototype.replace = function (a) {
          return i(this.nodes, a, this.cmp)
        }, a.prototype.pushpop = function (a) {
          return h(this.nodes, a, this.cmp)
        }, a.prototype.heapify = function () {
          return e(this.nodes, this.cmp)
        }, a.prototype.clear = function () {
          return this.nodes = []
        }, a.prototype.empty = function () {
          return this.nodes.length === 0
        }, a.prototype.size = function () {
          return this.nodes.length
        }, a.prototype.clone = function () {
          var b;
          return b = new a, b.nodes = this.nodes.slice(0), b
        }, a.prototype.toArray = function () {
          return this.nodes.slice(0)
        }, a.prototype.insert = a.prototype.push, a.prototype.remove = a.prototype.pop, a.prototype.top = a.prototype.peek, a.prototype.front = a.prototype.peek, a.prototype.has = a.prototype.contains, a.prototype.copy = a.prototype.clone, a
      }(), (typeof b != "undefined" && b !== null ? b.exports : void 0) ? b.exports = a : window.Heap = a
    }).call(this)
  }), a.define("assert", function (a, b, c, d, e) {
    function j(a, b) {
      return b === undefined ? "" + b : typeof b == "number" && (isNaN(b) || !isFinite(b)) ? b.toString() : typeof b == "function" || b instanceof RegExp ? b.toString() : b
    }

    function k(a, b) {
      return typeof a == "string" ? a.length < b ? a : a.slice(0, b) : a
    }

    function l(a, b, c, d, e) {
      throw new i.AssertionError({message: c, actual: a, expected: b, operator: d, stackStartFunction: e})
    }

    function m(a, b) {
      a || l(a, !0, b, "==", i.ok)
    }

    function n(a, b) {
      if (a === b) return !0;
      if (g.isBuffer(a) && g.isBuffer(b)) {
        if (a.length != b.length) return !1;
        for (var c = 0; c < a.length; c++) if (a[c] !== b[c]) return !1;
        return !0
      }
      return a instanceof Date && b instanceof Date ? a.getTime() === b.getTime() : typeof a != "object" && typeof b != "object" ? a == b : q(a, b)
    }

    function o(a) {
      return a === null || a === undefined
    }

    function p(a) {
      return Object.prototype.toString.call(a) == "[object Arguments]"
    }

    function q(a, b) {
      if (o(a) || o(b)) return !1;
      if (a.prototype !== b.prototype) return !1;
      if (p(a)) return p(b) ? (a = h.call(a), b = h.call(b), n(a, b)) : !1;
      try {
        var c = Object.keys(a), d = Object.keys(b), e, f
      } catch (g) {
        return !1
      }
      if (c.length != d.length) return !1;
      c.sort(), d.sort();
      for (f = c.length - 1; f >= 0; f--) if (c[f] != d[f]) return !1;
      for (f = c.length - 1; f >= 0; f--) {
        e = c[f];
        if (!n(a[e], b[e])) return !1
      }
      return !0
    }

    function r(a, b) {
      return !a || !b ? !1 : b instanceof RegExp ? b.test(a) : a instanceof b ? !0 : b.call({}, a) === !0 ? !0 : !1
    }

    function s(a, b, c, d) {
      var e;
      typeof c == "string" && (d = c, c = null);
      try {
        b()
      } catch (f) {
        e = f
      }
      d = (c && c.name ? " (" + c.name + ")." : ".") + (d ? " " + d : "."), a && !e && l("Missing expected exception" + d), !a && r(e, c) && l("Got unwanted exception" + d);
      if (a && e && c && !r(e, c) || !a && e) throw e
    }

    var f = a("util"), g = a("buffer").Buffer, h = Array.prototype.slice, i = b.exports = m;
    i.AssertionError = function (b) {
      this.name = "AssertionError", this.message = b.message, this.actual = b.actual, this.expected = b.expected, this.operator = b.operator;
      var c = b.stackStartFunction || l;
      Error.captureStackTrace && Error.captureStackTrace(this, c)
    }, f.inherits(i.AssertionError, Error), i.AssertionError.prototype.toString = function () {
      return this.message ? [this.name + ":", this.message].join(" ") : [this.name + ":", k(JSON.stringify(this.actual, j), 128), this.operator, k(JSON.stringify(this.expected, j), 128)].join(" ")
    }, i.AssertionError.__proto__ = Error.prototype, i.fail = l, i.ok = m, i.equal = function (b, c, d) {
      b != c && l(b, c, d, "==", i.equal)
    }, i.notEqual = function (b, c, d) {
      b == c && l(b, c, d, "!=", i.notEqual)
    }, i.deepEqual = function (b, c, d) {
      n(b, c) || l(b, c, d, "deepEqual", i.deepEqual)
    }, i.notDeepEqual = function (b, c, d) {
      n(b, c) && l(b, c, d, "notDeepEqual", i.notDeepEqual)
    }, i.strictEqual = function (b, c, d) {
      b !== c && l(b, c, d, "===", i.strictEqual)
    }, i.notStrictEqual = function (b, c, d) {
      b === c && l(b, c, d, "!==", i.notStrictEqual)
    }, i.throws = function (a, b, c) {
      s.apply(this, [!0].concat(h.call(arguments)))
    }, i.doesNotThrow = function (a, b, c) {
      s.apply(this, [!1].concat(h.call(arguments)))
    }, i.ifError = function (a) {
      if (a) throw a
    }
  }), a.define("util", function (a, b, c, d, e) {
    function g(a) {
      return a instanceof Array || Array.isArray(a) || a && a !== Object.prototype && g(a.__proto__)
    }

    function h(a) {
      return a instanceof RegExp || typeof a == "object" && Object.prototype.toString.call(a) === "[object RegExp]"
    }

    function i(a) {
      if (a instanceof Date) return !0;
      if (typeof a != "object") return !1;
      var b = Date.prototype && n(Date.prototype), c = a.__proto__ && n(a.__proto__);
      return JSON.stringify(c) === JSON.stringify(b)
    }

    function j(a) {
      return a < 10 ? "0" + a.toString(10) : a.toString(10)
    }

    function l() {
      var a = new Date, b = [j(a.getHours()), j(a.getMinutes()), j(a.getSeconds())].join(":");
      return [a.getDate(), k[a.getMonth()], b].join(" ")
    }

    var f = a("events");
    c.print = function () {
    }, c.puts = function () {
    }, c.debug = function () {
    }, c.inspect = function (a, b, d, e) {
      function k(a, d) {
        if (a && typeof a.inspect == "function" && a !== c && (!a.constructor || a.constructor.prototype !== a)) return a.inspect(d);
        switch (typeof a) {
          case"undefined":
            return j("undefined", "undefined");
          case"string":
            var e = "'" + JSON.stringify(a).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
            return j(e, "string");
          case"number":
            return j("" + a, "number");
          case"boolean":
            return j("" + a, "boolean")
        }
        if (a === null) return j("null", "null");
        var l = m(a), o = b ? n(a) : l;
        if (typeof a == "function" && o.length === 0) {
          if (h(a)) return j("" + a, "regexp");
          var p = a.name ? ": " + a.name : "";
          return j("[Function" + p + "]", "special")
        }
        if (i(a) && o.length === 0) return j(a.toUTCString(), "date");
        var q, r, s;
        g(a) ? (r = "Array", s = ["[", "]"]) : (r = "Object", s = ["{", "}"]);
        if (typeof a == "function") {
          var t = a.name ? ": " + a.name : "";
          q = h(a) ? " " + a : " [Function" + t + "]"
        } else q = "";
        i(a) && (q = " " + a.toUTCString());
        if (o.length === 0) return s[0] + q + s[1];
        if (d < 0) return h(a) ? j("" + a, "regexp") : j("[Object]", "special");
        f.push(a);
        var u = o.map(function (b) {
          var c, e;
          a.__lookupGetter__ && (a.__lookupGetter__(b) ? a.__lookupSetter__(b) ? e = j("[Getter/Setter]", "special") : e = j("[Getter]", "special") : a.__lookupSetter__(b) && (e = j("[Setter]", "special"))), l.indexOf(b) < 0 && (c = "[" + b + "]"), e || (f.indexOf(a[b]) < 0 ? (d === null ? e = k(a[b]) : e = k(a[b], d - 1), e.indexOf("\n") > -1 && (g(a) ? e = e.split("\n").map(function (a) {
            return "  " + a
          }).join("\n").substr(2) : e = "\n" + e.split("\n").map(function (a) {
            return "   " + a
          }).join("\n"))) : e = j("[Circular]", "special"));
          if (typeof c == "undefined") {
            if (r === "Array" && b.match(/^\d+$/)) return e;
            c = JSON.stringify("" + b), c.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (c = c.substr(1, c.length - 2), c = j(c, "name")) : (c = c.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), c = j(c, "string"))
          }
          return c + ": " + e
        });
        f.pop();
        var v = 0, w = u.reduce(function (a, b) {
          return v++, b.indexOf("\n") >= 0 && v++, a + b.length + 1
        }, 0);
        return w > 50 ? u = s[0] + (q === "" ? "" : q + "\n ") + " " + u.join(",\n  ") + " " + s[1] : u = s[0] + q + " " + u.join(", ") + " " + s[1], u
      }

      var f = [], j = function (a, b) {
        var c = {
          bold: [1, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          white: [37, 39],
          grey: [90, 39],
          black: [30, 39],
          blue: [34, 39],
          cyan: [36, 39],
          green: [32, 39],
          magenta: [35, 39],
          red: [31, 39],
          yellow: [33, 39]
        }, d = {
          special: "cyan",
          number: "blue",
          "boolean": "yellow",
          "undefined": "grey",
          "null": "bold",
          string: "green",
          date: "magenta",
          regexp: "red"
        }[b];
        return d ? "[" + c[d][0] + "m" + a + "[" + c[d][1] + "m" : a
      };
      return e || (j = function (a, b) {
        return a
      }), k(a, typeof d == "undefined" ? 2 : d)
    };
    var k = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    c.log = function (a) {
    }, c.pump = null;
    var m = Object.keys || function (a) {
      var b = [];
      for (var c in a) b.push(c);
      return b
    }, n = Object.getOwnPropertyNames || function (a) {
      var b = [];
      for (var c in a) Object.hasOwnProperty.call(a, c) && b.push(c);
      return b
    }, o = Object.create || function (a, b) {
      var c;
      if (a === null) c = {__proto__: null}; else {
        if (typeof a != "object") throw new TypeError("typeof prototype[" + typeof a + "] != 'object'");
        var d = function () {
        };
        d.prototype = a, c = new d, c.__proto__ = a
      }
      return typeof b != "undefined" && Object.defineProperties && Object.defineProperties(c, b), c
    };
    c.inherits = function (a, b) {
      a.super_ = b, a.prototype = o(b.prototype, {
        constructor: {
          value: a,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })
    }
  }), a.define("events", function (a, b, c, d, e) {
    process.EventEmitter || (process.EventEmitter = function () {
    });
    var f = c.EventEmitter = process.EventEmitter,
      g = typeof Array.isArray == "function" ? Array.isArray : function (a) {
        return Object.prototype.toString.call(a) === "[object Array]"
      }, h = 10;
    f.prototype.setMaxListeners = function (a) {
      this._events || (this._events = {}), this._events.maxListeners = a
    }, f.prototype.emit = function (a) {
      if (a === "error") if (!this._events || !this._events.error || g(this._events.error) && !this._events.error.length) throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event.");
      if (!this._events) return !1;
      var b = this._events[a];
      if (!b) return !1;
      if (typeof b == "function") {
        switch (arguments.length) {
          case 1:
            b.call(this);
            break;
          case 2:
            b.call(this, arguments[1]);
            break;
          case 3:
            b.call(this, arguments[1], arguments[2]);
            break;
          default:
            var c = Array.prototype.slice.call(arguments, 1);
            b.apply(this, c)
        }
        return !0
      }
      if (g(b)) {
        var c = Array.prototype.slice.call(arguments, 1), d = b.slice();
        for (var e = 0, f = d.length; e < f; e++) d[e].apply(this, c);
        return !0
      }
      return !1
    }, f.prototype.addListener = function (a, b) {
      if ("function" != typeof b) throw new Error("addListener only takes instances of Function");
      this._events || (this._events = {}), this.emit("newListener", a, b);
      if (!this._events[a]) this._events[a] = b; else if (g(this._events[a])) {
        if (!this._events[a].warned) {
          var c;
          this._events.maxListeners !== undefined ? c = this._events.maxListeners : c = h, c && c > 0 && this._events[a].length > c && (this._events[a].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[a].length), console.trace())
        }
        this._events[a].push(b)
      } else this._events[a] = [this._events[a], b];
      return this
    }, f.prototype.on = f.prototype.addListener, f.prototype.once = function (a, b) {
      var c = this;
      return c.on(a, function d() {
        c.removeListener(a, d), b.apply(this, arguments)
      }), this
    }, f.prototype.removeListener = function (a, b) {
      if ("function" != typeof b) throw new Error("removeListener only takes instances of Function");
      if (!this._events || !this._events[a]) return this;
      var c = this._events[a];
      if (g(c)) {
        var d = c.indexOf(b);
        if (d < 0) return this;
        c.splice(d, 1), c.length == 0 && delete this._events[a]
      } else this._events[a] === b && delete this._events[a];
      return this
    }, f.prototype.removeAllListeners = function (a) {
      return a && this._events && this._events[a] && (this._events[a] = null), this
    }, f.prototype.listeners = function (a) {
      return this._events || (this._events = {}), this._events[a] || (this._events[a] = []), g(this._events[a]) || (this._events[a] = [this._events[a]]), this._events[a]
    }
  }), a.define("buffer", function (a, b, c, d, e) {
    function f(a) {
      this.length = a
    }

    function h(a) {
      return a < 16 ? "0" + a.toString(16) : a.toString(16)
    }

    function i(a) {
      return a = ~~Math.ceil(+a), a < 0 ? 0 : a
    }

    function j(a, b, c) {
      if (!(this instanceof j)) return new j(a, b, c);
      var d;
      if (typeof c == "number") this.length = i(b), this.parent = a, this.offset = c; else {
        switch (d = typeof a) {
          case"number":
            this.length = i(a);
            break;
          case"string":
            this.length = j.byteLength(a, b);
            break;
          case"object":
            this.length = i(a.length);
            break;
          default:
            throw new Error("First argument needs to be a number, array or string.")
        }
        this.length > j.poolSize ? (this.parent = new f(this.length), this.offset = 0) : ((!l || l.length - l.used < this.length) && m(), this.parent = l, this.offset = l.used, l.used += this.length);
        if (k(a)) for (var e = 0; e < this.length; e++) this.parent[e + this.offset] = a[e]; else d == "string" && (this.length = this.write(a, 0, b))
      }
    }

    function k(a) {
      return Array.isArray(a) || j.isBuffer(a) || a && typeof a == "object" && typeof a.length == "number"
    }

    function m() {
      l = new f(j.poolSize), l.used = 0
    }

    function n(a, b, c, d) {
      var e = 0;
      return d || (g.ok(typeof c == "boolean", "missing or invalid endian"), g.ok(b !== undefined && b !== null, "missing offset"), g.ok(b + 1 < a.length, "Trying to read beyond buffer length")), c ? (e = a[b] << 8, e |= a[b + 1]) : (e = a[b], e |= a[b + 1] << 8), e
    }

    function o(a, b, c, d) {
      var e = 0;
      return d || (g.ok(typeof c == "boolean", "missing or invalid endian"), g.ok(b !== undefined && b !== null, "missing offset"), g.ok(b + 3 < a.length, "Trying to read beyond buffer length")), c ? (e = a[b + 1] << 16, e |= a[b + 2] << 8, e |= a[b + 3], e += a[b] << 24 >>> 0) : (e = a[b + 2] << 16, e |= a[b + 1] << 8, e |= a[b], e += a[b + 3] << 24 >>> 0), e
    }

    function p(a, b, c, d) {
      var e, f;
      return d || (g.ok(typeof c == "boolean", "missing or invalid endian"), g.ok(b !== undefined && b !== null, "missing offset"), g.ok(b + 1 < a.length, "Trying to read beyond buffer length")), f = n(a, b, c, d), e = f & 32768, e ? (65535 - f + 1) * -1 : f
    }

    function q(a, b, c, d) {
      var e, f;
      return d || (g.ok(typeof c == "boolean", "missing or invalid endian"), g.ok(b !== undefined && b !== null, "missing offset"), g.ok(b + 3 < a.length, "Trying to read beyond buffer length")), f = o(a, b, c, d), e = f & 2147483648, e ? (4294967295 - f + 1) * -1 : f
    }

    function r(b, c, d, e) {
      return e || (g.ok(typeof d == "boolean", "missing or invalid endian"), g.ok(c + 3 < b.length, "Trying to read beyond buffer length")), a("buffer_ieee754").readIEEE754(b, c, d, 23, 4)
    }

    function s(b, c, d, e) {
      return e || (g.ok(typeof d == "boolean", "missing or invalid endian"), g.ok(c + 7 < b.length, "Trying to read beyond buffer length")), a("buffer_ieee754").readIEEE754(b, c, d, 52, 8)
    }

    function t(a, b) {
      g.ok(typeof a == "number", "cannot write a non-number as a number"), g.ok(a >= 0, "specified a negative value for writing an unsigned value"), g.ok(a <= b, "value is larger than maximum value for type"), g.ok(Math.floor(a) === a, "value has a fractional component")
    }

    function u(a, b, c, d, e) {
      e || (g.ok(b !== undefined && b !== null, "missing value"), g.ok(typeof d == "boolean", "missing or invalid endian"), g.ok(c !== undefined && c !== null, "missing offset"), g.ok(c + 1 < a.length, "trying to write beyond buffer length"), t(b, 65535)), d ? (a[c] = (b & 65280) >>> 8, a[c + 1] = b & 255) : (a[c + 1] = (b & 65280) >>> 8, a[c] = b & 255)
    }

    function v(a, b, c, d, e) {
      e || (g.ok(b !== undefined && b !== null, "missing value"), g.ok(typeof d == "boolean", "missing or invalid endian"), g.ok(c !== undefined && c !== null, "missing offset"), g.ok(c + 3 < a.length, "trying to write beyond buffer length"), t(b, 4294967295)), d ? (a[c] = b >>> 24 & 255, a[c + 1] = b >>> 16 & 255, a[c + 2] = b >>> 8 & 255, a[c + 3] = b & 255) : (a[c + 3] = b >>> 24 & 255, a[c + 2] = b >>> 16 & 255, a[c + 1] = b >>> 8 & 255, a[c] = b & 255)
    }

    function w(a, b, c) {
      g.ok(typeof a == "number", "cannot write a non-number as a number"), g.ok(a <= b, "value larger than maximum allowed value"), g.ok(a >= c, "value smaller than minimum allowed value"), g.ok(Math.floor(a) === a, "value has a fractional component")
    }

    function x(a, b, c) {
      g.ok(typeof a == "number", "cannot write a non-number as a number"), g.ok(a <= b, "value larger than maximum allowed value"), g.ok(a >= c, "value smaller than minimum allowed value")
    }

    function y(a, b, c, d, e) {
      e || (g.ok(b !== undefined && b !== null, "missing value"), g.ok(typeof d == "boolean", "missing or invalid endian"), g.ok(c !== undefined && c !== null, "missing offset"), g.ok(c + 1 < a.length, "Trying to write beyond buffer length"), w(b, 32767, -32768)), b >= 0 ? u(a, b, c, d, e) : u(a, 65535 + b + 1, c, d, e)
    }

    function z(a, b, c, d, e) {
      e || (g.ok(b !== undefined && b !== null, "missing value"), g.ok(typeof d == "boolean", "missing or invalid endian"), g.ok(c !== undefined && c !== null, "missing offset"), g.ok(c + 3 < a.length, "Trying to write beyond buffer length"), w(b, 2147483647, -2147483648)), b >= 0 ? v(a, b, c, d, e) : v(a, 4294967295 + b + 1, c, d, e)
    }

    function A(b, c, d, e, f) {
      f || (g.ok(c !== undefined && c !== null, "missing value"), g.ok(typeof e == "boolean", "missing or invalid endian"), g.ok(d !== undefined && d !== null, "missing offset"), g.ok(d + 3 < b.length, "Trying to write beyond buffer length"), x(c, 3.4028234663852886e+38, -3.4028234663852886e+38)), a("buffer_ieee754").writeIEEE754(b, c, d, e, 23, 4)
    }

    function B(b, c, d, e, f) {
      f || (g.ok(c !== undefined && c !== null, "missing value"), g.ok(typeof e == "boolean", "missing or invalid endian"), g.ok(d !== undefined && d !== null, "missing offset"), g.ok(d + 7 < b.length, "Trying to write beyond buffer length"), x(c, 1.7976931348623157e+308, -1.7976931348623157e+308)), a("buffer_ieee754").writeIEEE754(b, c, d, e, 52, 8)
    }

    var g = a("assert");
    c.INSPECT_MAX_BYTES = 50, f.prototype.inspect = function () {
      var a = [], b = this.length;
      for (var d = 0; d < b; d++) {
        a[d] = h(this[d]);
        if (d == c.INSPECT_MAX_BYTES) {
          a[d + 1] = "...";
          break
        }
      }
      return "<SlowBuffer " + a.join(" ") + ">"
    }, f.prototype.hexSlice = function (a, b) {
      var c = this.length;
      if (!a || a < 0) a = 0;
      if (!b || b < 0 || b > c) b = c;
      var d = "";
      for (var e = a; e < b; e++) d += h(this[e]);
      return d
    }, f.prototype.toString = function (a, b, c) {
      a = String(a || "utf8").toLowerCase(), b = +b || 0, typeof c == "undefined" && (c = this.length);
      if (+c == b) return "";
      switch (a) {
        case"hex":
          return this.hexSlice(b, c);
        case"utf8":
        case"utf-8":
          return this.utf8Slice(b, c);
        case"ascii":
          return this.asciiSlice(b, c);
        case"binary":
          return this.binarySlice(b, c);
        case"base64":
          return this.base64Slice(b, c);
        case"ucs2":
        case"ucs-2":
          return this.ucs2Slice(b, c);
        default:
          throw new Error("Unknown encoding")
      }
    }, f.prototype.hexWrite = function (a, b, c) {
      b = +b || 0;
      var d = this.length - b;
      c ? (c = +c, c > d && (c = d)) : c = d;
      var e = a.length;
      if (e % 2) throw new Error("Invalid hex string");
      c > e / 2 && (c = e / 2);
      for (var g = 0; g < c; g++) {
        var h = parseInt(a.substr(g * 2, 2), 16);
        if (isNaN(h)) throw new Error("Invalid hex string");
        this[b + g] = h
      }
      return f._charsWritten = g * 2, g
    }, f.prototype.write = function (a, b, c, d) {
      if (isFinite(b)) isFinite(c) || (d = c, c = undefined); else {
        var e = d;
        d = b, b = c, c = e
      }
      b = +b || 0;
      var f = this.length - b;
      c ? (c = +c, c > f && (c = f)) : c = f, d = String(d || "utf8").toLowerCase();
      switch (d) {
        case"hex":
          return this.hexWrite(a, b, c);
        case"utf8":
        case"utf-8":
          return this.utf8Write(a, b, c);
        case"ascii":
          return this.asciiWrite(a, b, c);
        case"binary":
          return this.binaryWrite(a, b, c);
        case"base64":
          return this.base64Write(a, b, c);
        case"ucs2":
        case"ucs-2":
          return this.ucs2Write(a, b, c);
        default:
          throw new Error("Unknown encoding")
      }
    }, f.prototype.slice = function (a, b) {
      b === undefined && (b = this.length);
      if (b > this.length) throw new Error("oob");
      if (a > b) throw new Error("oob");
      return new j(this, b - a, +a)
    }, c.SlowBuffer = f, c.Buffer = j, j.poolSize = 8192;
    var l;
    j.isBuffer = function (b) {
      return b instanceof j || b instanceof f
    }, j.prototype.inspect = function () {
      var b = [], d = this.length;
      for (var e = 0; e < d; e++) {
        b[e] = h(this.parent[e + this.offset]);
        if (e == c.INSPECT_MAX_BYTES) {
          b[e + 1] = "...";
          break
        }
      }
      return "<Buffer " + b.join(" ") + ">"
    }, j.prototype.get = function (b) {
      if (b < 0 || b >= this.length) throw new Error("oob");
      return this.parent[this.offset + b]
    }, j.prototype.set = function (b, c) {
      if (b < 0 || b >= this.length) throw new Error("oob");
      return this.parent[this.offset + b] = c
    }, j.prototype.write = function (a, b, c, d) {
      if (isFinite(b)) isFinite(c) || (d = c, c = undefined); else {
        var e = d;
        d = b, b = c, c = e
      }
      b = +b || 0;
      var g = this.length - b;
      c ? (c = +c, c > g && (c = g)) : c = g, d = String(d || "utf8").toLowerCase();
      var h;
      switch (d) {
        case"hex":
          h = this.parent.hexWrite(a, this.offset + b, c);
          break;
        case"utf8":
        case"utf-8":
          h = this.parent.utf8Write(a, this.offset + b, c);
          break;
        case"ascii":
          h = this.parent.asciiWrite(a, this.offset + b, c);
          break;
        case"binary":
          h = this.parent.binaryWrite(a, this.offset + b, c);
          break;
        case"base64":
          h = this.parent.base64Write(a, this.offset + b, c);
          break;
        case"ucs2":
        case"ucs-2":
          h = this.parent.ucs2Write(a, this.offset + b, c);
          break;
        default:
          throw new Error("Unknown encoding")
      }
      return j._charsWritten = f._charsWritten, h
    }, j.prototype.toString = function (a, b, c) {
      a = String(a || "utf8").toLowerCase(), typeof b == "undefined" || b < 0 ? b = 0 : b > this.length && (b = this.length), typeof c == "undefined" || c > this.length ? c = this.length : c < 0 && (c = 0), b += this.offset, c += this.offset;
      switch (a) {
        case"hex":
          return this.parent.hexSlice(b, c);
        case"utf8":
        case"utf-8":
          return this.parent.utf8Slice(b, c);
        case"ascii":
          return this.parent.asciiSlice(b, c);
        case"binary":
          return this.parent.binarySlice(b, c);
        case"base64":
          return this.parent.base64Slice(b, c);
        case"ucs2":
        case"ucs-2":
          return this.parent.ucs2Slice(b, c);
        default:
          throw new Error("Unknown encoding")
      }
    }, j.byteLength = f.byteLength, j.prototype.fill = function (b, c, d) {
      b || (b = 0), c || (c = 0), d || (d = this.length), typeof b == "string" && (b = b.charCodeAt(0));
      if (typeof b != "number" || isNaN(b)) throw new Error("value is not a number");
      if (d < c) throw new Error("end < start");
      if (d === c) return 0;
      if (this.length == 0) return 0;
      if (c < 0 || c >= this.length) throw new Error("start out of bounds");
      if (d < 0 || d > this.length) throw new Error("end out of bounds");
      return this.parent.fill(b, c + this.offset, d + this.offset)
    }, j.prototype.copy = function (a, b, c, d) {
      var e = this;
      c || (c = 0), d || (d = this.length), b || (b = 0);
      if (d < c) throw new Error("sourceEnd < sourceStart");
      if (d === c) return 0;
      if (a.length == 0 || e.length == 0) return 0;
      if (b < 0 || b >= a.length) throw new Error("targetStart out of bounds");
      if (c < 0 || c >= e.length) throw new Error("sourceStart out of bounds");
      if (d < 0 || d > e.length) throw new Error("sourceEnd out of bounds");
      return d > this.length && (d = this.length), a.length - b < d - c && (d = a.length - b + c), this.parent.copy(a.parent, b + a.offset, c + this.offset, d + this.offset)
    }, j.prototype.slice = function (a, b) {
      b === undefined && (b = this.length);
      if (b > this.length) throw new Error("oob");
      if (a > b) throw new Error("oob");
      return new j(this.parent, b - a, +a + this.offset)
    }, j.prototype.utf8Slice = function (a, b) {
      return this.toString("utf8", a, b)
    }, j.prototype.binarySlice = function (a, b) {
      return this.toString("binary", a, b)
    }, j.prototype.asciiSlice = function (a, b) {
      return this.toString("ascii", a, b)
    }, j.prototype.utf8Write = function (a, b) {
      return this.write(a, b, "utf8")
    }, j.prototype.binaryWrite = function (a, b) {
      return this.write(a, b, "binary")
    }, j.prototype.asciiWrite = function (a, b) {
      return this.write(a, b, "ascii")
    }, j.prototype.readUInt8 = function (a, b) {
      var c = this;
      return b || (g.ok(a !== undefined && a !== null, "missing offset"), g.ok(a < c.length, "Trying to read beyond buffer length")), c[a]
    }, j.prototype.readUInt16LE = function (a, b) {
      return n(this, a, !1, b)
    }, j.prototype.readUInt16BE = function (a, b) {
      return n(this, a, !0, b)
    }, j.prototype.readUInt32LE = function (a, b) {
      return o(this, a, !1, b)
    }, j.prototype.readUInt32BE = function (a, b) {
      return o(this, a, !0, b)
    }, j.prototype.readInt8 = function (a, b) {
      var c = this, d;
      return b || (g.ok(a !== undefined && a !== null, "missing offset"), g.ok(a < c.length, "Trying to read beyond buffer length")), d = c[a] & 128, d ? (255 - c[a] + 1) * -1 : c[a]
    }, j.prototype.readInt16LE = function (a, b) {
      return p(this, a, !1, b)
    }, j.prototype.readInt16BE = function (a, b) {
      return p(this, a, !0, b)
    }, j.prototype.readInt32LE = function (a, b) {
      return q(this, a, !1, b)
    }, j.prototype.readInt32BE = function (a, b) {
      return q(this, a, !0, b)
    }, j.prototype.readFloatLE = function (a, b) {
      return r(this, a, !1, b)
    }, j.prototype.readFloatBE = function (a, b) {
      return r(this, a, !0, b)
    }, j.prototype.readDoubleLE = function (a, b) {
      return s(this, a, !1, b)
    }, j.prototype.readDoubleBE = function (a, b) {
      return s(this, a, !0, b)
    }, j.prototype.writeUInt8 = function (a, b, c) {
      var d = this;
      c || (g.ok(a !== undefined && a !== null, "missing value"), g.ok(b !== undefined && b !== null, "missing offset"), g.ok(b < d.length, "trying to write beyond buffer length"), t(a, 255)), d[b] = a
    }, j.prototype.writeUInt16LE = function (a, b, c) {
      u(this, a, b, !1, c)
    }, j.prototype.writeUInt16BE = function (a, b, c) {
      u(this, a, b, !0, c)
    }, j.prototype.writeUInt32LE = function (a, b, c) {
      v(this, a, b, !1, c)
    }, j.prototype.writeUInt32BE = function (a, b, c) {
      v(this, a, b, !0, c)
    }, j.prototype.writeInt8 = function (a, b, c) {
      var d = this;
      c || (g.ok(a !== undefined && a !== null, "missing value"), g.ok(b !== undefined && b !== null, "missing offset"), g.ok(b < d.length, "Trying to write beyond buffer length"), w(a, 127, -128)), a >= 0 ? d.writeUInt8(a, b, c) : d.writeUInt8(255 + a + 1, b, c)
    }, j.prototype.writeInt16LE = function (a, b, c) {
      y(this, a, b, !1, c)
    }, j.prototype.writeInt16BE = function (a, b, c) {
      y(this, a, b, !0, c)
    }, j.prototype.writeInt32LE = function (a, b, c) {
      z(this, a, b, !1, c)
    }, j.prototype.writeInt32BE = function (a, b, c) {
      z(this, a, b, !0, c)
    }, j.prototype.writeFloatLE = function (a, b, c) {
      A(this, a, b, !1, c)
    }, j.prototype.writeFloatBE = function (a, b, c) {
      A(this, a, b, !0, c)
    }, j.prototype.writeDoubleLE = function (a, b, c) {
      B(this, a, b, !1, c)
    }, j.prototype.writeDoubleBE = function (a, b, c) {
      B(this, a, b, !0, c)
    }, f.prototype.readUInt8 = j.prototype.readUInt8, f.prototype.readUInt16LE = j.prototype.readUInt16LE, f.prototype.readUInt16BE = j.prototype.readUInt16BE, f.prototype.readUInt32LE = j.prototype.readUInt32LE, f.prototype.readUInt32BE = j.prototype.readUInt32BE, f.prototype.readInt8 = j.prototype.readInt8, f.prototype.readInt16LE = j.prototype.readInt16LE, f.prototype.readInt16BE = j.prototype.readInt16BE, f.prototype.readInt32LE = j.prototype.readInt32LE, f.prototype.readInt32BE = j.prototype.readInt32BE, f.prototype.readFloatLE = j.prototype.readFloatLE, f.prototype.readFloatBE = j.prototype.readFloatBE, f.prototype.readDoubleLE = j.prototype.readDoubleLE, f.prototype.readDoubleBE = j.prototype.readDoubleBE, f.prototype.writeUInt8 = j.prototype.writeUInt8, f.prototype.writeUInt16LE = j.prototype.writeUInt16LE, f.prototype.writeUInt16BE = j.prototype.writeUInt16BE, f.prototype.writeUInt32LE = j.prototype.writeUInt32LE, f.prototype.writeUInt32BE = j.prototype.writeUInt32BE, f.prototype.writeInt8 = j.prototype.writeInt8, f.prototype.writeInt16LE = j.prototype.writeInt16LE, f.prototype.writeInt16BE = j.prototype.writeInt16BE, f.prototype.writeInt32LE = j.prototype.writeInt32LE, f.prototype.writeInt32BE = j.prototype.writeInt32BE, f.prototype.writeFloatLE = j.prototype.writeFloatLE, f.prototype.writeFloatBE = j.prototype.writeFloatBE, f.prototype.writeDoubleLE = j.prototype.writeDoubleLE, f.prototype.writeDoubleBE = j.prototype.writeDoubleBE
  }), a.define("buffer_ieee754", function (a, b, c, d, e) {
    c.readIEEE754 = function (a, b, c, d, e) {
      var f, g, h = e * 8 - d - 1, i = (1 << h) - 1, j = i >> 1, k = -7, l = c ? 0 : e - 1, m = c ? 1 : -1,
        n = a[b + l];
      l += m, f = n & (1 << -k) - 1, n >>= -k, k += h;
      for (; k > 0; f = f * 256 + a[b + l], l += m, k -= 8) ;
      g = f & (1 << -k) - 1, f >>= -k, k += d;
      for (; k > 0; g = g * 256 + a[b + l], l += m, k -= 8) ;
      if (f === 0) f = 1 - j; else {
        if (f === i) return g ? NaN : (n ? -1 : 1) * Infinity;
        g += Math.pow(2, d), f -= j
      }
      return (n ? -1 : 1) * g * Math.pow(2, f - d)
    }, c.writeIEEE754 = function (a, b, c, d, e, f) {
      var g, h, i, j = f * 8 - e - 1, k = (1 << j) - 1, l = k >> 1,
        m = e === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, n = d ? f - 1 : 0, o = d ? -1 : 1,
        p = b < 0 || b === 0 && 1 / b < 0 ? 1 : 0;
      b = Math.abs(b), isNaN(b) || b === Infinity ? (h = isNaN(b) ? 1 : 0, g = k) : (g = Math.floor(Math.log(b) / Math.LN2), b * (i = Math.pow(2, -g)) < 1 && (g--, i *= 2), g + l >= 1 ? b += m / i : b += m * Math.pow(2, 1 - l), b * i >= 2 && (g++, i /= 2), g + l >= k ? (h = 0, g = k) : g + l >= 1 ? (h = (b * i - 1) * Math.pow(2, e), g += l) : (h = b * Math.pow(2, l - 1) * Math.pow(2, e), g = 0));
      for (; e >= 8; a[c + n] = h & 255, n += o, h /= 256, e -= 8) ;
      g = g << e | h, j += e;
      for (; j > 0; a[c + n] = g & 255, n += o, g /= 256, j -= 8) ;
      a[c + n - o] |= p * 128
    }
  }), a.define("/difflib.js", function (a, b, c, d, e) {
    (function () {
      var b, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x = [].indexOf || function (a) {
        for (var b = 0, c = this.length; b < c; b++) if (b in this && this[b] === a) return b;
        return -1
      };
      j = Math.floor, l = Math.max, m = Math.min, d = a("heap"), h = a("assert"), s = function (a, b) {
        return b ? 2 * a / b : 1
      }, r = function (a, b) {
        var c, d, e, f, g, h;
        g = [a.length, b.length], d = g[0], e = g[1];
        for (c = f = 0, h = m(d, e); 0 <= h ? f < h : f > h; c = 0 <= h ? ++f : --f) {
          if (a[c] < b[c]) return -1;
          if (a[c] > b[c]) return 1
        }
        return d - e
      }, w = function (a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
      }, q = function (a) {
        var b, c, d;
        for (c = 0, d = a.length; c < d; c++) {
          b = a[c];
          if (b) return !0
        }
        return !1
      }, g = function () {
        function a(a, b, c, d) {
          this.isjunk = a, b == null && (b = ""), c == null && (c = ""), this.autojunk = d != null ? d : !0, this.a = this.b = null, this.setSeqs(b, c)
        }

        return a.name = "SequenceMatcher", a.prototype.setSeqs = function (a, b) {
          return this.setSeq1(a), this.setSeq2(b)
        }, a.prototype.setSeq1 = function (a) {
          if (a === this.a) return;
          return this.a = a, this.matchingBlocks = this.opcodes = null
        }, a.prototype.setSeq2 = function (a) {
          if (a === this.b) return;
          return this.b = a, this.matchingBlocks = this.opcodes = null, this.fullbcount = null, this._chainB()
        }, a.prototype._chainB = function () {
          var a, b, c, d, e, f, g, h, i, k, l, m, n, o, p, q;
          a = this.b, this.b2j = b = {};
          for (d = m = 0, o = a.length; m < o; d = ++m) c = a[d], f = w(b, c) ? b[c] : b[c] = [], f.push(d);
          h = {}, g = this.isjunk;
          if (g) {
            q = Object.keys(b);
            for (n = 0, p = q.length; n < p; n++) c = q[n], g(c) && (h[c] = !0, delete b[c])
          }
          l = {}, i = a.length;
          if (this.autojunk && i >= 200) {
            k = j(i / 100) + 1;
            for (c in b) e = b[c], e.length > k && (l[c] = !0, delete b[c])
          }
          return this.isbjunk = function (a) {
            return w(h, a)
          }, this.isbpopular = function (a) {
            return w(l, a)
          }
        }, a.prototype.findLongestMatch = function (a, b, c, d) {
          var e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, x, y, z;
          t = [this.a, this.b, this.b2j, this.isbjunk], e = t[0], f = t[1], g = t[2], l = t[3], u = [a, c, 0], h = u[0], i = u[1], j = u[2], n = {};
          for (k = q = a; a <= b ? q < b : q > b; k = a <= b ? ++q : --q) {
            p = {}, v = w(g, e[k]) ? g[e[k]] : [];
            for (r = 0, s = v.length; r < s; r++) {
              m = v[r];
              if (m < c) continue;
              if (m >= d) break;
              o = p[m] = (n[m - 1] || 0) + 1, o > j && (x = [k - o + 1, m - o + 1, o], h = x[0], i = x[1], j = x[2])
            }
            n = p
          }
          while (h > a && i > c && !l(f[i - 1]) && e[h - 1] === f[i - 1]) y = [h - 1, i - 1, j + 1], h = y[0], i = y[1], j = y[2];
          while (h + j < b && i + j < d && !l(f[i + j]) && e[h + j] === f[i + j]) j++;
          while (h > a && i > c && l(f[i - 1]) && e[h - 1] === f[i - 1]) z = [h - 1, i - 1, j + 1], h = z[0], i = z[1], j = z[2];
          while (h + j < b && i + j < d && l(f[i + j]) && e[h + j] === f[i + j]) j++;
          return [h, i, j]
        }, a.prototype.getMatchingBlocks = function () {
          var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, u, v, w, x, y, z, A;
          if (this.matchingBlocks) return this.matchingBlocks;
          w = [this.a.length, this.b.length], n = w[0], o = w[1], s = [[0, n, 0, o]], p = [];
          while (s.length) x = s.pop(), b = x[0], a = x[1], d = x[2], c = x[3], y = t = this.findLongestMatch(b, a, d, c), e = y[0], h = y[1], k = y[2], k && (p.push(t), b < e && d < h && s.push([b, e, d, h]), e + k < a && h + k < c && s.push([e + k, a, h + k, c]));
          p.sort(r), f = i = l = 0, q = [];
          for (u = 0, v = p.length; u < v; u++) z = p[u], g = z[0], j = z[1], m = z[2], f + l === g && i + l === j ? l += m : (l && q.push([f, i, l]), A = [g, j, m], f = A[0], i = A[1], l = A[2]);
          return l && q.push([f, i, l]), q.push([n, o, 0]), this.matchingBlocks = q
        }, a.prototype.getOpcodes = function () {
          var a, b, c, d, e, f, g, h, i, j, k, l;
          if (this.opcodes) return this.opcodes;
          d = e = 0, this.opcodes = b = [], j = this.getMatchingBlocks();
          for (h = 0, i = j.length; h < i; h++) k = j[h], a = k[0], c = k[1], f = k[2], g = "", d < a && e < c ? g = "replace" : d < a ? g = "delete" : e < c && (g = "insert"), g && b.push([g, d, a, e, c]), l = [a + f, c + f], d = l[0], e = l[1], f && b.push(["equal", a, d, c, e]);
          return b
        }, a.prototype.getGroupedOpcodes = function (a) {
          var b, c, d, e, f, g, h, i, j, k, n, o, p, q, r;
          a == null && (a = 3), b = this.getOpcodes(), b.length || (b = [["equal", 0, 1, 0, 1]]), b[0][0] === "equal" && (o = b[0], j = o[0], e = o[1], f = o[2], g = o[3], h = o[4], b[0] = [j, l(e, f - a), f, l(g, h - a), h]), b[b.length - 1][0] === "equal" && (p = b[b.length - 1], j = p[0], e = p[1], f = p[2], g = p[3], h = p[4], b[b.length - 1] = [j, e, m(f, e + a), g, m(h, g + a)]), i = a + a, d = [], c = [];
          for (k = 0, n = b.length; k < n; k++) q = b[k], j = q[0], e = q[1], f = q[2], g = q[3], h = q[4], j === "equal" && f - e > i && (c.push([j, e, m(f, e + a), g, m(h, g + a)]), d.push(c), c = [], r = [l(e, f - a), l(g, h - a)], e = r[0], g = r[1]), c.push([j, e, f, g, h]);
          return c.length && (c.length !== 1 || c[0][0] !== "equal") && d.push(c), d
        }, a.prototype.ratio = function () {
          var a, b, c, d, e;
          b = 0, e = this.getMatchingBlocks();
          for (c = 0, d = e.length; c < d; c++) a = e[c], b += a[2];
          return s(b, this.a.length + this.b.length)
        }, a.prototype.quickRatio = function () {
          var a, b, c, d, e, f, g, h, i, j, k;
          if (!this.fullbcount) {
            this.fullbcount = c = {}, j = this.b;
            for (f = 0, h = j.length; f < h; f++) b = j[f], c[b] = (c[b] || 0) + 1
          }
          c = this.fullbcount, a = {}, d = 0, k = this.a;
          for (g = 0, i = k.length; g < i; g++) b = k[g], w(a, b) ? e = a[b] : e = c[b] || 0, a[b] = e - 1, e > 0 && d++;
          return s(d, this.a.length + this.b.length)
        }, a.prototype.realQuickRatio = function () {
          var a, b, c;
          return c = [this.a.length, this.b.length], a = c[0], b = c[1], s(m(a, b), a + b)
        }, a
      }(), k = function (a, b, c, e) {
        var f, h, i, j, k, l, m, n, o, p;
        c == null && (c = 3), e == null && (e = .6);
        if (c > 0) {
          if (0 <= e && e <= 1) {
            f = [], h = new g, h.setSeq2(a);
            for (k = 0, m = b.length; k < m; k++) j = b[k], h.setSeq1(j), h.realQuickRatio() >= e && h.quickRatio() >= e && h.ratio() >= e && f.push([h.ratio(), j]);
            f = d.nlargest(f, c, r), p = [];
            for (l = 0, n = f.length; l < n; l++) o = f[l], i = o[0], j = o[1], p.push(j);
            return p
          }
          throw new Error("cutoff must be in [0.0, 1.0]: (" + e + ")")
        }
        throw new Error("n must be > 0: (" + c + ")")
      }, t = function (a, b) {
        var c, d, e;
        e = [0, a.length], c = e[0], d = e[1];
        while (c < d && a[c] === b) c++;
        return c
      }, b = function () {
        function a(a, b) {
          this.linejunk = a, this.charjunk = b
        }

        return a.name = "Differ", a.prototype.compare = function (a, b) {
          var c, d, e, f, h, i, j, k, l, m, n, o, p, q, r;
          h = new g(this.linejunk, a, b), k = [], q = h.getOpcodes();
          for (m = 0, o = q.length; m < o; m++) {
            r = q[m], l = r[0], d = r[1], c = r[2], f = r[3], e = r[4];
            switch (l) {
              case"replace":
                i = this._fancyReplace(a, d, c, b, f, e);
                break;
              case"delete":
                i = this._dump("-", a, d, c);
                break;
              case"insert":
                i = this._dump("+", b, f, e);
                break;
              case"equal":
                i = this._dump(" ", a, d, c);
                break;
              default:
                throw new Error("unknow tag (" + l + ")")
            }
            for (n = 0, p = i.length; n < p; n++) j = i[n], k.push(j)
          }
          return k
        }, a.prototype._dump = function (a, b, c, d) {
          var e, f, g;
          g = [];
          for (e = f = c; c <= d ? f < d : f > d; e = c <= d ? ++f : --f) g.push("" + a + " " + b[e]);
          return g
        }, a.prototype._plainReplace = function (a, b, c, d, e, f) {
          var g, i, j, k, l, m, n, o, p, q;
          h(b < c && e < f), f - e < c - b ? (g = this._dump("+", d, e, f), l = this._dump("-", a, b, c)) : (g = this._dump("-", a, b, c), l = this._dump("+", d, e, f)), k = [], q = [g, l];
          for (m = 0, o = q.length; m < o; m++) {
            i = q[m];
            for (n = 0, p = i.length; n < p; n++) j = i[n], k.push(j)
          }
          return k
        }, a.prototype._fancyReplace = function (a, b, c, d, e, f) {
          var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P,
            Q, R, S, T, U, V, W, X, Y, Z, $, _, ab, bb;
          R = [.74, .75], n = R[0], v = R[1], u = new g(this.charjunk), S = [null, null], w = S[0], x = S[1], D = [];
          for (z = F = e; e <= f ? F < f : F > f; z = e <= f ? ++F : --F) {
            q = d[z], u.setSeq2(q);
            for (y = G = b; b <= c ? G < c : G > c; y = b <= c ? ++G : --G) {
              i = a[y];
              if (i === q) {
                w === null && (W = [y, z], w = W[0], x = W[1]);
                continue
              }
              u.setSeq1(i), u.realQuickRatio() > n && u.quickRatio() > n && u.ratio() > n && (X = [u.ratio(), y, z], n = X[0], o = X[1], p = X[2])
            }
          }
          if (n < v) {
            if (w === null) {
              Y = this._plainReplace(a, b, c, d, e, f);
              for (H = 0, J = Y.length; H < J; H++) C = Y[H], D.push(C);
              return D
            }
            Z = [w, x, 1], o = Z[0], p = Z[1], n = Z[2]
          } else w = null;
          $ = this._fancyHelper(a, b, o, d, e, p);
          for (I = 0, K = $.length; I < K; I++) C = $[I], D.push(C);
          _ = [a[o], d[p]], h = _[0], m = _[1];
          if (w === null) {
            l = t = "", u.setSeqs(h, m), ab = u.getOpcodes();
            for (O = 0, L = ab.length; O < L; O++) {
              bb = ab[O], E = bb[0], j = bb[1], k = bb[2], r = bb[3], s = bb[4], T = [k - j, s - r], A = T[0], B = T[1];
              switch (E) {
                case"replace":
                  l += Array(A + 1).join("^"), t += Array(B + 1).join("^");
                  break;
                case"delete":
                  l += Array(A + 1).join("-");
                  break;
                case"insert":
                  t += Array(B + 1).join("+");
                  break;
                case"equal":
                  l += Array(A + 1).join(" "), t += Array(B + 1).join(" ");
                  break;
                default:
                  throw new Error("unknow tag (" + E + ")")
              }
            }
            U = this._qformat(h, m, l, t);
            for (P = 0, M = U.length; P < M; P++) C = U[P], D.push(C)
          } else D.push("  " + h);
          V = this._fancyHelper(a, o + 1, c, d, p + 1, f);
          for (Q = 0, N = V.length; Q < N; Q++) C = V[Q], D.push(C);
          return D
        }, a.prototype._fancyHelper = function (a, b, c, d, e, f) {
          var g;
          return g = [], b < c ? e < f ? g = this._fancyReplace(a, b, c, d, e, f) : g = this._dump("-", a, b, c) : e < f && (g = this._dump("+", d, e, f)), g
        }, a.prototype._qformat = function (a, b, c, d) {
          var e, f;
          return f = [], e = m(t(a, "	"), t(b, "	")), e = m(e, t(c.slice(0, e), " ")), e = m(e, t(d.slice(0, e), " ")), c = c.slice(e).replace(/\s+$/, ""), d = d.slice(e).replace(/\s+$/, ""), f.push("- " + a), c.length && f.push("? " + Array(e + 1).join("	") + c + "\n"), f.push("+ " + b), d.length && f.push("? " + Array(e + 1).join("	") + d + "\n"), f
        }, a
      }(), f = function (a, b) {
        return b == null && (b = /^\s*#?\s*$/), b.test(a)
      }, e = function (a, b) {
        return b == null && (b = " 	"), x.call(b, a) >= 0
      }, v = function (a, b) {
        var c, d;
        return c = a + 1, d = b - a, d === 1 ? "" + c : (d || c--, "" + c + "," + d)
      }, p = function (a, b, c) {
        var d, e, f, h, i, j, k, l, m, n, o, p, q, r, s, t, u, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O,
          P, Q;
        K = c != null ? c : {}, i = K.fromfile, y = K.tofile, j = K.fromfiledate, z = K.tofiledate, t = K.n, s = K.lineterm, i == null && (i = ""), y == null && (y = ""), j == null && (j = ""), z == null && (z = ""), t == null && (t = 3), s == null && (s = "\n"), r = [], u = !1, L = (new g(null, a, b)).getGroupedOpcodes();
        for (A = 0, E = L.length; A < E; A++) {
          k = L[A], u || (u = !0, h = j ? "	" + j : "", x = z ? "	" + z : "", r.push("--- " + i + h + s), r.push("+++ " + y + x + s)), M = [k[0], k[k.length - 1]], f = M[0], p = M[1], d = v(f[1], p[2]), e = v(f[3], p[4]), r.push("@@ -" + d + " +" + e + " @@" + s);
          for (B = 0, F = k.length; B < F; B++) {
            N = k[B], w = N[0], l = N[1], m = N[2], n = N[3], o = N[4];
            if (w === "equal") {
              O = a.slice(l, m);
              for (C = 0, G = O.length; C < G; C++) q = O[C], r.push(" " + q);
              continue
            }
            if (w === "replace" || w === "delete") {
              P = a.slice(l, m);
              for (D = 0, H = P.length; D < H; D++) q = P[D], r.push("-" + q)
            }
            if (w === "replace" || w === "insert") {
              Q = b.slice(n, o);
              for (J = 0, I = Q.length; J < I; J++) q = Q[J], r.push("+" + q)
            }
          }
        }
        return r
      }, u = function (a, b) {
        var c, d;
        return c = a + 1, d = b - a, d || c--, d <= 1 ? "" + c : "" + c + "," + (c + d - 1)
      }, i = function (a, b, c) {
        var d, e, f, h, i, j, k, l, m, n, o, p, r, s, t, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P,
          Q, R, S, T;
        N = c != null ? c : {}, i = N.fromfile, A = N.tofile, j = N.fromfiledate, B = N.tofiledate, v = N.n, t = N.lineterm, i == null && (i = ""), A == null && (A = ""), j == null && (j = ""), B == null && (B = ""), v == null && (v = 3), t == null && (t = "\n"), w = {
          insert: "+ ",
          "delete": "- ",
          replace: "! ",
          equal: "  "
        }, x = !1, s = [], O = (new g(null, a, b)).getGroupedOpcodes();
        for (D = 0, H = O.length; D < H; D++) {
          k = O[D];
          if (!x) {
            x = !0, h = j ? "	" + j : "", z = B ? "	" + B : "", s.push("*** " + i + h + t), s.push("--- " + A + z + t), P = [k[0], k[k.length - 1]], f = P[0], p = P[1], s.push("***************" + t), d = u(f[1], p[2]), s.push("*** " + d + " ****" + t);
            if (q(function () {
              var a, b, c, d;
              d = [];
              for (a = 0, b = k.length; a < b; a++) c = k[a], y = c[0], C = c[1], C = c[2], C = c[3], C = c[4], d.push(y === "replace" || y === "delete");
              return d
            }())) for (E = 0, I = k.length; E < I; E++) {
              Q = k[E], y = Q[0], l = Q[1], m = Q[2], C = Q[3], C = Q[4];
              if (y !== "insert") {
                R = a.slice(l, m);
                for (F = 0, J = R.length; F < J; F++) r = R[F], s.push(w[y] + r)
              }
            }
            e = u(f[3], p[4]), s.push("--- " + e + " ----" + t);
            if (q(function () {
              var a, b, c, d;
              d = [];
              for (a = 0, b = k.length; a < b; a++) c = k[a], y = c[0], C = c[1], C = c[2], C = c[3], C = c[4], d.push(y === "replace" || y === "insert");
              return d
            }())) for (G = 0, K = k.length; G < K; G++) {
              S = k[G], y = S[0], C = S[1], C = S[2], n = S[3], o = S[4];
              if (y !== "delete") {
                T = b.slice(n, o);
                for (M = 0, L = T.length; M < L; M++) r = T[M], s.push(w[y] + r)
              }
            }
          }
        }
        return s
      }, n = function (a, c, d, f) {
        return f == null && (f = e), (new b(d, f)).compare(a, c)
      }, o = function (a, b) {
        var c, d, e, f, g, h, i;
        f = {1: "- ", 2: "+ "}[b];
        if (!f) throw new Error("unknow delta choice (must be 1 or 2): " + b);
        e = ["  ", f], d = [];
        for (g = 0, h = a.length; g < h; g++) c = a[g], (i = c.slice(0, 2), x.call(e, i) >= 0) && d.push(c.slice(2));
        return d
      }, c._arrayCmp = r, c.SequenceMatcher = g, c.getCloseMatches = k, c._countLeading = t, c.Differ = b, c.IS_LINE_JUNK = f, c.IS_CHARACTER_JUNK = e, c._formatRangeUnified = v, c.unifiedDiff = p, c._formatRangeContext = u, c.contextDiff = i, c.ndiff = n, c.restore = o
    }).call(this)
  }), a("/difflib.js"), a("/difflib")
}()