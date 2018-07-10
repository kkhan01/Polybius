import chromep from "chrome-promise";
import DownloadItem = chrome.downloads.DownloadItem;


type Rule = any; // TODO


function matches(rule: Rule, item: DownloadItem) {
    if (rule.matcher == "js") {
        return eval(rule.match_param);
    }
    if (rule.matcher == "hostname") {
        const link = document.createElement("a");
        link.href = item.url.toLowerCase();
        const host = (rule.match_param.indexOf(":") < 0) ? link.hostname : link.host;
        return (host.indexOf(rule.match_param.toLowerCase()) ==
            (host.length - rule.match_param.length));
    }
    if (rule.matcher == "default") {
        return item.filename == rule.match_param;
    }
    if (rule.matcher == "url-regex") {
        return (new RegExp(rule.match_param)).test(item.url);
    }
    if (rule.matcher == "default-regex") {
        return (new RegExp(rule.match_param)).test(item.filename);
    }
    return false;
}

console.log(chromep);

const listener = function(item: any, __suggest: any) {
    function suggest(filename: string, conflictAction: string) {
        __suggest({
            filename: filename,
            conflictAction: conflictAction,
        });
        // conflict_action was renamed to conflictAction in
        // https://chromium.googlesource.com/chromium/src/+/f1d784d6938b8fe8e0d257e41b26341992c2552c
        // which was first picked up in branch 1580.
    }
    
    let rules: Rule[] | string = localStorage.rules;
    try {
        rules = JSON.parse(rules as string);
    } catch (e) {
        localStorage.rules = JSON.stringify([]);
    }
    for (let index = 0; index < rules.length; ++index) {
        const rule = rules[index];
        if (rule.enabled && matches(rule, item)) {
            if (rule.action == "overwrite") {
                suggest(item.filename, "overwrite");
            } else if (rule.action == "prompt") {
                suggest(item.filename, "prompt");
            } else if (rule.action == "js") {
                eval(rule.action_js);
            }
            break;
        }
    }
};

chrome.downloads.onDeterminingFilename.addListener(listener);

chrome.downloads.onDeterminingFilename.removeListener(listener);

const Rule: any = function(this: any, data: any) {
    var rules: any = document.getElementById("rule");
    this.node = (document.getElementById("rule-template") as any).cloneNode(true);
    this.node.id = "rule" + (Rule.next_id++);
    this.node.rule = this;
    rules.appendChild(this.node);
    this.node.hidden = false;
    
    if (data) {
        this.getElement("matcher").getter = data.matcher;
        this.getElement("match-param").getter = data.match_param;
        this.getElement("action").getter = data.action;
        this.getElement("action-js").getter = data.action_js;
        this.getElement("enabled").checked = data.enabled;
    }
    
    this.getElement("download-label").htmlFor = this.getElement("enabled").id =
        this.node.id + "-download";
    
    this.render();
    
    this.getElement("matcher").onchange = storeRules;
    this.getElement("match-param").onkeyup = storeRules;
    this.getElement("action").onchange = storeRules;
    this.getElement("action-js").onkeyup = storeRules;
    this.getElement("enabled").onchange = storeRules;
    
    var rule = this;
    this.getElement("move-up").onclick = function() {
        var sib = rule.node.previousSibling;
        rule.node.parentNode.removeChild(rule.node);
        sib.parentNode.insertBefore(rule.node, sib);
        storeRules();
    };
    this.getElement("move-down").onclick = function() {
        var parentNode = rule.node.parentNode;
        var sib = rule.node.nextSibling.nextSibling;
        parentNode.removeChild(rule.node);
        if (sib) {
            parentNode.insertBefore(rule.node, sib);
        } else {
            parentNode.appendChild(rule.node);
        }
        storeRules();
    };
    this.getElement("remove").onclick = function() {
        rule.node.parentNode.removeChild(rule.node);
        storeRules();
    };
    storeRules();
};

Rule.prototype.getElement = function(name: string) {
    return document.querySelector("#" + this.node.id + " ." + name);
};

Rule.prototype.render = function() {
    this.getElement("move-up").disabled = !this.node.previousSibling;
    this.getElement("move-down").disabled = !this.node.nextSibling;
    this.getElement("action-js").style.display =
        (this.getElement("action").value == "js") ? "block" : "none";
};

Rule.next_id = 0;

function loadRules() {
    var rules = localStorage.rules;
    try {
        JSON.parse(rules).forEach(function(rule: any) {
            new Rule(rule);
        });
    } catch (e) {
        localStorage.rules = JSON.stringify([]);
    }
}

function storeRules() {
    const rules = document.getElementById("rule");
    if (rules) {
        localStorage.rules = JSON.stringify(Array.prototype.slice.apply(
            rules.childNodes).map(function(node: any) {
            node.rule.render();
            return {
                matcher: node.rule.getElement("matcher").value,
                match_param: node.rule.getElement("match-param").value,
                action: node.rule.getElement("action").value,
                action_js: node.rule.getElement("action-js").value,
                enabled: node.rule.getElement("enabled").checked
            };
        }));
    }
}

window.onload = function() {
    loadRules();
    const addRule = document.getElementById("newObject");
    if (addRule) {
        addRule.onclick = function() {
            new Rule();
        };
    }
};

export const loadExample = () => undefined;