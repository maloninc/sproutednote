// ==========================================================================
// SN.Server
// ==========================================================================

require('core');

/** @class
  
  (Document your class here)

  @extends SC.Server
  @author    AuthorName  
  @version 0.1
*/  
SN.Server = SC.Server.extend(
/** @scope SN.Server.prototype */ {
  
  // ..........................................
  // REQUEST
  request: function(req){
    if(SN.FIXTURES.length != 0) { /* for TEST login */
      setTimeout(function(){SC.page.get('loading').set('isVisible',NO)}, 1000);
      return;
    }

    var now     = new Date(); 
    var url     = req.url;
    var success = req.success;
    var error   = req.error;
    var fail    = req.fail;
    var obj     = req.obj;
    var params  = req.params;
    var method  = req.method;

    params.method    = method;
    params.gmtoffset = now.getTimezoneOffset();
    var query = $H(params).toQueryString();

    var myAjax = new Ajax.Request(
			url, 
			{
				method: 'post', 
				parameters: query, 
				onComplete: function(orgReq){
                  var res = 'get nothing';
                  try{
                    eval('res = ' + orgReq.responseText);
                  }catch(e){
                    alert('[ERROR] ' + e + "\neval text: " + orgReq.responseText);
                  }

                  if(res.error){
                    error(res);
                  }else{
                    success(res);
                  }
                },
               onFailure: fail
			});
  },

  _requestFail: function(res){
    if(res.msg){
      alert(res.msg);
    }else if(res.responseText){
      alert('[ERROR] ' + res.responseText);
    }
  },
  
  // ..........................................
  // LIST
  listFor: function(opts) {
    params = SN.accountController.get('authParam');
    params.search = '';

    SN.server.request({url:     SN.serverURL,
                       params:  params,
                       method:  'sn_find_docs',
                       success: this._listSuccess.bind(this), 
                       error:   this._requestFail.bind(this),
                       fail:    this._requestFail.bind(this)  
                     });
    SC.page.get('loading').set('isVisible', YES);
  },
  
  _listSuccess: function(res){
    this.refreshRecordsWithData(res.result_list, SN.Note, null, false);
    SC.page.get('loading').set('isVisible',NO);
  },


  // ..........................................
  // CREATE
  createRecords: function(records) {
    if(SN.accountController.get('username') == 'demo') return;
    for(i=0; i < records.length; i++){
      var rec = records[i];
      rec.set('newRecord', false);
      params = SN.accountController.get('authParam');
      params.title = rec.get('title');
      params.text  = rec.get('text');

      SN.server.request({url:     SN.serverURL,
                         params:  params,
                         method:  'sn_add_doc',
                         success: function(res){this._createSuccess(res, rec);}.bind(this),
                         error:   this._requestFail.bind(this),
                         fail:    this._requestFail.bind(this)  
                       });
    }
  },
  
  _createSuccess: function(res, rec){
    rec.docId = res.docId;
  },

  // ..........................................
  // REFRESH
  refreshRecords: function(records) {
    alert('refreshRecords is NOT implemented');
  },

  // ..........................................
  // COMMIT
  commitRecords: function(records) {
    if(SN.accountController.get('username') == 'demo') return;
    for(i=0; i < records.length; i++){
      var rec = records[i];
      rec.set('newRecord', false);
      params = SN.accountController.get('authParam');
      params.docId = rec.get('docId');
      params.title = rec.get('title');
      params.text  = rec.get('text');

      SN.server.request({url:     SN.serverURL,
                         params:  params,
                         method:  'sn_mod_doc',
                         success: this._createSuccess.bind(this), 
                         error:   this._requestFail.bind(this),
                         fail:    this._requestFail.bind(this)  
                       });
    }
  },

  // ..........................................
  // DESTROY
  destroyRecords: function(records) {
    if(SN.accountController.get('username') == 'demo') {
      SC.Store.destroyRecords(records);
      return;
    }
    for(i=0; i < records.length; i++){
      var rec = records[i];
      rec.set('newRecord', false);
      params = SN.accountController.get('authParam');
      params.docId = rec.get('docId');

      SN.server.request({url:     SN.serverURL,
                         params:  params,
                         method:  'sn_del_doc',
                         success: function(res){this._destroySuccess(res, rec);}.bind(this), 
                         error:   this._requestFail.bind(this),
                         fail:    this._requestFail.bind(this)  
                       });
    }
  },

  _destroySuccess: function(res, rec){
    SC.Store.destroyRecords([rec]);
  }
}) ;
