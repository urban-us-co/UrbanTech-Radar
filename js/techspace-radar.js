function loadData() {
    var e = ["B2C", "B2G", "B2B"];
    d3.csv("data/radar.csv", function(t) {
        t = _.each(t, function(e) {
            e.Orbit = e.Orbit.split(", ").join(" "), e["Challenge Area"] = e["Challenge Area"].split("|"), e["Business Model"] = e["Business Model"].split("|"), e["Channel"] = e["Business Model"], e.Industry = e.Industry.replace("| ", "|").trim().split("|"), keywords = keywords.concat(e.Industry), tags = tags.concat(e.Industry), keywords.push(e["Company Name"].trim()), Array.prototype.push.apply(keywords,e["Investors"].split("|")), e.Industry = e.Industry.join(" ")
        }), featuredCompanies = _.filter(t, function(e) {
            var t = !1;
            //for (var n = 0; n < featuredCompanies.length; n++) 
            //    e["Company Name"].toLowerCase() === featuredCompanies[n].toLowerCase() && (t = !0);
            //console.log((e["Total Funding"] > 60000000) && (t = !0));
            //(e["Total Funding"] > 31000000) && (t = !0);
            (e["Featured"] == 1) && (t = !0);
            return t; 
        }), keywords = _.uniq(keywords), tags = _.uniq(tags), keywords = _.filter(keywords, function(e) {
            return e !== ""
        }), keywords = _.map(keywords, function(e) {
            return e.trim()
        }), tags = _.filter(tags, function(e) {
            return e !== ""
        }), tags = _.map(tags, function(e) {
            return e.trim()
        }), keywords = _.uniq(keywords), tags = _.uniq(_.map(tags, function(s){ return _.isString(s) ? s.toLowerCase() : s; })), initTypeAhead(), initTags();

        for (var n = 0; n < e.length; n++) {
            var r = {
                name: e[n],
                data: []
            };
            r.data = r.data.concat(_.filter(t, function(t) {
                return t["Business Model"][0].indexOf(e[n]) > -1
            })), problemareas.push(r)
        }
        problemareas = _.map(problemareas, function(e) {
            return e.data.sort(function(e, t) {
                if (e["Business Model"].length > 1) {
                    //if(e["Business Model"].indexOf("B2C") > -1 ){
                      //  e["Business Model"] = ["B2C"];
                        //return 0;
                        /*var ind = e["Business Model"].indexOf("B2C");
                        e["Business Model"].splice(ind, 1);
                        e["Business Model"].unshift("B2C");*/
                    //}
                    if (e["Business Model"][0] === "B2C" && e["Business Model"][1] === "B2B") return -1;
                    if (e["Business Model"][0] === "B2C" && e["Business Model"][1] === "B2G") return 1;
                    if (e["Business Model"][0] === "B2G" && e["Business Model"][1] === "B2C") return -1;
                    if (e["Business Model"][0] === "B2G" && e["Business Model"][1] === "B2B") return 1;
                    if (e["Business Model"][0] === "B2B" && e["Business Model"][1] === "B2G") return -1;
                    if (e["Business Model"][0] === "B2B" && e["Business Model"][1] === "B2C") return 1;
                }
                return 0
            }), e
        }), drawCircles(), drawCompanies(problemareas, 1)
    })
}

function drawCircles() {
    var e = ["B2C", "B2G", "B2B"],
        t = [{
            name: "core",
            arc: d3.svg.arc().outerRadius(100).innerRadius(0),
            radius: 100
        }, {
            name: "assurance",
            arc: d3.svg.arc().outerRadius(200).innerRadius(0),
            radius: 200
        }, {
            name: "safety",
            arc: d3.svg.arc().outerRadius(240).innerRadius(0),
            radius: 240
        }, {
            name: "outline",
            arc: d3.svg.arc().outerRadius(250).innerRadius(0)
        }],
        n = d3.select(".graph").select("svg").attr("width", 500).attr("height", 530).attr("viewBox", "0 0 500 530").append("g").attr("transform", "translate(250,250)"),
        r = 2 * Math.PI,
        i = 0,
        s, o;
    for (s = t.length - 1; s >= 0; s--) {
        if (s === t.length - 2)
            for (o = 0; o < 3; o++) n.append("path").attr("class", "line white").attr("d", function() {
                var e = 250 * Math.cos(i + o * r / 3 - r / 4),
                    t = 250 * Math.sin(i + o * r / 3 - r / 4);
                return "M0 0L" + e + " " + t
            }), n.append("text").attr("class", function() {
                return "label " + e[o]
            }).attr("transform", function(e) {
                var t = 270 * Math.cos(i + o * r / 3 - r / 4 + r / 6) - 10,
                    n = 270 * Math.sin(i + o * r / 3 - r / 4 + r / 6);
                return "translate(" + t + ", " + n + ")"
            }).text(function() {
                return e[o]
            });
        if (s === t.length - 1)
            for (o = 0; o < 3; o++) n.append("path").attr("data-orbit", t[s].name).attr("data-problemarea", problemareas[o].name).attr("d", function() {
                return t[s].arc.startAngle(i + o * r / 3).endAngle(i + (o + 1) * r / 3)()
            });
        else {
            for (o = 0; o < 3; o++) n.append("path").attr("data-orbit", t[s].name).attr("data-problemarea", problemareas[s].name).attr("d", function() {
                return t[s].arc.startAngle(i + o * r / 3).endAngle(i + (o + 1) * r / 3)()
            });
            n.append("circle").attr("class", "with-shadow").attr("data-orbit", t[s].name).attr("data-problemarea", problemareas[s].name).style("fill", function() {
                return "url(#" + t[s].name + "gradient)"
            }).attr("cx", 0).attr("cy", 0).attr("r", function() {
                return t[s].radius
            })
        }
    }
    var u = 0;
    for (o = 0; o < 250; o += 5) o > t[u].radius && u++, t[u].radius && o <= t[u].radius && n.append("circle").attr("class", "texture").attr("data-orbit", t[u].name).attr("data-problemarea", problemareas[u].name).attr("cx", 0).attr("cy", 0).attr("r", function() {
        return o
    });
    for (s = 0; s < 3; s++) n.append("path").attr("class", "line").attr("d", function() {
        var e = 250 * Math.cos(i + s * r / 3 - r / 4),
            t = 250 * Math.sin(i + s * r / 3 - r / 4);
        return "M0 0L" + e + " " + t
    });
    n.append("circle").attr("class", "center").attr("cx", 0).attr("cy", 0).attr("r", 3)
}

function drawCompanies(e, showFeatured) {
    function n(e, t) {
        var n, r = 0,
            i = 2 * Math.PI,
            s, o, u, a;
        switch (e.Orbit.split(" ")[0]) {
            case "Core":
                n = 10, offset = 80, o = 7;
                break;
            case "Assurance":
                n = 110, offset = 80, o = 7;
                break;
            case "Safety":
                n = 210, offset = 20, o = 3
        }
        switch (t.name) {
            case "B2B":
                a = _.find(problemareas, function(e) {
                    return e.name == "B2B"
                }), r = 2;
                break;
            case "B2G":
                a = _.find(problemareas, function(e) {
                    return e.name == "B2G"
                }), r = 1;
                break;
            case "B2C":
                a = _.find(problemareas, function(e) {
                    return e.name == "B2C"
                }), r = 0
        }
        u = a.data.length, s = _.indexOf(a.data, e), offset = offset / 2 + offset * Math.sin(i / o * s) / 2;
        var f = (n + offset) * Math.cos(r * i / 3 + i * s / (3 * u) - i / 4),
            l = (n + offset) * Math.sin(r * i / 3 + i * s / (3 * u) - i / 4);
        return {
            x: f,
            y: l
        }
    }
    var t = d3.select(".graph svg").selectAll(".problemarea").data(e);
    t.each(function(e) {
        var t = d3.select(this).selectAll(".company").data(e.data, function(e) {
            return e["Company Name"]
        });
        t.attr("transform", "translate(250,250)").attr("cx", function(t, r) {
            return n(t, e).x
        }).attr("cy", function(t, r) {
            return n(t, e).y
        }).attr("r", 2.5).attr("data-company", function(e) {
            return e["Company Name"].toLowerCase()
        }).attr("data-tags", function(e) {
            return e.Industry.toLowerCase()
        }).attr("data-problemarea", function(e) {
            return e["Business Model"]
        }), t.enter().append("circle").attr("class", "company").attr("transform", "translate(250,250)").attr("cx", function(t, r) {
            return n(t, e).x
        }).attr("cy", function(t, r) {
            return n(t, e).y
        }).attr("r", 2.5).attr("data-company", function(e) {
            return e["Company Name"].toLowerCase()
        }).attr("data-tags", function(e) {
            return e.Industry.toLowerCase()
        }).attr("data-problemarea", function(e) {
            return e["Business Model"]
        }).style("opacity", 0).transition().style("opacity", 1), t.exit().transition().style("opacity", 0).remove()
    }), t.enter().append("g").attr("class", "problemarea").attr("data-problemarea", function(e) {
        return e.name
    }).each(function(e) {
        var t = d3.select(this).selectAll(".company").data(e.data, function(e) {
            return e["Company Name"]
        });
        t.attr("transform", "translate(250,250)").attr("cx", function(t, r) {
            return n(t, e).x
        }).attr("cy", function(t, r) {
            return n(t, e).y
        }).attr("r", 2.5).attr("data-company", function(e) {
            return e["Company Name"].toLowerCase()
        }).attr("data-tags", function(e) {
            return e.Industry.toLowerCase()
        }).attr("data-problemarea", function(e) {
            return e["Business Model"]
        }), t.enter().append("circle").attr("class", "company").attr("transform", "translate(250,250)").attr("cx", function(t, r) {
            return n(t, e).x
        }).attr("cy", function(t, r) {
            return n(t, e).y
        }).attr("r", 2.5).attr("data-company", function(e) {
            return e["Company Name"].toLowerCase()
        }).attr("data-tags", function(e) {
            return e.Industry.toLowerCase()
        }).attr("data-problemarea", function(e) {
            return e["Business Model"]
        }).style("opacity", 0).transition().style("opacity", 1), t.exit().transition().style("opacity", 0).remove()
    });
    
    if(showFeatured){
        var r = d3.select(".graph").selectAll(".featured").data(featuredCompanies);
        r.style("display","block");
        r.style("top", function(e) {
            var t = $('.company[data-company="' + e["Company Name"].toLowerCase() + '"]');
            if (t.length > 0) {
                var n = t[0].getBoundingClientRect();
                return n.top + window.scrollY + n.height / 2 + "px"
            }
            return $(this).css("top")
        }).style("left", function(e) {
            var t = $('.company[data-company="' + e["Company Name"].toLowerCase() + '"]');
            if (t.length > 0) {
                var n = $('.company[data-company="' + e["Company Name"].toLowerCase() + '"]')[0].getBoundingClientRect();
                return n.left + window.scrollX + n.width / 2 + "px"
            }
            return $(this).css("left")
        }).style("background-image", function(e) {
            return "url(https://logo.clearbit.com/" + e.Website.split("//")[1] + ")"
        }), r.enter().append("div").attr("class", "featured").style("top", function(e) {
            var t = $('.company[data-company="' + e["Company Name"].toLowerCase() + '"]')[0].getBoundingClientRect();
            return t.top + window.scrollY + t.height / 2 + "px"
        }).style("left", function(e) {
            var t = $('.company[data-company="' + e["Company Name"].toLowerCase() + '"]')[0].getBoundingClientRect();
            return t.left + window.scrollX + t.width / 2 + "px"
        }).style("background-image", function(e) {
            return "url(https://logo.clearbit.com/" + e.Website.split("//")[1] + ")"
        })
    } else {
        var r = d3.select(".graph").selectAll(".featured").data(featuredCompanies);
        r.style("display","none");
    }
}

function initTypeAhead() {
    $("input.search").typeahead({
        hint: !0,
        highlight: !0,
        minLength: 1
    }, {
        name: "keywords",
        displayKey: "value",
        source: substringMatcher(keywords)
    })
}

function initTags() {
    var e = d3.select(".keywords").selectAll(".keyword").data(tags);
    e.enter().append("span").attr("class", "keyword").text(function(e) {
        return e
    })
}

function showCompanyInfo(e, t, n) {
    var r = $(".company.dialog"),
        i, s = $('.graph .with-shadow[data-orbit="assurance"]')[0].getBoundingClientRect();
    e.Image = "http://www.google.com/s2/favicons?domain=" + e.Website;
    console.log(e.Image);
    if(e.Image === ""){
        e.Image = "https://logo.clearbit.com/" + e.Website.split("//")[1];
    }
    console.log(e.Image);
    r.find(".name").html(e["Company Name"]), r.find(".description").html(e["Description"]), 
    r.find(".link").attr("href", e.Website).attr("alt", e["Company Name"]), e.Image.trim() != "" ? (r.addClass("has-image"), r.find(".logo").css("background-image", "url(" + e.Image + ")")) : r.removeClass("has-image"), i = r[0].getBoundingClientRect(), t.top + window.scrollY > s.top + window.scrollY + s.height / 2 ? (r.addClass("bottom").removeClass("top"), 
    r.css({
        top: n.pageY - i.height - 15 + "px",
        left: n.pageX + -i.width / 2 + "px"
    })) : (r.css({
        top: n.pageY + 20 + "px",
        left: n.pageX - i.width / 2 + "px"
    }), r.addClass("top").removeClass("bottom")), r.addClass("active");

    r.find(".investors").html("");
    if(e["Investors"].split("|").length >= 1){
        if(e["Investors"].split("|")[0] !== ""){
            var investors = jQuery.unique(e["Investors"].split("|"));
            r.find(".investors").html("<strong>Investors :</strong> "+investors.join(", ")+"");
        } 
        
    }
    r.find(".funding").html("");
    if(e["Stage"].length >= 1){
        r.find(".funding").html("<strong>Funding Stage :</strong> "+e["Stage"] + ""); 
    }    
    if(e["Channel"].length >= 1){
        r.find(".channel").html("<strong>Distribution Channel :</strong> "+e["Channel"].join(", ") + ""); 
    }
    r.find(".orbits").html("");
    console.log("e[Challenge Area].length",e["Challenge Area"].length)
    if(e["Challenge Area"].length >= 1){
        r.find(".orbits").html("<strong>Urban Impact :</strong> "+e["Challenge Area"].join(", ") + ""); 
    }    
}

function hideCompanyInfo() {
    $(".company.dialog").removeClass("active")
}

function searchByKeywords(e) {
    if (e) {
        var t = _.map(problemareas, function(t) {
            var n = {};
            return n.name = t.name, n.data = [], _.each(t.data, function(t) {
                var r = t.Industry.toLowerCase(),
                    i = t["Company Name"].toLowerCase(),
                    v = t["Investors"].toLowerCase();
                for (var s = 0; s < e.length; s++) {
                    var o = e[s].toLowerCase();
                    console.log(o, v, v.indexOf(o));
                    if (r.indexOf(o) > -1 || i.indexOf(o) > -1 || v.indexOf(o) > -1) {
                        n.data.push(t);
                        break
                    }
                }
            }), n
        });
        drawCompanies(t)
    }
}

function filterCompanies() {
    var e = $("button[data-orbit].active"),
        t = $("button[data-problemarea].active"),
        n = $(".search.tt-input").val().toLowerCase();
    n = n == "" ? null : n, n && ga("send", "pageview", "search/" + n);
    var r = _.map(problemareas, function(r) {
        var i = {};
        return i.name = r.name, i.data = _.filter(r.data, function(r) {
            var i = r["Business Model"].join(" ").toLowerCase(),
                s = r.Orbit.toLowerCase(),
                o = r.Industry.toLowerCase(),
                u = r["Company Name"].toLowerCase(),
                v = r.["Investors"].toLowerCase(),
                a;
            if (o.indexOf(n) > -1 || u.indexOf(n) > -1) return !0;
            if (n) return !1;
            for (a = 0; a < e.length; a++)
                if (s.indexOf($(e[a]).attr("data-orbit").toLowerCase()) > -1) return !0;
            for (a = 0; a < t.length; a++)
                if (i.indexOf($(t[a]).attr("data-problemarea").toLowerCase()) > -1) return !0;
            return !1
        }), i
    });
    drawCompanies(r)
}
var problemareas = [],
    keywords = [],
    tags = [],
    featuredCompanies = ["Architizer", "Dropcam", "FirstFuel Software", "Lyft", "Nest Labs", "OpenGov", "Opower", "Skycatch", "Uber", "Waze Mobile Ltd."],
    substringMatcher = function(e) {
        return function(n, r) {
            var i, s;
            i = [], s = new RegExp(n, "i"), $.each(e, function(e, t) {
                s.test(t) && i.push({
                    value: t
                })
            }), r(i)
        }
    };
$(document).ready(function() {
    loadData(), $("button.clear").on("click", function() {
        $("button.active").removeClass("active"), $(".keyword.active").removeClass("active"), $(".search").val(""), drawCompanies(problemareas,1)
    }), $(".search").on("typeahead:selected keydown", _.debounce(function(e) {
        $("button.active").removeClass("active"), $(".keyword.active").removeClass("active"), filterCompanies()
    }, 500)), $(".show-all-keywords").on("click", function() {
        var e = $(".keywords");
        e.toggleClass("show-all"), e.is(".show-all") ? $(this).html("Show fewer tags") : $(this).html("Show more tags")
    }), $(".hide-instructions").on("click", function() {
        var e = $(".instructions");
        e.toggleClass("collapsed"), e.is(".collapsed") ? $(this).html("Show Instructions") : $(this).html("Hide Instructions")
    }), $("body").on("click", ".keyword", function() {
        $(this).toggleClass("active"), $("button.active").removeClass("active");
        var e = [];
        $(".keyword.active").each(function() {
            e.push($(this).html())
        }), ga("send", "pageview", "tag/" + e[e.length - 1]), searchByKeywords(e)
    }), $(".dialog").on("click", "a", function() {
        ga("send", "pageview", "outbound/" + $(this).attr("href"))
    }), $(".graph").on("click mouseenter touchstart", "circle.company, .featured", function(e) {
        e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), showCompanyInfo(d3.select(this).datum(), this.getBoundingClientRect(), e)
    }), $("body").on("click", "*:not(.circle.company)", function() {
        hideCompanyInfo()
    })
})
