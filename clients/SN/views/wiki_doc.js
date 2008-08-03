// ==========================================================================
// SN.WikiDocView
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.View
  @author    AuthorName  
  @version 0.1
*/
SN.WikiDocView = SC.LabelView.extend(
/** @scope SN.WikiDocView.prototype */ {
  
  // TODO: Add your own code here.
  beginEditing: function()
  {
    if (this.get('isEditing')) return YES ;
    if (!this.get('isEditable')) return NO ;

    var value = this.get('value') || '' ;
    var f = this.convertFrameToView(this.get('frame'), null) ;
    var el = this.rootElement;
    SC.InlineTextFieldView.beginEditing({
      frame: f,
      delegate: this,
      exampleElement: el,
      value: value,
      multiline: YES,
      validator: this.get('validator')
    });
  }
}) ;
