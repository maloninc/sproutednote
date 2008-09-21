// ==========================================================================
// SN.TabView
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.TabView
  @author AuthorName
  @version 0.1
*/
SN.TabView = SC.TabView.extend(
/** @scope SN.TabView.prototype */ {

  // TODO: Add your own code here.
  nowShowingObserver: function() {
    sc_super();
    var nowShowing = this.get('nowShowing');
    if(nowShowing == 'preview'){
      var text = SC.page.get('editorTab').get('editBody').get('value');
      var preview = SC.page.get('previewTab').get('wikiPreview');
      preview.set('value', text)
    }
  }.observes('nowShowing')
}) ;
