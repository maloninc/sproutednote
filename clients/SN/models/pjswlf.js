// Pure JavaScript Wiki Like Formatter v0.8.5
// Modified by H.Nakamura(08.06.27)

var pjswlf = {
  reDocLink: /\[\[(.*?)\]\]/g,
  reStrong:  /\'\'\'(.*?)\'\'\'/g,
  reEm:      /\'\'(.*?)\'\'/g,
  reDel:     /\-\-(.*?)\-\-/g,
  reIns:     /\+\+(.*?)\+\+/g,
  //reImg:     /\{\{(.*?)|(\d+?):(\d+?):(.*?)\}\}/g,
  //reAnchor:  /\[\[(.*?)|(.*?)\]\]/g,
  //reUrl:     /([^("])(https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+)([^)"])/g,
  reUrl:    /(https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+)/g,
  reSpChars: /\\(['\\\-+:\[\]{}])/g,

  codeDiv: null,
  tableDiv: null,

  markupCode: function(div,line){
    var node = null;
    if(line.match(/\[code\]/i)){
      node = document.createElement('div');
      node.setAttribute("class", "code");
      this.codeDiv = node;
      div.appendChild(node);
      return true;
    }else if(line.match(/\[\/code\]/i)){
      this.codeDiv = null;
      return true;
    }else if(this.codeDiv){
      var txt = document.createTextNode(line);
      var br = document.createElement('br');
      this.codeDiv.appendChild(txt);
      this.codeDiv.appendChild(br);
      return true;
    }
    return false;
  },
  
  markupTable: function(div, line){
    var node = null;
    if(line.match(/\[table\]/i)){
      node = document.createElement('table');
      node.setAttribute("class", "wiki_table");
      this.tableDiv = node;
      div.appendChild(node);
      return true;
    }else if(line.match(/\[\/table\]/i)){
      this.tableDiv = null;
      return true;
    }else if(this.tableDiv){
      var cols = line.split('|');
      var tr   = document.createElement('tr');
      tr.setAttribute("class", "wiki_tr");
      for(var i = 0; i < cols.length; i++){
        var col = cols[i];
        var td = document.createElement('td');
        td.setAttribute("class", "wiki_td");
        var txt = document.createTextNode(col);
        td.appendChild(txt);
        tr.appendChild(td);
      }
      this.tableDiv.appendChild(tr);
      return true;
    }
    return false;
  },

  doMarkup: function (s) {
    var div   = document.createElement("div");

    var lines = s.replace(/\r\n|\r|\n/g, "\n").split(/\n/);

    for (var i = 0; i < lines.length; i++) {
      var node     = null;
      var line = lines[i];

      if(!this.markupCode(div,line) && !this.markupTable(div,line)){
        node = this.markupInline(this.markupBlock(line))
      }
      if(node)div.appendChild(node);
    }

    return div;
  },

  markupBlock: function (s) {
    var elm, txt;

    if (s.match(/^\n*$/)) {
      elm = document.createElement("br");
    } else if (s.indexOf("****") == 0) {
      elm = document.createElement("h6");
      txt = document.createTextNode(
        s.replace(/^\*\*\*\*\s*/, "")
      );
      elm.appendChild(txt);
    } else if (s.indexOf("***") == 0) {
      elm = document.createElement("h5");
      txt = document.createTextNode(
        s.replace(/^\*\*\*\s*/, "")
      );
      elm.appendChild(txt);
    } else if (s.indexOf("**") == 0) {
      elm = document.createElement("h4");
      txt = document.createTextNode(
        s.replace(/^\*\*\s*/, "")
      );
      elm.appendChild(txt);
    } else if (s.indexOf("*") == 0) {
      elm = document.createElement("h3");
      txt = document.createTextNode(
        s.replace(/^\*\s*/, "")
      );
      elm.appendChild(txt);
    } else if (s.indexOf("----") == 0) {
      elm = document.createElement("hr");
    } else if (s.indexOf(">") == 0) {
      elm = document.createElement("blockquote");

      var aQuotes = s.split(/\n/);

      for (var j = 0; j < aQuotes.length; j++) {
        elm.appendChild(this.doMarkup(aQuotes[j].replace(/^>\s*/gm, "")));
      }
    } else if (s.indexOf("-") == 0) {
      elm = document.createElement("ul");
      var aLi = s.replace(/^\-\s*/gm, "").split(/\n/);

      for (var j = 0; j < aLi.length; j++) {
        var li = document.createElement("li");
        txt = document.createTextNode(aLi[j]);
        li.appendChild(txt);
        elm.appendChild(li);
      }
    } else if (s.indexOf("+") == 0) {
      elm = document.createElement("ul");
      var aLi = s.replace(/^\+\s*/gm, "").split(/\n/);

      for (var j = 0; j < aLi.length; j++) {
        var li  = document.createElement("li");
        var del = document.createElement("del");
        txt = document.createTextNode(aLi[j]);
        li.appendChild(del);
        del.appendChild(txt);
        elm.appendChild(li);
      }
    } else if (s.indexOf(":") == 0) {
      elm = document.createElement("dl");
      var aLi = s.replace(/^\:\s*/gm, "").split(/\n/);

      for (var j = 0; j < aLi.length; j++) {
        if (aLi[j].indexOf(":") != 0) {
          var dt = document.createElement("dt");
          txt = document.createTextNode(aLi[j]);
          dt.appendChild(txt);
          elm.appendChild(dt);
        } else {
          var dd = document.createElement("dd");
          txt = document.createTextNode(aLi[j].replace(/^\:\s*/, ""));
          dd.appendChild(txt);
          elm.appendChild(dd);
        }
      }
    } else {
      elm = document.createElement("p");
      txt = document.createTextNode(s);
      elm.appendChild(txt);
    }

    return elm;
  },

  markupInline: function (elm) {
    if (elm == null) return null;
    if (elm.childNodes.length > 1) {
      for (var i = 0; i < elm.childNodes.length; i++) {
        this.markupInline(elm.childNodes[i]);
      }
    } else {
      elm = this._txt2html(elm);
    }

    return elm;
  },

  _txt2html: function (elm) {
    var s = elm.innerHTML;

    if (s != "") {
      s = s.replace(this.reDocLink, '<span class=doclink onclick="SN.masterController.showDocLink(\'$1\');">$1</span>');
      s = s.replace(this.reStrong,  '<strong>$1</strong>');
      s = s.replace(this.reEm,      '<em>$1</em>');
      s = s.replace(this.reDel,     '<del>$1</del>');
      s = s.replace(this.reIns,     '<ins>$1</ins>');
      //s = s.replace(this.reImg,     '<img src="$4" alt="$1" width="$2" height="$3" />');
      //s = s.replace(this.reAnchor,  '<a href="$2">$1</a>');
      //s = s.replace(this.reUrl,     '$1<a href="$2">$2</a>$3');
      s = s.replace(this.reUrl,    '<a href="$1" target="_blank" title="open with new window">$1</a>');
      s = s.replace(this.reSpChars, '$1');
      elm.innerHTML = s;
    }

    return elm;
  }
};

/* ---------------------------------------------------------------------

Copyright (c) 2002-2005 by Kyo Nagashima <kyo@hail2u.net>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

--------------------------------------------------------------------- */
