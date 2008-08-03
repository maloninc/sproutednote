// ==========================================================================
// SN.Note
// ==========================================================================

require('core');
require('pjswlf');

/** @class
  
  (Document your class here)

  @extends SC.Record
  @author  H.Nakamura <hiroyuki@maloninc.com>
  @version 0.1
*/  
SN.Note= SC.Record.extend(
/** @scope SN.Note.prototype */ {

  dataSource: SN.server,

  properties:['title', 'text','created','modified','uid','docId','isPublic'],

  commitChanges: function(){
    var now = new Date();
    this.set('modified', now.format('yyyy-MM-dd HH:mm:ss'));
    if(this.get('title') == '') this.set('title', 'untitled');
    this.commit();
  },

  wikify: function(){
    return SN.Note.Wikify(this.get("text"));
  }.property("text"),
  
  wikifiedHTML: function(){
    return SN.Note.WikifiedHTML(this.get("text"));
  }.property("text"),

  matchCondition: function(key, value){
    if(key == 'search'){
      try{
        var regex = new RegExp(value, "i");
      }catch(e){
        return false;
      }
      if(this.get('title'))var title_check = this.get('title').match(regex);
      if(this.get('text')) var text_check  = this.get('text').match(regex);

      if(!title_check  && !text_check ) {
        return false; // not found
      }else{
        return true;
      }
    }else if(key == 'notDocId'){
      return this.get('docId') != value;
    }else{
      $super();
    }
  }
}) ;

SN.Note.Verify = function(text){
  if(typeof(text) != 'string') return '';
};

SN.Note.Wikify = function(text){
  if(text == null) return null;
  if(typeof(text) != 'string') return null;
  var div = pjswlf.doMarkup(text);

  return div;
};

SN.Note.WikifiedHTML = function(text){
  var div = SN.Note.Wikify(text);
  if(div == null) return '';

  return div.innerHTML;
};
