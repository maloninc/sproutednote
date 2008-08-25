// ==========================================================================
// Contacts.DetailController
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.Object
  @author  H.Nakamura <hiroyuki@maloninc.com>
  @version 0.1
  @static
*/
SN.detailController = SC.ObjectController.create(
/** @scope SN.detailController */ {
  
  // TODO: Add your own code here.
  contentBinding: 'SN.masterController.selection',
  
  commitChangesImmediately: false,

  showEditor: function(sourceView, evt){
    /* disconnect binding temporaryly to prevent from real time wiki rendaring */
    var bindings = SC.page.get('workspace').get('detailView').get('wikiView').get('bindings');
    bindings.invoke('disconnect');

    SC.page.get('editTabs').popup(sourceView, evt) ;
    SN.masterController.set('searchButtonDefault', false);
    SN.masterController.set('searchFieldEnabled', false);
    SC.page.get('editorTab').get('title').rootElement.select();
  },

  hideEditor: function(sourceView, evt){
    SC.page.get('editTabs').set('isVisible',NO);
    SN.masterController.set('searchButtonDefault', true);
    SN.masterController.set('searchFieldEnabled', true);
    SC.page.get('header').get('searchWord').rootElement.select();

    /* connect binding again */
    var bindings = SC.page.get('workspace').get('detailView').get('wikiView').get('bindings');
    bindings.invoke('connect');
  },

  saveAndHideEditor: function(){
    this.hideEditor();
    this.commitChanges();
  },

  cancelAndHideEditor: function(){
    this.discardChanges();
    this.hideEditor();
  }
}) ;
