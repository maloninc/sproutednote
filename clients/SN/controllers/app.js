// ==========================================================================
// SN.AppController
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.Object
  @author AuthorName
  @version 0.1
  @static
*/
SN.appController = SC.Object.create(
/** @scope SN.appController */ {

  isAboutVisible: false,

  showAbout: function(){
    SC.page.get('about').set('isVisible',YES);
  },

  hideAbout: function(){
    SC.page.get('about').set('isVisible',NO);
  }
}) ;
