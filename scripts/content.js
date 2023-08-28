setInterval(() => {
    exportData()
}, 1000)

$(function() {
    $(".footer").after("<div style=\"height: 500px\"></div>")
})

var prevDataHash = "";

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function cleanUp() {
    [".footer-nav__export"].forEach(function(item) {
        if ($(item).length > 0) {
            $(item).each(function() {
                var url = $(this).attr("href")
                window.URL.revokeObjectURL(url)
            })
            $(item).remove()
        }
    })
}

function exportData() {
    var results = $(".otud-result__match")
    var csv = "name;doNotHarass;phone;address\n";

    if (results.length > 0) {
        results.each(function() {
            var name = $(this).find("span.otud-result__name").text().trim().replaceAll(/[ \n\t]+/g, " ")
            var phone = $(this).find("a.otud-result__phonenumber").text().trim().replaceAll(/[ \n\t]+/g, " ")
            var address = $(this).find("span.otud-result__address").text().trim().replaceAll(/[ \n\t]+/g, " ")
            var doNotHarass = ($(this).find("div.otud-tooltip--sign-paragraph").length > 0) ? "X" : ""


            csv += name +";"+ doNotHarass +";"+ phone +";"+ address + "\n"
        })

        if (prevDataHash == hashCode(csv)) {
            return;
        }

        cleanUp()        

        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        prevDataHash = hashCode(csv)

        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);

        var lastName = $("#otud-search__input-last-name").val()
        var firstName = $("#otud-search__input-first-name").val()
        var city = $("#otud-search__input-settlement").val()

        link.setAttribute("href", url);
        link.setAttribute("download", [lastName, firstName, city].join("+") + ".csv");
        link.setAttribute("data-v-0650cbab", "");
        link.setAttribute("class", "footer-nav__export")
        link.setAttribute("style", "color: green;")
        link.textContent = "Exportálás CSV fájlként"

        
        $(".footer-nav").prepend(link)

    } else {
        cleanUp()
    }

    
    
}
