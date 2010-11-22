/* Built from X 4.21 by XAG 1.0. 12Feb10 00:42 UT */
xLibrary = {
    version: "4.21",
    license: "GNU LGPL",
    url: "http://cross-browser.com/"
};

function xEvent(evt) {
    var e = evt || window.event;
    if (!e) {
        return
    }
    this.type = e.type;
    this.target = e.target || e.srcElement;
    this.relatedTarget = e.relatedTarget;
/*@cc_on if (e.type == 'mouseover') this.relatedTarget = e.fromElement;
  else if (e.type == 'mouseout') this.relatedTarget = e.toElement; @*/
    if (xDef(e.pageX)) {
        this.pageX = e.pageX;
        this.pageY = e.pageY
    } else {
        if (xDef(e.clientX)) {
            this.pageX = e.clientX + xScrollLeft();
            this.pageY = e.clientY + xScrollTop()
        }
    }
    if (xDef(e.offsetX)) {
        this.offsetX = e.offsetX;
        this.offsetY = e.offsetY
    } else {
        if (xDef(e.layerX)) {
            this.offsetX = e.layerX;
            this.offsetY = e.layerY
        } else {
            this.offsetX = this.pageX - xPageX(this.target);
            this.offsetY = this.pageY - xPageY(this.target)
        }
    }
    this.keyCode = e.keyCode || e.which || 0;
    this.shiftKey = e.shiftKey;
    this.ctrlKey = e.ctrlKey;
    this.altKey = e.altKey;
    if (typeof e.type == "string") {
        if (e.type.indexOf("click") != -1) {
            this.button = 0
        } else {
            if (e.type.indexOf("mouse") != -1) {
                this.button = e.button;
/*@cc_on if (e.button & 1) this.button = 0;
      else if (e.button & 4) this.button = 1;
      else if (e.button & 2) this.button = 2; @*/
            }
        }
    }
}
function xAddEventListener(d, c, b, a) {
    if (!(d = xGetElementById(d))) {
        return
    }
    c = c.toLowerCase();
    if (d.addEventListener) {
        d.addEventListener(c, b, a || false)
    } else {
        if (d.attachEvent) {
            d.attachEvent("on" + c, b)
        } else {
            var f = d["on" + c];
            d["on" + c] = typeof f == "function" ?
            function (e) {
                f(e);
                b(e)
            } : b
        }
    }
}
function xCamelize(d) {
    var e, g, b, f;
    b = d.split("-");
    f = b[0];
    for (e = 1; e < b.length; ++e) {
        g = b[e].charAt(0);
        f += b[e].replace(g, g.toUpperCase())
    }
    return f
}
function xClientHeight() {
    var b = 0,
        c = document,
        a = window;
    if ((!c.compatMode || c.compatMode == "CSS1Compat") && c.documentElement && c.documentElement.clientHeight) {
        b = c.documentElement.clientHeight
    } else {
        if (c.body && c.body.clientHeight) {
            b = c.body.clientHeight
        } else {
            if (xDef(a.innerWidth, a.innerHeight, c.width)) {
                b = a.innerHeight;
                if (c.width > a.innerWidth) {
                    b -= 16
                }
            }
        }
    }
    return b
}
function xClientWidth() {
    var b = 0,
        c = document,
        a = window;
    if ((!c.compatMode || c.compatMode == "CSS1Compat") && !a.opera && c.documentElement && c.documentElement.clientWidth) {
        b = c.documentElement.clientWidth
    } else {
        if (c.body && c.body.clientWidth) {
            b = c.body.clientWidth
        } else {
            if (xDef(a.innerWidth, a.innerHeight, c.height)) {
                b = a.innerWidth;
                if (c.height > a.innerHeight) {
                    b -= 16
                }
            }
        }
    }
    return b
}
function xDef() {
    for (var a = 0; a < arguments.length; ++a) {
        if (typeof(arguments[a]) == "undefined") {
            return false
        }
    }
    return true
}
function xEachE() {
    var c, b = arguments,
        d = b.length - 1;
    for (c = 0; c < d; ++c) {
        b[d](xGetElementById(b[c]), c)
    }
}
function xEachN(g, a, h, b) {
    var c = xGetElementById(g + a);
    while (c) {
        b(c, a, h);
        c = xGetElementById(g + (++a))
    }
}
function xGetComputedStyle(g, f, c) {
    if (!(g = xGetElementById(g))) {
        return null
    }
    var d, a = "undefined",
        b = document.defaultView;
    if (b && b.getComputedStyle) {
        d = b.getComputedStyle(g, "");
        if (d) {
            a = d.getPropertyValue(f)
        }
    } else {
        if (g.currentStyle) {
            a = g.currentStyle[xCamelize(f)]
        } else {
            return null
        }
    }
    return c ? (parseInt(a) || 0) : a
}
function xGetElementById(a) {
    if (typeof(a) == "string") {
        if (document.getElementById) {
            a = document.getElementById(a)
        } else {
            if (document.all) {
                a = document.all[a]
            } else {
                a = null
            }
        }
    }
    return a
}
function xGetElementsByClassName(l, k, b, h) {
    var g = [],
        d, j, a;
    d = new RegExp("(^|\\s)" + l + "(\\s|$)");
    j = xGetElementsByTagName(b, k);
    for (a = 0; a < j.length; ++a) {
        if (d.test(j[a].className)) {
            g[g.length] = j[a];
            if (h) {
                h(j[a])
            }
        }
    }
    return g
}
function xGetElementsByTagName(a, c) {
    var b = null;
    a = a || "*";
    c = xGetElementById(c) || document;
    if (typeof c.getElementsByTagName != "undefined") {
        b = c.getElementsByTagName(a);
        if (a == "*" && (!b || !b.length)) {
            b = c.all
        }
    } else {
        if (a == "*") {
            b = c.all
        } else {
            if (c.all && c.all.tags) {
                b = c.all.tags(a)
            }
        }
    }
    return b || []
}
function xHasPoint(f, i, g, j, a, h, d) {
    if (!xNum(j)) {
        j = a = h = d = 0
    } else {
        if (!xNum(a)) {
            a = h = d = j
        } else {
            if (!xNum(h)) {
                d = a;
                h = j
            }
        }
    }
    var c = xPageX(f),
        k = xPageY(f);
    return (i >= c + d && i <= c + xWidth(f) - a && g >= k + j && g <= k + xHeight(f) - h)
}
function xHeight(i, f) {
    var d, g = 0,
        c = 0,
        b = 0,
        j = 0,
        a;
    if (!(i = xGetElementById(i))) {
        return 0
    }
    if (xNum(f)) {
        if (f < 0) {
            f = 0
        } else {
            f = Math.round(f)
        }
    } else {
        f = -1
    }
    d = xDef(i.style);
    if (i == document || i.tagName.toLowerCase() == "html" || i.tagName.toLowerCase() == "body") {
        f = xClientHeight()
    } else {
        if (d && xDef(i.offsetHeight) && xStr(i.style.height)) {
            if (f >= 0) {
                if (document.compatMode == "CSS1Compat") {
                    a = xGetComputedStyle;
                    g = a(i, "padding-top", 1);
                    if (g !== null) {
                        c = a(i, "padding-bottom", 1);
                        b = a(i, "border-top-width", 1);
                        j = a(i, "border-bottom-width", 1)
                    } else {
                        if (xDef(i.offsetHeight, i.style.height)) {
                            i.style.height = f + "px";
                            g = i.offsetHeight - f
                        }
                    }
                }
                f -= (g + c + b + j);
                if (isNaN(f) || f < 0) {
                    return
                } else {
                    i.style.height = f + "px"
                }
            }
            f = i.offsetHeight
        } else {
            if (d && xDef(i.style.pixelHeight)) {
                if (f >= 0) {
                    i.style.pixelHeight = f
                }
                f = i.style.pixelHeight
            }
        }
    }
    return f
}
function xLeft(c, a) {
    if (!(c = xGetElementById(c))) {
        return 0
    }
    var b = xDef(c.style);
    if (b && xStr(c.style.left)) {
        if (xNum(a)) {
            c.style.left = a + "px"
        } else {
            a = parseInt(c.style.left);
            if (isNaN(a)) {
                a = xGetComputedStyle(c, "left", 1)
            }
            if (isNaN(a)) {
                a = 0
            }
        }
    } else {
        if (b && xDef(c.style.pixelLeft)) {
            if (xNum(a)) {
                c.style.pixelLeft = a
            } else {
                a = c.style.pixelLeft
            }
        }
    }
    return a
}
function xMoveTo(b, a, c) {
    xLeft(b, a);
    xTop(b, c)
}
function xNum() {
    for (var a = 0; a < arguments.length; ++a) {
        if (isNaN(arguments[a]) || typeof(arguments[a]) != "number") {
            return false
        }
    }
    return true
}
function xOffset(d, a) {
    var b = {
        x: 0,
        y: 0
    };
    d = xGetElementById(d);
    a = xGetElementById(a);
    while (d && d != a) {
        b.x += d.offsetLeft;
        b.y += d.offsetTop;
        d = d.offsetParent
    }
    return b
}
function xOpacity(a, b) {
    var c = xDef(b);
    if (!(a = xGetElementById(a))) {
        return 2
    }
    if (xStr(a.style.opacity)) {
        if (c) {
            a.style.opacity = b + ""
        } else {
            b = parseFloat(a.style.opacity)
        }
    } else {
        if (xStr(a.style.filter)) {
            if (c) {
                a.style.filter = "alpha(opacity=" + (100 * b) + ")"
            } else {
                if (a.filters && a.filters.alpha) {
                    b = a.filters.alpha.opacity / 100
                }
            }
        } else {
            if (xStr(a.style.MozOpacity)) {
                if (c) {
                    a.style.MozOpacity = b + ""
                } else {
                    b = parseFloat(a.style.MozOpacity)
                }
            } else {
                if (xStr(a.style.KhtmlOpacity)) {
                    if (c) {
                        a.style.KhtmlOpacity = b + ""
                    } else {
                        b = parseFloat(a.style.KhtmlOpacity)
                    }
                }
            }
        }
    }
    return isNaN(b) ? 1 : b
}
function xPageX(b) {
    var a = 0;
    b = xGetElementById(b);
    while (b) {
        if (xDef(b.offsetLeft)) {
            a += b.offsetLeft
        }
        b = xDef(b.offsetParent) ? b.offsetParent : null
    }
    return a
}
function xPageY(a) {
    var b = 0;
    a = xGetElementById(a);
    while (a) {
        if (xDef(a.offsetTop)) {
            b += a.offsetTop
        }
        a = xDef(a.offsetParent) ? a.offsetParent : null
    }
    return b
}
function xPreventDefault(a) {
    if (a && a.preventDefault) {
        a.preventDefault()
    } else {
        if (window.event) {
            window.event.returnValue = false
        }
    }
}
function xRemoveEventListener(d, c, b, a) {
    if (!(d = xGetElementById(d))) {
        return
    }
    c = c.toLowerCase();
    if (d.removeEventListener) {
        d.removeEventListener(c, b, a || false)
    } else {
        if (d.detachEvent) {
            d.detachEvent("on" + c, b)
        } else {
            d["on" + c] = null
        }
    }
}
function xResizeTo(c, a, b) {
    return {
        w: xWidth(c, a),
        h: xHeight(c, b)
    }
}
function xScrollLeft(c, b) {
    var a, d = 0;
    if (!xDef(c) || b || c == document || c.tagName.toLowerCase() == "html" || c.tagName.toLowerCase() == "body") {
        a = window;
        if (b && c) {
            a = c
        }
        if (a.document.documentElement && a.document.documentElement.scrollLeft) {
            d = a.document.documentElement.scrollLeft
        } else {
            if (a.document.body && xDef(a.document.body.scrollLeft)) {
                d = a.document.body.scrollLeft
            }
        }
    } else {
        c = xGetElementById(c);
        if (c && xNum(c.scrollLeft)) {
            d = c.scrollLeft
        }
    }
    return d
}
function xScrollTop(c, b) {
    var a, d = 0;
    if (!xDef(c) || b || c == document || c.tagName.toLowerCase() == "html" || c.tagName.toLowerCase() == "body") {
        a = window;
        if (b && c) {
            a = c
        }
        if (a.document.documentElement && a.document.documentElement.scrollTop) {
            d = a.document.documentElement.scrollTop
        } else {
            if (a.document.body && xDef(a.document.body.scrollTop)) {
                d = a.document.body.scrollTop
            }
        }
    } else {
        c = xGetElementById(c);
        if (c && xNum(c.scrollTop)) {
            d = c.scrollTop
        }
    }
    return d
}
function xStopPropagation(a) {
    if (a && a.stopPropagation) {
        a.stopPropagation()
    } else {
        if (window.event) {
            window.event.cancelBubble = true
        }
    }
}
function xStr(b) {
    for (var a = 0; a < arguments.length; ++a) {
        if (typeof(arguments[a]) != "string") {
            return false
        }
    }
    return true
}
function xStyle(c, a) {
    var b, f;
    for (b = 2; b < arguments.length; ++b) {
        f = xGetElementById(arguments[b]);
        if (f.style) {
            try {
                f.style[c] = a
            } catch (d) {
                f.style[c] = ""
            }
        }
    }
}
function xTop(b, c) {
    if (!(b = xGetElementById(b))) {
        return 0
    }
    var a = xDef(b.style);
    if (a && xStr(b.style.top)) {
        if (xNum(c)) {
            b.style.top = c + "px"
        } else {
            c = parseInt(b.style.top);
            if (isNaN(c)) {
                c = xGetComputedStyle(b, "top", 1)
            }
            if (isNaN(c)) {
                c = 0
            }
        }
    } else {
        if (a && xDef(b.style.pixelTop)) {
            if (xNum(c)) {
                b.style.pixelTop = c
            } else {
                c = b.style.pixelTop
            }
        }
    }
    return c
}
function xWidth(g, b) {
    var d, f = 0,
        i = 0,
        h = 0,
        c = 0,
        a;
    if (!(g = xGetElementById(g))) {
        return 0
    }
    if (xNum(b)) {
        if (b < 0) {
            b = 0
        } else {
            b = Math.round(b)
        }
    } else {
        b = -1
    }
    d = xDef(g.style);
    if (g == document || g.tagName.toLowerCase() == "html" || g.tagName.toLowerCase() == "body") {
        b = xClientWidth()
    } else {
        if (d && xDef(g.offsetWidth) && xStr(g.style.width)) {
            if (b >= 0) {
                if (document.compatMode == "CSS1Compat") {
                    a = xGetComputedStyle;
                    f = a(g, "padding-left", 1);
                    if (f !== null) {
                        i = a(g, "padding-right", 1);
                        h = a(g, "border-left-width", 1);
                        c = a(g, "border-right-width", 1)
                    } else {
                        if (xDef(g.offsetWidth, g.style.width)) {
                            g.style.width = b + "px";
                            f = g.offsetWidth - b
                        }
                    }
                }
                b -= (f + i + h + c);
                if (isNaN(b) || b < 0) {
                    return
                } else {
                    g.style.width = b + "px"
                }
            }
            b = g.offsetWidth
        } else {
            if (d && xDef(g.style.pixelWidth)) {
                if (b >= 0) {
                    g.style.pixelWidth = b
                }
                b = g.style.pixelWidth
            }
        }
    }
    return b
};

// xEnableDrag r8, Copyright 2002-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xEnableDrag(id,fS,fD,fE)
{
  var mx = 0, my = 0, el = xGetElementById(id);
  if (el) {
    el.xDragEnabled = true;
    xAddEventListener(el, 'mousedown', dragStart, false);
  }
  // Private Functions
  function dragStart(e)
  {
    if (el.xDragEnabled) {
      var ev = new xEvent(e);
      xPreventDefault(e);
      mx = ev.pageX;
      my = ev.pageY;
      xAddEventListener(document, 'mousemove', drag, false);
      xAddEventListener(document, 'mouseup', dragEnd, false);
      if (fS) {
        fS(el, ev.pageX, ev.pageY, ev);
      }
    }
  }
  function drag(e)
  {
    var ev, dx, dy;
    xPreventDefault(e);
    ev = new xEvent(e);
    dx = ev.pageX - mx;
    dy = ev.pageY - my;
    mx = ev.pageX;
    my = ev.pageY;
    if (fD) {
      fD(el, dx, dy, ev);
    }
    else {
      xMoveTo(el, xLeft(el) + dx, xTop(el) + dy);
    }
  }
  function dragEnd(e)
  {
    var ev = new xEvent(e);
    xPreventDefault(e);
    xRemoveEventListener(document, 'mouseup', dragEnd, false);
    xRemoveEventListener(document, 'mousemove', drag, false);
    if (fE) {
      fE(el, ev.pageX, ev.pageY, ev);
    }
    if (xEnableDrag.drop) {
      xEnableDrag.drop(el, ev);
    }
  }
}

xEnableDrag.drops = []; // static property

// xFirstChild r4, Copyright 2004-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xFirstChild(e,t)
{
  e = xGetElementById(e);
  var c = e ? e.firstChild : null;
  while (c) {
    if (c.nodeType == 1 && (!t || c.nodeName.toLowerCase() == t.toLowerCase())){break;}
    c = c.nextSibling;
  }
  return c;
}

// xNextSib r4, Copyright 2005-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xNextSib(e,t)
{
  e = xGetElementById(e);
  var s = e ? e.nextSibling : null;
  while (s) {
    if (s.nodeType == 1 && (!t || s.nodeName.toLowerCase() == t.toLowerCase())){break;}
    s = s.nextSibling;
  }
  return s;
}

// xSplitter r5, Copyright 2006-2010 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xSplitter(sSplId, uSplX, uSplY, uSplW, uSplH, bHorizontal, uBarW, uBarPos, uBarLimit1, uBarLimit2, bBarEnabled, uSplBorderW, oSplChild1, oSplChild2)
{
  // Private

  var pane1, pane2, splW, splH, splEle, barPos, barLim1, barLim2, barEle, deFn;

  function barOnDrag(ele, dx, dy)
  {
    var bp;
    iFrameVis(false);
    if (bHorizontal) {
        bp = barPos + dx;
        if (bp < barLim1 || bp > splW - barLim2) { return; }
        xWidth(pane1, xWidth(pane1) + dx);
        xLeft(barEle, xLeft(barEle) + dx);
        xWidth(pane2, xWidth(pane2) - dx);
        xLeft(pane2, xLeft(pane2) + dx);
        barPos = bp;
    }
    else {
        bp = barPos + dy;
        if (bp < barLim1 || bp > splH - barLim2) { return; }
        xHeight(pane1, xHeight(pane1) + dy);
        xTop(barEle, xTop(barEle) + dy);
        xHeight(pane2, xHeight(pane2) - dy);
        xTop(pane2, xTop(pane2) + dy);
        barPos = bp;
    }
    if (oSplChild1) { oSplChild1.paint(xWidth(pane1), xHeight(pane1)); }
    if (oSplChild2) { oSplChild2.paint(xWidth(pane2), xHeight(pane2)); }
  }

  function barOnDragEnd(ele)
  {
    iFrameVis(true);
    if (deFn) deFn(splEle, barPos);
  }

  function iFrameVis(show)
  {
    var i;
    i = xFirstChild(pane1, 'iframe');
    if (i) {
      i.style.display = show ? 'block' : 'none';
    }
    i = xFirstChild(pane2, 'iframe');
    if (i) {
      i.style.display = show ? 'block' : 'none';
    }
  }

  // Public

  this.setDragEnd = function(fn) { deFn = fn; };

  this.paint = function(uNewW, uNewH, uNewBarPos, uNewBarLim1, uNewBarLim2) // uNewBarPos and uNewBarLim are optional
  {
    var w1, h1, w2, h2;
    if (uNewW == 0) { return; }
    iFrameVis(false);
    splW = uNewW;
    splH = uNewH;
    barPos = uNewBarPos || barPos;
    barLim1 = uNewBarLim1 || barLim1;
    barLim2 = uNewBarLim2 || barLim2;
    xMoveTo(splEle, uSplX, uSplY);
    xResizeTo(splEle, uNewW, uNewH);
    if (bHorizontal) {
      w1 = barPos;
      h1 = uNewH - 2 * uSplBorderW;
      w2 = uNewW - w1 - uBarW - 2 * uSplBorderW;
      h2 = h1;
      xMoveTo(pane1, 0, 0);
      xResizeTo(pane1, w1, h1);
      xMoveTo(barEle, w1, 0);
      xResizeTo(barEle, uBarW, h1);
      xMoveTo(pane2, w1 + uBarW, 0);
      xResizeTo(pane2, w2, h2);
    }
    else {
      w1 = uNewW - 2 * uSplBorderW;;
      h1 = barPos;
      w2 = w1;
      h2 = uNewH - h1 - uBarW - 2 * uSplBorderW;
      xMoveTo(pane1, 0, 0);
      xResizeTo(pane1, w1, h1);
      xMoveTo(barEle, 0, h1);
      xResizeTo(barEle, w1, uBarW);
      xMoveTo(pane2, 0, h1 + uBarW);
      xResizeTo(pane2, w2, h2);
    }
    if (oSplChild1) {
      pane1.style.overflow = 'hidden';
      oSplChild1.paint(w1, h1);
    }
    if (oSplChild2) {
      pane2.style.overflow = 'hidden';
      oSplChild2.paint(w2, h2);
    }
    iFrameVis(true);
  };

  // Constructor

  splEle = xGetElementById(sSplId); // we assume the splitter has 3 DIV children and in this order:
  pane1 = xFirstChild(splEle, 'DIV');
  pane2 = xNextSib(pane1, 'DIV');
  barEle = xNextSib(pane2, 'DIV');
  //  --- slightly dirty hack
  pane1.style.zIndex = 2;
  pane2.style.zIndex = 2;
  barEle.style.zIndex = 1;
  // ---
  barPos = uBarPos;
  barLim1 = uBarLimit1;
  barLim2 = uBarLimit2;
  this.paint(uSplW, uSplH);
  if (bBarEnabled) {
    xEnableDrag(barEle, null, barOnDrag, barOnDragEnd);
    barEle.style.cursor = bHorizontal ? 'e-resize' : 'n-resize';
  }
  splEle.style.visibility = 'visible';

} // end xSplitter
