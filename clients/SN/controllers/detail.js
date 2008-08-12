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
    SC.page.get('editor').popup(sourceView, evt) ;
    SN.masterController.set('searchButtonDefault', false);
    SN.masterController.set('searchFieldEnabled', false);
    SC.page.get('editor').get('title').rootElement.select();
  },

  hideEditor: function(sourceView, evt){
    SC.page.get('editor').set('isVisible',NO);
    SN.masterController.set('searchButtonDefault', true);
    SN.masterController.set('searchFieldEnabled', true);
    SC.page.get('header').get('searchWord').rootElement.select();
  },

  saveAndHideEditor: function(){
    this.commitChanges();
    this.hideEditor();
  },

  cancelAndHideEditor: function(){
    this.discardChanges();
    this.hideEditor();
  }
}) ;
