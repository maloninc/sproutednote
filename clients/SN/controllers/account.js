// ==========================================================================
// SN.AccountController
// ==========================================================================

require('core');
require('md5');

/** @class

  (Document Your View Here)

  @extends SC.Object
  @author    AuthorName  
  @version 0.1
  @static
*/
SN.accountController = SC.Object.create(
/** @scope SN.accountController */ {

  isLogin:  NO,
  uid:      -1,
  username: '',
  password: '',
  confirm_pass: '',
  token:    '',  
  loginIsVisible: YES,
  loginButtonEnabled:YES,
  loginButtonTitle: 'Login',
  loginButtonIsVisible: YES,
  signupIsVisible: NO,
  signupButtonEnabled:YES,
  signupButtonTitle: 'Signup',
  changeButtonEnables:YES,
  changeButtonTitle: 'Change',

  login: function(){
    if(SN.FIXTURES.length != 0) { /* for TEST login */
      this.set('username', 'demo');

      this.set('loginButtonEnabled', NO);
      this.set('loginButtonTitle', 'Loading...');
      setTimeout(this._loginSuccess.bind(this), 1000);
      return;
    }
    var _this = this;
    SN.server.request({url:     SN.serverURL,
                       params:  {username: this.get('username'),
                                 password: this.get('password')},
                       method:  'sn_login',
                       success: this._loginSuccess.bind(this),
                       error:   this._loginFail.bind(this),    
                       fail:    this._loginFail.bind(this)    
                     });
    
    this.set('loginButtonEnabled', NO);
    this.set('loginButtonTitle', 'Loading...');
  },

  _loginSuccess: function(res){
    this.set("isLogin", YES);
    this.set('loginButtonEnabled', YES);
    this.set('loginButtonTitle', 'Login');
    this.set('signupButtonEnabled', YES);
    this.set('signupButtonTitle', 'Signup');
    this.set('signupIsVisible', NO);

    this.set('uid',   res.uid);
    this.set('token', res.token); 

    SN.server.preload(SN.FIXTURES) ;
    SN.server.listFor();
    //SN.masterController.content.refresh();
  },

  _loginFail: function(res){
    this.set('loginButtonEnabled', YES);
    this.set('loginButtonTitle', 'Login');
    if(res.msg){
      alert(res.msg);
    }else if(res.responseText){
      alert('[ERROR] ' + res.responseText);
    }
  },

  logout: function(){
    this.set("uid", -1);
    this.set("token", '');
    this.set("isLogin", NO);

    /* destroy all local stored data */
    var records = SC.Store.records();
    SC.Store.destroyRecords(records);
  },

  confirmPassword: function(){
    if(this.get('password') != this.get('confirm_pass')){
        alert('confirm password is incorrect!');
        return false;
    }
    return true;
  },

  signup: function(){
    if(!this.confirmPassword()) return;

    SN.server.request({url:     SN.serverURL,
                       params:  {username: this.get('username'),
                                 password: this.get('password'),
                                 secretkey: this.get('secretkey')},
                       method:  'sn_add_user',
                       success: this._loginSuccess.bind(this),
                       error:   this._signupError.bind(this),
                       fail:    this._signupFail.bind(this)
                     });
    this.set('signupButtonEnabled', NO);
    this.set('signupButtonTitle', 'Loading...');
  },

  _signupError: function(res){
     this.set('signupButtonEnabled', YES);
     this.set('signupButtonTitle', 'Signup');
     switch(res.msg){
       case 'duplicated user':
         alert('The requested name is already in used. Please try other name');
         break;

       case 'name length is zero':
         alert('There is no name. Please type your name.');
         break;

       case 'password length is zero':
         alert('There is no password. Please type your password.');
         break;

       default: 
         alert('[ERROR] ' + res.msg);
     }
  },

  _signupFail: function(res){
    this.set('signupButtonEnabled', YES);
    this.set('signupButtonTitle', 'Signup');
    alert('[ERROR] ' + res.responseText);
  },

  secretkey: function(){
    var username = this.get("username");
    var password = this.get("password");
    return MD5_hexhash(username+'/'+password+'/'+'Spam sucks');
  }.property('username', 'password'),

  authParam: function(){
    return {username: this.get('username'),
            uid:      this.get('uid'),
            token:    this.get('token')
           };
  }.property('username','uid','token'),

  showAccountDialog: function(){
    SC.page.get('account').set('isVisible',YES);
  },
  
  hideAccountDialog: function(){
    SC.page.get('account').set('isVisible',NO);
  },

  changeAccount: function(){
    if(!this.confirmPassword()) return;
    SN.server.request({url:     SN.serverURL,
                       params:  {username: this.get('username'),
                                 password: this.get('password'),
                                 token:    this.get('token'),
                                 uid:      this.get('uid')},
                       method:  'sn_mod_user',
                       success: this._changeAccountSuccess.bind(this),
                       error:   this._changeAccountError.bind(this),
                       fail:    this._changeAccountError.bind(this)
                     });
      this.set('changeAccountButtonEnabled', NO);
      this.set('changeAccountButtonTitle', 'Loading...');
  },
  
  _changeAccountSuccess: function(res){
    this.hideAccountDialog();
    this.set('changeAccountButtonEnabled', YES);
    this.set('changeAccountButtonTitle', 'Change');
  },

  _changeAccountError: function(res){
    this.set('changeAccountButtonEnabled', YES);
    this.set('changeAccountButtonTitle', 'Change');
     switch(res.msg){
       case 'password length is zero':
         alert('There is no password. Please type your password.');
         break;

       case 'name length is zero':
         alert('There is no username.');
         break;

       case 'user not found':
         alert('There is no user such as '+username);
         break;

       default: 
         alert('[ERROR] ' + res.msg);
     }
  },
  cancelChange: function(){
    this.hideAccountDialog();
  },

  loginObserver: function(){
    var isLogin = this.get("isLogin");
    this.set('loginIsVisible', !isLogin);
  }.observes("isLogin")
  ,

  siginupObserver: function(){
    var isSignup = this.get("signupIsVisible");
    this.set('loginButtonIsVisible', !isSignup);
  }.observes("signupIsVisible")


});

