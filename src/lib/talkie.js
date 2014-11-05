(function() {Talkie = {
    version: "1.0.4"
};

var warn = Talkie.warn = function() {
    if (console && console.log) {
        if (console.log.apply) {
            console.log.apply(console, arguments);
        } else {
            console.log(Array.prototype.slice.call(arguments, 0));
        }
    }
};

Talkie.extend = function(d) {
    for (var k in d) {
        if (d.hasOwnProperty(k)) {
            if (Talkie.hasOwnProperty(k)) {
                warn("Refusing to override Talkie." + k);
                continue;
            }
            Talkie[k] = d[k];
        }
    }
};

Talkie.element = function(element_or_selector) {
    if (typeof element_or_selector === "string") {
        return document.querySelector(element_or_selector);
    }
    return element_or_selector;
};

Talkie.getStyle = function(element, style) {
    if (element.currentStyle) return element.currentStyle[style];
    return document.defaultView.getComputedStyle(element, null).getPropertyValue(style);
};

Talkie.preventDefault = function(e) {
    if (window.event && event.preventDefault) {
        event.preventDefault();
    } else if (e.preventDefault) {
        e.preventDefault();
    } else {
        event.returnValue = false;
    }
};

function _addEventListener(element, event_name, event_handler) {
    if (element.addEventListener) element.addEventListener(event_name, event_handler, false); else if (element.attachEvent) element.attachEvent("on" + event_name, event_handler); else element["on" + event_handler] = event_handler;
}

Talkie.addEventListener = function(selector_or_element, event_name, event_handler) {
    if (typeof selector_or_element === "string") {
        var elements = document.querySelectorAll(selector_or_element);
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            _addEventListener(element, event_name, event_handler);
        }
    } else {
        _addEventListener(selector_or_element, event_name, event_handler);
    }
};

Talkie.fireEvent = function(event_type, element, attributes) {
    var event;
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(event_type, true, true);
    } else if (document.createEventObject) {
        event = document.createEventObject();
        event.eventType = event_type;
    }
    if (attributes) {
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                event[attr] = attributes[attr];
            }
        }
    }
    if (element.dispatchEvent) {
        element.dispatchEvent(event);
    } else if (element.fireEvent) {
        element.fireEvent("on" + event.eventType, event);
    }
};

Talkie.ui = {
    version: "1.0"
};

Talkie.ui.playButton = function(element_or_selector, timeline) {
    var element = Talkie.element(element_or_selector);
    var play_button = document.createElement("div");
    play_button.className = "talkie-play-button";
    if (Talkie.getStyle(element, "position") !== "relative") {
        element.style.position = "relative";
    }
    element.appendChild(play_button);
    play_button.style.left = (element.offsetWidth - play_button.offsetWidth) / 2 + "px";
    play_button.style.top = (element.offsetHeight - play_button.offsetHeight) / 2 + "px";
    Talkie.addEventListener(play_button, "click", function() {
        timeline.play();
    });
    timeline.onPlay(function() {
        try {
            element.removeChild(play_button);
        } catch (exception) {}
    });
};

var Talkie_Animate_Slider = function(slider, panel_element_or_selector) {
    var panel_element = Talkie.element(panel_element_or_selector);
    if (!panel_element) return;
    var panel_index = panel_element.getAttribute("data-talkie-panel-index");
    this.animations = [ [ function(timeline) {
        var previously_selected_panel = slider.selected_panel;
        slider._selectPanel(panel_index);
        timeline.setUndo(function() {
            slider._selectPanel(previously_selected_panel);
        });
    } ] ];
};

Talkie_Animate_Slider.prototype = new Talkie_Animate_Base();

var Talkie_Slider = function(element_or_selector) {
    var slider_element = Talkie.element(element_or_selector);
    if (!slider_element.classList) {
        if (!slider_element.className.match(/\btalkie-slider\b/)) {
            slider_element.className += " talkie-slider";
        }
    } else if (!slider_element.classList.contains("talkie-slider")) {
        slider_element.classList.add("talkie-slider");
    }
    this.arrow_prev = slider_element.getElementsByClassName("talkie-slider-arrowprev")[0];
    this.arrow_next = slider_element.getElementsByClassName("talkie-slider-arrownext")[0];
    this.frame = document.createElement("div");
    this.frame.className = "talkie-slider-frame";
    slider_element.appendChild(this.frame);
    this.panels = document.createElement("div");
    this.panels.className = "talkie-slider-panels";
    this.frame.appendChild(this.panels);
    this.panel_elements = slider_element.querySelectorAll(".talkie-slider-panel");
    this.num_panels = this.panel_elements.length;
    for (var i = 0; i < this.panel_elements.length; i++) {
        var panel = this.panel_elements[i];
        this.panels.appendChild(panel);
        panel.style.width = this.frame.offsetWidth + "px";
        panel.setAttribute("data-talkie-panel-index", i);
    }
    if (d3) {
        d3.select(this.panels).selectAll(".talkie-slider-panel").data(d3.range(this.num_panels));
    }
    var nav = slider_element.querySelector(".talkie-slider-nav");
    if (nav) this.navigation(nav);
    this._panelChanged(0);
    var slider = this;
    if (this.arrow_next) {
        slider_element.appendChild(this.arrow_next);
        this.arrow_next.style.top = (slider_element.offsetHeight - this.arrow_next.offsetHeight) / 2 + "px";
        Talkie.addEventListener(this.arrow_next, "click", function(e) {
            Talkie.preventDefault(e);
            slider._selectNextPanel();
        });
    }
    if (this.arrow_prev) {
        slider_element.appendChild(this.arrow_prev);
        this.arrow_prev.style.top = (slider_element.offsetHeight - this.arrow_prev.offsetHeight) / 2 + "px";
        Talkie.addEventListener(this.arrow_prev, "click", function(e) {
            Talkie.preventDefault(e);
            slider._selectPreviousPanel();
        });
    }
};

Talkie_Slider.prototype.navigation = function(element_or_selector) {
    var slider = this;
    var element = Talkie.element(element_or_selector);
    if (d3) {
        var nav = d3.select(element);
        nav.classed("talkie-slider-nav", true);
        nav.selectAll(".talkie-slider-nav-dot").data(d3.range(this.num_panels)).enter().append("div").attr("class", "talkie-slider-nav-dot");
        this.navdots = nav.selectAll(".talkie-slider-nav-dot");
        this.navdots.on("click", function(i) {
            slider._selectPanel(i, true);
            return false;
        });
        this._markSelectedNavDot();
    }
    return this;
};

Talkie_Slider.prototype.panel = function(panel_element_or_selector) {
    return new Talkie_Animate_Slider(this, panel_element_or_selector);
};

Talkie_Slider.prototype.slideTo = function(panel_element_or_selector) {
    this._selectPanelByElement(Talkie.element(panel_element_or_selector));
};

Talkie_Slider.prototype._panelChanged = function(new_panel, explicitly) {
    var previously_selected_panel = this.selected_panel;
    this.selected_panel = new_panel;
    if (d3) {
        d3.select(this.panels).transition().duration(500).style("margin-left", -this.frame.clientWidth * this.selected_panel + "px");
        if (this.arrow_prev) {
            d3.select(this.arrow_prev).transition().duration(500).style("opacity", this.selected_panel == 0 ? 0 : 1);
        }
        if (this.arrow_next) {
            d3.select(this.arrow_next).transition().duration(500).style("opacity", this.selected_panel == this.num_panels - 1 ? 0 : 1);
        }
    } else {
        this.panels.style.marginLeft = -this.frame.clientWidth * this.selected_panel + "px";
        if (this.arrow_prev) {
            if (this.selected_panel == 0) {
                this.arrow_prev.style.opacity = 1;
                this.arrow_prev.style.visibility = "hidden";
            } else this.arrow_prev.style.visibility = "visible";
        }
        if (this.arrow_next) {
            if (this.selected_panel == this.num_panels - 1) this.arrow_next.style.visibility = "hidden"; else this.arrow_next.style.visibility = "visible";
        }
    }
    this._markSelectedNavDot();
    Talkie.fireEvent("Talkie.slider.load", this.panel_elements[this.selected_panel], {
        explicitly: explicitly,
        fromPanel: this.panel_elements[previously_selected_panel],
        toPanel: this.panel_elements[this.selected_panel],
        slider: this
    });
};

Talkie_Slider.prototype._markSelectedNavDot = function() {
    if (this.navdots) {
        var slider = this;
        this.navdots.classed("talkie-slider-nav-dot-selected", function(d, i) {
            return i == slider.selected_panel;
        });
    }
};

Talkie_Slider.prototype._selectPanel = function(i, explicitly) {
    this._panelChanged(i, explicitly);
};

Talkie_Slider.prototype._selectPanelByElement = function(element) {
    if (!element) return;
    this._panelChanged(element.getAttribute("data-talkie-panel-index"));
};

Talkie_Slider.prototype._selectNextPanel = function() {
    if (this.selected_panel == this.num_panels - 1) return;
    this._panelChanged(this.selected_panel + 1, true);
};

Talkie_Slider.prototype._selectPreviousPanel = function() {
    if (this.selected_panel == 0) return;
    this._panelChanged(this.selected_panel - 1, true);
};

Talkie.slider = function(element_or_selector) {
    return new Talkie_Slider(element_or_selector);
};

var makePathAbsolute = function(path) {
    if (path.getAttribute("data-talkie-madeAbsolute")) return;
    path.setAttribute("data-talkie-madeAbsolute", true);
    var x0, y0, x1, y1, x2, y2, segs = path.pathSegList;
    for (var x = 0, y = 0, i = 0, len = segs.numberOfItems; i < len; ++i) {
        var seg = segs.getItem(i), c = seg.pathSegTypeAsLetter;
        if (/[MLHVCSQTA]/.test(c)) {
            if ("x" in seg) x = seg.x;
            if ("y" in seg) y = seg.y;
        } else {
            if ("x1" in seg) x1 = x + seg.x1;
            if ("x2" in seg) x2 = x + seg.x2;
            if ("y1" in seg) y1 = y + seg.y1;
            if ("y2" in seg) y2 = y + seg.y2;
            if ("x" in seg) x += seg.x;
            if ("y" in seg) y += seg.y;
            switch (c) {
              case "m":
                segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
                break;

              case "l":
                segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
                break;

              case "h":
                segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
                break;

              case "v":
                segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
                break;

              case "c":
                segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
                break;

              case "s":
                segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
                break;

              case "q":
                segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
                break;

              case "t":
                segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
                break;

              case "a":
                segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
                break;

              case "z":
              case "Z":
                x = x0;
                y = y0;
                break;
            }
        }
        if (c == "M" || c == "m") x0 = x, y0 = y;
    }
};

var normaliseElement = function(element) {
    if (element.empty()) return;
    var node = element.node();
    if (node.nodeName === "path") makePathAbsolute(node);
};

function Talkie_Animate_Base() {
    this.animations = [];
}

Talkie_Animate_Base.prototype.clone = function() {
    var r = new Talkie_Animate_Base();
    r.animations = this.animations.slice(0);
    return r;
};

Talkie_Animate_Base.prototype.pushAnimation = function(f, args) {
    var r = this.clone();
    r.animations.push([ f, args ]);
    return r;
};

Talkie_Animate_Base.prototype.and = function(chained_animation) {
    function runAnimation(timeline, chained_animation) {
        if (typeof chained_animation === "function") {
            chained_animation.call(timeline);
        } else {
            chained_animation.run(timeline);
        }
    }
    return this.pushAnimation(runAnimation, chained_animation);
};

Talkie_Animate_Base.prototype.run = function(timeline) {
    if (!timeline) timeline = {
        setUndo: function() {}
    };
    for (var i = 0; i < this.animations.length; i++) {
        var animation = this.animations[i], method = animation[0], args = animation[1];
        method.call(this, timeline, args);
    }
};

function startTransition(element, timeline, duration, easing) {
    if (typeof duration === "undefined") duration = 0;
    cancelTransition(element);
    var k = element.node().__kiln_transitions__;
    var t = element.transition().duration(Talkie.fast_forward ? 0 : duration);
    if (easing) t.ease(easing);
    return {
        attr: function(name, value) {
            k.push([ "attr", name, value ]);
            t.attr(name, value);
        },
        style: function(name, value) {
            k.push([ "style", name, value ]);
            t.style(name, value);
        },
        text: function(value) {
            k.push([ "text", value ]);
            t.text(value);
        },
        attrInterpolateString: function(name, start_value, end_value) {
            k.push([ "attr", name, end_value ]);
            t.attrTween(name, function() {
                return d3.interpolateString(start_value, end_value);
            });
        }
    };
}

function cancelTransition(element) {
    element.transition().duration(0);
    var node = element.node();
    var k = node.__kiln_transitions__;
    if (k) {
        for (var i = 0; i < k.length; i++) {
            var x = k[i], f = x[0], name = x[1], value = x[2];
            element[f](name, value);
        }
        k.length = 0;
    } else {
        node.__kiln_transitions__ = [];
    }
}

function Talkie_Animate(root_element) {
    if (typeof root_element === "undefined") root_element = document;
    this._root = d3.select(root_element);
}

Talkie.animate = function(root_element) {
    return new Talkie_Animate(root_element);
};

var animation_methods = [];

Talkie_Animate.prototype._element = function(selector) {
    if (selector instanceof window.Element) return d3.select(selector);
    var element = this._root.select(selector);
    if (element.empty()) {
        Talkie.warn("Selector does not match anything: " + selector + " in " + this._root);
    }
    return element;
};

Talkie_Animate.prototype.raw = function() {
    return this._root;
};

animation_methods.push("text");

Talkie_Animate.prototype.text = function(element, timeline, to_text, duration, easing) {
    var t = startTransition(element, timeline, duration, easing);
    var from_text = element.text();
    t.text(to_text);
    timeline.setUndo(function() {
        cancelTransition(element);
        element.text(from_text);
    });
    return this;
};

animation_methods.push("attr");

Talkie_Animate.prototype.attr = function(element, timeline, attribute, to_value, duration, easing) {
    var t = startTransition(element, timeline, duration, easing);
    var from_value = element.attr(attribute);
    t.attr(attribute, to_value);
    timeline.setUndo(function() {
        cancelTransition(element);
        element.attr(attribute, from_value);
    });
    return this;
};

animation_methods.push("morphTo");

var morphAttributes = {
    circle: [ "cx", "cy", "r" ],
    path: [ "d" ],
    line: [ "x1", "y1", "x2", "y2" ]
};

Talkie_Animate.prototype.morphTo = function(element, timeline, target_selector, duration, easing) {
    normaliseElement(element);
    var target = this._element(target_selector);
    if (target.empty()) return;
    normaliseElement(target);
    var t = startTransition(element, timeline, duration, easing);
    var from_values = [];
    var attributes = morphAttributes[target.node().nodeName];
    if (!attributes) {
        Talkie.warn("Talkie doesn’t know how to morph a " + target.node().nodeName + " element");
        return;
    }
    for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];
        from_values.push(element.attr(attribute));
        t.attr(attribute, target.attr(attribute));
    }
    timeline.setUndo(function() {
        cancelTransition(element);
        for (var i = 0; i < attributes.length; i++) {
            element.attr(attributes[i], from_values[i]);
        }
    });
    return this;
};

Talkie_Animate.prototype._style_single = function(element, timeline, style, to_value, duration, easing) {
    var t = startTransition(element, timeline, duration, easing);
    var from_value = element.style(style);
    t.style(style, to_value);
    timeline.setUndo(function() {
        cancelTransition(element);
        element.style(style, from_value);
    });
    return this;
};

Talkie_Animate.prototype._style_multi = function(element, timeline, style_changes, duration, easing) {
    var t = startTransition(element, timeline, duration, easing);
    var from_values = {};
    for (var style in style_changes) {
        if (!style_changes.hasOwnProperty(style)) continue;
        from_values[style] = element.style(style);
        t.style(style, style_changes[style]);
    }
    timeline.setUndo(function() {
        cancelTransition(element);
        for (var style in style_changes) {
            if (!style_changes.hasOwnProperty(style)) continue;
            element.style(style, from_values[style]);
        }
    });
    return this;
};

animation_methods.push("style");

Talkie_Animate.prototype.style = function(element, timeline, discriminator) {
    if (typeof discriminator === "string") {
        return this._style_single.apply(this, arguments);
    } else {
        return this._style_multi.apply(this, arguments);
    }
};

Talkie_Animate.prototype.select = function(selector) {
    var element = this._element(selector);
    return new Talkie_Animate_Element(this, element);
};

function Talkie_Animate_Element(animate, element) {
    this.animate = animate;
    this.element = element;
}

Talkie_Animate_Element.prototype = new Talkie_Animate_Base();

Talkie_Animate_Element.prototype.clone = function() {
    var r = new Talkie_Animate_Element(this.animate, this.element);
    r.animations = this.animations.slice(0);
    return r;
};

for (var i = 0; i < animation_methods.length; i++) {
    (function(method) {
        Talkie_Animate_Element.prototype[method] = function() {
            if (this.element.empty()) return this;
            return this.pushAnimation(function(timeline, args) {
                this.animate[method].apply(this.animate, [ this.element, timeline ].concat(args));
            }, Array.prototype.slice.call(arguments, 0));
        };
    })(animation_methods[i]);
}

function _t(timecode) {
    if (typeof timecode === "string") {
        var m = timecode.match(/^(\d+):(\d+(?:\.\d+)?)$/);
        if (m) {
            return parseInt(m[1]) * 60 + parseFloat(m[2]);
        }
    }
    return parseFloat(timecode);
}

function run(animation, timeline_object) {
    if (typeof animation === "function") {
        animation.call(timeline_object);
    } else if (Object.prototype.toString.call(animation) === "[object Array]") {
        for (var i = 0; i < animation.length; i++) {
            run(animation[i], timeline_object);
        }
    } else {
        animation.run(timeline_object);
    }
}

function order_timeline(timeline_object) {
    var timecode_strings = Object.keys(timeline_object);
    var timecodes = timecode_strings.map(_t);
    var a = {};
    for (var i = 0; i < timecodes.length; i++) {
        a[timecodes[i]] = timeline_object[timecode_strings[i]];
    }
    timecodes.sort(function(a, b) {
        return a - b;
    });
    var track_animations = [];
    for (var i = 0; i < timecodes.length; i++) {
        var t = timecodes[i];
        track_animations.push([ t, a[t] ]);
    }
    return track_animations;
}

Talkie.timeline = function(soundtrack_element, timeline_spec) {
    soundtrack_element = Talkie.element(soundtrack_element);
    var animation_undo_stack = [], animation_current_index = -1;
    var timecode;
    var skip_the_next_timeUpdate = false;
    var timeline_object = {
        rewind: function() {
            if (soundtrack_element.readyState >= 1) {
                animation_undo_stack = [];
                animation_current_index = -1;
                soundtrack_element.pause();
                soundtrack_element.currentTime = 0;
            }
        },
        setUndo: function(undo_function) {
            if (this.undoing) {
                Talkie.warn("Ignoring setUndo: we are already undoing");
                return;
            }
            animation_undo_stack.push([ timecode, undo_function, animation_current_index ]);
        },
        undoInteraction: function(undo_function) {
            if (this.undoing) {
                Talkie.warn("Ignoring undoInteraction: we are already undoing");
                return;
            }
            animation_undo_stack.push([ Infinity, undo_function, animation_current_index ]);
        },
        play: function() {
            soundtrack_element.play();
        },
        pause: function() {
            soundtrack_element.pause();
            skip_the_next_timeUpdate = true;
        },
        onPlay: function(event_handler) {
            soundtrack_element.addEventListener("play", event_handler, false);
        }
    };
    var track_animations = order_timeline(timeline_spec);
    soundtrack_element.addEventListener("timeupdate", function() {
        if (skip_the_next_timeUpdate) {
            skip_the_next_timeUpdate = false;
            return;
        }
        timeline_object.undoing = true;
        while (animation_undo_stack.length > 0 && animation_undo_stack[animation_undo_stack.length - 1][0] > this.currentTime) {
            var stack_top = animation_undo_stack.pop();
            stack_top[1].call(timeline_object);
            animation_current_index = stack_top[2];
        }
        timeline_object.undoing = false;
        for (var i = animation_current_index + 1; i < track_animations.length && track_animations[i][0] <= this.currentTime; i++) {
            timeline_object.fast_forward = i + 1 < track_animations.length && track_animations[i + 1][0] <= this.currentTime;
            timecode = track_animations[i][0];
            run(track_animations[i][1], timeline_object);
            animation_current_index = i;
        }
    }, false);
    return timeline_object;
};

if (window.jQuery) {
    var special_commands = {
        animate: function($el) {
            var el = $el.get(0);
            return Talkie.animate(el.ownerDocument).select(el);
        }
    };
    var commands = {
        timeline: function(element, timeline) {
            var t = Talkie.timeline(element, timeline);
            jQuery(element).data("_talkie_timeline", t);
        }
    };
    jQuery.fn.talkie = function(command) {
        var other_params = Array.prototype.slice.call(arguments, 1);
        var f = special_commands[command];
        if (f) {
            return f.apply(window, [ this ].concat(other_params));
        }
        f = commands[command];
        if (typeof f === "undefined") {
            Talkie.warn("No such command: " + command);
            return this;
        }
        return this.each(function() {
            f.apply(window, [ this ].concat(other_params));
        });
    };
}
})();
