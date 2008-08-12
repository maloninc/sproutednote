// ==========================================================================
// Contacts.MasterController
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.CollectionController
  @author  H.Nakamura <hiroyuki@maloninc.com>
  @version 0.1
  @static
*/
SN.masterController = SC.CollectionController.create(
/** @scope SN.masterController */ {
  
  // TODO: Add your own code here.
  allowsEmptySelection: false,

  allowsMultipleSelection: true,

  canEditCollection: true,

  searchWord: '',

  searchButtonDefault: true,
  searchFieldEnabled: true,

  addNote: function(sender){
    var now = new Date();
    var content = this.get('content');
    var note = SN.Note.newRecord({
      title:    'untitled',
      text:     'click the Edit button to edit.',
      created:  now.format('yyyy-MM-dd HH:mm:ss'),
      modified: now.format('yyyy-MM-dd HH:mm:ss'),
      uid:      SN.accountController.get('uid'),
      docId:    '',
      isPublic: 0
    },SN.server);

    note.commitChanges();
    this.set('selection',[note]);
    SN.detailController.showEditor();
  },

  delNote: function(sender){
    if(!confirm('Are you sure?')) return;
    var content = this.get('content');
    var sel = (this.get('selection') || []).clone() ;
    var idx = sel.get('length') ;
    while(--idx >= 0) {
      var note = sel.objectAt(idx);
      note.destroy();
    }
  },

  search: function(){
    this.content.set('conditions', {'search':  this.get('searchWord')});
  },

  showDocLink: function(searchWord){
    this.set('searchWord', searchWord);
    var sel = this.get('selection');
    var docId = sel[0].get('docId');

    this.content.set('conditions', {'notDocId': docId, 'search':  searchWord});
  }
}) ;
